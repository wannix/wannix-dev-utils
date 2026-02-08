# Dev Utilities Hub Implementation Plan

## Executive Summary
This plan outlines the development of "Dev Utilities Hub," a high-performance, offline-first browser-based developer toolkit. The approach prioritizes a "premium" polished UI using the shadcn/ui ecosystem, strictly adhering to the architectural constraints (standalone plugin pattern) and security guidelines (client-side only). Development is broken down into 5 phases, starting with the Core MVP.

## Design System Extraction

### Visual Language
- **Layout**: Sidebar Navigation (Left) + Top Header (Search/Utils) + Main Content Area.
- **Color Palette**:
  - **Background (Dark)**: `#020817` (Deep Navy/Black)
  - **Background (Light)**: `#ffffff` (Pure White)
  - **Primary Accent**: `#7c3aed` (Violet-600) to `#3b82f6` (Blue-500) gradients for main actions.
  - **Surface/Cards**: `#0f172a` (Slate-950) with subtle borders `#1e293b` (Slate-800).
  - **Text**: Primary `#f8fafc`, Muted `#94a3b8`.
- **Spacing**: Base unit 4px. Comfortable density (p-6 container padding).
- **Border Radius**:
  - Cards/Containers: `rounded-xl` (0.75rem)
  - Buttons: `rounded-md` or `rounded-full` for primary actions.
  - Inputs: `rounded-md`.
- **Effects**:
  - Glassmorphism on Sidebar/Header (`bg-background/95 backdrop-blur-md`).
  - Subtle colored shadows on primary buttons (`shadow-lg shadow-violet-500/20`).

### Component Patterns
- **Card Style**: `Card` from shadcn/ui with `border-border/40` and `bg-card/50` for depth.
- **Buttons**:
  - **Primary**: Solid Violet/Blue gradient, white text.
  - **Secondary**: `ghost` or `outline` variant for tool actions (Copy, Reset).
- **Inputs**: `bg-muted/50` with focus rings matching primary accent.
- **Navigation**:
  - Vertical Sidebar with grouped categories (Collapsible/Accordion style).
  - Icons (Lucide) for every tool.

## Architecture Decisions

### Routing Strategy
- **Recommendation**: **React Router DOM v6** (Browser Router)
- **Rationale**: Enables deep linking (e.g., `/tools/uuid`, `/tools/jwt`), browser history navigation, and lazy loading of routes. Essential for a "hub" feel where users can bookmark specific tools.

### State Management
- **Tool State**: Local `useState`/`useReducer` within tool components (isolation).
- **Global App State**: **Zustand**.
  - `useAppStore`: Theme, Sidebar open/close, Active Tool metadata, Favorites list.
  - `useHistoryStore`: Last used tools, recent inputs (persisted to localStorage).
- **Theme**: `next-themes` standard implementation.

### Component Hierarchy
```
App
├── ThemeProvider (next-themes)
├── Toaster (sonner/shadcn)
└── Layout
    ├── Sidebar (Navigation groups: Converters, Generators, Parsers)
    ├── Header (Command Palette trigger, Theme Toggle, GitHub link)
    └── Main (Scrollable)
        └── Suspense (Fallback: LoadingSpinner)
             └── Routes
                 ├── Home (Dashboard/Favorites)
                 └── ToolContainer (Layout wrapper for tools)
                     └── ToolComponent (Lazy Loaded: e.g., Base64Tool)
```

## Implementation Phases

### Phase 1: Project Skeleton & Design System
**Goal**: Initialize repo, setup architecture, and implement the visual shell.
- **Task 1.1**: Initialize Vite + React + TS project with strict linting rules.
- **Task 1.2**: Install & Configure Tailwind, shadcn/ui, Lucide, `next-themes`.
- **Task 1.3**: Implement `Layout`, `Sidebar`, and `Header` components.
- **Task 1.4**: Setup Zustand stores (`app.store.ts`) and Routing structure.
- **Task 1.5**: Create the "Tool Shell" (standard layout for tool header, description, Input/Output zones).
- **Validation**: App loads with correct layout, theme toggle works, responsive sidebar.

### Phase 2: Core Tool Implementation (MVP)
**Goal**: Implement the 3 priority tools with full features.
- **Task 2.1**: Implement `UUID Generator` (v4, quantity, copy all).
- **Task 2.2**: Implement `Base64 Encoder/Decoder` (live update, error handling).
- **Task 2.3**: Implement `JWT Decoder` (visual breakdown of Header/Payload, expiry warning).
- **Task 2.4**: Add "Recent History" functionality to core tools.
- **Validation**: All 3 tools functional, pass unit tests for logic, retain state on navigation.

### Phase 3: PWA & Offline Capability
**Goal**: Make it a proper "app" that works without internet.
- **Task 3.1**: Configure `vite-plugin-pwa`.
- **Task 3.2**: Generate assets (manifest, icons using `vite-pwa-assets` or similar).
- **Task 3.3**: Register Service Worker with "Offline Ready" toast.
- **Validation**: App installable on Chrome/Safari, works in Airplane mode.

### Phase 4: Polish & Experience
**Goal**: Add the "wow" factor from the screenshots.
- **Task 4.1**: Add Command Palette (`Cmd+K`) for quick navigation between tools.
- **Task 4.2**: Implement "Favorites" system (pin tools to sidebar/dashboard).
- **Task 4.3**: Add micro-interactions (Framer Motion on page transitions/tool switches).
- **Task 4.4**: Global "History" view.
- **Validation**: Smooth transitions, keyboard navigation (Cmd+K).

### Phase 5: Documentation & Delivery
- **Task 5.1**: Write README.md and CONTRIBUTING.md.
- **Task 5.2**: Final Lint/Type-check sweep.
- **Task 5.3**: Production Build analysis (Bundle size check).

## Risk Assessment & Mitigation

| Priority | Risk | Mitigation |
| :--- | :--- | :--- |
| **High** | **Bundle Size** | Strict code-splitting (Lazy load *every* tool). Use `import { x }` instead of `*`. Monitor `rollup-plugin-visualizer` reports. |
| **Medium** | **Complex JWTs** | Some JWTs (encrypted/JWE) might crash standard decoders. **Mitigation**: Wrap decoding in robust `try/catch` and show friendly "Encrypted tokens not supported" message. |
| **Medium** | **LocalStorage Quota** | Storing too much history/state can hit 5MB limits. **Mitigation**: Implement MRU (Most Recently Used) limits (e.g., max 50 items) and auto-prune. |
| **Low** | **UI Consistency** | Different tools might look disjointed. **Mitigation**: Enforce use of `ToolPage` wrapper and `ToolSection` components. |

## Open Questions / Clarifications Needed

1.  **Icon Assets**: Do we have specific SVG assets for the branding/logo, or should I generate a placeholder text logo?
    - **Decision**: Use an SVG Text logo with styling. The text is "Dev Utilities Hub".
2.  **History Persistence**: Should sensitive tool inputs (like decoded JWTs or Base64 secrets) be excluded from LocalStorage history for security? (Suggestion: Yes, exclude by default or ask user).
    - **Decision**: Ask the user (via UI prompt/setting) whether to persist sensitive data. If they confirm "yes", it will be saved to `localStorage`.
    - **Note**: Provide a delete action button for individual saved items.

## Handoff
This plan acts as the blueprint. The Implementation Agent should strictly follow the Folder Structure defined in `constitution.md`.
