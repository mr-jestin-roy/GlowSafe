import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import postcodesRouter from "./routes/postcodes.js";
import usersRouter from "./routes/users.js";
import skinprofilesRouter from "./routes/skinprofiles.js";
import tipsRouter from "./routes/tips.js";
import weatherRouter from "./routes/weather.js";
import cancerRouter from "./routes/cancer.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

const app = express();
const PORT = process.env.PORT || 3001;

// Allow Vercel (and other) frontends to call this API (cross-origin)
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (_req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

// Log API requests (shows in terminal where you run pnpm dev:server)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/postcodes", postcodesRouter);
app.use("/api/users", usersRouter);
app.use("/api/skinprofiles", skinprofilesRouter);
app.use("/api/tips", tipsRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/cancer", cancerRouter);

// Health check (use /api/health for Render health check path)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// In production, serve the Vite-built frontend
if (isProduction) {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));
  // Express 5 requires a named wildcard (path-to-regexp); "*" alone is invalid
  app.get("/{*splat}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`GlowSafe API server running on http://localhost:${PORT}`);
});
