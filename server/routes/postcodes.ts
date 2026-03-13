import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/postcodes/search?q=suburb
router.get("/search", async (req: Request, res: Response) => {
  const q = req.query.q as string;
  if (!q || q.length < 2) {
    res.status(400).json({ error: "Query parameter 'q' must be at least 2 characters" });
    return;
  }

  const { rows } = await pool.query(
    `SELECT postcode, suburb, state, latitude, longitude
     FROM postcodes_geo
     WHERE LOWER(suburb) LIKE LOWER($1)
     ORDER BY suburb
     LIMIT 20`,
    [`%${q}%`]
  );

  res.json(
    rows.map((r) => ({
      postcode: r.postcode,
      suburb: r.suburb,
      state: r.state,
      lat: parseFloat(r.latitude),
      lng: parseFloat(r.longitude),
    }))
  );
});

// GET /api/postcodes/:postcode
router.get("/:postcode", async (req: Request, res: Response) => {
  const { postcode } = req.params;
  if (!/^\d{4}$/.test(postcode)) {
    res.status(400).json({ error: "Invalid postcode format" });
    return;
  }

  const { rows } = await pool.query(
    `SELECT postcode, suburb, state, latitude, longitude
     FROM postcodes_geo
     WHERE postcode = $1`,
    [postcode]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: "Postcode not found" });
    return;
  }

  const r = rows[0];
  res.json({
    postcode: r.postcode,
    suburb: r.suburb,
    state: r.state,
    lat: parseFloat(r.latitude),
    lng: parseFloat(r.longitude),
  });
});

export default router;
