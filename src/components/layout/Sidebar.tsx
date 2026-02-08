import {
    FileText,
    Key,
    FileCode,
    FileJson,
    Shield,
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
import { cn } from '@/lib/utils'

interface NavItem {
    id: string
    name: string
    icon: LucideIcon
    href: string
    iconColor?: string
}

interface NavCategory {
    title: string
    items: NavItem[]
}

const navCategories: NavCategory[] = [
    {
        title: 'Conversion & Parsing',
        items: [
            { id: 'base64', name: 'Base64 Encoder', icon: FileText, href: '/tools/base64' },
            { id: 'jwt', name: 'JWT Decoder', icon: Key, href: '/tools/jwt', iconColor: 'text-green-500' },
            { id: 'spring-yaml', name: 'Spring ↔ YAML', icon: FileCode, href: '/tools/spring-yaml' },
            { id: 'json-yaml', name: 'JSON ↔ YAML', icon: FileJson, href: '/tools/json-yaml' },
            { id: 'certificate', name: 'Certificate Decoder', icon: Shield, href: '/tools/certificate' },
            { id: 'timestamp', name: 'Unix Timestamp', icon: Clock, href: '/tools/timestamp' },
        ],
    },
    {
        title: 'Generation & Building',
        items: [
            { id: 'uuid', name: 'ID Generator', icon: Fingerprint, href: '/tools/uuid' },
            { id: 'hash', name: 'Hash Generator', icon: Hash, href: '/tools/hash' },
            { id: 'curl', name: 'Curl Builder', icon: Terminal, href: '/tools/curl' },
        ],
    },
    {
        title: 'Validation & Debugging',
        items: [
            { id: 'diff', name: 'Diff Checker', icon: GitCompare, href: '/tools/diff' },
            { id: 'cron', name: 'Cron Tester', icon: Timer, href: '/tools/cron' },
            { id: 'svg', name: 'SVG Optimizer', icon: Image, href: '/tools/svg' },
            { id: 'regex', name: 'Regex Tester', icon: Braces, href: '/tools/regex' },
            { id: 'keycode', name: 'Keycode Info', icon: Keyboard, href: '/tools/keycode' },
        ],
    },
]

import { useLocation } from 'react-router-dom'

export function Sidebar(): JSX.Element {
    const location = useLocation()
    const activeId = navCategories
        .flatMap((c) => c.items)
        .find((item) => item.href === location.pathname)?.id

    return (
        <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-border/40 bg-background/95 backdrop-blur-sm">
            <div className="flex h-full flex-col gap-6 p-4">
                {/* Categories */}
                {navCategories.map((category) => (
                    <div key={category.title} className="space-y-2">
                        <h3 className="px-3 text-xs font-semibold text-[#8B949E]">
                            {category.title}
                        </h3>
                        <nav className="flex flex-col gap-0.5">
                            {category.items.map((item) => {
                                const Icon = item.icon
                                const isActive = item.id === activeId

                                return (
                                    <a
                                        key={item.id}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all',
                                            isActive
                                                ? 'bg-primary/10 text-primary font-semibold'
                                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        <Icon className={cn('h-4 w-4', isActive ? 'text-[#2EA043]' : 'text-[#8B949E]')} />
                                        {item.name}
                                    </a>
                                )
                            })}
                        </nav>
                    </div>
                ))}
            </div>
        </aside>
    )
}
