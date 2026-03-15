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

// Map DB age_group label to (minAge, maxAge) for range overlap. "90+" → 90–99.
const AGE_GROUP_RANGES: { group: string; min: number; max: number }[] = [
  { group: "00–04", min: 0, max: 4 },
  { group: "05–09", min: 5, max: 9 },
  { group: "10–14", min: 10, max: 14 },
  { group: "15–19", min: 15, max: 19 },
  { group: "20–24", min: 20, max: 24 },
  { group: "25–29", min: 25, max: 29 },
  { group: "30–34", min: 30, max: 34 },
  { group: "35–39", min: 35, max: 39 },
  { group: "40–44", min: 40, max: 44 },
  { group: "45–49", min: 45, max: 49 },
  { group: "50–54", min: 50, max: 54 },
  { group: "55–59", min: 55, max: 59 },
  { group: "60–64", min: 60, max: 64 },
  { group: "65–69", min: 65, max: 69 },
  { group: "70–74", min: 70, max: 74 },
  { group: "75–79", min: 75, max: 79 },
  { group: "80–84", min: 80, max: 84 },
  { group: "85–89", min: 85, max: 89 },
  { group: "90+", min: 90, max: 99 },
];

function ageGroupsInRange(startAge: number, endAge: number): string[] {
  return AGE_GROUP_RANGES.filter(
    (r) => r.min <= endAge && r.max >= startAge,
  ).map((r) => r.group);
}

// GET /api/cancer/trend?sex=Males|Females|Persons&start_age=20&end_age=60
// Returns time series: year, incidenceRate, mortalityRate (per 100,000), cumulative over the age range.
router.get("/trend", async (req: Request, res: Response) => {
  const { sex, start_age, end_age } = req.query;
  const sexParam = (sex as string) || "Persons";
  const startAge = Math.max(0, Math.min(99, parseInt(String(start_age), 10) || 0));
  const endAge = Math.max(startAge, Math.min(99, parseInt(String(end_age), 10) || 99));
  const groups = ageGroupsInRange(startAge, endAge);

  if (groups.length === 0) {
    return res.json([]);
  }

  try {
    const placeholders = groups.map((_, i) => `$${i + 1}`).join(", ");
    const baseQuery = `
      SELECT year,
             AVG(incidence_rate)::float AS incidence_rate,
             AVG(mortality_rate)::float AS mortality_rate
      FROM cancer_incidence_mortality
      WHERE age_group IN (${placeholders})
    `;
    const params: string[] = [...groups];

    if (sexParam === "Persons") {
      const { rows } = await pool.query(
        `${baseQuery}
         GROUP BY year
         ORDER BY year`,
        params,
      );
      return res.json(
        rows.map((r) => ({
          year: r.year,
          incidenceRate: r.incidence_rate ?? 0,
          mortalityRate: r.mortality_rate ?? 0,
        })),
      );
    }

    const { rows } = await pool.query(
      `${baseQuery} AND sex = $${params.length + 1}
       GROUP BY year
       ORDER BY year`,
      [...params, sexParam] as string[],
    );
    res.json(
      rows.map((r) => ({
        year: r.year,
        incidenceRate: r.incidence_rate ?? 0,
        mortalityRate: r.mortality_rate ?? 0,
      })),
    );
  } catch (err) {
    console.error("GET /api/cancer/trend error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load trend data",
    });
  }
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
