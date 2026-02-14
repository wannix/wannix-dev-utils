import { useState, useEffect } from 'react'
import { Copy, RefreshCw, Check, Trash2, History, Settings2 } from 'lucide-react'
import { ToolShell } from '@/components/layout/ToolShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useUuidStore } from '@/store/uuid.store'
import { generateIds, type IdType } from './uuid.utils'

export default function UuidTool() {
    const [uuids, setUuids] = useState<string>('')
    const [uuidList, setUuidList] = useState<string[]>([])

    // Configuration State
    const [idType, setIdType] = useState<IdType>('uuid-v4')
    const [quantity, setQuantity] = useState<number>(1)
    const [hyphens, setHyphens] = useState<boolean>(true)
    const [uppercase, setUppercase] = useState<boolean>(false)
    const [braces, setBraces] = useState<boolean>(false)

    // History Store
    const { history, addToHistory, clearHistory } = useUuidStore()
    const { copied: hasCopied, copyToClipboard } = useCopyToClipboard()

    const generate = (saveToHistory = true) => {
        const newUuids = generateIds(idType, quantity, { hyphens, uppercase, braces })

        const resultArgs = newUuids.join('\n')
        setUuids(resultArgs)
        setUuidList(newUuids)

        if (saveToHistory) {
            // Create a summary value for history
            const summaryValue = newUuids.length === 1
                ? newUuids[0]
                : `${newUuids[0]} (+${newUuids.length - 1} more)`

            addToHistory(summaryValue, idType, {
                hyphens,
                uppercase,
                braces
            })
        }
    }

    // Generate on mount (no history save)
    useEffect(() => {
        generate(false)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Re-generate when options change
    useEffect(() => {
        generate(false)
    }, [idType, quantity, hyphens, uppercase, braces]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleGenerateClick = () => {
        generate(true)
    }

    const handleCopy = () => {
        copyToClipboard(uuids)
    }

    const CopyItem = ({ text }: { text: string }) => {
        const { copied, copyToClipboard } = useCopyToClipboard()
        return (
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard(text)}
                title="Copy"
            >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        )
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value)
        if (isNaN(val)) val = 1
        if (val < 1) val = 1
        if (val > 100) val = 100
        setQuantity(val)
    }

    const isUuid = idType === 'uuid-v4'

    return (
        <ToolShell
            title="ID Generator Suite"
            description="Generate UUID, ULID, and KSUID identifiers"
        >
            <div className="grid lg:grid-cols-3 gap-8 h-[calc(95vh-14rem)] min-h-[600px]">

                {/* Left Column: Configuration & History */}
                <div className="lg:col-span-1 flex flex-col gap-6 h-full overflow-hidden">
                    <Card className="border-border/50 bg-card shadow-sm">
                        <CardHeader className="pb-4 border-b border-border/40 bg-muted/10">
                            <div className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Configuration</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            {/* ID Type & Quantity */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">ID Type</Label>
                                    <Select value={idType} onValueChange={(v) => setIdType(v as IdType)}>
                                        <SelectTrigger className="bg-background/50">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="uuid-v4">UUID v4 (Random)</SelectItem>
                                            <SelectItem value="ulid">ULID (Sortable)</SelectItem>
                                            <SelectItem value="ksuid">KSUID (K-Sortable)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-[10px] text-muted-foreground">
                                        {idType === 'uuid-v4' && "Universally Unique Identifier, 128-bit random."}
                                        {idType === 'ulid' && "Universally Unique Lexicographically Sortable Identifier."}
                                        {idType === 'ksuid' && "K-Sortable Unique IDentifier, base62 encoded."}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-medium text-muted-foreground">Quantity (1-100)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="space-y-4">
                                <div className={`flex items-center justify-between transition-opacity ${!isUuid ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <Label htmlFor="uppercase" className="text-sm font-medium cursor-pointer">Uppercase</Label>
                                    <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} disabled={!isUuid} />
                                </div>
                                <div className={`flex items-center justify-between transition-opacity ${!isUuid ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <Label htmlFor="hyphens" className="text-sm font-medium cursor-pointer">Hyphens</Label>
                                    <Switch id="hyphens" checked={hyphens} onCheckedChange={setHyphens} disabled={!isUuid} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="braces" className="text-sm font-medium cursor-pointer">Braces</Label>
                                    <Switch id="braces" checked={braces} onCheckedChange={setBraces} />
                                </div>
                            </div>

                            <Button className="w-full" onClick={handleGenerateClick}>
                                <RefreshCw className="mr-2 h-4 w-4" /> Generate {idType === 'uuid-v4' ? 'UUIDs' : idType.toUpperCase() + 's'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* History Section - Scrollable */}
                    <Card className="border-border/50 bg-card shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
                        <CardHeader className="pb-3 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <History className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">History</CardTitle>
                            </div>
                            {history.length > 0 && (
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={clearHistory} title="Clear History">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-0 overflow-y-auto flex-1">
                            {history.length === 0 ? (
                                <div className="p-8 text-center text-xs text-muted-foreground">No history yet</div>
                            ) : (
                                <div className="divide-y divide-border/40">
                                    {history.map((item) => (
                                        <div key={item.id} className="p-3 hover:bg-muted/30 transition-colors group">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="font-mono text-xs break-all text-foreground/80 line-clamp-2">{item.value}</div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <CopyItem text={item.value} />
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                                                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                                                <div className="flex gap-1 items-center">
                                                    {item.type && (
                                                        <span className="px-1 py-0.5 rounded bg-primary/10 text-primary font-semibold uppercase">
                                                            {item.type.replace('-v4', '')}
                                                        </span>
                                                    )}
                                                    {item.format.braces && <span className="px-1 py-0.5 rounded bg-muted">{'{}'}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Output */}
                <div className="lg:col-span-2 h-full flex flex-col min-h-0">
                    <Tabs defaultValue="raw" className="flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-4 shrink-0">
                            <TabsList className="bg-muted/50">
                                <TabsTrigger value="raw">Raw Text</TabsTrigger>
                                <TabsTrigger value="list">List View</TabsTrigger>
                            </TabsList>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={handleCopy}
                            >
                                {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                Copy All
                            </Button>
                        </div>

                        <TabsContent value="raw" className="flex-1 min-h-0 mt-0">
                            <Textarea
                                className="h-full w-full font-mono text-sm resize-none bg-card/50 p-6 leading-relaxed"
                                value={uuids}
                                readOnly
                            />
                        </TabsContent>

                        <TabsContent value="list" className="flex-1 min-h-0 mt-0 overflow-hidden rounded-md border border-border/50 bg-card/50">
                            <div className="h-full overflow-y-auto p-2">
                                <div className="space-y-1">
                                    {uuidList.map((uuid, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-muted/40 group font-mono text-sm border border-transparent hover:border-border/30">
                                            <span className="text-muted-foreground w-8 text-right text-xs select-none">#{idx + 1}</span>
                                            <span className="flex-1 break-all">{uuid}</span>
                                            <CopyItem text={uuid} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </ToolShell>
    )
}
