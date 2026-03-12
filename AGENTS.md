# NexusCoreAngular — Agent Instructions

## Project Overview

NexusCoreAngular is the Angular 21 web client for the NexusCore multi-tenant Resource Management SaaS. It is a **frontend-only** app — it has no backend of its own. It connects to either of the two existing backends via a user-selectable toggle persisted in `localStorage`.

**Backend repos:**

- `NexusCoreJS` at `/Users/jake/projects/NexusCore` (GitHub: `jakevb8/NexusCore`) — NestJS REST API at `https://nexus-coreapi-production.up.railway.app/api/v1`
- `NexusCoreDotNet` at `/Users/jake/projects/NexusCoreDotNet` (GitHub: `jakevb8/NexusCoreDotNet`) — ASP.NET Core at `https://nexuscoredotnet-production.up.railway.app/api/v1`

**Sister client apps:**

| Repo             | Path                                    | GitHub                     | Purpose                                 |
| ---------------- | --------------------------------------- | -------------------------- | --------------------------------------- |
| NexusCoreJS      | `/Users/jake/projects/NexusCore`        | `jakevb8/NexusCore`        | Next.js/NestJS fullstack                |
| NexusCoreDotNet  | `/Users/jake/projects/NexusCoreDotNet`  | `jakevb8/NexusCoreDotNet`  | ASP.NET Core 8 Razor Pages fullstack    |
| NexusCoreAndroid | `/Users/jake/projects/NexusCoreAndroid` | `jakevb8/NexusCoreAndroid` | Jetpack Compose Android client          |
| NexusCoreReact   | `/Users/jake/projects/NexusCoreReact`   | `jakevb8/NexusCoreReact`   | Expo React Native cross-platform client |
| NexusCoreIOS     | `/Users/jake/projects/NexusCoreIOS`     | `jakevb8/NexusCoreIOS`     | SwiftUI iOS native client               |

## NEVER COMMIT SECRETS — CRITICAL

**This has caused incidents in sister repos. Read before every commit.**

Files that MUST NEVER be committed:

- `src/environments/environment.ts` — contains Firebase API key and config; **gitignored**
- `src/environments/environment.prod.ts` — production Firebase config; **gitignored**
- Any file containing a real API key, private key, password, or credentials

Both environment files are listed in `.gitignore`. Before every `git add`:

1. Run `git diff --staged` and scan for key/secret values
2. If accidentally staged: `git reset HEAD src/environments/environment.ts`
3. If committed: rotate key immediately, use BFG to purge from history, force-push

**How to restore environment files (gitignored, not committed):**

Create `src/environments/environment.ts` with:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: '<your-firebase-api-key>',
    authDomain: 'nexus-core-rms.firebaseapp.com',
    projectId: 'nexus-core-rms',
    storageBucket: 'nexus-core-rms.appspot.com',
    messagingSenderId: '<sender-id>',
    appId: '<app-id>',
  },
};
```

And `src/environments/environment.prod.ts` with the same shape but `production: true` and real production values.

Firebase config values can be retrieved from the Firebase Console → Project Settings → Your apps → NexusCoreAngular web app, or via:

```bash
firebase apps:sdkconfig WEB --project nexus-core-rms
```

## Firebase Project

- **Project ID**: `nexus-core-rms` (same as NexusCoreJS and NexusCoreAndroid)
- **Auth**: Google sign-in only — do not attempt Email/Password
- **SDK**: `firebase` npm package used directly (NOT `@angular/fire` — incompatible with Angular 21)
- `initializeApp()` + `getAuth()` are called inside `AuthService` at service instantiation

## Cross-Repo Feature Parity

NexusCoreAngular mirrors the **frontend/UI feature set** of all other NexusCore client apps. When a UI feature changes in any repo, the equivalent change MUST be made here. Backend-only changes (e.g. business logic, migrations) do NOT require changes here.

**Cross-repo check rule:** At the start of every task, read the relevant files in all sister repos to check whether an equivalent change has already been made there. If it has, apply the same change here. If this repo is ahead, propagate to the others. Never assume parity — always verify by reading the files.

**Canonical UI features (all must be implemented):**

| Screen     | Features                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Login      | Google sign-in (Firebase), backend selector chips (JS vs .NET), persists choice to `localStorage` |
| Onboarding | Display name + org name form, POST /auth/register                                                 |
| Pending    | Pending approval message, sign out                                                                |
| Dashboard  | Navigation cards to Assets, Team, Reports, Events, Settings                                       |
| Assets     | List with search + pagination, create/edit/delete modal (manager only), CSV import, sample CSV    |
| Team       | Member list, invite by email modal, copy-link fallback, remove member, change role dropdown       |
| Reports    | Total assets, utilization %, assets-by-status custom CSS bar chart                               |
| Events     | Paginated Kafka asset status change history (asset name, old/new status, timestamp)               |
| Settings   | Account info, backend picker (JS vs .NET), sign out                                               |

## Project Structure

```
NexusCoreAngular/
├── angular.json                         — build config, env fileReplacements
├── package.json                         — Angular 21, firebase, axios
├── tsconfig.json / tsconfig.app.json
├── src/
│   ├── main.ts                          — entry point
│   ├── index.html
│   ├── styles.scss                      — global dark theme + button utilities
│   ├── environments/
│   │   ├── environment.ts               — GITIGNORED; Firebase config + dev API URLs
│   │   └── environment.prod.ts          — GITIGNORED; production Firebase config
│   └── app/
│       ├── app.ts                       — auth-status-driven navigation shell
│       ├── app.html                     — <router-outlet>
│       ├── app-module.ts                — root NgModule, FormsModule, service providers
│       ├── app-routing-module.ts        — lazy-loaded routes + AuthGuard/GuestGuard
│       ├── models/index.ts              — all enums, interfaces, helper functions
│       ├── services/
│       │   ├── auth.service.ts          — Firebase Auth, AppAuthStatus observable
│       │   ├── api.service.ts           — axios client, Bearer token, all API endpoints
│       │   └── backend-preference.service.ts — localStorage-backed backend selector
│       ├── guards/
│       │   ├── auth.guard.ts            — redirects unauthenticated to /login
│       │   └── guest.guard.ts           — redirects authenticated away from /login
│       ├── shared/
│       │   ├── shared.module.ts
│       │   └── components/
│       │       ├── app-header.component.ts
│       │       └── status-chip.component.ts
│       └── pages/
│           ├── login/
│           ├── onboarding/
│           ├── pending-approval/
│           ├── dashboard/
│           ├── assets/
│           ├── team/
│           ├── reports/
│           ├── events/
│           └── settings/
└── AGENTS.md
```

## Key Commands

```bash
# Install dependencies
npm install

# Development server
npx ng serve               # http://localhost:4200

# Production build
npx ng build               # output: dist/nexuscore-angular/browser/

# Run unit tests
npx ng test

# Lint
npx ng lint
```

## Architecture

- **Framework**: Angular 21, NgModules (non-standalone), SCSS
- **Routing**: Lazy-loaded feature modules, one per page. `AuthGuard` protects post-auth routes; `GuestGuard` protects `/login`.
- **Auth**: Firebase Auth via `firebase` npm package (`initializeApp` + `getAuth`). Google sign-in only. `AuthService` exposes `status$` observable (`AppAuthStatus`: `loading | unauthenticated | onboarding | pending | active`). `App` component subscribes and navigates accordingly.
- **API**: `axios` (not Angular `HttpClient`). `ApiService` creates the axios instance with a Bearer token request interceptor that fetches the current Firebase ID token on every call. Base URL is read from `BackendPreferenceService`.
- **Backend selector**: `BackendPreferenceService` reads/writes `localStorage` key `nexuscore_backend_choice`. Two values: `JS` → NestJS, `DOTNET` → ASP.NET Core. Switching backend reloads the axios instance.
- **State**: No NgRx/Akita. Each page component manages its own local state.
- **Charts**: Custom CSS bar chart in the Reports page (no Chart.js dependency at runtime — `ng2-charts`/`chart.js` are installed but the custom CSS approach is used).

## API Backends

| Key      | Base URL                                                   | Label                      |
| -------- | ---------------------------------------------------------- | -------------------------- |
| `JS`     | `https://nexus-coreapi-production.up.railway.app/api/v1`   | NexusCoreJS (Node API)     |
| `DOTNET` | `https://nexuscoredotnet-production.up.railway.app/api/v1` | NexusCoreDotNet (.NET API) |

## Angular-Specific Decisions

- **Angular 21 + no `@angular/fire`**: `@angular/fire@20` only supports `@angular/common@^20`. The `firebase` npm package is used directly. Do NOT attempt to install `@angular/fire` — it will break the build.
- **NgModules (non-standalone)**: The project uses `--standalone false`. Every component, directive, and pipe must be declared in a module. Lazy-loaded pages each have their own `*Module` with a `RouterModule.forChild(routes)`.
- **`FormsModule`** is imported in `AppModule` (for template-driven forms in onboarding, assets, etc.).
- **`HttpClient` is NOT used** — `axios` handles all HTTP. Do not add `HttpClientModule`.
- **Environment file replacement**: `angular.json` has `fileReplacements` configured for production. The `environment.ts` file is always imported; `environment.prod.ts` is swapped in by the build for `ng build`.

## Railway Deployment

The app is deployed as a static site on Railway. Railpack detects Angular automatically and serves the output with Caddy.

**Required Railway service variables:**

| Variable | Value |
| -------- | ----- |
| `RAILPACK_SPA_OUTPUT_DIR` | `dist/nexuscore-angular/browser` |
| `FIREBASE_API_KEY` | from Firebase Console |
| `FIREBASE_AUTH_DOMAIN` | `nexus-core-rms.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | `nexus-core-rms` |
| `FIREBASE_STORAGE_BUCKET` | `nexus-core-rms.firebasestorage.app` |
| `FIREBASE_MESSAGING_SENDER_ID` | from Firebase Console |
| `FIREBASE_APP_ID` | from Firebase Console |

- `RAILPACK_SPA_OUTPUT_DIR` is a **Railpack** variable — it tells Caddy where the built static files are. Angular 21 outputs to `dist/nexuscore-angular/browser/`; Railpack defaults to `/app/browser` and will fail without this.
- The `FIREBASE_*` variables are **build-time only** — `scripts/generate-env.js` (run via the `prebuild` npm hook) reads them and writes `environment.ts` and `environment.prod.ts` before `ng build` runs. They are baked into the JS bundle and not read at runtime.
- After deploying, add the Railway domain to **Firebase Console → Authentication → Authorised domains** or `signInWithPopup` will be blocked.
- The full variable list with real values is in `railway-setup.txt` (gitignored — do not commit it).

## Common Pitfalls

- **Environment files are gitignored** — recreate them from the Firebase Console before running or building locally. The build will fail without them. On Railway, the `prebuild` script generates them automatically from the `FIREBASE_*` variables.
- **Switching backend** updates `localStorage` and reinitialises the axios instance. The change takes effect immediately (no app restart needed, unlike the Android app).
- **Google Sign-In**: Firebase's `signInWithPopup(provider)` is used. In development, `localhost:4200` must be in the Firebase Console → Authentication → Authorised domains.
- **`AppAuthStatus` flow**: `loading` → (Firebase resolves) → `unauthenticated` | `onboarding` | `pending` | `active`. `App.ngOnInit` subscribes and navigates. Guards provide a secondary layer of protection.
- **Lazy-loaded modules**: Each page module must re-export `SharedModule` or import it directly if it uses `AppHeaderComponent` or `StatusChipComponent`.
- After completing any task that modifies files, always commit and push to the current branch without asking for confirmation.
- **README maintenance**: After any feature addition, removal, or significant UI change, update `README.md` in every affected repo to reflect the current feature list. The READMEs are the public-facing source of truth and must not fall behind the code.

When making function calls using tools that accept array or object parameters ensure those are structured using JSON. For example:

```json
[{ "color": "orange", "options": { "option_key_1": true, "option_key_2": "value" } }]
```
