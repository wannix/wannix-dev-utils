import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps): JSX.Element {
    return (
        <div className="relative min-h-screen bg-background">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 pl-64">
                    <div className="container py-6 px-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
