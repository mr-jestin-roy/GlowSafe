-- USERS
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  user_id          SERIAL PRIMARY KEY,
  name             VARCHAR(100),
  age_group        VARCHAR(20),
  postcode      VARCHAR(5) REFERENCES postcodes_geo(postcode),
  alert_threshold  INT
);


INSERT INTO users (name, age_group, postcode, alert_threshold) VALUES
  ('WenTao', '18-25', '3000', 7),
  ('Kevin', '18-25', '3168', 10),
  ('JiaXuan', '18-25', '3150', 6),
  ('Jestin', '18-25', '3168', 10);
