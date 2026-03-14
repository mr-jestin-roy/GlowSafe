import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// POST /api/skinprofiles
router.post("/", async (req: Request, res: Response) => {
  const { userId, fitzpatrickType, skinCharacteristics, timeToBurn } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO skinprofiles (user_id, fitzpatrick_type, skin_characteristics, time_to_burn)
     VALUES ($1, $2, $3, $4)
     RETURNING profile_id, user_id, fitzpatrick_type, skin_characteristics, time_to_burn`,
    [userId, fitzpatrickType, skinCharacteristics, timeToBurn]
  );

  const r = rows[0];
  res.status(201).json({
    profileId: r.profile_id,
    userId: r.user_id,
    fitzpatrickType: r.fitzpatrick_type,
    skinCharacteristics: r.skin_characteristics,
    timeToBurn: r.time_to_burn,
  });
});

// GET /api/skinprofiles/types - reference skin types for UI (user_id IS NULL)
router.get("/types", async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query(
      `SELECT fitzpatrick_type, name, description, characteristics,
              burn_time_display, vitamin_d, melanin_level, color
       FROM skinprofiles
       WHERE user_id IS NULL
       ORDER BY fitzpatrick_type`
    );
    console.log("GET /api/skinprofiles/types rows:", rows.length);
    res.json(
      rows.map((r) => ({
        level: r.fitzpatrick_type,
        name: r.name ?? "",
        description: r.description ?? "",
        characteristics: Array.isArray(r.characteristics) ? r.characteristics : [],
        burnTime: r.burn_time_display ?? "",
        vitaminD: r.vitamin_d ?? "",
        melaninLevel: r.melanin_level ?? "",
        color: r.color ?? "",
      }))
    );
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : "";
    if (code === "ECONNREFUSED") {
      console.error("Database connection refused. Is PostgreSQL running? Check DATABASE_URL in .env");
      res.status(503).json({
        error: "Database unavailable. Start PostgreSQL and set DATABASE_URL in .env",
      });
      return;
    }
    console.error("GET /api/skinprofiles/types error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load skin types",
    });
  }
});

// GET /api/skinprofiles/user/:userId
router.get("/user/:userId", async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId as string);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const { rows } = await pool.query(
    `SELECT profile_id, user_id, fitzpatrick_type, skin_characteristics, time_to_burn
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
    timeToBurn: r.time_to_burn,
  });
});

// PUT /api/skinprofiles/:id
router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid profile ID" });
    return;
  }

  const { fitzpatrickType, skinCharacteristics, timeToBurn } = req.body;

  const { rows } = await pool.query(
    `UPDATE skinprofiles
     SET fitzpatrick_type = COALESCE($1, fitzpatrick_type),
         skin_characteristics = COALESCE($2, skin_characteristics),
         time_to_burn = COALESCE($3, time_to_burn)
     WHERE profile_id = $4
     RETURNING profile_id, user_id, fitzpatrick_type, skin_characteristics, time_to_burn`,
    [fitzpatrickType, skinCharacteristics, timeToBurn, id],
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
    timeToBurn: r.time_to_burn,
  });
});

export default router;
