# NexusCoreAngular

Angular 21 web client for the [NexusCore](https://github.com/jakevb8/NexusCore) multi-tenant Resource Management SaaS. Frontend-only — connects to the ASP.NET Core backend.

## Tech Stack

- **Framework**: Angular 21, NgModules, SCSS
- **Auth**: Firebase Authentication (Google sign-in only), `firebase` npm package (direct SDK — no `@angular/fire`)
- **HTTP**: Axios with Firebase Bearer token interceptor
- **Backend**: NexusCoreDotNet (.NET API) — hardcoded, no toggle

## Features

| Screen     | Features                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Login      | Google sign-in (Firebase)                                                                      |
| Onboarding | Display name + org name form, POST /auth/register                                              |
| Pending    | Pending approval message, sign out                                                             |
| Dashboard  | Navigation cards to Assets, Team, Reports, Settings                                            |
| Assets     | List with search + pagination, create/edit/delete modal (manager only), CSV import, sample CSV |
| Team       | Member list, invite by email modal, copy-link fallback, remove member, change role dropdown    |
| Reports    | Total assets, utilization %, assets-by-status custom CSS bar chart                            |
| Settings   | Account info, sign out, delete account                                                         |

## API Backend

`https://nexuscoredotnet-production.up.railway.app/api/v1`

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase project `nexus-core-rms` access (to restore environment files)

### Setup

```bash
npm install
```

Restore the gitignored environment files from the Firebase Console (Project Settings → Your apps → NexusCoreAngular web app) or via:

```bash
firebase apps:sdkconfig WEB --project nexus-core-rms
```

Create `src/environments/environment.ts`:

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

### Development

```bash
npx ng serve        # http://localhost:4200
```

### Production build

```bash
npx ng build        # output: dist/nexuscore-angular/browser/
```

### Tests

```bash
npx ng test
```

## Sister Repos

| Repo             | GitHub                                                         | Purpose                                 |
| ---------------- | -------------------------------------------------------------- | --------------------------------------- |
| NexusCoreJS      | [jakevb8/NexusCore](https://github.com/jakevb8/NexusCore)      | Next.js/NestJS fullstack                |
| NexusCoreDotNet  | [jakevb8/NexusCoreDotNet](https://github.com/jakevb8/NexusCoreDotNet) | ASP.NET Core 8 Razor Pages fullstack    |
| NexusCoreAndroid | [jakevb8/NexusCoreAndroid](https://github.com/jakevb8/NexusCoreAndroid) | Jetpack Compose Android client          |
| NexusCoreReact   | [jakevb8/NexusCoreReact](https://github.com/jakevb8/NexusCoreReact) | Expo React Native cross-platform client |
| NexusCoreIOS     | [jakevb8/NexusCoreIOS](https://github.com/jakevb8/NexusCoreIOS) | SwiftUI iOS native client               |
