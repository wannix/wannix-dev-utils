import { useState, useEffect } from 'react'
import { Copy, AlertCircle, Check, Trash2, AlertTriangle, Info } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { decodeJWT } from './jwt.utils'
import type { DecodedJWT } from './jwt.types'

// Helper component to check token validity and show banner
const TokenStatusBanner = ({ payload }: { payload: Record<string, unknown> | null }) => {
    if (!payload?.exp || typeof payload.exp !== 'number') return null

    const expTime = payload.exp * 1000 // Convert to ms
    const isExpired = Date.now() > expTime
    const expirationDate = new Date(expTime).toLocaleString()

    if (isExpired) {
        return (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-amber-500 mb-1">Token Expired</h4>
                        <p className="text-xs text-amber-500/90">Expires: {expirationDate}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-emerald-500 mb-1">Token Active</h4>
                    <p className="text-xs text-emerald-500/90">Expires: {expirationDate}</p>
                </div>
            </div>
        </div>
    )
}

// Reusable Display Component (JSON or Table)
const DataDisplay = ({
    data,
    title,
    colorClass,
    className,
    headerActions
}: {
    data: Record<string, unknown> | null,
    title: string,
    colorClass: string,
    className?: string,
    headerActions?: React.ReactNode
}) => {
    const { copied, copyToClipboard } = useCopyToClipboard()
    const [view, setView] = useState<'json' | 'table'>('json')

    if (!data) return null
    const jsonString = JSON.stringify(data, null, 2)

    return (
        <Card className={`border-border/50 bg-card/50 shadow-sm overflow-hidden flex flex-col ${className}`}>
            <CardHeader className={`px-4 py-2 border-b border-border/40 ${colorClass} bg-opacity-10 shrink-0`}>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xs font-semibold tracking-wide uppercase text-foreground/90">{title}</CardTitle>
                        {title === "Decoded Header" && <div className="text-[10px] text-muted-foreground mt-0.5">Algorithm & Token Type</div>}
                        {title === "Decoded Payload" && <div className="text-[10px] text-muted-foreground mt-0.5">Data & Claims</div>}
                    </div>

                    <div className="flex items-center gap-4">
                        <Tabs value={view} onValueChange={(v) => setView(v as 'json' | 'table')} className="h-7">
                            <TabsList className="h-7 bg-background/50 border border-border/20">
                                <TabsTrigger value="json" className="h-5 text-[10px] px-2 data-[state=active]:bg-muted">JSON</TabsTrigger>
                                <TabsTrigger value="table" className="h-5 text-[10px] px-2 data-[state=active]:bg-muted">Claims Table</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center gap-2">
                            {headerActions}
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs gap-1.5 bg-background/50 hover:bg-background border-border/20"
                                onClick={() => copyToClipboard(jsonString)}
                            >
                                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                                Copy
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0 overflow-hidden relative group bg-card/30">
                {view === 'json' ? (
                    <pre className="p-4 text-xs md:text-sm font-mono text-foreground/80 h-full w-full overflow-auto">
                        {jsonString}
                    </pre>
                ) : (
                    <div className="h-full w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-border/40">
                                    <TableHead className="w-[150px] text-xs h-9">Claim</TableHead>
                                    <TableHead className="text-xs h-9">Value</TableHead>
                                    <TableHead className="w-[40px] h-9"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(data).map(([key, value]) => {
                                    let displayValue: React.ReactNode = String(value)
                                    const isTimestamp = ['exp', 'iat', 'nbf'].includes(key) && typeof value === 'number'

                                    if (isTimestamp) {
                                        displayValue = (
                                            <div className="flex flex-col">
                                                <span className="text-primary/90">{value as number}</span>
                                                <span className="text-[10px] text-muted-foreground">{new Date((value as number) * 1000).toLocaleString()}</span>
                                            </div>
                                        )
                                    } else if (typeof value === 'object' && value !== null) {
                                        displayValue = (
                                            <pre className="text-[10px] font-mono bg-muted/30 p-1 rounded max-w-[300px] overflow-hidden text-ellipsis">
                                                {JSON.stringify(value)}
                                            </pre>
                                        )
                                    } else {
                                        // Highlight standard claims?
                                        if (key === 'alg' || key === 'typ') {
                                            displayValue = <span className="text-red-500/90">{String(value)}</span>
                                        } else if (['iss', 'sub', 'aud', 'jti'].includes(key)) {
                                            displayValue = <span className="text-purple-500/90">{String(value)}</span>
                                        }
                                    }

                                    return (
                                        <TableRow key={key} className="border-border/40 hover:bg-muted/30">
                                            <TableCell className="font-mono text-xs font-medium text-muted-foreground py-2">{key}</TableCell>
                                            <TableCell className="font-mono text-xs py-2 break-all">{displayValue}</TableCell>
                                            <TableCell className="py-2">
                                                <Button size="icon" variant="ghost" className="h-4 w-4 opacity-0 group-hover:opacity-50 hover:!opacity-100" title="Description">
                                                    <Info className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


export default function JwtTool() {
    const [token, setToken] = useState('')
    const [decoded, setDecoded] = useState<DecodedJWT | null>(null)

    useEffect(() => {
        const result = decodeJWT(token)
        setDecoded(result)
    }, [token])

    const handleClear = () => {
        setToken('')
    }

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText()
            setToken(text)
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err)
        }
    }

    return (
        <ToolShell
            title="JWT Decoder"
            description="Decode JSON Web Tokens to inspect header, payload, and signature."
            headerActions={null} // Removed header actions to clean up top bar
            className="max-w-[68rem]"
        >
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(95vh-14rem)] min-h-[500px]">
                {/* Left Column: Input */}
                <div className="flex flex-col gap-0 lg:w-[38%] h-full bg-card border border-border/40 rounded-lg overflow-hidden flex-shrink-0">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/10">
                        <Label htmlFor="jwt-input" className="text-sm font-semibold">Encoded Value</Label>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-foreground"
                                onClick={handlePaste}
                            >
                                Paste
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                                className="h-7 text-xs text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="mr-1.5 h-3 w-3" />
                                Clear
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 relative p-4 flex flex-col gap-4 overflow-y-auto">
                        {decoded?.header && <TokenStatusBanner payload={decoded.payload} />}

                        <Textarea
                            id="jwt-input"
                            placeholder="Paste your JWT here..."
                            className={`flex-1 font-mono resize-none bg-muted/30 focus-visible:ring-primary break-all p-4 text-xs leading-relaxed border-0 shadow-none focus-visible:ring-0 ${decoded?.error ? 'text-destructive' : ''}`}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        {decoded?.error && token && (
                            <Alert variant="destructive" className="mt-2 border-destructive/50 bg-destructive/10">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="font-medium text-xs">{decoded?.error}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>

                {/* Right Column: Output */}
                <div className="flex flex-col gap-4 lg:flex-1 h-full min-h-0 overflow-y-auto pr-1">
                    {decoded && !decoded.error && token ? (
                        <>
                            {/* Header (Part 1) */}
                            <div className="shrink-0">
                                <DataDisplay
                                    data={decoded.header as Record<string, unknown>}
                                    title="Decoded Header"
                                    colorClass="bg-red-500/10 text-red-500 border-red-500/20"
                                    className="max-h-[200px]"
                                />
                            </div>

                            {/* Payload (Part 2) */}
                            <div className="flex-1 min-h-[200px]">
                                <DataDisplay
                                    data={decoded.payload}
                                    title="Decoded Payload"
                                    colorClass="bg-purple-500/10 text-purple-500 border-purple-500/20"
                                    className="h-full"
                                />
                            </div>

                            {/* Signature (Part 3) - Fixed Height */}
                            <div className="shrink-0">
                                <Card className="border-border/50 bg-card/50 shadow-sm overflow-hidden text-xs md:text-sm">
                                    <CardHeader className="px-4 py-2 border-b border-border/40 bg-blue-500/10 text-blue-500 border-blue-500/20">
                                        <CardTitle className="text-xs font-semibold tracking-wide uppercase text-foreground/90">Signature</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 bg-muted/20 font-mono break-all text-muted-foreground">
                                        {decoded.signature}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-12 text-center text-muted-foreground/50 bg-muted/5">
                            <Label className="text-lg font-medium mb-2">Decoded Output</Label>
                            <p className="text-sm">Paste a valid JWT to view its contents</p>
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    )
}
