# Dev Utilities Hub - Project Constitution

## Role 👤
Act as a Senior Software Architect. We are building **"Dev Utilities Hub"**, a browser-based, offline-first utility suite for developers with a polished, modern interface.

## Mission 🎯
Create a high-performance, production-grade dashboard containing modular developer tools with an emphasis on rich UI/UX, theme customization, and offline capabilities.

**Priority Tools:**
- Base64 Encoder/Decoder
- JWT Decoder
- UUID v4 Generator
- Additional utilities to be added incrementally

## Tech Stack 🛠️

### Core Framework
- **Build Tool**: Vite 5.x (fast HMR, optimized builds)
- **Framework**: React 18.x
- **Language**: TypeScript (strict mode)
- **Routing**: React Router DOM (for multi-tool navigation)

### UI & Styling
- **CSS Framework**: Tailwind CSS (utility-first approach)
- **Component Library**: shadcn/ui (accessible, customizable components)
- **UI Primitives**: Radix UI (comes with shadcn/ui)
- **Icons**: Lucide React (consistent, clean iconography)
- **Animations**: Tailwind transitions + Framer Motion (for complex animations if needed)

### Theme & Customization
- **Theme Management**: next-themes (dark/light mode with system preference)
- **Color Scheme**: Support for dark mode, light mode, and system preference
- **Persistence**: Theme preference saved to localStorage

### State Management
- **Global State**: Zustand (lightweight, for theme, favorites, history)
- **Local State**: React hooks (useState, useReducer)
- **Storage**: localStorage for preferences, IndexedDB for larger data if needed

### PWA & Offline Support
- **PWA Plugin**: vite-plugin-pwa
- **Service Worker**: Workbox (automatic generation)
- **Caching Strategy**: Cache-first for static assets, network-first for dynamic content
- **Offline Fallback**: Full functionality available offline
- **Installability**: Must be installable on desktop and mobile

### Utility Libraries
- **UUID**: `uuid` (v4 generation)
- **Base64**: `js-base64` (encoding/decoding)
- **JWT**: `jwt-decode` (parsing and decoding)
- **Dates**: `date-fns` (formatting and manipulation)
- **Crypto**: `crypto-js` (hashing: MD5, SHA-1, SHA-256, etc.)
- **JSON**: Native JSON with error handling
- **QR Code**: `qrcode.react` (for QR generation utility)
- **Diff**: `diff` (for text comparison utility)

### Development Tools
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Husky + lint-staged (optional)

## Architecture 🏗️

### Plugin Architecture Pattern
Each tool is a **standalone, self-contained React component** following the plugin pattern:

```
/src/
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/                  # App layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── ToolCard.tsx
│   │   └── Navigation.tsx
│   └── tools/                   # Individual utility tools
│       ├── base64/
│       │   ├── Base64Tool.tsx
│       │   ├── base64.utils.ts
│       │   └── base64.types.ts
│       ├── jwt-decoder/
│       │   ├── JwtDecoderTool.tsx
│       │   ├── jwt.utils.ts
│       │   └── jwt.types.ts
│       ├── uuid-generator/
│       │   ├── UuidGeneratorTool.tsx
│       │   ├── uuid.utils.ts
│       │   └── uuid.types.ts
│       └── [tool-name]/
│           ├── [ToolName]Tool.tsx    # Main component
│           ├── [tool-name].utils.ts   # Business logic
│           └── [tool-name].types.ts   # TypeScript types
├── lib/
│   ├── utils.ts                 # Shared utility functions
│   ├── store.ts                 # Zustand store
│   └── constants.ts             # App constants
├── hooks/
│   ├── useCopyToClipboard.ts   # Reusable clipboard hook
│   ├── useLocalStorage.ts      # localStorage wrapper
│   └── useTheme.ts             # Theme management hook
├── types/
│   ├── tool.types.ts           # Tool interface definitions
│   └── global.types.ts         # Global type definitions
├── config/
│   └── tools.config.ts         # Tool registry/metadata
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

### Tool Component Interface
Every tool must implement the following structure:

```typescript
// Tool metadata interface
interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'encoder' | 'generator' | 'parser' | 'converter' | 'formatter';
  component: React.ComponentType;
}

// Tool component props
interface ToolComponentProps {
  className?: string;
}
```

### Central State Management
```typescript
// Zustand store structure
interface AppStore {
  theme: 'light' | 'dark' | 'system';
  activeTool: string | null;
  favorites: string[];
  history: ToolHistoryItem[];
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setActiveTool: (toolId: string) => void;
  toggleFavorite: (toolId: string) => void;
  addToHistory: (item: ToolHistoryItem) => void;
  clearHistory: () => void;
}
```

## Design System 🎨

### Color Palette
- Use Tailwind's default color system
- Define CSS variables for theme colors in `globals.css`
- Support dark mode using `class` strategy (preferred over media queries)

### Component Guidelines
- All interactive elements must have hover, focus, and active states
- Use shadcn/ui components for consistency
- Animations should be subtle and purposeful (respect `prefers-reduced-motion`)
- All form inputs must have proper labels and ARIA attributes

### Typography
- Font: System font stack (native OS fonts for performance)
- Headings: Clear hierarchy using Tailwind's typography scale
- Code blocks: Monospace font for technical content

### Spacing & Layout
- Consistent spacing using Tailwind's spacing scale (4px base unit)
- Responsive design: mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

## Constraints & Requirements ⚠️

### TypeScript Standards
- ✅ **No `any` types** - Use proper type definitions or `unknown`
- ✅ **Strict mode enabled** - No implicit any, strict null checks
- ✅ **Explicit return types** - For all functions and components
- ✅ **Interface over Type** - Use interfaces for object shapes, types for unions/intersections
- ✅ **Proper error typing** - Use discriminated unions for error states

### Mandatory Features for Every Tool
1. **Copy to Clipboard** - One-click copy functionality with visual feedback
2. **Clear/Reset** - Ability to clear all inputs
3. **Error Handling** - Graceful error messages for invalid inputs
4. **Loading States** - Show processing for long operations (if any)
5. **Responsive Design** - Works on mobile, tablet, and desktop
6. **Keyboard Shortcuts** - Support common shortcuts (Ctrl+C, Ctrl+V, Esc to clear)
7. **Accessibility** - WCAG 2.1 AA compliant (proper ARIA labels, keyboard navigation)

### Performance Targets 🎯
- **Lighthouse Score**: 100/100 (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: < 200KB gzipped for initial load
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.0s
- **Code Splitting**: Lazy load tools not currently in use
- **Tree Shaking**: Eliminate unused code
- **No External API Calls**: All processing happens client-side for security and speed

### Security Requirements 🔒
- **Client-Side Only**: All transformations happen in the browser
- **No Data Transmission**: Never send user data to external servers
- **Content Security Policy (CSP)**: Implement strict CSP headers
- **XSS Prevention**: Sanitize all user inputs
- **Secure Dependencies**: Regular dependency audits (`npm audit`)

### PWA Requirements 📱
- **Manifest**: Proper web app manifest with icons (192x192, 512x512)
- **Service Worker**: Auto-generated via vite-plugin-pwa
- **Offline Mode**: Full functionality without network connection
- **Install Prompt**: Custom install button in UI
- **Update Notifications**: Alert users when new version is available
- **Cache Strategy**: 
  - Static assets: Cache-first
  - HTML: Network-first with cache fallback
  - API calls: None (client-side only)

### Accessibility Standards ♿
- **Keyboard Navigation**: All features accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators, logical tab order
- **Color Contrast**: WCAG AA compliance (4.5:1 for normal text)
- **Reduced Motion**: Respect `prefers-reduced-motion` setting
- **Alternative Text**: All icons have descriptive labels

## Development Workflow 🔄

### Code Quality
```bash
# Before commit
npm run lint          # ESLint check
npm run type-check    # TypeScript validation
npm run format        # Prettier formatting
npm run test          # Run unit tests (if applicable)
```

### Git Commit Convention
```
feat: Add new tool (UUID Generator)
fix: Correct Base64 padding issue
style: Update theme toggle icon
refactor: Extract clipboard logic to hook
perf: Optimize JWT parsing performance
docs: Update README with new tool
```

### Build & Deployment
```bash
npm run dev           # Development server
npm run build         # Production build
npm run preview       # Preview production build
npm run lighthouse    # Run Lighthouse audit
```

### Testing Strategy
- **Unit Tests**: Critical utility functions (encoding, decoding, parsing)
- **Component Tests**: Tool components with React Testing Library
- **E2E Tests**: User workflows with Playwright (optional for v1)
- **Accessibility Tests**: Automated a11y checks with axe-core

## Feature Roadmap 🗺️

### Phase 1: MVP (Core Tools)
- [x] Base64 Encoder/Decoder
- [x] JWT Decoder
- [x] UUID v4 Generator
- [x] Dark/Light theme toggle
- [x] PWA setup with offline support

### Phase 2: Extended Utilities
- [ ] JSON Formatter/Validator
- [ ] URL Encoder/Decoder
- [ ] Hash Generator (MD5, SHA-1, SHA-256, SHA-512)
- [ ] Timestamp Converter (Unix/ISO)
- [ ] QR Code Generator
- [ ] Color Converter (HEX/RGB/HSL)

### Phase 3: Advanced Features
- [ ] Text Diff Tool
- [ ] Regex Tester
- [ ] Markdown Preview
- [ ] YAML ↔ JSON Converter
- [ ] Lorem Ipsum Generator
- [ ] Cron Expression Parser

### Phase 4: User Experience Enhancements
- [ ] Favorites system (star tools)
- [ ] Recent history with search
- [ ] Export/Import settings
- [ ] Keyboard shortcuts panel
- [ ] Command palette (Cmd+K)
- [ ] Shareable links with pre-filled data

## Success Metrics ✅

### Technical Metrics
- Bundle size < 200KB gzipped
- 100/100 Lighthouse score
- 0 TypeScript errors
- 0 accessibility violations
- < 100ms tool processing time

### User Experience Metrics
- Works offline seamlessly
- Theme persists across sessions
- One-click copy functionality
- Mobile responsive (all breakpoints)
- No layout shifts (CLS = 0)

## Documentation Requirements 📚
- **README.md**: Installation, usage, contribution guide
- **CONTRIBUTING.md**: Code standards, PR process
- **Component Documentation**: Props, usage examples via Storybook (optional)
- **Tool Guidelines**: How to add new tools

---

## Notes for Implementation 📝

1. **Start Small**: Implement Base64, JWT, UUID first. Validate architecture before scaling.
2. **Component Reusability**: Extract common patterns (input/output areas, copy buttons, error displays).
3. **Progressive Enhancement**: Build core functionality first, add PWA/theme as enhancements.
4. **Performance First**: Use React.lazy() for code splitting, monitor bundle size.
5. **Security Mindset**: Never trust user input, always validate and sanitize.

---

**Last Updated**: February 8, 2026  
**Version**: 1.0  
**Owner**: Sandun Wanniarachchi
