import { useState, useEffect } from 'react'
import { Copy, RotateCcw, Clock, Check } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { parseTimestamp, generateTimestampResult } from './timestamp.utils'
import type { TimestampResult } from './timestamp.types'

export default function TimestampTool() {
    const [input, setInput] = useState<string>(Math.floor(Date.now() / 1000).toString())
    const [result, setResult] = useState<TimestampResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        handleConvert(input)
    }, [])

    const handleConvert = (val: string) => {
        if (!val.trim()) {
            setResult(null)
            setError(null)
            return
        }

        const date = parseTimestamp(val)
        if (date) {
            setResult(generateTimestampResult(date))
            setError(null)
        } else {
            setResult(null)
            setError('Invalid timestamp or date format')
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInput(val)
        handleConvert(val)
    }

    const handleClear = () => {
        setInput('')
        setResult(null)
        setError(null)
    }

    const handleSetNow = () => {
        const now = Math.floor(Date.now() / 1000).toString()
        setInput(now)
        handleConvert(now)
    }

    return (
        <ToolShell title="Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-medium">Input</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="timestamp-input">Timestamp or Date</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="timestamp-input"
                                    placeholder="e.g. 1771041924"
                                    value={input}
                                    onChange={handleChange}
                                    className="font-mono"
                                />
                                <Button onClick={handleSetNow} className="px-4">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Now
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleClear} title="Clear">
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </div>
                    </CardContent>
                </Card>

                {result && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-medium">Results</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <ResultItem label="Unix (Seconds)" value={result.unixSeconds.toString()} />
                            <ResultItem label="Unix (Milliseconds)" value={result.unixMs.toString()} />
                            <ResultItem label="ISO 8601" value={result.iso8601} />
                            <ResultItem label="UTC" value={result.utc} />
                            <ResultItem label="Local" value={result.local} />
                            <ResultItem label="Relative" value={result.relative} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </ToolShell>
    )
}

function ResultItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1.5 p-3 rounded-md bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
                <CopyButton text={value} />
            </div>
            <div className="font-mono text-sm break-all">{value}</div>
        </div>
    )
}

function CopyButton({ text }: { text: string }) {
    const { copied, copyToClipboard } = useCopyToClipboard()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => copyToClipboard(text)}
            title="Copy"
        >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        </Button>
    )
}
