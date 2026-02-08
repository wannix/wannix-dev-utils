import { type LucideIcon } from 'lucide-react'

export interface ToolConfig {
    id: string
    name: string
    description: string
    icon: LucideIcon
    category: 'encoder' | 'generator' | 'parser' | 'converter' | 'formatter'
    component: React.ComponentType
}

export interface ToolComponentProps {
    className?: string
}
