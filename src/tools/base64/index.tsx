import { useState, useEffect, useCallback } from 'react'
import { Copy, Trash2, AlertCircle, Check } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { encodeText, decodeBase64 } from './base64.utils'
import type { Base64Mode } from './base64.types'

export default function Base64Tool() {
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [mode, setMode] = useState<Base64Mode>('encode')
    const { copied, copyToClipboard } = useCopyToClipboard()

    const processInput = useCallback((value: string, currentMode: Base64Mode) => {
        if (!value) {
            setOutput('')
            setError(null)
            return
        }

        const result = currentMode === 'encode' ? encodeText(value) : decodeBase64(value)

        if (result.error) {
            setError(result.error)
            // Keep previous output or clear it? Keeping it might be confusing if error is shown.
            // But for validation, let's clear output on error.
            setOutput('')
        } else {
            setError(null)
            setOutput(result.text)
        }
    }, [])

    useEffect(() => {
        processInput(input, mode)
    }, [input, mode, processInput])

    const handleModeChange = (newMode: string) => {
        setMode(newMode as Base64Mode)
        // Optionally swap input/output when switching modes?
        // For now, let's just clear or keep input. Clearing is safer to avoid immediate errors.
        // Actually, if I encode "A" -> "QQ==", then switch to decode, input "A" is invalid base64.
        // UX: Let's Just keep input and let user handle it, or swap?
        // Let's NOT swap automatically to avoid confusion.
    }

    const handleClear = () => {
        setInput('')
        setOutput('')
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
            title="Base64 Encoder/Decoder"
            description="Encode text to Base64 or decode Base64 strings with UTF-8 support."
            headerActions={
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear (Esc)
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Mode Selection */}
                <div className="flex justify-center">
                    <Tabs value={mode} onValueChange={handleModeChange} className="w-full max-w-md">
                        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                            <TabsTrigger value="encode" className="data-[state=active]:bg-background data-[state=active]:text-primary">Encoder</TabsTrigger>
                            <TabsTrigger value="decode" className="data-[state=active]:bg-background data-[state=active]:text-primary">Decoder</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Input Section */}
                    <div className="space-y-3">
                        <div className="flex items-center min-h-9">
                            <Label htmlFor="input" className="text-base font-medium">
                                {mode === 'encode' ? 'Text Input' : 'Base64 Input'}
                            </Label>
                        </div>
                        <Textarea
                            id="input"
                            placeholder={mode === 'encode' ? 'Type or paste content to encode...' : 'Paste Base64 string to decode...'}
                            className="min-h-[300px] font-mono resize-none bg-muted/30 focus-visible:ring-primary"
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
                            <Label htmlFor="output" className="text-base font-medium">
                                {mode === 'encode' ? 'Base64 Output' : 'Text Output'}
                            </Label>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(output)}
                                disabled={!output}
                                className={copied ? "text-primary hover:text-primary" : "text-muted-foreground"}
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
                                id="output"
                                readOnly
                                className={`min-h-[300px] font-mono resize-none bg-muted/50 ${error ? 'border-destructive/50 focus-visible:ring-destructive' : 'focus-visible:ring-primary'}`}
                                value={output}
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
