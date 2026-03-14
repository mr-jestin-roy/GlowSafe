-- ============================================================
-- Run after: australian-postcodes.sql
-- ============================================================

-- WEATHER_SNAPSHOTS
DROP TABLE IF EXISTS weather_snapshots CASCADE;
CREATE TABLE weather_snapshots (
  snapshot_id    SERIAL PRIMARY KEY,
  postcode    VARCHAR(5) REFERENCES postcodes_geo(postcode),
  observed_at    TIMESTAMP,
  uv_index       FLOAT,
  temperature_c  FLOAT
);
