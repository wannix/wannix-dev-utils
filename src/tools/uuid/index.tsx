import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Copy, RefreshCw, Check } from 'lucide-react'
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
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'

export default function UuidTool() {
    const [uuids, setUuids] = useState<string>('')
    const [quantity, setQuantity] = useState<number>(1)
    const [hyphens, setHyphens] = useState<boolean>(true)
    const [uppercase, setUppercase] = useState<boolean>(false)
    const { copied: hasCopied, copyToClipboard } = useCopyToClipboard()

    const generateUUIDs = () => {
        const newUuids: string[] = []
        for (let i = 0; i < quantity; i++) {
            let uuid = uuidv4()
            if (!hyphens) {
                uuid = uuid.replace(/-/g, '')
            }
            if (uppercase) {
                uuid = uuid.toUpperCase()
            }
            newUuids.push(uuid)
        }
        setUuids(newUuids.join('\n'))
    }

    // Generate on mount and when options change
    useEffect(() => {
        generateUUIDs()
    }, [quantity, hyphens, uppercase]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleCopy = () => {
        copyToClipboard(uuids)
    }

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value)
        if (isNaN(val)) val = 1
        if (val < 1) val = 1
        if (val > 100) val = 100 // Cap at 100
        setQuantity(val)
    }

    return (
        <ToolShell
            title="ID Generator Suite"
            description="Generate UUID, ULID, and KSUID identifiers"
        >
            <div className="space-y-8">

                {/* Configuration Row */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                        <Label htmlFor="id-type" className="text-base font-medium">ID Type</Label>
                        <Select defaultValue="uuid-v4">
                            <SelectTrigger id="id-type" className="h-11 bg-background border-input">
                                <SelectValue placeholder="Select ID Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uuid-v4">UUID v4</SelectItem>
                                <SelectItem value="ulid" disabled>ULID (Coming Soon)</SelectItem>
                                <SelectItem value="ksuid" disabled>KSUID (Coming Soon)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">Universally Unique Identifier, random-based</p>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="quantity" className="text-base font-medium">Count</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min={1}
                            max={100}
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="h-11 bg-background border-input"
                        />
                    </div>
                </div>

                {/* Toggles Row */}
                <div className="flex flex-wrap gap-8">
                    <div className="flex items-center space-x-3">
                        <Switch
                            id="uppercase"
                            checked={uppercase}
                            onCheckedChange={setUppercase}
                        />
                        <Label htmlFor="uppercase" className="cursor-pointer font-medium">Uppercase</Label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Switch
                            id="hyphens"
                            checked={hyphens}
                            onCheckedChange={setHyphens}
                        />
                        <Label htmlFor="hyphens" className="cursor-pointer font-medium">With Hyphens</Label>
                    </div>
                </div>

                {/* Action Button */}
                <div>
                    <Button
                        className="w-full md:w-auto font-semibold h-11 px-6 shadow-sm"
                        onClick={generateUUIDs}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Generate
                    </Button>
                </div>

                {/* Output */}
                <div className="space-y-3 pt-6 border-t border-border/40">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Generated IDs</Label>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={handleCopy}
                        >
                            {hasCopied ? (
                                <span className="flex items-center text-green-500"><Check className="mr-2 h-3 w-3" />Copied</span>
                            ) : (
                                <span className="flex items-center"><Copy className="mr-2 h-3 w-3" />Copy to clipboard</span>
                            )}
                        </Button>
                    </div>
                    <Textarea
                        className="min-h-[300px] bg-muted/50 border-border/40 font-mono text-base resize-none focus-visible:ring-primary"
                        value={uuids}
                        readOnly
                    />
                </div>

            </div>
        </ToolShell>
    )
}
