# Deploying Drishti on Zoho Catalyst

This prototype is a **Catalyst-native app**: a static web client (Web Client Hosting)
plus an Advanced I/O **Serverless Function** that acts as the mock intelligence API.
Deployment is two commands once your Catalyst project is linked.

```
drishti-crime-intel/
├── catalyst.json                 ← project manifest (set project_id)
├── client/                       ← web app → Web Client Hosting
│   ├── index.html · styles.css · app.js
│   └── client-package.json
└── functions/
    └── drishti_api/              ← Advanced I/O Node function → /server/drishti_api
        ├── index.js · scenarios.js
        ├── package.json          ← express (installed by Catalyst on deploy)
        └── catalyst-config.json
```

## Prerequisites

1. A **Zoho / Catalyst account** and a **Catalyst project** — create at <https://catalyst.zoho.com>.
   (Account creation and login must be done by you — sign in through the browser.)
2. **Node.js ≥ 18**.
3. The **Catalyst CLI**:
   ```bash
   npm install -g zcatalyst-cli
   ```

## Steps

**1. Sign in** (opens a browser for OAuth — you approve it):
```bash
catalyst login
```

**2. Link this folder to your project.** From the repo root, either:
- run `catalyst init` and select your existing project (it writes the real `project_id` into `catalyst.json`), **or**
- open `catalyst.json` and replace `"REPLACE_WITH_YOUR_PROJECT_ID"` with your project's ID (Catalyst console → project → Settings).

> If `catalyst init` asks which components to enable, choose **Functions** and **Web Client Hosting**. Keep the folder names `functions/drishti_api` and `client`.

**3. Deploy:**
```bash
catalyst deploy
```

Catalyst installs the function's dependencies (Express), uploads the client, and returns your live URLs.

## After deploy

- **Web app:** `https://<project>.<zone>.catalystserverless.com/` (the client).
- **Mock API:** `https://<project>.<zone>.catalystserverless.com/server/drishti_api/`
  - `GET  /server/drishti_api/` → health check
  - `POST /server/drishti_api/query` with `{ "text": "…" }` → evidence-backed answer
  - `GET  /server/drishti_api/query?q=…` → same, for quick testing

The client calls the function at the **relative** path `/server/drishti_api`, so it works
automatically once both are deployed to the same project. The footer shows **“live API”**
when the function responds and **“demo data (offline)”** if it can't reach it (the client
ships with an embedded copy of the sample data, so the demo never breaks).

## Testing locally (optional)

Serve the client folder with any static server, e.g.:
```bash
npx http-server client -p 4611 -c-1
```
Then open <http://localhost:4611>. Locally there's no function, so it runs on the
embedded demo data — expected. To exercise the function locally, run `catalyst serve`.

## Update the submission

Once live, put the URL in [`docs/SUBMISSION.md`](docs/SUBMISSION.md) → *Deployed Solution Link*,
and on the closing slide of the pitch deck.

> **Note:** the prototype uses **synthetic data only**. No real crime records are included.
