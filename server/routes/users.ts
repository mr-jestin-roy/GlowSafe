import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// POST /api/users
router.post("/", async (req: Request, res: Response) => {
  const { name, ageGroup, postcode, alertThreshold } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO users (name, age_group, postcode, alert_threshold)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, name, age_group, postcode, alert_threshold`,
    [name, ageGroup, postcode, alertThreshold]
  );

  const r = rows[0];
  res.status(201).json({
    userId: r.user_id,
    name: r.name,
    ageGroup: r.age_group,
    postcode: r.postcode,
    alertThreshold: r.alert_threshold,
  });
});

// GET /api/users/:id
router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const { rows } = await pool.query(
    `SELECT user_id, name, age_group, postcode, alert_threshold
     FROM users WHERE user_id = $1`,
    [id]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const r = rows[0];
  res.json({
    userId: r.user_id,
    name: r.name,
    ageGroup: r.age_group,
    postcode: r.postcode,
    alertThreshold: r.alert_threshold,
  });
});

// PUT /api/users/:id
router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const { name, ageGroup, postcode, alertThreshold } = req.body;

  const { rows } = await pool.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         age_group = COALESCE($2, age_group),
         postcode = COALESCE($3, postcode),
         alert_threshold = COALESCE($4, alert_threshold)
     WHERE user_id = $5
     RETURNING user_id, name, age_group, postcode, alert_threshold`,
    [name, ageGroup, postcode, alertThreshold, id]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const r = rows[0];
  res.json({
    userId: r.user_id,
    name: r.name,
    ageGroup: r.age_group,
    postcode: r.postcode,
    alertThreshold: r.alert_threshold,
  });
});

export default router;
