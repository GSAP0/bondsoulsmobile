# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BondSouls is a mobile dating/social networking application built with Ionic Framework (Vue 3) and Capacitor, targeting both iOS and Android platforms. The app connects to a Laravel backend API hosted at `https://operator.bondsouls.com/mobile` (development: `http://bondsoulsadmin.test/mobile`).

## Technology Stack

- **Framework**: Ionic 8 with Vue 3 (Composition API)
- **Build Tool**: Vite 7
- **State Management**: Pinia 3
- **HTTP Client**: Axios
- **Routing**: Vue Router with unplugin-vue-router (file-based routing)
- **Styling**: Tailwind CSS 4 + Ionic CSS utilities
- **Native Capabilities**: Capacitor 7 (iOS, Android)
- **Testing**: Vitest (unit), Cypress (e2e)

## Common Commands

### Development
```bash
npm run dev           # Start Vite dev server (http://localhost:5173)
```

### Building
```bash
npm run build         # Build web assets to dist/
npm run preview       # Preview production build locally
```

### Testing
```bash
npm run test:unit     # Run Vitest unit tests
npm run test:e2e      # Run Cypress e2e tests (requires dev server running)
```

### Mobile Platforms
```bash
npx cap sync          # Sync web build to native platforms
npx cap open ios      # Open iOS project in Xcode
npx cap open android  # Open Android project in Android Studio
npx cap run ios       # Build and run on iOS
npx cap run android   # Build and run on Android
```

## Architecture

### Authentication Flow
- Token-based authentication using localStorage (`access_token`)
- User data cached in localStorage (`user` key)
- Authentication initialized in `src/main.ts` before app mount
- Axios configured globally with Bearer token and base URL
- Router guards in `src/router/index.ts` protect non-public routes
- Public routes: `/`, `/otp`, `/verification`

### Routing
- **File-based routing** via `unplugin-vue-router`
- Route files in `src/pages/` automatically generate routes
- `src/pages/index.vue` → `/`
- `src/pages/dashboard.vue` → `/dashboard`
- Router guards check authentication and redirect unauthenticated users

### State Management (Pinia)
- **globalStore** (`src/stores/globalStore.js`):
  - `user`: Current user object
  - `questions`, `answers`, `interests`: Survey/profile data
  - `load()`: Loads all data in parallel and redirects to `/questions?required` if unanswered required questions exist
  - Computed properties for filtering unanswered/required questions

### API Integration
- Base axios instance configured in `src/main.ts`:
  - Base URL: `https://operator.bondsouls.com/mobile`
  - Credentials: withCredentials enabled
  - Authorization header set from localStorage token
- Global `window.axios` available throughout the app
- Endpoints used: `/user`, `/questions`, `/answers`, `/interests`

### Key Application Features
- **Onboarding Flow**: Welcome → Phone verification → OTP → Survey → Bio/Interests
- **Survey System**: Dynamic question types (text, choice, multiple choice, slider, calendar) in `src/components/questions/`
- **Dashboard**: User profile with statistics, questionnaire completion, interests, bio, instructions
- **Required Questions**: App enforces completion of required survey questions before full access

### Component Structure
```
src/
├── pages/              # Route pages (file-based routing)
│   ├── index.vue       # Welcome/login
│   ├── verification.vue
│   ├── otp.vue
│   ├── survey.vue
│   ├── questions.vue
│   ├── dashboard.vue
│   ├── statistics.vue
│   ├── interests.vue
│   ├── bio.vue
│   └── instructions.vue
├── components/
│   ├── questions/      # Survey question types
│   ├── dashboard/      # Dashboard components
│   ├── bio/
│   ├── interests/
│   └── statistics/
├── stores/
│   └── globalStore.js  # Main Pinia store
├── router/
│   └── index.ts        # Router config with auth guards
├── composables/
│   └── axios.js        # Axios wrapper
└── theme/              # CSS variables and custom styles
```

### Styling
- Ionic theming via CSS variables in `src/theme/variables.css`
- Dark mode configured with system preference: `@ionic/vue/css/palettes/dark.system.css`
- Tailwind CSS 4 with Vite plugin for utility classes
- Ionic utility classes for padding, flexbox, alignment

### TypeScript Configuration
- Path alias: `@/` → `src/`
- ESNext target with strict mode
- Vitest globals enabled for testing

### Build Configuration
- Top-level await supported via esbuild config
- Legacy browser support via `@vitejs/plugin-legacy`
- Assets output to `dist/` directory
- Capacitor webDir configured to `dist/`

## Important Notes

- **Mobile-first**: Always test changes on mobile viewports (Ionic components are mobile-optimized)
- **File-based routing**: Add new pages to `src/pages/` to auto-generate routes
- **Store loading**: The app waits for `globalStore.load()` before rendering (see `App.vue`)
- **Survey enforcement**: Users with incomplete required questions are auto-redirected to `/questions?required`
- **Greek language**: UI is in Greek - maintain consistency when adding text
- Αντι για ion-toolbar εχω φτιαξει ενα component @src\components\PageHeader.vue .