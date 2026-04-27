/**
 * Order service — a small Express REST API.
 *
 * Routes
 * ──────
 *   GET  /orders      list orders (simulates 5–50ms DB read)
 *   POST /orders      create order (simulates 10–80ms DB write, validates body)
 *   GET  /health      liveness check; reports heap and uptime
 */

import express, { NextFunction, Request, Response } from "express";
import http from "node:http";
import { startJobProcessor } from "./jobs";

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// Simulated data store
// ---------------------------------------------------------------------------

interface Order {
  id: number;
  item: string;
  quantity: number;
  createdAt: string;
}

const store: Order[] = [
  { id: 1, item: "widget", quantity: 10, createdAt: new Date().toISOString() },
  { id: 2, item: "gadget", quantity: 5, createdAt: new Date().toISOString() },
  { id: 3, item: "doohickey", quantity: 3, createdAt: new Date().toISOString() },
];
let nextId = store.length + 1;

// ---------------------------------------------------------------------------
// Simulated async I/O helpers
// ---------------------------------------------------------------------------

function delay(minMs: number, maxMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, minMs + Math.floor(Math.random() * (maxMs - minMs))));
}

async function dbRead(): Promise<Order[]> {
  await delay(5, 50);
  return [...store];
}

async function dbWrite(item: string, quantity: number): Promise<Order> {
  await delay(10, 80);
  const order: Order = { id: nextId++, item, quantity, createdAt: new Date().toISOString() };
  store.push(order);
  return order;
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET /orders — list all orders.
app.get("/orders", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await dbRead();

    res.json({ data: orders, count: orders.length });
  } catch (err) {
    next(err);
  }
});

// POST /orders — create a new order.
app.post("/orders", async (req: Request, res: Response, next: NextFunction) => {
  const { item, quantity } = req.body as { item?: unknown; quantity?: unknown };

  if (typeof item !== "string" || item.length === 0) {
    res.status(400).json({ error: "item must be a non-empty string" });
    return;
  }
  if (typeof quantity !== "number" || quantity <= 0) {
    res.status(400).json({ error: "quantity must be a positive number" });
    return;
  }

  try {
    const order = await dbWrite(item, quantity);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// GET /health — liveness probe.
app.get("/health", (_req: Request, res: Response) => {
  const { heapUsed, heapTotal } = process.memoryUsage();

  res.json({
    status: "ok",
    heap: { used: heapUsed, total: heapTotal },
    uptime: process.uptime(),
  });
});

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err.message);
  res.status(500).json({ error: "internal server error" });
});

// ---------------------------------------------------------------------------
// Server + connection tracking
// ---------------------------------------------------------------------------
let activeConnections = 0;
const server = http.createServer(app);

server.on("connection", (socket) => {
  activeConnections++;
  
  socket.on("close", () => {
    activeConnections--;
  });
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const HEALTH_POLL_INTERVAL_MS = 15_000;

startJobProcessor();

server.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

// Poll /health at a fixed interval so heap and uptime metrics are updated
// regularly even when there is no external traffic hitting the endpoint.
const healthPoller = setInterval(() => {
  http.get(`http://localhost:${PORT}/health`, (res) => res.resume()).on("error", () => {});
}, HEALTH_POLL_INTERVAL_MS);

process.on("SIGTERM", () => {
  console.log("[server] shutting down");
  clearInterval(healthPoller);
  server.close(() => process.exit(0));
});

export { server };
