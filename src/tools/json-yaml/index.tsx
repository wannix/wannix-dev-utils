import { useState, useCallback } from 'react'
import { ArrowRightLeft, RotateCcw, FileJson, FileText, Check, Copy } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { toJson, toYaml } from './jsonYaml.utils'
import type { Direction } from './jsonYaml.types'


export default function JsonYamlTool() {
    const [direction, setDirection] = useState<Direction>('json-to-yaml')
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState<string | null>(null)
    // Removed: const { copied, copyToClipboard } = useCopyToClipboard() // This hook was unused in the main component

    const handleDirectionChange = (newDirection: Direction) => {
        setDirection(newDirection)
        // Swap content if there is valid output to be new input
        if (output && !error) {
            setInput(output)
            // Trigger conversion immediately with new input
            try {
                const converted = newDirection === 'json-to-yaml' ? toYaml(output) : toJson(output)
                setOutput(converted)
                setError(null)
            } catch (err: any) {
                // If swap fails, just clear output
                setOutput('')
            }
        } else {
            // Just clear if error or empty
            setInput('')
            setOutput('')
            setError(null)
        }
    }

    const handleInputChange = useCallback((value: string) => {
        setInput(value)
        setError(null)

        if (!value.trim()) {
            setOutput('')
            return
        }

        try {
            let converted = ''
            if (direction === 'json-to-yaml') {
                converted = toYaml(value)
            } else {
                converted = toJson(value)
            }
            setOutput(converted)
        } catch (err: any) {
            console.warn('Conversion failed', err)
            // Show error immediately for better feedback
            setError(err.message)
        }
    }, [direction])

    const handleClear = () => {
        setInput('')
        setOutput('')
        setError(null)
    }

    const isJsonToYaml = direction === 'json-to-yaml'

    const CopyButton = ({ text }: { text: string }) => {
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

    return (
        <ToolShell
            title="JSON <> YAML Converter"
            description="Convert between JSON and YAML formats in real-time."
        >
            <div className="flex flex-col h-[calc(95vh-14rem)] min-h-[600px] gap-6">
                {/* Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                    <div className="hidden sm:block"></div> {/* Spacer for centering */}

                    <Button
                        onClick={() => handleDirectionChange(direction === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml')}
                        className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 font-semibold justify-self-center"
                    >
                        {isJsonToYaml ? 'JSON' : 'YAML'}
                        <ArrowRightLeft className="h-4 w-4" />
                        {isJsonToYaml ? 'YAML' : 'JSON'}
                    </Button>

                    <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 w-full sm:w-auto justify-self-end">
                        <RotateCcw className="h-4 w-4" />
                        Clear All
                    </Button>
                </div>

                {/* Editors */}
                <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
                    {/* Input Pane */}
                    <Card className={`flex flex-col border-border/50 bg-card shadow-sm overflow-hidden ${error ? 'border-destructive/50' : ''}`}>
                        <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isJsonToYaml ? <FileJson className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
                                <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                                    {isJsonToYaml ? 'Input: JSON' : 'Input: YAML'}
                                </CardTitle>
                            </div>
                            <CopyButton text={input} />
                        </CardHeader>
                        <CardContent className="p-0 flex-1 relative">
                            <Textarea
                                className="h-full w-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 leading-relaxed"
                                placeholder={isJsonToYaml ? 'Paste JSON here...' : 'Paste YAML here...'}
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />
                            {error && (
                                <div className="absolute bottom-0 left-0 right-0 bg-destructive/10 text-destructive text-xs p-2 border-t border-destructive/20 truncate">
                                    Error: {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Output Pane */}
                    <Card className="flex flex-col border-border/50 bg-card shadow-sm overflow-hidden">
                        <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isJsonToYaml ? <FileText className="h-4 w-4 text-primary" /> : <FileJson className="h-4 w-4 text-primary" />}
                                <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                                    {isJsonToYaml ? 'Output: YAML' : 'Output: JSON'}
                                </CardTitle>
                            </div>
                            <CopyButton text={output} />
                        </CardHeader>
                        <CardContent className="p-0 flex-1 bg-muted/5">
                            <Textarea
                                className="h-full w-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 leading-relaxed text-muted-foreground"
                                value={output}
                                readOnly
                                placeholder="Result will appear here..."
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ToolShell>
    )
}
