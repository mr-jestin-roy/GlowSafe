# Database setup order

Run these SQL scripts **in this order** (from project root, with DB `glowsafe` created):

| Order | File | Depends on |
|-------|------|------------|
| 1 | `australian_postcodes.sql` | — (creates `postcodes_geo`) |
| 2 | `users.sql` | `postcodes_geo` |
| 3 | `dummy_tables.sql` | `postcodes_geo` |
| 4 | `skinprofiles.sql` | `users` |
| 5 | `prevention_tips.sql` | — |
| 6 | `cancer_incidence_by_state.sql` | — |
| 7 | `cancer_incidence_mortality_by_age_gender.sql` | — |

## From project root

```bash
cd /Users/jestinroy/Monash/GlowSafe
createdb glowsafe  # if not exists
psql -d glowsafe -f src/Database/australian_postcodes.sql
psql -d glowsafe -f src/Database/users.sql
psql -d glowsafe -f src/Database/dummy_tables.sql
psql -d glowsafe -f src/Database/skinprofiles.sql
psql -d glowsafe -f src/Database/prevention_tips.sql
psql -d glowsafe -f src/Database/cancer_incidence_by_state.sql
psql -d glowsafe -f src/Database/cancer_incidence_mortality_by_age_gender.sql
```

## From src/Database

```bash
cd /Users/jestinroy/Monash/GlowSafe/src/Database
createdb glowsafe  # from project root if needed
psql -d glowsafe -f australian_postcodes.sql
psql -d glowsafe -f users.sql
psql -d glowsafe -f dummy_tables.sql
psql -d glowsafe -f skinprofiles.sql
psql -d glowsafe -f prevention_tips.sql
psql -d glowsafe -f cancer_incidence_by_state.sql
psql -d glowsafe -f cancer_incidence_mortality_by_age_gender.sql
```

## Render.com deployment

**Important:** Do **not** run `db:seed` in the **Build Command**. The build runs in an isolated environment where `DATABASE_URL` is not available, so the seed will fail and the deploy will break.

- **Build Command:** `npm install && npm run build` (no `db:seed`)
- **Start Command:** `npm run db:seed && npm run start` (seed runs before the server starts; works on free tier, no Pre-Deploy needed)
- Set `DATABASE_URL` in the service Environment.

To run all SQL files locally:

```bash
npm run db:seed
```
