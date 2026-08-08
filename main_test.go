package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestDoorStartsLocked(t *testing.T) {
	response := request(t, newHandler(), http.MethodGet, "/api/door", "")
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		t.Fatalf("status = %d, want %d", response.StatusCode, http.StatusOK)
	}
	var state doorResponse
	if err := json.NewDecoder(response.Body).Decode(&state); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if state.Unlocked {
		t.Fatal("door is unlocked after service initialization")
	}
}

func TestDoorCanBeUpdated(t *testing.T) {
	handler := newHandler()
	response := request(t, handler, http.MethodPost, "/api/door", `{"unlocked":true}`)
	response.Body.Close()
	if response.StatusCode != http.StatusOK {
		t.Fatalf("POST status = %d, want %d", response.StatusCode, http.StatusOK)
	}

	response = request(t, handler, http.MethodGet, "/api/door", "")
	defer response.Body.Close()
	var state doorResponse
	if err := json.NewDecoder(response.Body).Decode(&state); err != nil {
		t.Fatalf("decode response: %v", err)
	}
	if !state.Unlocked {
		t.Fatal("door was not unlocked")
	}

	// Constructing a new handler represents a service restart.
	response.Body.Close()
	response = request(t, newHandler(), http.MethodGet, "/api/door", "")
	defer response.Body.Close()
	if err := json.NewDecoder(response.Body).Decode(&state); err != nil {
		t.Fatalf("decode response after restart: %v", err)
	}
	if state.Unlocked {
		t.Fatal("door state persisted across service restart")
	}
}

func TestDoorRejectsInvalidUpdates(t *testing.T) {
	tests := []string{
		`{}`,
		`{"unlocked":"yes"}`,
		`{"unlocked":true,"extra":1}`,
		`{"unlocked":true}{"unlocked":false}`,
	}

	for _, body := range tests {
		t.Run(body, func(t *testing.T) {
			response := request(t, newHandler(), http.MethodPost, "/api/door", body)
			defer response.Body.Close()
			if response.StatusCode != http.StatusBadRequest {
				t.Fatalf("status = %d, want %d", response.StatusCode, http.StatusBadRequest)
			}
		})
	}
}

func TestDoorRejectsUnsupportedMethods(t *testing.T) {
	response := request(t, newHandler(), http.MethodDelete, "/api/door", "")
	defer response.Body.Close()
	if response.StatusCode != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want %d", response.StatusCode, http.StatusMethodNotAllowed)
	}
}

func request(t *testing.T, handler http.Handler, method, path, body string) *http.Response {
	t.Helper()
	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	handler.ServeHTTP(recorder, req)
	return recorder.Result()
}
