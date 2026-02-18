import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { generateHash, generateHMAC, hashAlgorithms, HashAlgorithm } from "@/lib/converters/hash";

export function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("sha256");
  const [hash, setHash] = useState("");
  const [hmacMode, setHmacMode] = useState(false);
  const [hmacKey, setHmacKey] = useState("");

  useEffect(() => {
    const compute = async () => {
      if (!input) { setHash(""); return; }
      if (hmacMode && hmacKey && ["sha256", "sha384", "sha512"].includes(algorithm)) {
        const result = await generateHMAC(input, hmacKey, algorithm as "sha256" | "sha384" | "sha512");
        setHash(result.hash || "");
      } else {
        const result = await generateHash(input, algorithm);
        setHash(result.hash || "");
      }
    };
    compute();
  }, [input, algorithm, hmacMode, hmacKey]);

  return (
    <ToolCard title="Hash/HMAC Generator" description="Generate MD5, SHA-256, SHA-512 hashes and HMAC signatures">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Algorithm</Label>
            <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as HashAlgorithm)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {hashAlgorithms.map((a) => (<SelectItem key={a.value} value={a.value}>{a.label} ({a.bits} bits)</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={hmacMode} onCheckedChange={setHmacMode} disabled={!["sha256", "sha384", "sha512"].includes(algorithm)} />
              <Label>HMAC Mode</Label>
            </div>
          </div>
        </div>
        {hmacMode && <Input value={hmacKey} onChange={(e) => setHmacKey(e.target.value)} placeholder="HMAC Secret Key" className="font-mono" />}
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to hash..." className="min-h-[100px]" />
        {hash && (
          <div className="space-y-2">
            <div className="flex justify-between items-center"><Label>Result ({hmacMode ? "HMAC" : algorithm.toUpperCase()})</Label><CopyButton text={hash} /></div>
            <div className="p-3 bg-code-bg rounded font-mono text-sm break-all">{hash}</div>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
