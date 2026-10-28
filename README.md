# Workout Tracker (Nuxt 3)

```bash
npm install
npm run dev        # http://localhost:3000
```

Data is always saved in your browser (localStorage), so it works offline. **Settings → Backup & restore** exports/imports a JSON file.

## Sync across devices (Netlify)

Uses Netlify Blobs (no database to set up).

1. Deploy to Netlify (build command `npm run build`; Netlify detects Nuxt).
2. In **Site configuration → Environment variables** add `NUXT_SYNC_PASSPHRASE` with a long, unique passphrase, then redeploy.
3. On each device open **Settings → Sync across devices**, enter the passphrase and tap **Connect**.

The newest change wins (by timestamp). Locally, sync stores data in `.data/` — try it with `NUXT_SYNC_PASSPHRASE=yourpass npm run dev`.
