
-- PREVENTIONTIPS
DROP TABLE IF EXISTS preventiontips CASCADE;
CREATE TABLE preventiontips (
  tip_id               SERIAL PRIMARY KEY,
  uv_index_min         FLOAT,
  uv_index_max         FLOAT,
  fitzpatrick_type     INT,
  dosage_in_tsp        FLOAT,
  reapply_interval_min INT
);

-- reapply_interval_min = (SKINPROFILES.time_to_burn * 10) / UV_Index


INSERT INTO preventiontips (uv_index_min, uv_index_max, fitzpatrick_type, dosage_in_tsp, reapply_interval_min) VALUES
-- UV moderate (3.0-5.9, mean 4.5)
(3.0, 5.9, 1, 1.0, 33),
(3.0, 5.9, 2, 1.0, 44),
(3.0, 5.9, 3, 1.0, 55),
(3.0, 5.9, 4, 1.0, 89),
(3.0, 5.9, 5, 1.0, 111),
(3.0, 5.9, 6, 1.0, 133),
-- UV high (6.0-10.9, mean 8.5)
(6.0, 10.9, 1, 4.0, 18),
(6.0, 10.9, 2, 4.0, 24),
(6.0, 10.9, 3, 4.0, 29),
(6.0, 10.9, 4, 3.0, 47),
(6.0, 10.9, 5, 3.0, 59),
(6.0, 10.9, 6, 2.0, 71),
-- UV very high (11.0-15.0, mean 13)
(11.0, 15.0, 1, 7.0, 11),
(11.0, 15.0, 2, 7.0, 15),
(11.0, 15.0, 3, 7.0, 19),
(11.0, 15.0, 4, 7.0, 31),
(11.0, 15.0, 5, 6.0, 38),
(11.0, 15.0, 6, 5.0, 46);
