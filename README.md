# React + Vite starter for AWS Amplify hosting

A minimal React 18 + Vite app you can wire directly into AWS Amplify for static site hosting. Edit the UI, push to your Git repo, and connect the branch in Amplify to get CI/CD and hosting with no servers to manage.

## Local development

```bash
npm install
npm run dev
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
- Add environment variables in Amplify under **App settings → Environment variables**; read them in code via `import.meta.env`.
- Swap npm for pnpm/yarn by changing the build commands above.

## Troubleshooting

- If Amplify fails to build, try running `npm run build` locally to catch missing deps or env vars.
- Double-check the `baseDirectory` is `dist` so Amplify serves the correct folder.
- Ensure you’re on at least Node 18 in Amplify (set under **App settings → Build settings** if needed).
