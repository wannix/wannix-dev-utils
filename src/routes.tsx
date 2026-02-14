import { Suspense, useState, useMemo } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { tools } from '@/config/tools.config'

function HomePage() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim()
        if (!q) return tools
        return tools.filter(
            (t) =>
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q)
        )
    }, [search])

    return (
        <div className="flex flex-col items-center justify-center space-y-12 py-10">
            {/* Hero Section */}
            <div className="text-center space-y-6 max-w-3xl">
                <h1 className="text-5xl font-extrabold tracking-tight">
                    <span className="text-primary">Developer Utilities</span>{' '}
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tools (e.g., 'json', 'jwt', 'hash')..."
                        className="h-10 w-full rounded-md border border-input bg-background/50 pl-10 pr-4 text-sm focus:border-[#2EA043] focus:ring-1 focus:ring-[#2EA043] focus:outline-none"
                    />
                </div>
            </div>

            {/* Tool Cards Grid */}
            <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.length > 0 ? (
                    filtered.map((tool) => (
                        <Card
                            key={tool.id}
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
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No tools found matching &ldquo;{search}&rdquo;
                    </div>
                )}
            </div>
        </div>
    )
}

const Loading = () => (
    <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
)

export function AppRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {tools.map((tool) => (
                    <Route
                        key={tool.id}
                        path={tool.href}
                        element={<tool.component />}
                    />
                ))}
            </Routes>
        </Suspense>
    )
}
