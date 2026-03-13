import { Router, Request, Response } from "express";
import pool from "../db.js";

const router = Router();

// GET /api/cancer/by-state?state=X&year=Y&sex=Z
router.get("/by-state", async (req: Request, res: Response) => {
  const { state, year, sex } = req.query;

  let query = `
    SELECT id, cancer_type, year, sex, state, count, incidence_rate
    FROM cancer_incidence_by_state
    WHERE 1=1
  `;
  const params: (string | number)[] = [];
  let idx = 1;

  if (state) {
    query += ` AND state = $${idx++}`;
    params.push(state as string);
  }
  if (year) {
    query += ` AND year = $${idx++}`;
    params.push(parseInt(year as string));
  }
  if (sex) {
    query += ` AND sex = $${idx++}`;
    params.push(sex as string);
  }

  query += ` ORDER BY year, state LIMIT 200`;

  const { rows } = await pool.query(query, params);

  res.json(
    rows.map((r) => ({
      id: r.id,
      cancerType: r.cancer_type,
      year: r.year,
      sex: r.sex,
      state: r.state,
      count: r.count,
      incidenceRate: r.incidence_rate ? parseFloat(r.incidence_rate) : null,
    }))
  );
});

// GET /api/cancer/by-age?year=Y&sex=Z&age_group=A
router.get("/by-age", async (req: Request, res: Response) => {
  const { year, sex, age_group } = req.query;

  let query = `
    SELECT incidence_id, cancer_type, year, sex, age_group,
           count, incidence_rate, mortality_rate
    FROM cancer_incidence_mortality
    WHERE 1=1
  `;
  const params: (string | number)[] = [];
  let idx = 1;

  if (year) {
    query += ` AND year = $${idx++}`;
    params.push(parseInt(year as string));
  }
  if (sex) {
    query += ` AND sex = $${idx++}`;
    params.push(sex as string);
  }
  if (age_group) {
    query += ` AND age_group = $${idx++}`;
    params.push(age_group as string);
  }

  query += ` ORDER BY year, sex, age_group LIMIT 200`;

  const { rows } = await pool.query(query, params);

  res.json(
    rows.map((r) => ({
      incidenceId: r.incidence_id,
      cancerType: r.cancer_type,
      year: r.year,
      sex: r.sex,
      ageGroup: r.age_group,
      count: r.count,
      incidenceRate: r.incidence_rate ? parseFloat(r.incidence_rate) : null,
      mortalityRate: r.mortality_rate ? parseFloat(r.mortality_rate) : null,
    }))
  );
});

export default router;
