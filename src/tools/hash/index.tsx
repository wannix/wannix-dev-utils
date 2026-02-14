import { useState, useEffect } from 'react'
import { Copy, RotateCcw, Check, Hash, Fingerprint } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { generateHash, ALGORITHMS } from './hash.utils'
import type { HashAlgorithm } from './hash.types'

export default function HashTool() {
    const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA256')
    const [hmacEnabled, setHmacEnabled] = useState(false)
    const [hmacKey, setHmacKey] = useState('')
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        calculateHash()
    }, [input, algorithm, hmacEnabled, hmacKey])

    const calculateHash = () => {
        setError(null)
        if (!input) {
            setOutput('')
            return
        }

        if (hmacEnabled && !hmacKey) {
            setOutput('')
            return
        }

        try {
            const result = generateHash(input, algorithm, hmacEnabled ? hmacKey : undefined)
            setOutput(result)
        } catch (err: any) {
            console.warn('Hash generation failed', err)
            setError(err.message)
            setOutput('')
        }
    }

    const handleClear = () => {
        setInput('')
        setHmacKey('')
        setOutput('')
        setError(null)
    }

    return (
        <ToolShell
            title="Hash Generator"
            description="Generate cryptographic hashes (MD5, SHA-1, SHA-256, etc.) from text."
        >
            <div className="flex flex-col h-[calc(95vh-14rem)] min-h-[600px] gap-6">
                {/* Configuration Bar */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-muted/20 p-4 rounded-lg border border-border/40">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="algorithm" className="whitespace-nowrap font-medium text-sm text-muted-foreground">Algorithm:</Label>
                            <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as HashAlgorithm)}>
                                <SelectTrigger id="algorithm" className="w-[140px] bg-background">
                                    <SelectValue placeholder="Select algorithm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALGORITHMS.map((algo) => (
                                        <SelectItem key={algo.value} value={algo.value}>
                                            {algo.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 border-l border-border/40 pl-0 sm:pl-4 ml-0 sm:ml-4">
                            <Switch
                                id="hmac-mode"
                                checked={hmacEnabled}
                                onCheckedChange={setHmacEnabled}
                            />
                            <Label htmlFor="hmac-mode" className="font-medium text-sm text-muted-foreground cursor-pointer">HMAC Mode</Label>
                        </div>

                        {hmacEnabled && (
                            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto animate-in fade-in slide-in-from-left-4 duration-200">
                                <Label htmlFor="hmac-key" className="whitespace-nowrap font-medium text-sm text-muted-foreground">Key:</Label>
                                <Input
                                    id="hmac-key"
                                    type="text"
                                    placeholder="Enter secret key..."
                                    value={hmacKey}
                                    onChange={(e) => setHmacKey(e.target.value)}
                                    className="h-9 bg-background max-w-[250px]"
                                />
                            </div>
                        )}
                    </div>

                    <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 shrink-0">
                        <RotateCcw className="h-4 w-4" />
                        Clear All
                    </Button>
                </div>

                {/* Editors */}
                <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
                    {/* Input Pane */}
                    <Card className="flex flex-col border-border/50 bg-card shadow-sm overflow-hidden">
                        <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Fingerprint className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                                    Input Text
                                </CardTitle>
                            </div>
                            <CopyButton text={input} />
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative">
                            <Textarea
                                className="h-full w-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 leading-relaxed"
                                placeholder="Enter text to hash..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* Output Pane */}
                    <Card className={`flex flex-col border-border/50 bg-card shadow-sm overflow-hidden ${error ? 'border-destructive/50' : ''}`}>
                        <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                                    Output Hash
                                </CardTitle>
                            </div>
                            <CopyButton text={output} />
                        </CardHeader>
                        <CardContent className="p-0 flex-1 bg-muted/5 relative">
                            <Textarea
                                className="h-full w-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 leading-relaxed text-muted-foreground"
                                value={output}
                                readOnly
                                placeholder="Hash will appear here..."
                            />
                            {error && (
                                <div className="absolute bottom-0 left-0 right-0 bg-destructive/10 text-destructive text-xs p-2 border-t border-destructive/20 truncate">
                                    Error: {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ToolShell>
    )
}

function CopyButton({ text }: { text: string }) {
    const { copied, copyToClipboard } = useCopyToClipboard()

    return (
        <Button
            variant="ghost"
            size="icon"
            className={copied ? "h-8 w-8 text-primary hover:text-primary" : "h-8 w-8 text-muted-foreground hover:text-foreground"}
            onClick={() => copyToClipboard(text)}
            title="Copy"
        >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
        </Button>
    )
}
