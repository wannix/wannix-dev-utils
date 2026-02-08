# Claude Code Prompts - Dev Utilities Hub Build Guide

## 📋 Prompt Strategy Overview

**Token Optimization Principles:**
1. Reference constitution files by path instead of pasting content
2. Use specific, actionable instructions
3. Request validation checkpoints after each phase
4. Break work into logical, testable increments
5. Request confirmation before major architectural decisions

---

## 🚀 PROMPT 1: Project Initialization & Planning

```
I'm building "Dev Utilities Hub" - a developer utilities web app. I've attached:
1. constitution.md (full technical spec)
2. UI inspiration screenshots (for design reference)

TASK: Create a detailed, actionable task list following the constitution strictly.

REQUIREMENTS:
- Read constitution.md thoroughly
- Analyze the UI screenshots to extract design patterns (layout, spacing, colors, component style)
- Create a phased task list with validation checkpoints
- Identify any potential blockers or unclear requirements
- Suggest optimal file/folder structure based on the constitution

OUTPUT FORMAT:
## Phase 1: Project Setup
- [ ] Task 1.1: Description
- [ ] Task 1.2: Description
  - Validation: How to verify completion

## Phase 2: Core Architecture
...

## Phase 3: First Tool (Base64)
...

## Design System Decisions (based on screenshots):
- Color palette: [extracted from images]
- Component style: [card-based/minimal/etc]
- Layout pattern: [sidebar/tabs/grid]

## Questions/Clarifications:
[Any ambiguities in the constitution]

Do NOT start coding yet. Wait for my approval of this plan.
```

---

## 🏗️ PROMPT 2: Project Setup (After Plan Approval)

```
Approved! Execute Phase 1: Project Setup.

CONSTITUTION: See constitution.md (already in context)

TASKS:
1. Initialize Vite + React + TypeScript project
2. Install ALL dependencies from constitution (exact versions)
3. Configure Tailwind CSS with dark mode support
4. Set up shadcn/ui (initialize + install: button, card, input, textarea, tabs, toast)
5. Create folder structure exactly as specified in constitution
6. Configure vite.config.ts with PWA plugin
7. Set up TypeScript strict mode + path aliases

VALIDATION CHECKLIST:
- [ ] npm run dev starts without errors
- [ ] Tailwind classes work
- [ ] Dark mode CSS variables defined in globals.css
- [ ] All folders created per constitution architecture
- [ ] TypeScript strict mode enabled

OUTPUT:
- List what was installed (versions)
- Show final package.json
- Confirm folder structure matches constitution
- Report any deviations and why

STOP after validation. Wait for next prompt.
```

---

## 🎨 PROMPT 3: Theme System & Layout

```
CONSTITUTION: constitution.md (in context)

TASK: Implement theme system and app layout shell.

REQUIREMENTS (from constitution):
- next-themes integration
- Theme toggle component (Header)
- Dark/light mode with system preference
- Persistent theme in localStorage
- Layout: Header + Sidebar (or tabs, match UI screenshots)

FILES TO CREATE:
1. src/hooks/useTheme.ts - Theme management hook
2. src/components/layout/Header.tsx - App header with theme toggle
3. src/components/layout/Sidebar.tsx - Navigation sidebar
4. src/components/layout/ThemeToggle.tsx - Toggle button component
5. src/lib/store.ts - Zustand store (theme, activeTool, favorites, history)
6. src/App.tsx - Main app shell with layout

DESIGN REFERENCE:
Use the UI screenshots I provided earlier. Match:
- Header height/style
- Sidebar width/navigation pattern
- Overall spacing/padding
- Color scheme (extract from dark/light mode images)

VALIDATION:
- [ ] Theme persists on page reload
- [ ] Toggle switches smoothly between dark/light
- [ ] All shadcn/ui components adapt to theme
- [ ] Layout responsive on mobile (test viewport resize)
- [ ] No console errors

Show me the key component code for review before proceeding.
```

---

## 🔧 PROMPT 4: Tool Infrastructure

```
CONSTITUTION: constitution.md

TASK: Create tool plugin architecture and shared utilities.

FILES TO CREATE:
1. src/types/tool.types.ts
   - ToolConfig interface (id, name, description, icon, category, component)
   - ToolComponentProps interface
   
2. src/hooks/useCopyToClipboard.ts
   - Copy functionality with toast notification
   - Return: { copy, isCopied } with 2s reset
   
3. src/config/tools.config.ts
   - Tool registry array
   - Export tools: ToolConfig[]
   
4. src/components/layout/ToolCard.tsx
   - Reusable tool wrapper component
   - Props: title, description, children
   - Includes copy button slot

VALIDATION:
- [ ] useCopyToClipboard hook works (test with dummy data)
- [ ] ToolCard renders with proper styling
- [ ] Tool registry structure matches ToolConfig interface
- [ ] TypeScript: zero errors, no 'any' types

Run `npm run type-check` and show results.
```

---

## 🛠️ PROMPT 5: First Tool - Base64 Encoder/Decoder

```
CONSTITUTION: constitution.md

TASK: Build Base64 tool following plugin architecture.

FOLDER: src/components/tools/base64/

FILES:
1. base64.types.ts
   - Type definitions (Mode: 'encode' | 'decode', etc.)
   
2. base64.utils.ts
   - encodeBase64(input: string): string
   - decodeBase64(input: string): string | Error
   - Proper error handling (try/catch, return typed errors)
   
3. Base64Tool.tsx
   - Two textareas: input/output
   - Mode toggle (encode/decode)
   - Copy button using useCopyToClipboard
   - Clear button
   - Error display for invalid Base64 decode
   - Match UI design from screenshots

REQUIREMENTS (from constitution):
✅ No 'any' types
✅ Copy to clipboard
✅ Clear/reset button
✅ Error handling with user-friendly messages
✅ Responsive design
✅ Keyboard shortcuts (Ctrl+C for copy, Esc for clear)
✅ Accessibility (labels, ARIA)

VALIDATION:
- [ ] Encode: "Hello World" → "SGVsbG8gV29ybGQ="
- [ ] Decode: "SGVsbG8gV29ybGQ=" → "Hello World"
- [ ] Invalid decode shows error (don't crash)
- [ ] Copy button shows "Copied!" feedback
- [ ] Mobile responsive
- [ ] Dark/light theme works
- [ ] TypeScript: no errors

Test all edge cases. Show screenshots of working tool.
```

---

## 🔑 PROMPT 6: JWT Decoder Tool

```
CONSTITUTION: constitution.md

TASK: Build JWT Decoder (read-only, no verification).

FOLDER: src/components/tools/jwt-decoder/

REQUIREMENTS:
- Parse JWT into header, payload, signature
- Display JSON formatted with syntax highlighting
- Show decoded timestamps (iat, exp, nbf) as human-readable dates
- Copy individual sections (header/payload) or full decoded JSON
- Error handling for invalid JWT format
- Use `jwt-decode` library

DESIGN:
- Input: textarea for JWT token
- Output: Three sections (Header | Payload | Signature)
- Each section: collapsible card with copy button
- Timestamp fields: show both Unix and ISO format

VALIDATION:
- [ ] Valid JWT decodes properly
- [ ] Invalid JWT shows helpful error
- [ ] Timestamps formatted correctly
- [ ] Copy buttons work for each section
- [ ] Follows constitution requirements (copy, clear, errors, etc.)

Provide test JWT for me to validate.
```

---

## 🆔 PROMPT 7: UUID Generator Tool

```
CONSTITUTION: constitution.md

TASK: Build UUID v4 Generator.

FOLDER: src/components/tools/uuid-generator/

FEATURES:
- Generate single UUID button
- Generate bulk UUIDs (input: quantity 1-100)
- Display format options: uppercase/lowercase/braces
- Copy single or copy all
- History of last 10 generated (stored in Zustand)

REQUIREMENTS:
- Use `uuid` library v4()
- Validate quantity input (1-100)
- Show loading state for bulk generation (if >50)
- List view with copy button per UUID
- Clear history button

VALIDATION:
- [ ] Generated UUIDs are valid v4 format
- [ ] Bulk generation works (test with 100)
- [ ] Copy all copies newline-separated list
- [ ] Format options work
- [ ] History persists in Zustand store

Show demo with 5 generated UUIDs.
```

---

## 🔗 PROMPT 8: Tool Integration & Navigation

```
CONSTITUTION: constitution.md

TASK: Wire up all tools to navigation.

UPDATES NEEDED:
1. src/config/tools.config.ts
   - Add all three tools (Base64, JWT, UUID) to registry
   - Set proper icons from lucide-react
   
2. src/App.tsx or Router setup
   - Implement tool switching (tabs or routes)
   - Active tool state in Zustand
   - Lazy load tool components (React.lazy)
   
3. src/components/layout/Sidebar.tsx
   - Map tools from config
   - Highlight active tool
   - Click to switch tools

VALIDATION:
- [ ] All tools appear in navigation
- [ ] Clicking switches active tool
- [ ] Active tool highlighted in sidebar
- [ ] Tool state preserved when switching
- [ ] Lazy loading works (check Network tab)

Test navigation flow. Record video/gif if possible.
```

---

## 📱 PROMPT 9: PWA Configuration

```
CONSTITUTION: constitution.md (PWA Requirements section)

TASK: Configure PWA with offline support.

STEPS:
1. Create public/manifest.json
   - name: "Dev Utilities Hub - Developer Utilities"
   - icons: 192x192, 512x512 (generate or use placeholder)
   - theme_color, background_color (from design)
   
2. Update vite.config.ts
   - Configure vite-plugin-pwa
   - Workbox settings (cache-first for assets)
   - Auto-update strategy
   
3. Add install prompt UI (optional)
   - Button in header: "Install App"
   - Show only if installable
   
4. Test offline mode
   - Build production
   - Serve and test offline

VALIDATION:
- [ ] Lighthouse PWA score 100
- [ ] Works offline (disconnect network, reload)
- [ ] Install prompt appears (desktop/mobile)
- [ ] Manifest validates (Chrome DevTools)
- [ ] Service worker registers

Show Lighthouse PWA report.
```

---

## 🎯 PROMPT 10: Performance Optimization

```
CONSTITUTION: constitution.md (Performance Targets)

TASK: Optimize for 100/100 Lighthouse score.

CHECKLIST:
1. Bundle Analysis
   - Run `npm run build` and check sizes
   - Ensure main bundle < 200KB gzipped
   - Check for duplicate dependencies
   
2. Code Splitting
   - Verify tools are lazy loaded
   - Split vendor chunks (React, icons, etc.)
   
3. Image Optimization
   - Compress icons/logos
   - Use WebP format
   
4. Performance Metrics
   - Run Lighthouse (Production build)
   - Target: 100 Performance, 100 Accessibility
   - FCP < 1.5s, TTI < 3.0s
   
5. Accessibility Audit
   - Run axe DevTools
   - Fix any violations
   - Test keyboard navigation

VALIDATION:
- [ ] Lighthouse: 100/100/100/100
- [ ] Bundle size < 200KB gzipped
- [ ] No accessibility violations
- [ ] All tools keyboard accessible

Provide Lighthouse report and bundle analysis.
```

---

## ✅ PROMPT 11: Final Polish & Documentation

```
TASK: Final quality checks and documentation.

1. Code Quality
   - Run `npm run lint` - fix all errors
   - Run `npm run type-check` - zero TypeScript errors
   - Remove console.logs
   - Add JSDoc comments to utility functions
   
2. Error Boundaries
   - Add React error boundary around tool components
   - Friendly error fallback UI
   
3. Loading States
   - Add skeleton loaders for lazy-loaded tools
   
4. Documentation
   - Update README.md with:
     - Installation instructions
     - Available tools list
     - Development commands
     - Tech stack
   - Add comments to complex logic
   
5. Testing
   - Manual test all tools in dark/light mode
   - Test on mobile viewport
   - Test offline mode
   
6. Git Ready
   - Create .gitignore (node_modules, dist, .env)
   - Initial commit structure

VALIDATION:
- [ ] No lint errors
- [ ] No TypeScript errors
- [ ] All tools work in both themes
- [ ] Responsive on mobile
- [ ] README is complete
- [ ] Ready for deployment

Final checklist report + deployment recommendations.
```

---

## 🚨 TROUBLESHOOTING PROMPT (Use as needed)

```
ISSUE: [Describe the problem]

CONTEXT:
- Current phase: [e.g., "Building Base64 tool"]
- Error message: [paste error]
- What I tried: [your attempts]

CONSTITUTION: constitution.md

TASK: Debug and fix following constitution constraints.

Requirements:
- Maintain TypeScript strict mode (no 'any')
- Don't break existing functionality
- Explain root cause
- Provide tested solution

Show fixed code + explanation.
```

---

## 💡 TIPS FOR OPTIMAL TOKEN USAGE

### DO:
✅ Reference files by path: "See constitution.md"
✅ Use specific task numbers: "Execute Task 1.1 from the plan"
✅ Request validation checkpoints: "Stop after validation"
✅ Ask for confirmation: "Show code for review before proceeding"
✅ Break prompts by logical feature boundaries
✅ Request only what you need: "Show key component code" vs "Show all files"

### DON'T:
❌ Paste entire constitution in every prompt (it's already in context)
❌ Ask open-ended questions like "What should I do next?"
❌ Request full file dumps when you only need snippets
❌ Skip validation steps (catch issues early)
❌ Combine unrelated tasks (keep prompts focused)

---

## 📊 PROGRESS TRACKING TEMPLATE

After each prompt, update this checklist:

```
## Dev Utilities Hub Build Progress

### Phase 1: Setup ✅
- [x] Project initialized
- [x] Dependencies installed
- [x] Folder structure created

### Phase 2: Core Infrastructure ⏳
- [x] Theme system
- [x] Layout components
- [ ] Tool architecture

### Phase 3: Tools 🔄
- [ ] Base64 Encoder/Decoder
- [ ] JWT Decoder
- [ ] UUID Generator

### Phase 4: Polish ⏸️
- [ ] PWA configuration
- [ ] Performance optimization
- [ ] Documentation

### Blockers/Notes:
- None

### Next Prompt:
PROMPT 3: Theme System & Layout
```

---

## 🎯 SUCCESS CRITERIA

Before marking project complete, verify:
- [ ] All tools work offline
- [ ] Lighthouse 100/100/100/100
- [ ] Dark/light theme functional
- [ ] Mobile responsive
- [ ] Zero TypeScript errors
- [ ] Bundle < 200KB gzipped
- [ ] All constitution requirements met
- [ ] README documentation complete

---

**Generated**: February 8, 2026
**For**: Dev Utilities Hub
**Agent**: Claude Code
**Constitution**: constitution.md
