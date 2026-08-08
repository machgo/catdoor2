# catdoor2

A small, dependency-free Go service that keeps the current cat-door state in
memory. The door is always initialized as locked when the service starts.

## Run

```sh
go run .
```

The service listens on port `8080` by default. Set `PORT` to override it.

With Docker Compose:

```sh
docker compose up --build
```

This exposes the service at `http://localhost:32003`.

## API

Read the current state:

```sh
curl http://localhost:8080/api/door
```

Unlock or lock the door:

```sh
curl -X POST http://localhost:8080/api/door \
  -H 'Content-Type: application/json' \
  -d '{"unlocked":true}'
```

Both endpoints return the current state as JSON:

```json
{"unlocked":true}
```

`GET /healthz` is available as a health check. Event endpoints and persistence
are intentionally not provided.

## Test

```sh
go test ./...
```
