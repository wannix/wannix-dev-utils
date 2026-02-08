# Dev Utilities Hub Build Guide - Multi-Agent Workflow

> **Version 2.0** | Last Updated: February 8, 2026  
> **Planning Agent:** Gemini 2.0 Flash Thinking  
> **Implementation Agent:** Claude Sonnet 4 / Opus 4

---

## 📖 Table of Contents

1. [Workflow Overview](#workflow-overview)
2. [Planning Phase - Gemini](#planning-phase---gemini)
3. [Handoff Protocol](#handoff-protocol)
4. [Implementation Phase - Claude](#implementation-phase---claude)
5. [Maintenance & Troubleshooting](#maintenance--troubleshooting)
6. [Progress Tracking](#progress-tracking)
7. [Success Criteria](#success-criteria)

---

## 🎯 Workflow Overview

### Agent Responsibilities

| Agent | Role | Prompts Used |
|-------|------|--------------|
| 🧠 **Gemini 2.0 Flash Thinking** | Strategic planning, architecture design, task breakdown | **PROMPT 1 only** |
| 🛠️ **Claude Sonnet 4** | Implementation, code generation, validation | **PROMPTS 2-10** |
| 🔧 **Claude Opus 4** | Complex debugging, optimization (if needed) | **Phase 5 fallback** |

### Token Optimization Rules

✅ **DO:**
- Reference files by path (`constitution.md`)
- Request specific sections, not full files
- Use validation checklists instead of prose
- Stop after each task for approval

❌ **DON'T:**
- Paste entire files in prompts (they're in context)
- Request full code dumps when snippets suffice
- Skip validation steps
- Combine unrelated tasks

### Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  PHASE 1: PLANNING (Gemini)                             │
│  - Analyze constitution, rules, screenshots             │
│  - Create detailed implementation plan                  │
│  - Identify risks and architecture decisions            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  HANDOFF CHECKPOINT                                      │
│  - Review Gemini's plan                                 │
│  - Answer open questions                                │
│  - Approve architecture decisions                       │
│  - Save as implementation-plan.md                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  PHASE 2: IMPLEMENTATION (Claude)                       │
│  - Execute plan tasks sequentially                      │
│  - Validate after each prompt                           │
│  - Report blockers immediately                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  FINAL VALIDATION                                        │
│  - Lighthouse 100/100/100/100                           │
│  - All features working                                 │
│  - Documentation complete                               │
└─────────────────────────────────────────────────────────┘
```

---

# 🧠 PLANNING PHASE - GEMINI

## GEMINI PROMPT 1: Strategic Planning

> **Model:** Gemini 2.0 Flash Thinking  
> **Purpose:** Create comprehensive implementation plan  
> **Duration:** ~10 minutes

### 📎 Required Attachments

Before running this prompt, attach:
1. ✅ `constitution.md` (technical specification)
2. ✅ `coding-style.md` (development rules & security guidelines)
3. ✅ UI inspiration screenshots (design reference)

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                    GEMINI PLANNING PROMPT
═══════════════════════════════════════════════════════════════

I'm building "Dev Utilities Hub" - a browser-based developer utilities web app.

ATTACHED FILES:
1. constitution.md - Complete technical specification
2. coding-style.md - Development rules and security guidelines
3. UI inspiration screenshots - Design reference for layout and styling

YOUR ROLE: Strategic Planning & Architecture Design

═══════════════════════════════════════════════════════════════
                            TASK
═══════════════════════════════════════════════════════════════

Analyze all materials and create a comprehensive, actionable implementation plan.

REQUIREMENTS:

1. Read constitution.md and coding-style.md thoroughly

2. Analyze UI screenshots to extract:
   - Layout pattern (sidebar/tabs/grid)
   - Component hierarchy
   - Color scheme (light/dark modes)
   - Spacing system
   - Typography scale
   - Component styling (cards, buttons, inputs)

3. Create phased task breakdown with:
   - Clear dependencies between tasks
   - Validation checkpoints
   - Estimated complexity (simple/medium/complex)
   - Files to create/modify per task

4. Identify potential risks/blockers:
   - Technical challenges
   - Library compatibility issues
   - Performance bottlenecks
   - Security considerations

5. Recommend optimal architecture decisions:
   - Routing strategy (tabs vs routes)
   - State management patterns
   - Component composition
   - Code splitting approach

═══════════════════════════════════════════════════════════════
                        OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

# Dev Utilities Hub Implementation Plan

## Executive Summary
[2-3 sentence overview of approach]

## Design System Extraction (from screenshots)

### Visual Language
- Layout: [sidebar/tabs/modal based]
- Color Palette: 
  - Primary: [hex codes]
  - Background (light): [hex]
  - Background (dark): [hex]
  - Text colors: [hex codes]
- Spacing: [base unit, scale]
- Border radius: [values]
- Shadows: [elevation levels]

### Component Patterns
- Card style: [description]
- Button variants: [primary, secondary, outline, etc.]
- Input style: [bordered/filled/underlined]
- Navigation: [horizontal/vertical/hamburger]

## Architecture Decisions

### Routing Strategy
- Recommendation: [React Router / Tab-based / Hash routing]
- Rationale: [why this approach]

### State Management
- Tool state: [Zustand pattern]
- Theme: [next-themes setup]
- History: [localStorage pattern]

### Component Hierarchy
```
App
├── ThemeProvider
├── Layout
│   ├── Header (theme toggle, branding)
│   ├── Sidebar/Tabs (tool navigation)
│   └── MainContent
│       └── ToolContainer (lazy loaded)
└── Toaster (notifications)
```

## Implementation Phases

[Detailed task breakdown for Phases 1-5 with:
 - Task IDs (e.g., 1.1, 1.2)
 - Files to create
 - Validation criteria
 - Estimated time
 - Dependencies
 - Risks]

## Risk Assessment & Mitigation

[List high/medium priority risks with mitigation strategies]

## Open Questions / Clarifications Needed

[Questions for human to answer before implementation]

## Handoff to Implementation Agent (Claude)

**What Claude Needs:**
1. This complete plan (save as implementation-plan.md)
2. constitution.md (reference)
3. coding-style.md (reference)
4. UI screenshots (for design matching)
5. Approved answers to open questions

**Recommended Model:**
- Claude Sonnet 4 for Phases 1-4
- Claude Opus 4 for Phase 5 if issues arise

═══════════════════════════════════════════════════════════════
                         STOP HERE
═══════════════════════════════════════════════════════════════

Wait for approval and answers to open questions before 
implementation begins.
```

### ✅ After Running This Prompt

**You should receive:**
- [ ] Detailed implementation plan with all 5 phases
- [ ] Design system extracted from screenshots
- [ ] Architecture recommendations with rationale
- [ ] Risk assessment for each phase
- [ ] Open questions that need your answers

**Your Next Steps:**
1. Review the plan carefully
2. Answer all open questions
3. Approve or request adjustments
4. Save Gemini's output as `implementation-plan.md`
5. Proceed to **HANDOFF PROTOCOL** below

---

# 🔄 HANDOFF PROTOCOL

## Preparing for Claude Implementation

Before starting Claude prompts:

### ✅ Checklist

- [ ] Gemini's plan reviewed and approved
- [ ] All open questions answered
- [ ] Plan saved as `implementation-plan.md`
- [ ] Architecture decisions confirmed
- [ ] Risk mitigation strategies agreed upon

### 📦 Files to Attach to Claude

When starting Claude Prompt 2, have ready:
1. `implementation-plan.md` (from Gemini)
2. `constitution.md` (original spec)
3. `coding-style.md` (development rules)
4. UI screenshots (same ones used with Gemini)

---

# 🛠️ IMPLEMENTATION PHASE - CLAUDE

---

## CLAUDE PROMPT 2: Handoff & Project Setup

> **Model:** Claude Sonnet 4  
> **Phase:** Handoff + Phase 1  
> **Duration:** ~30-45 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                  CLAUDE HANDOFF & PHASE 1
═══════════════════════════════════════════════════════════════

CONTEXT HANDOFF FROM GEMINI PLANNING:

I have a complete implementation plan from Gemini.

PROJECT FILES AVAILABLE:
✓ constitution.md (technical spec)
✓ coding-style.md (development rules, security, approved dependencies)
✓ implementation-plan.md (Gemini's detailed plan - FOLLOW THIS)
✓ UI screenshots (design reference)

YOUR ROLE: Implementation Agent
You are a Lead Software Engineer specializing in Browser-Native Developer Utilities, ReactJS and TypeScript.

═══════════════════════════════════════════════════════════════
                     CRITICAL INSTRUCTIONS
═══════════════════════════════════════════════════════════════

✅ Follow implementation-plan.md task sequence EXACTLY
✅ Reference coding-style.md for all dependency and security decisions
✅ Do NOT deviate from constitution requirements
✅ Validate after EACH task before proceeding
✅ Report any blockers immediately (don't improvise)

═══════════════════════════════════════════════════════════════
                          FIRST TASK
═══════════════════════════════════════════════════════════════

STARTING POINT: Phase 1, Task 1.1

STEP 1: Acknowledge you've read:
1. implementation-plan.md (confirm phase count)
2. constitution.md (confirm tech stack)
3. coding-style.md (confirm dependency rules)

STEP 2: Execute Phase 1 - Foundation (All tasks 1.1 - 1.4):

Tasks:
□ 1.1: Initialize Vite + React + TypeScript
□ 1.2: Install dependencies (verify against coding-style.md)
□ 1.3: Configure Tailwind + shadcn/ui
□ 1.4: Create folder structure

SECURITY CHECKPOINT (before installing):
- Verify each package is in coding-style.md approved list
- Run `npm audit` after install
- Report any vulnerabilities

VALIDATION CHECKLIST:
□ npm run dev starts without errors
□ Tailwind classes work (test bg-red-500)
□ Dark mode CSS variables in globals.css
□ All folders exist per constitution
□ TypeScript strict mode enabled
□ Path aliases work (@/components/...)

OUTPUT REQUIRED:
1. Final package.json (show versions)
2. Folder structure tree
3. Any deviations from plan (explain why)
4. Screenshot of dev server running

═══════════════════════════════════════════════════════════════
                   STOP AFTER PHASE 1 VALIDATION
═══════════════════════════════════════════════════════════════

Wait for approval before proceeding to Phase 2.
```

---

## CLAUDE PROMPT 3: Core Infrastructure

> **Model:** Claude Sonnet 4  
> **Phase:** 2  
> **Duration:** ~45-60 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                    CLAUDE PROMPT 3: PHASE 2
                     Core Infrastructure
═══════════════════════════════════════════════════════════════

REFERENCES:
✓ implementation-plan.md → Phase 2
✓ constitution.md
✓ coding-style.md

EXECUTE: Phase 2 - Core Infrastructure

═══════════════════════════════════════════════════════════════
                            TASKS
═══════════════════════════════════════════════════════════════

□ 2.1: Zustand store (theme, activeTool, favorites, history)
□ 2.2: Layout components (Header, Sidebar, ThemeToggle)
□ 2.3: Tool infrastructure (types, config, useCopyToClipboard)

DESIGN REFERENCE:
- Use UI screenshots for layout spacing, colors, component style
- Extract design tokens from implementation-plan.md

CRITICAL REQUIREMENTS:
- Follow coding-style.md TypeScript rules (no 'any', explicit returns)
- Match design from screenshots (spacing, colors, borders)
- Test theme persistence (localStorage)

═══════════════════════════════════════════════════════════════
                      VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ Theme toggles between light/dark/system
□ Theme persists on page reload
□ Zustand store updates without errors
□ Layout responsive (test 375px, 768px, 1280px)
□ useCopyToClipboard hook works with toast
□ TypeScript: zero errors (npm run type-check)

OUTPUT REQUIRED:
- Show key component code (Header, ThemeToggle, store)
- Screenshot of layout in light mode
- Screenshot of layout in dark mode
- Confirm design matches screenshots

═══════════════════════════════════════════════════════════════
                   STOP AFTER PHASE 2 VALIDATION
═══════════════════════════════════════════════════════════════

Wait for approval before proceeding to Phase 3.
```

---

## CLAUDE PROMPT 4: Base64 Tool

> **Model:** Claude Sonnet 4  
> **Phase:** 3  
> **Duration:** ~40-50 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                    CLAUDE PROMPT 4: PHASE 3
                   First Tool - Base64 Encoder/Decoder
═══════════════════════════════════════════════════════════════

REFERENCES:
✓ implementation-plan.md → Phase 3
✓ constitution.md (Tool requirements section)
✓ coding-style.md (TypeScript rules, security rules)

EXECUTE: Phase 3 - Base64 Encoder/Decoder

═══════════════════════════════════════════════════════════════
                         FILES TO CREATE
═══════════════════════════════════════════════════════════════

FOLDER: src/components/tools/base64/

1. base64.types.ts - Type definitions
2. base64.utils.ts - Pure functions (encode/decode with errors)
3. Base64Tool.tsx - UI component

═══════════════════════════════════════════════════════════════
                    MANDATORY REQUIREMENTS
═══════════════════════════════════════════════════════════════

✅ No 'any' types
✅ Copy to clipboard button
✅ Clear/reset button  
✅ Error handling (invalid Base64)
✅ Responsive design
✅ Keyboard shortcuts (Ctrl+C copy, Esc clear)
✅ WCAG AA accessibility (labels, ARIA, focus)
✅ Dark/light theme support
✅ Works offline (no API calls)

═══════════════════════════════════════════════════════════════
                      VALIDATION TEST CASES
═══════════════════════════════════════════════════════════════

□ Encode: "Hello World" → "SGVsbG8gV29ybGQ="
□ Decode: "SGVsbG8gV29ybGQ=" → "Hello World"
□ Invalid Base64: Shows error, doesn't crash
□ Copy shows "Copied!" toast
□ Clear button empties both textareas
□ Esc key clears inputs
□ Tab key navigates properly
□ Works in dark mode

OUTPUT REQUIRED:
- Show base64.utils.ts (functions)
- Screenshot of tool working (encode + decode)
- Screenshot of error state
- Confirm all validation tests pass

═══════════════════════════════════════════════════════════════
                   STOP AFTER PHASE 3 VALIDATION
═══════════════════════════════════════════════════════════════

Wait for approval before proceeding to Phase 4.
```

---

## CLAUDE PROMPT 5: JWT Decoder

> **Model:** Claude Sonnet 4  
> **Phase:** 4.1  
> **Duration:** ~40-50 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                   CLAUDE PROMPT 5: PHASE 4.1
                        JWT Decoder Tool
═══════════════════════════════════════════════════════════════

REFERENCES:
✓ implementation-plan.md → Phase 4, Task 4.1
✓ constitution.md
✓ coding-style.md (check jwt-decode library version)

EXECUTE: JWT Decoder Tool

═══════════════════════════════════════════════════════════════
                         FILES TO CREATE
═══════════════════════════════════════════════════════════════

FOLDER: src/components/tools/jwt-decoder/

REQUIREMENTS:
- Parse JWT into header, payload, signature (3 sections)
- Use `jwt-decode` library (verify version in coding-style.md)
- Display JSON with syntax highlighting
- Decode timestamps (iat, exp, nbf) to human-readable
- Copy buttons for each section + full JSON
- Error handling for invalid JWT
- NO JWT verification (decode only, no crypto)

═══════════════════════════════════════════════════════════════
                          UI DESIGN
═══════════════════════════════════════════════════════════════

- Input: Textarea for JWT token
- Output: Three collapsible cards (Header | Payload | Signature)
- Each card: Copy button, formatted JSON
- Timestamp fields: Show Unix + ISO 8601 format

═══════════════════════════════════════════════════════════════
                      VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ Valid JWT parses correctly
□ Invalid JWT shows clear error
□ Timestamps display in both formats
□ Copy buttons work for each section
□ Follows all constitution tool requirements

OUTPUT REQUIRED:
- Provide test JWT token for me to validate with
- Screenshot of decoded JWT
- Screenshot of error handling

═══════════════════════════════════════════════════════════════
                  STOP AFTER TASK 4.1 VALIDATION
═══════════════════════════════════════════════════════════════

Wait for approval before proceeding to Task 4.2.
```

---

## CLAUDE PROMPT 6: UUID Generator

> **Model:** Claude Sonnet 4  
> **Phase:** 4.2  
> **Duration:** ~40-45 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                   CLAUDE PROMPT 6: PHASE 4.2
                      UUID Generator Tool
═══════════════════════════════════════════════════════════════

REFERENCES:
✓ implementation-plan.md → Phase 4, Task 4.2
✓ constitution.md
✓ coding-style.md (check uuid library version)

EXECUTE: UUID v4 Generator Tool

═══════════════════════════════════════════════════════════════
                         FILES TO CREATE
═══════════════════════════════════════════════════════════════

FOLDER: src/components/tools/uuid-generator/

FEATURES:
- Generate single UUID button
- Generate bulk (input: 1-100, validate range)
- Format options: uppercase/lowercase/braces
- Copy single UUID or copy all
- History: Last 10 generated (Zustand store)
- Clear history button

═══════════════════════════════════════════════════════════════
                        REQUIREMENTS
═══════════════════════════════════════════════════════════════

- Use `uuid` library v4() (check coding-style.md version)
- Input validation: Clamp quantity to 1-100
- Loading state for bulk >50 (if needed)
- List view with copy button per UUID
- History persists in Zustand (add to store schema)

═══════════════════════════════════════════════════════════════
                      VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ Generated UUIDs are valid v4 format
□ Bulk 100 generates without errors
□ Copy all creates newline-separated list
□ Format options work (upper/lower/braces)
□ History stores in Zustand
□ Clear history works

OUTPUT REQUIRED:
- Screenshot with 5 generated UUIDs
- Show format options working
- Demonstrate history feature

═══════════════════════════════════════════════════════════════
                  STOP AFTER TASK 4.2 VALIDATION
═══════════════════════════════════════════════════════════════

Wait for approval before proceeding to Task 4.3.
```

---

## CLAUDE PROMPT 7: Tool Integration

> **Model:** Claude Sonnet 4  
> **Phase:** 4.3  
> **Duration:** ~30 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                   CLAUDE PROMPT 7: PHASE 4.3
                    Tool Integration & Navigation
═══════════════════════════════════════════════════════════════

REFERENCES:
✓ implementation-plan.md → Phase 4, Task 4.3
✓ constitution.md

EXECUTE: Wire all tools to navigation

═══════════════════════════════════════════════════════════════
                          UPDATES NEEDED
═══════════════════════════════════════════════════════════════

1. src/config/tools.config.ts
   - Add all three tools: Base64, JWT, UUID
   - Set icons from lucide-react
   - Set categories (encoder, parser, generator)

2. Routing/Navigation (based on plan's decision)
   - If tab-based: Update tab component
   - If React Router: Add routes
   - Lazy load tools (React.lazy + Suspense)

3. src/components/layout/Sidebar.tsx (or Tabs)
   - Map from tools.config.ts
   - Highlight active tool
   - Click switches tool
   - Show loading skeleton while lazy loading

═══════════════════════════════════════════════════════════════
                      VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ All tools appear in navigation
□ Clicking switches active tool smoothly
□ Active tool highlighted
□ Tool state preserved when switching
□ Lazy loading works (check Network tab - separate chunks)
□ No TypeScript errors

OUTPUT REQUIRED:
- Screenshot of all tools in navigation
- Show Network tab with lazy-loaded chunks
- Video/GIF of navigation flow (optional)

═══════════════════════════════════════════════════════════════
                  STOP AFTER TASK 4.3 VALIDATION
═══════════════════════════════════════════════════════════════

Wait for approval before proceeding to Phase 5.
```

---

## CLAUDE PROMPT 8: PWA Configuration

> **Model:** Claude Sonnet 4  
> **Phase:** 5.1  
> **Duration:** ~30 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                   CLAUDE PROMPT 8: PHASE 5.1
                       PWA Configuration
═══════════════════════════════════════════════════════════════

REFERENCES:
✓ implementation-plan.md → Phase 5, Task 5.1
✓ constitution.md (PWA Requirements section)
✓ coding-style.md (check vite-plugin-pwa version)

EXECUTE: PWA Configuration

═══════════════════════════════════════════════════════════════
                            TASKS
═══════════════════════════════════════════════════════════════

1. Create public/manifest.json
   - name: "Dev Utilities Hub - Developer Utilities"
   - short_name: "Dev Utilities Hub"
   - icons: 192x192, 512x512 (generate or placeholder)
   - theme_color: From design system
   - background_color: From design system
   - display: "standalone"

2. Update vite.config.ts
   - Import vite-plugin-pwa
   - Configure workbox
   - Cache strategy: cache-first for assets
   - Auto-update: reloadPrompt

3. Add install prompt (optional)
   - Button in Header: "Install App"
   - Show only if beforeinstallprompt fires

4. Test offline mode
   - npm run build
   - npm run preview
   - Disconnect network, reload
   - All tools should work

═══════════════════════════════════════════════════════════════
                      VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ Lighthouse PWA score: 100
□ Works offline (test with network disabled)
□ Install prompt appears (Chrome desktop/Android)
□ Manifest validates (DevTools → Application → Manifest)
□ Service worker registers
□ Icons appear in install prompt

OUTPUT REQUIRED:
- Lighthouse PWA report (screenshot)
- Screenshot of install prompt
- Video of offline functionality (optional)

═══════════════════════════════════════════════════════════════
                  STOP AFTER TASK 5.1 VALIDATION
═══════════════════════════════════════════════════════════════

Wait for approval before proceeding to Task 5.2.
```

---

## CLAUDE PROMPT 9: Performance Optimization

> **Model:** Claude Sonnet 4 (or Opus if bundle issues)  
> **Phase:** 5.2  
> **Duration:** ~45-60 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                   CLAUDE PROMPT 9: PHASE 5.2
                    Performance Optimization
═══════════════════════════════════════════════════════════════

REFERENCES:
✓ implementation-plan.md → Phase 5, Task 5.2
✓ constitution.md (Performance Targets)

TARGET: Lighthouse 100/100/100/100
CRITICAL LIMIT: Bundle < 200KB gzipped

═══════════════════════════════════════════════════════════════
                          CHECKLIST
═══════════════════════════════════════════════════════════════

1. Bundle Analysis
   Run: npm run build
   Check: dist/assets/ folder sizes
   - Main bundle < 200KB gzipped ⚠️ CRITICAL
   - Check for duplicate dependencies
   - Identify largest chunks

2. Code Splitting Verification
   - Tools are lazy loaded ✓
   - Vendor chunks split (React separate) ✓
   - Consider splitting large libraries

3. Image Optimization
   - Compress logo/icons
   - Use WebP format (PNG fallback)
   - Ensure PWA icons optimized

4. Lighthouse Audit (Production)
   Run: npm run build && npm run preview
   - Performance: 100
   - Accessibility: 100
   - Best Practices: 100
   - SEO: 100
   - FCP < 1.5s
   - TTI < 3.0s
   - CLS = 0

5. Accessibility Final Audit
   - Install axe DevTools extension
   - Scan all tools
   - Fix violations
   - Test keyboard navigation

IF BUNDLE TOO LARGE:
- Analyze: npx vite-bundle-visualizer
- Remove unused dependencies
- Use named imports (not default)
- Consider removing heavy libraries

═══════════════════════════════════════════════════════════════
                      VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ Bundle < 200KB gzipped ⚠️ CRITICAL
□ Lighthouse 100/100/100/100
□ Zero accessibility violations (axe)
□ All tools keyboard accessible
□ No console errors/warnings

OUTPUT REQUIRED:
- Full Lighthouse report (all 4 scores)
- Bundle size report (show gzipped sizes)
- List of optimizations made
- Remaining issues (if any)

═══════════════════════════════════════════════════════════════
                  STOP AFTER TASK 5.2 VALIDATION
═══════════════════════════════════════════════════════════════

Wait for approval before proceeding to final phase.
```

---

## CLAUDE PROMPT 10: Final Polish & Documentation

> **Model:** Claude Sonnet 4  
> **Phase:** 5.3 (FINAL)  
> **Duration:** ~30-40 minutes

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                   CLAUDE PROMPT 10: PHASE 5.3
                Final Polish & Documentation
═══════════════════════════════════════════════════════════════

REFERENCES:
✓ implementation-plan.md → Phase 5, Task 5.3
✓ constitution.md

EXECUTE: Final Polish & Documentation

═══════════════════════════════════════════════════════════════
                            TASKS
═══════════════════════════════════════════════════════════════

1. Code Quality Cleanup
   □ npm run lint (fix all errors)
   □ npm run type-check (zero TypeScript errors)
   □ npm run format (Prettier)
   □ Remove all console.log statements
   □ Add JSDoc comments to utility functions

2. Error Boundaries
   □ Add React ErrorBoundary around tools
   □ Create ErrorFallback component
   □ Test by throwing error in tool

3. Loading States
   □ Add skeleton loaders for lazy-loaded tools
   □ Ensure smooth transitions
   □ No layout shifts (CLS = 0)

4. Documentation
   □ Create comprehensive README.md
   □ Installation instructions
   □ Development commands
   □ Tech stack list
   □ How to add new tools

5. Git Preparation
   □ Create .gitignore
   □ Verify sensitive files not tracked
   □ Ready for initial commit

6. Final Testing Matrix
   Test all tools:
   □ Base64: Encode/decode/error/copy/clear
   □ JWT: Parse/copy sections/timestamps/error
   □ UUID: Single/bulk/formats/history/copy

   Test in both themes:
   □ Light mode: All tools readable
   □ Dark mode: All tools readable
   □ Theme toggle works
   □ Theme persists

   Test responsive:
   □ Mobile (375px): Usable layout
   □ Tablet (768px): Optimal layout
   □ Desktop (1280px+): Full layout

   Test offline:
   □ Disconnect network
   □ All tools function
   □ No errors

═══════════════════════════════════════════════════════════════
                   FINAL VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ npm run lint → 0 errors
□ npm run type-check → 0 errors
□ README.md complete
□ .gitignore comprehensive
□ All 3 tools tested in both themes
□ Responsive on mobile/tablet/desktop
□ Works offline completely
□ Error boundary tested
□ No console errors in production

OUTPUT REQUIRED:
- Final project structure tree
- README.md content
- Deployment recommendations (Vercel/Netlify/Cloudflare)
- Any remaining TODOs (if applicable)

═══════════════════════════════════════════════════════════════
                      🎉 PROJECT COMPLETE! 🎉
═══════════════════════════════════════════════════════════════

After validation, project is ready for deployment!
```

---

# 🔧 MAINTENANCE & TROUBLESHOOTING

## TROUBLESHOOTING PROMPT

> **Model:** Claude Sonnet 4 (or Opus for complex issues)  
> **Use:** When errors occur during implementation

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                      TROUBLESHOOTING PROMPT
═══════════════════════════════════════════════════════════════

ISSUE: [Describe the problem]

CONTEXT:
- Current phase: [e.g., "Phase 2, Task 2.1"]
- Error message: [Paste full error]
- What I tried: [Your debugging attempts]
- Files affected: [List files]

REFERENCE MATERIALS:
✓ implementation-plan.md (for context)
✓ constitution.md (for requirements)
✓ coding-style.md (for constraints)

TASK: Debug and fix following all constraints.

═══════════════════════════════════════════════════════════════
                          CONSTRAINTS
═══════════════════════════════════════════════════════════════

- Maintain TypeScript strict mode (no 'any')
- Don't break existing functionality
- Follow coding-style.md security guidelines
- Stay within constitution requirements

═══════════════════════════════════════════════════════════════
                       REQUIRED OUTPUT
═══════════════════════════════════════════════════════════════

1. Root cause explanation
2. Proposed fix (with code)
3. Why this fix is safe
4. How to test the fix
5. Any side effects to watch for

Show fixed code + step-by-step verification.
```

---

## NEW TOOL ADDITION PROMPT

> **Model:** Claude Sonnet 4  
> **Use:** Adding tools after MVP is complete

### 📝 The Prompt

```
═══════════════════════════════════════════════════════════════
                    NEW TOOL ADDITION PROMPT
═══════════════════════════════════════════════════════════════

CONTEXT: Dev Utilities Hub is complete. Adding new tool: [TOOL_NAME]

REFERENCES:
✓ Follow existing pattern from Base64/JWT/UUID
✓ constitution.md (Tool requirements)
✓ coding-style.md (TypeScript, security, dependencies)

NEW TOOL: [e.g., "JSON Formatter", "Hash Generator"]

═══════════════════════════════════════════════════════════════
                       REQUIRED INFO
═══════════════════════════════════════════════════════════════

1. Tool purpose: [What it does]
2. Inputs: [What user provides]
3. Outputs: [What tool generates]
4. Libraries needed: [Check coding-style.md approved list first]

═══════════════════════════════════════════════════════════════
                            TASKS
═══════════════════════════════════════════════════════════════

1. Create folder: src/components/tools/[tool-name]/
2. Files needed:
   - [tool-name].types.ts
   - [tool-name].utils.ts
   - [ToolName]Tool.tsx

3. Update tools.config.ts (add to registry)

4. Follow ALL constitution requirements:
   ✅ Copy button
   ✅ Clear button
   ✅ Error handling
   ✅ Responsive
   ✅ Accessibility
   ✅ Dark/light theme
   ✅ Keyboard shortcuts

═══════════════════════════════════════════════════════════════
                      VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

□ Tool works in both themes
□ Mobile responsive
□ Keyboard accessible
□ No TypeScript errors
□ Bundle size still < 200KB (check after adding)

Implement new tool following this pattern.
```

---

# 📊 PROGRESS TRACKING

## Track Your Progress

Copy this template and update after each prompt:

```markdown
# Dev Utilities Hub Build Progress

**Planning Agent:** Gemini 2.0 Flash Thinking ✅  
**Implementation Agent:** Claude Sonnet 4

═══════════════════════════════════════════════════════════════
                         PHASE STATUS
═══════════════════════════════════════════════════════════════

## Planning Phase
- [x] Strategic plan created (Gemini)
- [x] Architecture decisions made
- [x] Open questions answered
- [x] Plan approved

## Phase 1: Foundation
- [ ] 1.1: Vite + React + TypeScript
- [ ] 1.2: Dependencies installed
- [ ] 1.3: Tailwind + shadcn/ui
- [ ] 1.4: Folder structure

## Phase 2: Core Infrastructure
- [ ] 2.1: Zustand store
- [ ] 2.2: Layout components
- [ ] 2.3: Tool infrastructure

## Phase 3: First Tool
- [ ] 3.1: Base64 utilities
- [ ] 3.2: Base64 UI
- [ ] 3.3: Navigation wiring

## Phase 4: Remaining Tools
- [ ] 4.1: JWT Decoder
- [ ] 4.2: UUID Generator
- [ ] 4.3: Navigation integration

## Phase 5: Production Ready
- [ ] 5.1: PWA configured
- [ ] 5.2: Performance optimized
- [ ] 5.3: Documentation complete

═══════════════════════════════════════════════════════════════
                       METRICS TRACKING
═══════════════════════════════════════════════════════════════

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Bundle size (gzipped) | ___ KB | <200 KB | ⏳ |
| Lighthouse Performance | ___ | 100 | ⏳ |
| Lighthouse Accessibility | ___ | 100 | ⏳ |
| Lighthouse Best Practices | ___ | 100 | ⏳ |
| Lighthouse PWA | ___ | 100 | ⏳ |
| TypeScript errors | ___ | 0 | ⏳ |
| npm audit vulnerabilities | ___ | 0 | ⏳ |

═══════════════════════════════════════════════════════════════
                        CURRENT STATUS
═══════════════════════════════════════════════════════════════

**Active Phase:** Phase [X]  
**Active Task:** [X.Y]  
**Last Validation:** [Pass/Fail]  
**Blockers:** [None / List issues]  
**Next Prompt:** CLAUDE PROMPT [N]

═══════════════════════════════════════════════════════════════
                            NOTES
═══════════════════════════════════════════════════════════════

[Add observations, decisions made, issues encountered]
```

---

# ✅ SUCCESS CRITERIA

## Final Checklist

Before marking project complete, verify all items:

### 🎯 Functionality

- [ ] All 3 tools work perfectly
- [ ] Works offline (PWA)
- [ ] Dark/light theme functional
- [ ] Mobile responsive (375px, 768px, 1280px+)
- [ ] Keyboard navigation complete
- [ ] Copy buttons work everywhere
- [ ] Error handling graceful

### ⚡ Performance

- [ ] Lighthouse: 100/100/100/100
- [ ] Bundle < 200KB gzipped
- [ ] FCP < 1.5s
- [ ] TTI < 3.0s
- [ ] CLS = 0

### 💻 Code Quality

- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] No console.logs in production
- [ ] Files follow naming conventions
- [ ] Code formatted with Prettier

### 🔒 Security

- [ ] Zero npm audit vulnerabilities
- [ ] All dependencies in coding-style.md
- [ ] No secrets in code
- [ ] CSP headers configured
- [ ] All input validated

### ♿ Accessibility

- [ ] WCAG AA compliant
- [ ] Zero axe violations
- [ ] Keyboard navigation tested
- [ ] Focus indicators visible
- [ ] ARIA labels present

### 📚 Documentation

- [ ] README.md complete
- [ ] Installation instructions clear
- [ ] Tech stack documented
- [ ] .gitignore comprehensive

### 🚀 Deployment Ready

- [ ] Production build successful
- [ ] Preview works offline
- [ ] All tests pass
- [ ] Ready for deployment

---

## 📅 Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Planning (Gemini) | 10 min | 10 min |
| Phase 1 (Setup) | 45 min | 55 min |
| Phase 2 (Infrastructure) | 60 min | 1h 55min |
| Phase 3 (Base64) | 50 min | 2h 45min |
| Phase 4.1 (JWT) | 50 min | 3h 35min |
| Phase 4.2 (UUID) | 45 min | 4h 20min |
| Phase 4.3 (Integration) | 30 min | 4h 50min |
| Phase 5.1 (PWA) | 30 min | 5h 20min |
| Phase 5.2 (Performance) | 60 min | 6h 20min |
| Phase 5.3 (Documentation) | 40 min | 7h |
| **TOTAL** | **~7 hours** | Active dev time |

---

**END OF GUIDE**
