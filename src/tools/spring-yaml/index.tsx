import { useState, useCallback, useEffect } from 'react'
import { Copy, RotateCcw, Check, FileText, Code, ArrowRightLeft } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { toYaml, toProperties } from './springYaml.utils'

type Direction = 'prop-to-yaml' | 'yaml-to-prop'

export default function SpringYamlTool() {
    const [direction, setDirection] = useState<Direction>('prop-to-yaml')
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Clear everything when switching direction
    const handleDirectionChange = (value: string) => {
        setDirection(value as Direction)
        setInput('')
        setOutput('')
        setError(null)
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
            if (direction === 'prop-to-yaml') {
                converted = toYaml(value)
            } else {
                converted = toProperties(value)
            }
            setOutput(converted)
        } catch (err: any) {
            console.warn('Conversion failed', err)
            if (direction === 'yaml-to-prop') {
                setError(err.message)
            } else {
                // For prop-to-yaml, we might not want to show error immediately as user types
                // unless it's a critical parsing error
            }
        }
    }, [direction])

    // Re-run conversion if direction changes (though we clear input currently, 
    // keeping this logic in case we want to preserve input in future)
    useEffect(() => {
        handleInputChange(input)
    }, [direction, input, handleInputChange])


    const handleClear = () => {
        setInput('')
        setOutput('')
        setError(null)
    }

    const isPropToYaml = direction === 'prop-to-yaml'

    return (
        <ToolShell
            title="Spring YAML Converter"
            description="Convert between Spring Boot application.properties and YAML configuration."
        >
            <div className="flex flex-col h-[calc(95vh-14rem)] min-h-[600px] gap-6">
                {/* Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                    <div className="hidden sm:block"></div> {/* Spacer for centering */}

                    <Button
                        onClick={() => handleDirectionChange(direction === 'prop-to-yaml' ? 'yaml-to-prop' : 'prop-to-yaml')}
                        className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-2 font-semibold justify-self-center"
                    >
                        {direction === 'prop-to-yaml' ? 'Properties' : 'YAML'}
                        <ArrowRightLeft className="h-4 w-4" />
                        {direction === 'prop-to-yaml' ? 'YAML' : 'Properties'}
                    </Button>

                    <Button variant="outline" size="sm" onClick={handleClear} className="gap-2 w-full sm:w-auto justify-self-end">
                        <RotateCcw className="h-4 w-4" />
                        Clear All
                    </Button>
                </div>

                {/* Editors */}
                <div className="grid lg:grid-cols-2 gap-4 flex-1 min-h-0">
                    {/* Input Pane */}
                    <Card className="flex flex-col min-h-0 border-border/50 bg-card shadow-sm">
                        <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isPropToYaml ? <FileText className="h-4 w-4 text-primary" /> : <Code className="h-4 w-4 text-primary" />}
                                <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                                    {isPropToYaml ? 'Input: application.properties' : 'Input: application.yaml'}
                                </CardTitle>
                            </div>
                            <CopyButton text={input} />
                        </CardHeader>
                        <CardContent className="p-0 flex-1 min-h-0">
                            <Textarea
                                className="h-full w-full resize-none rounded-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed bg-transparent"
                                placeholder={isPropToYaml ? "server.port=8080\nspring.datasource.url=..." : "server:\n  port: 8080\nspring:\n  datasource:..."}
                                value={input}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* Output Pane */}
                    <Card className={`flex flex-col min-h-0 border-border/50 bg-card shadow-sm ${error ? 'ring-2 ring-destructive/50' : ''}`}>
                        <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                {isPropToYaml ? <Code className="h-4 w-4 text-primary" /> : <FileText className="h-4 w-4 text-primary" />}
                                <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                                    {isPropToYaml ? 'Output: application.yaml' : 'Output: application.properties'}
                                </CardTitle>
                            </div>
                            <CopyButton text={output} />
                        </CardHeader>
                        <CardContent className="p-0 flex-1 min-h-0 relative">
                            <Textarea
                                className="h-full w-full resize-none rounded-none border-0 focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed bg-muted/10"
                                value={output}
                                readOnly
                            />
                            {error && (
                                <div className="absolute bottom-4 right-4 left-4 bg-destructive/10 text-destructive text-xs p-2 rounded border border-destructive/20 shadow-sm backdrop-blur-sm">
                                    {error}
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
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => copyToClipboard(text)}
            disabled={!text}
            title="Copy"
        >
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
    )
}
