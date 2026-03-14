import express from "express";
import dotenv from "dotenv";

import postcodesRouter from "./routes/postcodes.js";
import usersRouter from "./routes/users.js";
import skinprofilesRouter from "./routes/skinprofiles.js";
import tipsRouter from "./routes/tips.js";
import weatherRouter from "./routes/weather.js";
import cancerRouter from "./routes/cancer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`GlowSafe API server running on http://localhost:${PORT}`);
});
