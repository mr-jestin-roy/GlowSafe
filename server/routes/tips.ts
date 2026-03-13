import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/tips?uv_index=X&fitzpatrick_type=Y
router.get("/", async (req: Request, res: Response) => {
  const uvIndex = parseFloat(req.query.uv_index as string);
  const fitzpatrickType = parseInt(req.query.fitzpatrick_type as string);

  if (isNaN(uvIndex)) {
    res.status(400).json({ error: "Query parameter 'uv_index' is required and must be a number" });
    return;
  }

  let query = `
    SELECT tip_id, uv_index_min, uv_index_max, fitzpatrick_type,
           dosage_ml, reapply_interval_min
    FROM preventiontips
    WHERE uv_index_min <= $1 AND uv_index_max >= $1
  `;
  const params: (number | string)[] = [uvIndex];

  if (!isNaN(fitzpatrickType)) {
    query += ` AND fitzpatrick_type = $2`;
    params.push(fitzpatrickType);
  }

  query += ` ORDER BY fitzpatrick_type`;

  const { rows } = await pool.query(query, params);

  res.json(
    rows.map((r) => ({
      tipId: r.tip_id,
      uvIndexMin: parseFloat(r.uv_index_min),
      uvIndexMax: parseFloat(r.uv_index_max),
      fitzpatrickType: r.fitzpatrick_type,
      dosageMl: parseFloat(r.dosage_ml),
      reapplyIntervalMin: r.reapply_interval_min,
    }))
  );
});

export default router;
