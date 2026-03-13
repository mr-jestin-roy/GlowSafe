import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// POST /api/skinprofiles
router.post("/", async (req: Request, res: Response) => {
  const { userId, fitzpatrickType, skinCharacteristics, absorptionRate } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO skinprofiles (user_id, fitzpatrick_type, skin_characteristics, absorption_rate)
     VALUES ($1, $2, $3, $4)
     RETURNING profile_id, user_id, fitzpatrick_type, skin_characteristics, absorption_rate`,
    [userId, fitzpatrickType, skinCharacteristics, absorptionRate]
  );

  const r = rows[0];
  res.status(201).json({
    profileId: r.profile_id,
    userId: r.user_id,
    fitzpatrickType: r.fitzpatrick_type,
    skinCharacteristics: r.skin_characteristics,
    absorptionRate: parseFloat(r.absorption_rate),
  });
});

// GET /api/skinprofiles/user/:userId
router.get("/user/:userId", async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const { rows } = await pool.query(
    `SELECT profile_id, user_id, fitzpatrick_type, skin_characteristics, absorption_rate
     FROM skinprofiles WHERE user_id = $1`,
    [userId]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: "Skin profile not found for this user" });
    return;
  }

  const r = rows[0];
  res.json({
    profileId: r.profile_id,
    userId: r.user_id,
    fitzpatrickType: r.fitzpatrick_type,
    skinCharacteristics: r.skin_characteristics,
    absorptionRate: parseFloat(r.absorption_rate),
  });
});

// PUT /api/skinprofiles/:id
router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid profile ID" });
    return;
  }

  const { fitzpatrickType, skinCharacteristics, absorptionRate } = req.body;

  const { rows } = await pool.query(
    `UPDATE skinprofiles
     SET fitzpatrick_type = COALESCE($1, fitzpatrick_type),
         skin_characteristics = COALESCE($2, skin_characteristics),
         absorption_rate = COALESCE($3, absorption_rate)
     WHERE profile_id = $4
     RETURNING profile_id, user_id, fitzpatrick_type, skin_characteristics, absorption_rate`,
    [fitzpatrickType, skinCharacteristics, absorptionRate, id]
  );

  if (rows.length === 0) {
    res.status(404).json({ error: "Skin profile not found" });
    return;
  }

  const r = rows[0];
  res.json({
    profileId: r.profile_id,
    userId: r.user_id,
    fitzpatrickType: r.fitzpatrick_type,
    skinCharacteristics: r.skin_characteristics,
    absorptionRate: parseFloat(r.absorption_rate),
  });
});

export default router;
