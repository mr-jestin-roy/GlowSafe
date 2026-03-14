-- SKINPROFILES
DROP TABLE IF EXISTS skinprofiles CASCADE;
CREATE TABLE skinprofiles (
  profile_id           SERIAL PRIMARY KEY,
  user_id              INT REFERENCES users(user_id),
  fitzpatrick_type     INT,
  skin_characteristics TEXT,
  time_to_burn         INT,
  name                 VARCHAR(255),
  description          VARCHAR(255),
  characteristics      JSONB,
  burn_time_display    VARCHAR(50),
  vitamin_d            TEXT,
  melanin_level        VARCHAR(100),
  color                VARCHAR(100)
);

-- Reference skin types (user_id NULL) for UI display
INSERT INTO skinprofiles (
  fitzpatrick_type, skin_characteristics, time_to_burn,
  name, description, characteristics, burn_time_display, vitamin_d, melanin_level, color
) VALUES
(1, 'Pale white skin, blue/hazel eyes, blond/red hair. Always burns, does not tan.', 15,
 'Type I - Always Burns', 'Pale white, often with freckles',
 '["Very fair skin, almost translucent","Hair typically red or light blonde","Eyes are blue or green","Always burns, never tans"]'::jsonb,
 '10-15 minutes', 'Extremely low melanin content, highest vitamin D synthesis efficiency, but must be extremely vigilant about sunburn risk', 'Extremely Low', 'bg-stone-100'),
(2, 'Fair skin, blue eyes. Burns easily, tans poorly.', 20,
 'Type II - Usually Burns', 'Fair skin, may have freckles',
 '["Fair skin","Hair is blonde, light brown, or red","Eyes are blue, green, or hazel","Usually burns, tans with difficulty"]'::jsonb,
 '15-20 minutes', 'Low melanin content, high vitamin D synthesis efficiency, but still needs sun protection', 'Low', 'bg-amber-50'),
(3, 'Darker white skin. Tans after initial burn.', 25,
 'Type III - Sometimes Burns', 'Medium skin tone',
 '["Skin is light brown or beige","Hair is brown or dark blonde","Eyes are brown or hazel","Sometimes burns, gradually tans"]'::jsonb,
 '20-30 minutes', 'Moderate melanin content, needs moderate sun exposure to synthesize adequate vitamin D', 'Moderate', 'bg-amber-100'),
(4, 'Light brown skin. Burns minimally, tans easily.', 40,
 'Type IV - Rarely Burns', 'Olive or light brown skin tone',
 '["Skin is olive or medium brown","Hair is dark brown or black","Eyes are dark brown","Rarely burns, tans easily"]'::jsonb,
 '30-45 minutes', 'Higher melanin content, needs longer sun exposure to synthesize vitamin D, but lower sunburn risk', 'Higher', 'bg-amber-200'),
(5, 'Brown skin. Rarely burns, tans darkly easily.', 50,
 'Type V - Very Rarely Burns', 'Dark brown skin tone',
 '["Skin is dark brown","Hair is black","Eyes are dark brown or black","Very rarely burns, tans very easily"]'::jsonb,
 '45-60 minutes', 'High melanin content, needs significantly increased sun exposure time (about 3-6x) to synthesize adequate vitamin D', 'High', 'bg-amber-700'),
(6, 'Dark brown or black skin. Never burns, always tans darkly.', 60,
 'Type VI - Never Burns', 'Very dark skin tone',
 '["Skin is very dark","Hair is black","Eyes are dark brown or black","Never burns, skin is deeply pigmented"]'::jsonb,
 '60+ minutes', 'Very high melanin content, strongest natural UV protection, but highest vitamin D deficiency risk, may need supplements', 'Very High', 'bg-amber-900');
