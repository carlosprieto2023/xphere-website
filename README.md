# xphere-website
Full-stack MERN website for Xphere LLC (vehicle inspections &amp; appraisals)

## Deploy diagnostics (e.g. Render)

- **502 on login** usually means the Node process is down, sleeping, or timing out—not a wrong password. Check the service **Logs** and hit **`GET /api/health`** on the same URL as the site. A **503** from `/api/health` means the app is up but **MongoDB is not connected** (`db.state` in the JSON).
- **Wrong password** normally returns **401** from `POST /api/admin/login`. Editing **`ADMIN_PASSWORD` in local `server/.env` does not change production**; login checks the hash in MongoDB. Set secrets on the host (**Render → Environment**).
- **`DATABASE_URL` / `MONGODB_URI` on Render:** use the **value field for the URI only** (starting with `mongodb+srv://` or `mongodb://`). Do not paste `DATABASE_URL=...` into the value, and do not rely on a local `.env` file on the server.

## Admin password (production MongoDB)

Use the **same `DATABASE_URL` (or `MONGODB_URI`) as Render** when running these from `server/`:

```bash
npm run admin:list
ADMIN_EMAIL='your@email.com' ADMIN_PASSWORD='new-password' npm run admin:password
```

(`ADMIN_PASSWORD` in `.env` is only read by the seed/update scripts, not by the login API.)
