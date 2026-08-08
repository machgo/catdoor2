package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

const maxRequestBody = 1 << 20 // 1 MiB

type doorState struct {
	mu       sync.RWMutex
	unlocked bool
}

type doorResponse struct {
	Unlocked bool `json:"unlocked"`
}

type updateDoorRequest struct {
	Unlocked *bool `json:"unlocked"`
}

func (d *doorState) serveHTTP(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		d.mu.RLock()
		unlocked := d.unlocked
		d.mu.RUnlock()
		writeJSON(w, http.StatusOK, doorResponse{Unlocked: unlocked})
	case http.MethodPost:
		d.update(w, r)
	default:
		w.Header().Set("Allow", "GET, POST")
		writeError(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func (d *doorState) update(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxRequestBody)
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()

	var request updateDoorRequest
	if err := decoder.Decode(&request); err != nil {
		writeError(w, http.StatusBadRequest, "body must be a JSON object containing a boolean unlocked field")
		return
	}
	if err := decoder.Decode(&struct{}{}); !errors.Is(err, io.EOF) {
		writeError(w, http.StatusBadRequest, "body must contain exactly one JSON object")
		return
	}
	if request.Unlocked == nil {
		writeError(w, http.StatusBadRequest, "unlocked is required")
		return
	}

	d.mu.Lock()
	d.unlocked = *request.Unlocked
	unlocked := d.unlocked
	d.mu.Unlock()

	writeJSON(w, http.StatusOK, doorResponse{Unlocked: unlocked})
}

func newHandler() http.Handler {
	// A newly constructed state is deliberately locked. Nothing is persisted.
	door := &doorState{unlocked: false}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, _ *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"service": "catdoor2"})
	})
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	})
	mux.HandleFunc("/api/door", door.serveHTTP)
	return mux
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(value); err != nil {
		log.Printf("write response: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func listenAddress() string {
	port := strings.TrimSpace(os.Getenv("PORT"))
	if port == "" {
		port = "8080"
	}
	if strings.HasPrefix(port, ":") {
		return port
	}
	return ":" + port
}

func main() {
	address := listenAddress()
	server := &http.Server{
		Addr:              address,
		Handler:           newHandler(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	log.Printf("catdoor2 listening on %s (door starts locked)", address)
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatal(fmt.Errorf("serve: %w", err))
	}
}
