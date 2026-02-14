import { cn } from '@/lib/utils'
import { tools } from '@/config/tools.config'
import { useLocation, Link } from 'react-router-dom'

export function Sidebar(): JSX.Element {
    const location = useLocation()

    // Group tools by category
    const categories = [
        { id: 'conversion', title: 'Conversion & Parsing' },
        { id: 'generation', title: 'Generation & Building' },
        { id: 'validation', title: 'Validation & Debugging' },
    ]

    return (
        <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-border/40 bg-background/95 backdrop-blur-sm overflow-y-auto">
            <div className="flex h-full flex-col gap-6 p-4">
                {/* Categories */}
                {categories.map((category) => {
                    const categoryTools = tools.filter(t => t.category === category.id)
                    if (categoryTools.length === 0) return null

                    return (
                        <div key={category.id} className="space-y-2">
                            <h3 className="px-3 text-xs font-semibold text-[#8B949E] uppercase tracking-wider">
                                {category.title}
                            </h3>
                            <nav className="flex flex-col gap-0.5">
                                {categoryTools.map((tool) => {
                                    const Icon = tool.icon
                                    const isActive = location.pathname === tool.href

                                    return (
                                        <Link
                                            key={tool.id}
                                            to={tool.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all whitespace-nowrap',
                                                isActive
                                                    ? 'bg-primary/10 text-primary font-semibold'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            )}
                                        >
                                            <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
                                            <span className="truncate flex-1 min-w-0">{tool.title}</span>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </div>
                    )
                })}
            </div>
        </aside>
    )
}
