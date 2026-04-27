# [TICKET] Add monitoring instrumentation to order-service

**Type:** Feature  
**Component:** order-service

---

## Background

We are integrating the internal monitoring package into the order-service to get visibility into
request throughput, latency, resource usage, and background job activity.

The service exposes three HTTP endpoints (`GET /orders`, `POST /orders`, `GET /health`) and
runs a background job processor (`src/jobs.ts`).

---

## Acceptance criteria

### HTTP layer (`src/server.ts`)

- **Request volume** — track how many requests each route receives.
  - `GET /orders`
  - `POST /orders`
- **Request latency** — track how long each route takes to respond.
  - `GET /orders`
  - `POST /orders`
- **Validation errors** — `POST /orders` validates the request body and returns `400` on bad input. Track these failures separately from server errors.
- **Server errors** — track errors that reach the global error-handler middleware (HTTP 500s).
- **Active connections** — at any point in time, track how many TCP connections are open on the HTTP server.
- **Heap usage** — on each `GET /health` call, record the current Node.js heap usage.

### Background jobs (`src/jobs.ts`)

- **Jobs processed** — each time the processor runs, record how many jobs were handled.
- **Pending queue depth** — after each run, record the current simulated queue depth.

### Lifecycle

- Monitoring must be initialised before the server starts listening.
- On `SIGTERM`, monitoring must be shut down cleanly before the process exits.

---

## Testing the endpoints manually

Start the server:

```bash
npm start
```

**List orders**

```bash
curl http://localhost:3000/orders
```

**Create an order (valid)**

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"item": "widget", "quantity": 3}'
```

**Create an order (invalid — triggers validation error)**

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"item": "", "quantity": -1}'
```

**Health check**

```bash
curl http://localhost:3000/health
```

**Generate a stream of mixed traffic** (runs until you press Ctrl-C)

```bash
while true; do
  curl -s http://localhost:3000/orders > /dev/null
  curl -s -X POST http://localhost:3000/orders \
    -H "Content-Type: application/json" \
    -d '{"item": "thing", "quantity": 1}' > /dev/null
  sleep 0.5
done
```

---

## Notes

- Tag metrics with enough context (e.g. route name) so results can be filtered per-endpoint in InfluxDB.
- Before you start the implementation, take up to 10 minutes to familiarize yourself with relevant concepts like what types of metrics exist (counter, histogram, etc) and what type of metric you should use for the data you want to track.
