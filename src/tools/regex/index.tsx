import { useState, useCallback, useEffect } from 'react'
import { Trash2, Copy, Check, AlertCircle } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { findMatches, FLAGS, PRESETS } from './regex.utils'
import type { RegexMatch } from './regex.types'

export default function RegexTool() {
    const [pattern, setPattern] = useState('')
    const [testString, setTestString] = useState('')
    const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set(['g']))
    const [matches, setMatches] = useState<RegexMatch[]>([])
    const [error, setError] = useState<string | null>(null)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const { copyToClipboard } = useCopyToClipboard()

    const flagsString = FLAGS.filter(f => activeFlags.has(f.key)).map(f => f.key).join('')

    const runMatch = useCallback(() => {
        const { matches: m, error: e } = findMatches(pattern, flagsString, testString)
        setMatches(m)
        setError(e ?? null)
    }, [pattern, flagsString, testString])

    useEffect(() => {
        runMatch()
    }, [runMatch])

    const toggleFlag = (key: string) => {
        setActiveFlags(prev => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const handlePreset = (preset: typeof PRESETS[0]) => {
        setPattern(preset.pattern)
        const flags = new Set(preset.flags.split(''))
        setActiveFlags(flags)
    }

    const handleClear = () => {
        setPattern('')
        setTestString('')
        setMatches([])
        setError(null)
        setActiveFlags(new Set(['g']))
    }

    const handleCopyMatch = (value: string, index: number) => {
        copyToClipboard(value)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 1500)
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClear()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <ToolShell
            title="Regex Tester"
            description="Test regular expressions with real-time matching and common pattern presets."
            headerActions={
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear (Esc)
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Pattern Input + Flags */}
                <div className="space-y-3">
                    <Label htmlFor="regex-pattern" className="text-base font-medium">Pattern</Label>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
                            <Input
                                id="regex-pattern"
                                value={pattern}
                                onChange={(e) => setPattern(e.target.value)}
                                placeholder="Enter regex pattern..."
                                className="font-mono pl-7 pr-7"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/{flagsString}</span>
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="flex flex-wrap items-center gap-4">
                        {FLAGS.map(flag => (
                            <div key={flag.key} className="flex items-center gap-2">
                                <Switch
                                    id={`flag-${flag.key}`}
                                    checked={activeFlags.has(flag.key)}
                                    onCheckedChange={() => toggleFlag(flag.key)}
                                />
                                <Label htmlFor={`flag-${flag.key}`} className="text-sm cursor-pointer">
                                    {flag.label} <span className="text-muted-foreground text-xs">({flag.key})</span>
                                </Label>
                            </div>
                        ))}
                    </div>

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-muted-foreground mr-1">Presets:</span>
                        {PRESETS.map(preset => (
                            <Badge
                                key={preset.label}
                                variant="outline"
                                className="cursor-pointer hover:bg-muted transition-colors font-normal"
                                onClick={() => handlePreset(preset)}
                            >
                                {preset.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Test String */}
                    <div className="space-y-3">
                        <Label htmlFor="test-string" className="text-base font-medium">Test String</Label>
                        <Textarea
                            id="test-string"
                            placeholder="Enter text to test against..."
                            className="min-h-[calc(95vh-480px)] font-mono resize-none bg-muted/30 focus-visible:ring-primary"
                            value={testString}
                            onChange={(e) => setTestString(e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {testString.length} chars
                        </div>
                    </div>

                    {/* Matches */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">
                                Matches <span className="text-muted-foreground font-normal">({matches.length})</span>
                            </Label>
                        </div>
                        <div className={`min-h-[calc(95vh-480px)] rounded-md border bg-muted/50 overflow-auto`}>
                            {matches.length > 0 ? (
                                <ul className="divide-y divide-border/40">
                                    {matches.map((match, i) => (
                                        <li key={i} className="flex items-center justify-between gap-3 py-2.5 px-4 hover:bg-muted/70 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="text-xs text-muted-foreground font-mono shrink-0 w-6 text-right">{i + 1}</span>
                                                <span className="font-mono text-sm truncate text-foreground">{match.value}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-xs text-muted-foreground">@{match.index}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={copiedIndex === i ? "h-6 w-6 p-0 text-primary hover:text-primary" : "h-6 w-6 p-0 text-muted-foreground hover:text-foreground"}
                                                    onClick={() => handleCopyMatch(match.value, i)}
                                                >
                                                    {copiedIndex === i ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
                                                </Button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex items-center justify-center h-full min-h-[200px] text-sm text-muted-foreground italic">
                                    {pattern ? 'No matches found' : 'Enter a pattern to begin'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    )
}
