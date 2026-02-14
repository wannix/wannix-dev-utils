import { useState, useCallback, useEffect } from 'react'
import { Copy, Trash2, Check, AlertCircle, Sparkles } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { optimizeSvg, formatBytes } from './svg.utils'
import type { SvgResult } from './svg.types'

export default function SvgTool() {
    const [input, setInput] = useState('')
    const [result, setResult] = useState<SvgResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { copied, copyToClipboard } = useCopyToClipboard()

    const handleOptimize = useCallback(() => {
        if (!input.trim()) {
            setResult(null)
            setError(null)
            return
        }
        try {
            const r = optimizeSvg(input)
            setResult(r)
            setError(null)
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to optimize SVG'
            setError(message)
            setResult(null)
        }
    }, [input])

    useEffect(() => {
        handleOptimize()
    }, [handleOptimize])

    const handleClear = () => {
        setInput('')
        setResult(null)
        setError(null)
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClear()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <ToolShell
            title="SVG Optimizer"
            description="Optimize SVG files by removing unnecessary metadata, comments, and editor data."
            headerActions={
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear (Esc)
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Stats bar */}
                {result && (
                    <div className="flex items-center justify-center gap-6 text-sm animate-in fade-in duration-300">
                        <span className="text-muted-foreground">
                            Original: <span className="font-mono font-medium text-foreground">{formatBytes(result.originalSize)}</span>
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-muted-foreground">
                            Optimized: <span className="font-mono font-medium text-foreground">{formatBytes(result.optimizedSize)}</span>
                        </span>
                        <span className="text-muted-foreground">
                            Saved: <span className="font-mono font-medium text-green-500">{result.savedPercent.toFixed(1)}%</span>
                        </span>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 items-start">
                    {/* Input Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between min-h-9">
                            <Label htmlFor="svg-input" className="text-base font-medium">
                                SVG Input
                            </Label>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Sparkles className="h-3 w-3" />
                                Auto-optimizes on paste
                            </div>
                        </div>
                        <Textarea
                            id="svg-input"
                            placeholder="Paste your SVG markup here..."
                            className="min-h-[calc(95vh-340px)] font-mono resize-none bg-muted/30 focus-visible:ring-primary"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {input.length} chars
                        </div>
                    </div>

                    {/* Output Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between min-h-9">
                            <Label htmlFor="svg-output" className="text-base font-medium">
                                Optimized SVG
                            </Label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => result && copyToClipboard(result.optimized)}
                                disabled={!result}
                                className={copied ? "text-primary" : "text-muted-foreground"}
                            >
                                {copied ? (
                                    <><Check className="mr-2 h-3.5 w-3.5" /> Copied</>
                                ) : (
                                    <><Copy className="mr-2 h-3.5 w-3.5" /> Copy</>
                                )}
                            </Button>
                        </div>

                        <div className="relative">
                            <Textarea
                                id="svg-output"
                                readOnly
                                className={`min-h-[calc(95vh-340px)] font-mono resize-none bg-muted/50 ${error ? 'border-destructive/50 focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                value={result?.optimized ?? ''}
                            />
                            {error && (
                                <div className="absolute bottom-4 left-4 right-4">
                                    <Alert variant="destructive" className="py-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    )
}
