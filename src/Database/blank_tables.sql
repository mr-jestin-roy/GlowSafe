-- ============================================================
-- Run after: australian-postcodes.sql
-- ============================================================

-- USERS
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  user_id          SERIAL PRIMARY KEY,
  name             VARCHAR(100),
  age_group        VARCHAR(20),
  postcode      VARCHAR(5) REFERENCES postcodes_geo(postcode),
  alert_threshold  INT
);

-- SKINPROFILES
DROP TABLE IF EXISTS skinprofiles CASCADE;
CREATE TABLE skinprofiles (
  profile_id         SERIAL PRIMARY KEY,
  user_id            INT REFERENCES users(user_id),
  fitzpatrick_type   INT,
  skin_characteristics    TEXT,
  absorption_rate    FLOAT
);

-- PREVENTIONTIPS
DROP TABLE IF EXISTS preventiontips CASCADE;
CREATE TABLE preventiontips (
  tip_id               SERIAL PRIMARY KEY,
  uv_index_min         FLOAT,
  uv_index_max         FLOAT,
  fitzpatrick_type     INT,
  dosage_ml            FLOAT,
  reapply_interval_min INT
);

-- WEATHER_SNAPSHOTS
DROP TABLE IF EXISTS weather_snapshots CASCADE;
CREATE TABLE weather_snapshots (
  snapshot_id    SERIAL PRIMARY KEY,
  postcode    VARCHAR(5) REFERENCES postcodes_geo(postcode),
  observed_at    TIMESTAMP,
  uv_index       FLOAT,
  temperature_c  FLOAT
);