FROM golang:1.26-alpine AS build

WORKDIR /src
COPY go.mod ./
COPY main.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /catdoor2 .

FROM scratch
COPY --from=build /catdoor2 /catdoor2
EXPOSE 8080
USER 65532:65532
ENTRYPOINT ["/catdoor2"]
