import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// POST /api/weather
router.post("/", async (req: Request, res: Response) => {
  const { postcode, observedAt, uvIndex, temperatureC } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO weather_snapshots (postcode, observed_at, uv_index, temperature_c)
     VALUES ($1, $2, $3, $4)
     RETURNING snapshot_id, postcode, observed_at, uv_index, temperature_c`,
    [postcode, observedAt, uvIndex, temperatureC]
  );

  const r = rows[0];
  res.status(201).json({
    snapshotId: r.snapshot_id,
    postcode: r.postcode,
    observedAt: r.observed_at,
    uvIndex: parseFloat(r.uv_index),
    temperatureC: parseFloat(r.temperature_c),
  });
});

// GET /api/weather/:postcode — latest snapshot
router.get("/:postcode", async (req: Request, res: Response) => {
  const { postcode } = req.params;
  if (!/^\d{4}$/.test(postcode)) {
    res.status(400).json({ error: "Invalid postcode format" });
    return;
  }

  const { rows } = await pool.query(
    `SELECT snapshot_id, postcode, observed_at, uv_index, temperature_c
     FROM weather_snapshots
     WHERE postcode = $1
     ORDER BY observed_at DESC
     LIMIT 1`,
    [postcode]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: "No weather data found for this postcode" });
    return;
  }

  const r = rows[0];
  res.json({
    snapshotId: r.snapshot_id,
    postcode: r.postcode,
    observedAt: r.observed_at,
    uvIndex: parseFloat(r.uv_index),
    temperatureC: parseFloat(r.temperature_c),
  });
});

export default router;
