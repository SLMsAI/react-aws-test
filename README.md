# React weather app (Vite) + simple Express backend

A React 18 + Vite frontend that fetches weather from a minimal Express API proxying the free Open-Meteo service (no API key required). Push to your Git repo, connect the frontend in Amplify for static hosting, and deploy the backend where you prefer (Amplify Functions/Containers, ECS/Fargate, etc.).

## Local development

```bash
# frontend
npm install
npm run dev

# backend
cd backend
npm install
npm start

# production build (frontend)
npm run build
```

The production bundle is emitted to `dist/`, which Amplify serves by default.

## Deploying with AWS Amplify Hosting

1. Push this repo to GitHub/GitLab/Bitbucket/CodeCommit.
2. In the [Amplify console](https://console.aws.amazon.com/amplify/home) choose **Host web app** → **Git**, select your repo + branch.
3. Amplify will detect Vite and create a build spec similar to:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. Save and deploy. Amplify provisions hosting, runs the build, and publishes your static site from `dist/`.
5. Optionally add a custom domain in Amplify under **App settings → Domain management**.

## Customization tips

- Update the UI in `src/App.jsx` and styles in `src/styles.css`.
- The frontend calls your backend. Configure its base URL via `VITE_API_BASE` (see `.env.example`).
- Add environment variables in Amplify under **App settings → Environment variables**; Vite requires the `VITE_` prefix (e.g., `VITE_API_BASE=https://your-backend.example.com`).
- Backend environment: set `PORT` and `WEATHER_API_BASE` (defaults to `https://api.open-meteo.com`). See `backend/.env.example`.
- Swap npm for pnpm/yarn by changing the build commands above.

## Troubleshooting

- If Amplify fails to build, try running `npm run build` locally to catch missing deps or env vars.
- Double-check the `baseDirectory` is `dist` so Amplify serves the correct folder.
- Ensure you’re on at least Node 18 in Amplify (set under **App settings → Build settings** if needed).
- Host the backend separately (Amplify Functions/Containers, EC2, ECS, or any Node host). Once deployed, point `VITE_API_BASE` at it and redeploy the frontend so the new env var is baked into the bundle.
