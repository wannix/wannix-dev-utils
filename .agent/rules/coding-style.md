# Development Rules - Dev Utilities Hub

## 🔒 Security & Dependencies

### Dependency Management

#### Package Installation Rules
```bash
# ALWAYS check security before installing
npm audit                    # Before any install
npm audit --audit-level=high # Fail on high/critical vulnerabilities

# Safe-chain is installed system-wide - it will block vulnerable packages automatically
# If blocked, find alternative package or wait for patched version
```

#### Approved Dependencies (Vetted for Security)

**Core Framework (Required)**
```json
{
  "react": "^18.3.1",              // ✅ Stable, actively maintained
  "react-dom": "^18.3.1",          // ✅ Official React package
  "vite": "^5.4.0",                // ✅ Secure, modern bundler
  "typescript": "^5.6.0"           // ✅ Type safety
}
```

**UI & Styling (Required)**
```json
{
  "tailwindcss": "^3.4.1",         // ✅ No runtime, compile-time only
  "clsx": "^2.1.0",                // ✅ Minimal, well-audited
  "tailwind-merge": "^2.5.0",      // ✅ Safe utility
  "lucide-react": "^0.446.0",      // ✅ Tree-shakeable icons
  "@radix-ui/react-*": "latest"    // ✅ Accessibility primitives (shadcn/ui dependency)
}
```

**State & Storage (Required)**
```json
{
  "zustand": "^4.5.5",             // ✅ Lightweight, no vulnerabilities
  "next-themes": "^0.3.0"          // ✅ Theme management, client-side only
}
```

**Utility Libraries (Required)**
```json
{
  "uuid": "^10.0.0",               // ✅ Industry standard, well-maintained
  "js-base64": "^3.7.7",           // ✅ Pure JS, no dependencies
  "jwt-decode": "^4.0.0",          // ✅ Decode only, no crypto (safe)
  "date-fns": "^3.6.0"             // ✅ Modern, tree-shakeable
}
```

**Crypto & Hashing (Use with Caution)**
```json
{
  "crypto-js": "^4.2.0"            // ⚠️ USE ONLY for non-security hashing (MD5/SHA for checksums)
                                    // ❌ DO NOT use for passwords or authentication
                                    // ✅ OK for: File hashing, checksums, non-sensitive data
}
```

**PWA (Required)**
```json
{
  "vite-plugin-pwa": "^0.20.0",    // ✅ Official Vite plugin
  "workbox-window": "^7.1.0"       // ✅ Google's service worker library
}
```

**Development Tools (DevDependencies)**
```json
{
  "@vitejs/plugin-react": "^4.3.0",
  "autoprefixer": "^10.4.20",
  "postcss": "^8.4.47",
  "eslint": "^9.0.0",
  "prettier": "^3.3.0",
  "@typescript-eslint/parser": "^8.0.0",
  "@typescript-eslint/eslint-plugin": "^8.0.0"
}
```

#### ❌ BANNED/RESTRICTED Libraries

**Security Risks:**
```
❌ lodash < 4.17.21        - Prototype pollution vulnerabilities
❌ moment.js               - Deprecated, use date-fns instead
❌ request                 - Deprecated, security issues
❌ axios < 1.6.0           - SSRF vulnerabilities (not needed for client-side)
❌ jquery                  - Outdated, XSS risks
❌ eval, Function()        - Never use dynamic code execution
❌ dangerouslySetInnerHTML - XSS vector (avoid unless sanitized)
```

**Performance/Bundle Size:**
```
⚠️ Avoid large libraries for simple tasks:
❌ lodash (full) - Use specific imports or native JS
❌ bootstrap - Use Tailwind instead
❌ material-ui - Too heavy, use shadcn/ui
```

**Crypto Libraries (Special Rules):**
```
❌ bcrypt/bcryptjs          - Client-side password hashing is insecure
❌ node-rsa                 - Wrong environment (Node.js only)
✅ Web Crypto API (native)  - Use for real crypto needs
⚠️ crypto-js               - OK for checksums ONLY, not security
```

---

## 📝 TypeScript Rules

### Strict Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "strict": true,                    // ✅ Enable all strict checks
    "noImplicitAny": true,             // ✅ No implicit any
    "strictNullChecks": true,          // ✅ Null safety
    "strictFunctionTypes": true,       // ✅ Function type safety
    "noUnusedLocals": true,            // ✅ Warn on unused variables
    "noUnusedParameters": true,        // ✅ Warn on unused params
    "noImplicitReturns": true,         // ✅ All code paths must return
    "noFallthroughCasesInSwitch": true // ✅ Switch case safety
  }
}
```

### Type Safety Rules

#### ❌ NEVER Use `any`
```typescript
// ❌ BAD
function process(data: any) { }
const result: any = getData();

// ✅ GOOD
function process(data: unknown) {
  if (typeof data === 'string') {
    // Type narrowing
  }
}

interface DataShape {
  id: string;
  value: number;
}
const result: DataShape = getData();
```

#### Use Proper Type Definitions
```typescript
// ✅ Interfaces for object shapes
interface ToolConfig {
  id: string;
  name: string;
  icon: LucideIcon;
}

// ✅ Type for unions/intersections
type Theme = 'light' | 'dark' | 'system';
type Status = 'idle' | 'loading' | 'success' | 'error';

// ✅ Generics for reusable logic
function copy<T>(value: T): T {
  return structuredClone(value);
}
```

#### Explicit Return Types
```typescript
// ❌ BAD - Inferred return type
function encodeBase64(input: string) {
  return btoa(input);
}

// ✅ GOOD - Explicit return type
function encodeBase64(input: string): string {
  return btoa(input);
}

// ✅ GOOD - Error handling with discriminated union
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function decodeBase64(input: string): Result<string> {
  try {
    return { success: true, data: atob(input) };
  } catch (error) {
    return { 
      success: false, 
      error: new Error('Invalid Base64 string') 
    };
  }
}
```

#### Error Typing
```typescript
// ❌ BAD - Catching as any
try {
  // code
} catch (error: any) {
  console.log(error.message);
}

// ✅ GOOD - Proper error typing
try {
  // code
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('Unknown error:', String(error));
  }
}
```

---

## ⚛️ React Best Practices

### Component Rules

#### Functional Components Only
```typescript
// ✅ GOOD - Functional component with TypeScript
interface Props {
  title: string;
  onCopy: () => void;
}

export function ToolCard({ title, onCopy }: Props): JSX.Element {
  return <div>{title}</div>;
}

// ❌ BAD - Class components (outdated)
class ToolCard extends React.Component { }
```

#### Hooks Rules
```typescript
// ✅ Always at top level (not in conditionals)
function Component() {
  const [state, setState] = useState('');  // ✅ Top level
  
  if (condition) {
    // ❌ Never put hooks here
    // const [bad, setBad] = useState('');
  }
  
  return null;
}

// ✅ Custom hooks must start with 'use'
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  // ...
}
```

#### Avoid Inline Functions in JSX
```typescript
// ❌ BAD - Creates new function every render
<button onClick={() => handleClick(id)}>Click</button>

// ✅ GOOD - Use useCallback for handlers with dependencies
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

<button onClick={handleClick}>Click</button>

// ✅ GOOD - Or use event delegation
<button onClick={handleClick} data-id={id}>Click</button>
```

#### Memoization
```typescript
// ✅ Use memo for expensive components
export const ExpensiveComponent = memo(({ data }: Props) => {
  // Heavy rendering logic
});

// ✅ Use useMemo for expensive calculations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.value - b.value);
}, [data]);

// ❌ Don't over-memoize simple operations
const doubled = useMemo(() => value * 2, [value]); // Unnecessary
```

### State Management

#### Zustand Store Pattern
```typescript
// ✅ GOOD - Typed store with actions
interface AppStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Derived state as computed properties
  isDark: boolean;
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  
  // Computed value
  get isDark() {
    const theme = get().theme;
    return theme === 'dark' || 
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
}));

// ✅ Usage - Select only what you need
function Component() {
  const theme = useAppStore((state) => state.theme); // Only re-render when theme changes
}
```

#### Local Storage Persistence
```typescript
// ✅ GOOD - Type-safe localStorage hook
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T): void => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
```

---

## 🎨 UI/UX Rules

### shadcn/ui Component Usage
```typescript
// ✅ Import only what you use
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

// ✅ Use semantic HTML with shadcn/ui
<Button variant="outline" size="sm" asChild>
  <a href="/docs">Documentation</a>
</Button>

// ❌ Don't modify shadcn/ui components directly
// ✅ Create wrapper components instead
export function PrimaryButton(props: ButtonProps) {
  return <Button variant="default" {...props} />;
}
```

### Tailwind CSS Rules
```typescript
// ✅ Use Tailwind utilities
<div className="flex items-center gap-4 p-4 rounded-lg bg-card">

// ✅ Use clsx/tailwind-merge for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === 'primary' && "primary-classes"
)}>

// ❌ Don't use inline styles (breaks theming)
<div style={{ color: '#000' }}>  // BAD

// ✅ Use CSS variables for theme colors
<div className="text-foreground bg-background">  // GOOD
```

---

## 🔐 Security Rules

### Input Validation & Sanitization

#### Never Trust User Input
```typescript
// ✅ GOOD - Validate before processing
function decodeBase64(input: string): Result<string> {
  // Validate format
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(input)) {
    return { success: false, error: new Error('Invalid Base64 format') };
  }
  
  try {
    return { success: true, data: atob(input) };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// ✅ GOOD - Length limits
function generateUUIDs(count: number): string[] {
  const MAX_COUNT = 100;
  const validCount = Math.min(Math.max(1, count), MAX_COUNT);
  return Array.from({ length: validCount }, () => uuidv4());
}
```

#### XSS Prevention
```typescript
// ❌ NEVER use dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // DANGER!

// ✅ Use text content instead
<div>{userInput}</div>  // Automatically escaped

// ✅ If you MUST render HTML, sanitize first
import DOMPurify from 'dompurify';  // Add to approved deps if needed
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

#### Content Security Policy (CSP)
```html
<!-- ✅ Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self';
  "
>
```

### Secret Management
```typescript
// ❌ NEVER hardcode secrets
const API_KEY = 'sk-1234567890';  // NEVER DO THIS

// ✅ Use environment variables (even for client-side)
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

// ✅ Never commit .env files
// Add to .gitignore:
// .env
// .env.local
// .env.production
```

### Safe API Usage (if added later)
```typescript
// ✅ GOOD - Validate responses
async function fetchData<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate shape before using
    if (!isValidShape(data)) {
      throw new Error('Invalid response shape');
    }
    
    return { success: true, data: data as T };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
}
```

---

## ⚡ Performance Rules

### Code Splitting
```typescript
// ✅ Lazy load tools
const Base64Tool = lazy(() => import('./components/tools/base64/Base64Tool'));
const JwtDecoder = lazy(() => import('./components/tools/jwt-decoder/JwtDecoderTool'));

// ✅ Wrap with Suspense
<Suspense fallback={<ToolSkeleton />}>
  <Base64Tool />
</Suspense>
```

### Bundle Size Optimization
```typescript
// ✅ Import only what you need
import { format } from 'date-fns';  // ✅ Named import
// import * as dateFns from 'date-fns';  // ❌ Imports everything

// ✅ Use tree-shakeable libraries
import { Calendar } from 'lucide-react';  // ✅ Only imports Calendar icon

// ❌ Avoid libraries with large default exports
```

### Image Optimization
```bash
# ✅ Use modern formats
logo.webp (preferred)
logo.png (fallback)

# ✅ Compress images
npx @squoosh/cli --webp auto *.png

# ✅ Provide multiple sizes for PWA icons
icons/icon-192x192.png
icons/icon-512x512.png
```

### Avoid Memory Leaks
```typescript
// ✅ Clean up subscriptions/timers
useEffect(() => {
  const timer = setInterval(() => {
    // Do something
  }, 1000);
  
  return () => clearInterval(timer);  // Cleanup
}, []);

// ✅ Clean up event listeners
useEffect(() => {
  const handleResize = () => { };
  window.addEventListener('resize', handleResize);
  
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## 📂 File Structure Rules

### Naming Conventions
```
✅ Components: PascalCase
   - Base64Tool.tsx
   - ThemeToggle.tsx

✅ Utilities: camelCase
   - base64.utils.ts
   - clipboard.helpers.ts

✅ Types: camelCase with .types.ts suffix
   - tool.types.ts
   - api.types.ts

✅ Hooks: camelCase with 'use' prefix
   - useCopyToClipboard.ts
   - useLocalStorage.ts

✅ Constants: UPPER_SNAKE_CASE
   - MAX_UUID_COUNT = 100
   - DEFAULT_THEME = 'system'
```

### Import Order
```typescript
// 1. React imports
import { useState, useEffect } from 'react';

// 2. Third-party imports
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import type { ToolConfig } from '@/types/tool.types';

// 4. Relative imports
import { encodeBase64 } from './base64.utils';
import type { Base64Mode } from './base64.types';

// 5. CSS imports (last)
import './styles.css';
```

### File Organization
```
src/components/tools/[tool-name]/
  ├── [ToolName]Tool.tsx      # Main component (export default)
  ├── [tool-name].utils.ts    # Pure functions (business logic)
  ├── [tool-name].types.ts    # TypeScript types
  └── [tool-name].test.ts     # Tests (if applicable)
```

---

## 🧪 Testing Rules (If Implemented)

### Unit Tests
```typescript
// ✅ Test pure functions
import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64 } from './base64.utils';

describe('Base64 Utils', () => {
  it('should encode string to base64', () => {
    expect(encodeBase64('Hello')).toBe('SGVsbG8=');
  });
  
  it('should handle empty string', () => {
    expect(encodeBase64('')).toBe('');
  });
});
```

### Component Tests
```typescript
// ✅ Test user interactions
import { render, screen, fireEvent } from '@testing-library/react';
import { Base64Tool } from './Base64Tool';

describe('Base64Tool', () => {
  it('should copy output to clipboard', async () => {
    render(<Base64Tool />);
    
    const input = screen.getByLabelText('Input');
    fireEvent.change(input, { target: { value: 'Test' } });
    
    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);
    
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });
});
```

---

## 🚫 Common Anti-Patterns to Avoid

### React
```typescript
// ❌ Mutating state directly
state.push(item);  // BAD
setState([...state, item]);  // GOOD

// ❌ Missing dependency array
useEffect(() => { /* uses external var */ });  // BAD
useEffect(() => { /* uses external var */ }, [externalVar]);  // GOOD

// ❌ Unnecessary state
const [doubled, setDoubled] = useState(0);
setDoubled(value * 2);  // BAD - derive from value instead
const doubled = value * 2;  // GOOD
```

### TypeScript
```typescript
// ❌ Type assertions without validation
const data = apiResponse as User;  // BAD - assumes shape

// ✅ Type guards
function isUser(data: unknown): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data
  );
}

if (isUser(data)) {
  // Now safely typed as User
}
```

### Performance
```typescript
// ❌ Creating objects/arrays in render
function Component() {
  return <Child data={{ id: 1 }} />;  // New object every render
}

// ✅ Memoize or define outside
const staticData = { id: 1 };
function Component() {
  return <Child data={staticData} />;
}
```

---

## 📚 Learning Resources

### Official Documentation
- [React Docs](https://react.dev) - Modern React patterns
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type system
- [Vite Guide](https://vitejs.dev/guide/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [shadcn/ui](https://ui.shadcn.com) - Component library

### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web security
- [Snyk Advisor](https://snyk.io/advisor/) - Package security scores
- [Socket.dev](https://socket.dev) - Supply chain security

### Performance
- [web.dev Lighthouse](https://web.dev/performance-scoring/) - Performance metrics
- [Bundle Phobia](https://bundlephobia.com) - Package size analysis

---

**Version**: 1.0  
**Last Updated**: February 8, 2026  
**Enforcement**: Automated via ESLint, TypeScript, npm audit, Safe-chain
