import { useState, useEffect, useCallback, useRef } from 'react'
import { Trash2, Copy, Check } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import {
    captureKeyInfo, getKeyLabel, getKeyProperties,
    captureMouseInfo, getMouseLabel, getMouseProperties,
    captureWheelInfo, getWheelProperties,
    captureTouchInfo, getTouchLabel, getTouchProperties,
    keyToHistoryItem, mouseToHistoryItem, wheelToHistoryItem, touchToHistoryItem,
} from './keycode.utils'
import type { KeyProperty, EventType, EventHistoryItem } from './keycode.types'

const TYPE_COLORS: Record<EventType, string> = {
    keyboard: 'text-blue-400',
    mouse: 'text-amber-400',
    wheel: 'text-purple-400',
    touch: 'text-pink-400',
}

const TYPE_LABELS: Record<EventType, string> = {
    keyboard: 'Keyboard',
    mouse: 'Mouse',
    wheel: 'Wheel',
    touch: 'Touch',
}

export default function KeycodeTool() {
    const [eventType, setEventType] = useState<EventType | null>(null)
    const [label, setLabel] = useState('')
    const [properties, setProperties] = useState<KeyProperty[]>([])
    const [history, setHistory] = useState<EventHistoryItem[]>([])
    const { copied, copyToClipboard } = useCopyToClipboard()

    const interactionRef = useRef<HTMLDivElement>(null)

    const addHistory = useCallback((item: EventHistoryItem) => {
        setHistory(prev => [item, ...prev.slice(0, 14)])
    }, [])

    // Keyboard — global
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        e.preventDefault()
        const info = captureKeyInfo(e)
        setEventType('keyboard')
        setLabel(getKeyLabel(info))
        setProperties(getKeyProperties(info))
        addHistory(keyToHistoryItem(info))
    }, [addHistory])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    // Mouse — on interaction zone
    useEffect(() => {
        const el = interactionRef.current
        if (!el) return

        const onMouse = (e: MouseEvent) => {
            e.preventDefault()
            const info = captureMouseInfo(e)
            setEventType('mouse')
            setLabel(getMouseLabel(info))
            setProperties(getMouseProperties(info))
            addHistory(mouseToHistoryItem(info))
        }

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const info = captureWheelInfo(e)
            setEventType('wheel')
            setLabel('🖲 Scroll')
            setProperties(getWheelProperties(info))
            addHistory(wheelToHistoryItem(info))
        }

        const onTouch = (e: TouchEvent) => {
            e.preventDefault()
            const info = captureTouchInfo(e)
            setEventType('touch')
            setLabel(getTouchLabel(info))
            setProperties(getTouchProperties(info))
            addHistory(touchToHistoryItem(info))
        }

        el.addEventListener('mousedown', onMouse)
        el.addEventListener('mouseup', onMouse)
        el.addEventListener('dblclick', onMouse)
        el.addEventListener('contextmenu', onMouse)
        el.addEventListener('wheel', onWheel, { passive: false })
        el.addEventListener('touchstart', onTouch, { passive: false })
        el.addEventListener('touchend', onTouch, { passive: false })
        el.addEventListener('touchmove', onTouch, { passive: false })

        return () => {
            el.removeEventListener('mousedown', onMouse)
            el.removeEventListener('mouseup', onMouse)
            el.removeEventListener('dblclick', onMouse)
            el.removeEventListener('contextmenu', onMouse)
            el.removeEventListener('wheel', onWheel)
            el.removeEventListener('touchstart', onTouch)
            el.removeEventListener('touchend', onTouch)
            el.removeEventListener('touchmove', onTouch)
        }
    }, [addHistory])

    const handleClear = () => {
        setEventType(null)
        setLabel('')
        setProperties([])
        setHistory([])
    }

    const handleCopyAll = () => {
        if (!properties.length) return
        const text = properties.map(p => `${p.label}: ${p.value}`).join('\n')
        copyToClipboard(text)
    }

    return (
        <ToolShell
            title="Keycode Info"
            description="Press any key or interact with the zone below to see JavaScript event properties."
            headerActions={
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            }
        >
            <div className="space-y-6">

                {/* Interaction Zone */}
                <div
                    ref={interactionRef}
                    className="flex flex-col items-center justify-center py-12 rounded-lg border border-dashed border-border/60 bg-muted/20 transition-all cursor-pointer select-none"
                    tabIndex={0}
                >
                    {eventType ? (
                        <>
                            <Badge variant="outline" className={`mb-3 ${TYPE_COLORS[eventType]}`}>
                                {TYPE_LABELS[eventType]}
                            </Badge>
                            <div className="text-6xl font-bold text-primary mb-3 animate-in zoom-in duration-200">
                                {label}
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="text-4xl mb-3 opacity-40">⌨️ 🖱</div>
                            <div className="text-lg text-muted-foreground">Press any key, click, scroll, or touch here...</div>
                            <div className="text-xs text-muted-foreground mt-1">Keyboard works anywhere • Mouse/touch events in this zone</div>
                        </div>
                    )}
                </div>

                {properties.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Properties Table */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between min-h-9">
                                <span className="text-base font-medium">Event Properties</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleCopyAll}
                                    className={copied ? "text-primary" : "text-muted-foreground"}
                                >
                                    {copied ? <><Check className="mr-2 h-3.5 w-3.5" /> Copied</> : <><Copy className="mr-2 h-3.5 w-3.5" /> Copy All</>}
                                </Button>
                            </div>
                            <div className="rounded-md border bg-muted/30 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-left py-2 px-4 font-medium text-muted-foreground">Property</th>
                                            <th className="text-left py-2 px-4 font-medium text-muted-foreground">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {properties.map(prop => (
                                            <tr key={prop.label} className="border-b border-border/30 last:border-0">
                                                <td className="py-2 px-4 font-mono text-xs text-muted-foreground">{prop.label}</td>
                                                <td className="py-2 px-4 font-mono text-xs">
                                                    <span className={prop.value === 'true' ? 'text-primary' : prop.value === 'false' ? 'text-muted-foreground' : 'text-foreground'}>
                                                        {prop.value}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Event History */}
                        <div className="space-y-3">
                            <div className="flex items-center min-h-9">
                                <span className="text-base font-medium">Recent Events</span>
                            </div>
                            <div className="rounded-md border bg-muted/30 overflow-hidden">
                                {history.length > 0 ? (
                                    <ul className="divide-y divide-border/30">
                                        {history.map((h, i) => (
                                            <li key={`${h.timestamp}-${i}`} className={`flex items-center justify-between py-2 px-4 ${i === 0 ? 'bg-primary/5' : ''}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${TYPE_COLORS[h.type]}`}>
                                                        {TYPE_LABELS[h.type].slice(0, 3)}
                                                    </span>
                                                    <span className="font-mono text-sm font-medium w-20 truncate">{h.label}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground font-mono">{h.detail}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 text-sm text-muted-foreground italic text-center">No events yet</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ToolShell >
    )
}
