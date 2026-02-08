import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'


export function Header(): JSX.Element {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    <Logo />
                </div>

                <div className="flex items-center gap-4">

                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
