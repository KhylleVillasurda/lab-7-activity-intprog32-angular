# ipt-2026-frontend

Angular frontend for the IPT 2026 project. Uses pnpm as the package manager.

## Prerequisites

Install pnpm globally if you haven't:
```bash
npm install -g pnpm
```

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm start
```

Runs on `http://localhost:4200`. By default uses the **fake backend** (no real API needed).

### Switching to your real backend (node-mysql-api)

1. Make sure your backend is running on `http://localhost:4000`
2. Open `src/environments/environment.ts` and set:
   ```ts
   useFakeBackend: false,
   ```
3. Restart `pnpm start`

That's it — no other code changes needed.

## Build for production

```bash
pnpm build:prod
```

Output goes to `dist/`. The production build **never** uses the fake backend regardless of the flag.

## Deployment (Vercel)

1. Push this repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Vercel auto-detects Angular. Set the build command to `pnpm build:prod`
4. Set the output directory to `dist/ipt-2026-frontend/browser`
5. Update the `apiUrl` in `src/environments/environment.prod.ts` to your deployed backend URL

The `vercel.json` handles Angular SPA client-side routing automatically.

## Project structure

```
src/
├── app/
│   ├── _components/   # Shared UI components
│   ├── _helpers/      # Interceptors, guards, fake backend
│   ├── _models/       # TypeScript interfaces
│   ├── _services/     # API service layer
│   ├── account/       # Login, register, forgot/reset password
│   ├── admin/         # Admin panel (accounts management)
│   ├── home/          # Home page
│   └── profile/       # User profile update
└── environments/
    ├── environment.ts       # Dev config (useFakeBackend: true by default)
    └── environment.prod.ts  # Prod config (useFakeBackend: false always)
```
