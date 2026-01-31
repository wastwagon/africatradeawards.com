# Elsewedy Electric Image – Local Development Diagnosis

## Why the image was not showing

1. **Data pointed to a file that does not exist**
   - `data/awardees.ts` had: `logo: '/assets/img/awardees/elsewedy-electric.png'`
   - In `public/assets/img/awardees/` there was **no** `elsewedy-electric.png`
   - Only `elsewedy-electric.jpg` exists in that folder
   - The browser requested `/assets/img/awardees/elsewedy-electric.png` → **404** → broken/placeholder image

2. **Root file not in repo**
   - `ElsewedyElectric.png` was not found in the project root when checked from the terminal
   - So the copy script could not run and the PNG was never placed under `public/`

## Fix applied (safe for local and production)

- **Data updated** to use the file that actually exists: `logo: '/assets/img/awardees/elsewedy-electric.jpg'`
- Elsewedy Electric will now show the existing logo image in local dev and in production.

## If you want to use your PNG later

1. Place **ElsewedyElectric.png** in the **project root** (same folder as `package.json`).
2. Run: `npm run copy-elsewedy`
   - This copies it to `public/assets/img/awardees/elsewedy-electric.png`.
3. In `data/awardees.ts`, change Elsewedy Electric’s `logo` back to: `'/assets/img/awardees/elsewedy-electric.png'`

## Path summary

| Purpose              | Path (URL)                              | File on disk                                      |
|----------------------|-----------------------------------------|---------------------------------------------------|
| Current (working)    | `/assets/img/awardees/elsewedy-electric.jpg` | `public/assets/img/awardees/elsewedy-electric.jpg` |
| When using your PNG  | `/assets/img/awardees/elsewedy-electric.png`  | `public/assets/img/awardees/elsewedy-electric.png` (after copy script) |
