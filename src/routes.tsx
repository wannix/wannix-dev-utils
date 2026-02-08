import { Routes, Route, useNavigate } from 'react-router-dom'
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
    Search
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import UuidTool from '@/tools/uuid'
import Base64Tool from '@/tools/base64'
import JwtTool from '@/tools/jwt'

// Placeholder components
const PlaceholderTool = ({ name }: { name: string }) => <div className="p-4">{name} Placeholder</div>

function HomePage() {
    const navigate = useNavigate()

    const tools = [
        {
            title: 'Base64 Encoder/Decoder',
            description: 'Encode text to Base64 or decode Base64 back to text. Supports UTF-8 characters.',
            icon: FileText,
            href: '/tools/base64',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'JWT Decoder',
            description: 'Decode and inspect JSON Web Tokens. View header, payload, and signature information.',
            icon: Key,
            href: '/tools/jwt',
            iconColor: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
        {
            title: 'ID Generator',
            description: 'Generate cryptographically secure UUID v4 identifiers with customizable formatting.',
            icon: Fingerprint,
            href: '/tools/uuid',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Spring YAML Converter',
            description: 'Convert Spring Boot properties files to YAML format and vice versa.',
            icon: FileCode,
            href: '/tools/spring-yaml',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'JSON <> YAML Converter',
            description: 'Convert between JSON and YAML formats with real-time validation and preview.',
            icon: FileJson,
            href: '/tools/json-yaml',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Certificate Decoder',
            description: 'Decode and inspect X.509 certificates to view details like expiration, issuer, and subject.',
            icon: Shield,
            href: '/tools/certificate',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Timestamp Converter',
            description: 'Convert between Unix timestamps and human-readable dates for various timezones.',
            icon: Clock,
            href: '/tools/timestamp',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },

        {
            title: 'Hash Generator',
            description: 'Generate cryptographic hashes (MD5, SHA-1, SHA-256, etc.) from text or files.',
            icon: Hash,
            href: '/tools/hash',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Curl Builder',
            description: 'Build and test cURL commands with a visual interface.',
            icon: Terminal,
            href: '/tools/curl',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Diff Checker',
            description: 'Compare two text snippets and highlight differences.',
            icon: GitCompare,
            href: '/tools/diff',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Cron Tester',
            description: 'Test and debug cron expressions.',
            icon: Timer,
            href: '/tools/cron',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'SVG Optimizer',
            description: 'Optimize SVG files by removing unnecessary metadata.',
            icon: Image,
            href: '/tools/svg',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Regex Tester',
            description: 'Test and debug regular expressions.',
            icon: Braces,
            href: '/tools/regex',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            title: 'Keycode Info',
            description: 'Get information about keyboard events and keycodes.',
            icon: Keyboard,
            href: '/tools/keycode',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        }
    ]

    return (
        <div className="flex flex-col items-center justify-center space-y-12 py-10">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-3xl">
                <h1 className="text-5xl font-extrabold tracking-tight">
                    <span className="text-[#2EA043]">Developer Utilities</span>{' '}
                    <span className="text-[#3b82f6]">Hub</span>
                </h1>
                <div className="space-y-2">
                    <p className="text-lg text-muted-foreground">
                        A suite of essential tools for your daily development workflow.
                    </p>
                    <p className="text-base text-muted-foreground/80">
                        All processing happens locally in your browser for maximum implementation security.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative mx-auto max-w-lg">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search tools (e.g., 'json', 'jwt', 'hash')..."
                        className="h-10 w-full rounded-md border border-input bg-background/50 pl-10 pr-4 text-sm focus:border-[#2EA043] focus:ring-1 focus:ring-[#2EA043] focus:outline-none"
                    />
                </div>
            </div>

            {/* Tool Cards Grid */}
            <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                    <Card
                        key={tool.title}
                        className="group relative cursor-pointer overflow-hidden border border-border/40 bg-card hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
                        onClick={() => navigate(tool.href)}
                    >
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", tool.bgColor)}>
                                    <tool.icon className={cn("h-5 w-5", tool.iconColor)} />
                                </div>
                                <CardTitle className="text-lg text-card-foreground">{tool.title}</CardTitle>
                            </div>
                            <CardDescription className="mt-2 text-muted-foreground leading-relaxed">
                                {tool.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools/base64" element={<Base64Tool />} />
            <Route path="/tools/jwt" element={<JwtTool />} />
            <Route path="/tools/uuid" element={<UuidTool />} />
            <Route path="/tools/*" element={<PlaceholderTool name="Tool" />} />
        </Routes>
    )
}
