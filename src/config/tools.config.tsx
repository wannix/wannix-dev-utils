import {
    FileText,
    Key,
    FileCode2,
    FileJson,
    Clock,
    Fingerprint,
    Hash,
    Terminal,
    GitCompare,
    Timer,
    Image,
    Braces,
    Keyboard,
    type LucideIcon
} from 'lucide-react'
import React from 'react'

export interface ToolConfig {
    id: string
    title: string
    description: string
    icon: LucideIcon
    href: string
    iconColor?: string
    bgColor?: string
    category: 'conversion' | 'generation' | 'validation'
    component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>
}

// Lazy load tool components
const Base64Tool = React.lazy(() => import('@/tools/base64'))
const JwtTool = React.lazy(() => import('@/tools/jwt'))
const UuidTool = React.lazy(() => import('@/tools/uuid'))

const TimestampTool = React.lazy(() => import('@/tools/timestamp'))
const SpringYamlTool = React.lazy(() => import('@/tools/spring-yaml'))
const JsonYamlTool = React.lazy(() => import('@/tools/json-yaml'))

const HashTool = React.lazy(() => import('@/tools/hash'))

// Placeholder for tools not yet implemented
const PlaceholderTool = ({ name }: { name: string }) => <div className="p-8 text-center text-muted-foreground" > {name} Tool Coming Soon </div>

const CurlTool = React.lazy(() => import('@/tools/curl'))

export const tools: ToolConfig[] = [
    // Conversion & Parsing
    {
        id: 'base64',
        title: 'Base64 Encoder/Decoder',
        description: 'Encode text to Base64 or decode Base64 back to text. Supports UTF-8 characters.',
        icon: FileText,
        href: '/tools/base64',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'conversion',
        component: Base64Tool
    },
    {
        id: 'jwt',
        title: 'JWT Decoder',
        description: 'Decode and inspect JSON Web Tokens. View header, payload, and signature information.',
        icon: Key,
        href: '/tools/jwt',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'conversion',
        component: JwtTool
    },
    {
        id: 'timestamp',
        title: 'Timestamp Converter',
        description: 'Convert between Unix timestamps and human-readable dates for various timezones.',
        icon: Clock,
        href: '/tools/timestamp',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'conversion',
        component: TimestampTool
    },
    {
        id: 'spring-yaml',
        title: 'Spring YAML Converter',
        description: 'Convert between Spring Boot properties and YAML configuration formats.',
        icon: FileCode2,
        href: '/tools/spring-yaml',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'conversion',
        component: SpringYamlTool
    },
    // Generators
    {
        id: 'json-yaml',
        title: 'JSON <> YAML Converter',
        description: 'Convert between JSON and YAML formats with real-time validation and preview.',
        icon: FileJson,
        href: '/tools/json-yaml',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'conversion',
        component: JsonYamlTool
    },

    // Generation & Building
    {
        id: 'uuid',
        title: 'ID Generator',
        description: 'Generate cryptographically secure UUID v4, ULID, and KSUID identifiers.',
        icon: Fingerprint,
        href: '/tools/uuid',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'generation',
        component: UuidTool
    },
    {
        id: 'hash',
        title: 'Hash Generator',
        description: 'Generate cryptographic hashes (MD5, SHA-1, SHA-256, etc.) and HMAC signatures from text.',
        icon: Hash,
        href: '/tools/hash',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'generation',
        component: HashTool
    },
    {
        id: 'curl',
        title: 'Curl Builder',
        description: 'Build and test cURL commands with a visual interface.',
        icon: Terminal,
        href: '/tools/curl',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'generation',
        component: CurlTool
    },

    // Validation & Debugging
    {
        id: 'diff',
        title: 'Diff Checker',
        description: 'Compare two text snippets and highlight differences.',
        icon: GitCompare,
        href: '/tools/diff',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'validation',
        component: () => <PlaceholderTool name="Diff Checker" />
    },
    {
        id: 'cron',
        title: 'Cron Tester',
        description: 'Test and debug cron expressions.',
        icon: Timer,
        href: '/tools/cron',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'validation',
        component: () => <PlaceholderTool name="Cron Tester" />
    },
    {
        id: 'svg',
        title: 'SVG Optimizer',
        description: 'Optimize SVG files by removing unnecessary metadata.',
        icon: Image,
        href: '/tools/svg',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'validation',
        component: () => <PlaceholderTool name="SVG Optimizer" />
    },
    {
        id: 'regex',
        title: 'Regex Tester',
        description: 'Test and debug regular expressions.',
        icon: Braces,
        href: '/tools/regex',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'validation',
        component: () => <PlaceholderTool name="Regex Tester" />
    },
    {
        id: 'keycode',
        title: 'Keycode Info',
        description: 'Get information about keyboard events and keycodes.',
        icon: Keyboard,
        href: '/tools/keycode',
        iconColor: 'text-primary',
        bgColor: 'bg-primary/10',
        category: 'validation',
        component: () => <PlaceholderTool name="Keycode Info" />
    },
]
