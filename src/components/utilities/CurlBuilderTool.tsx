import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export function CurlBuilderTool() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState("");
  const [authType, setAuthType] = useState("none");
  const [authValue, setAuthValue] = useState("");
  const [curlCommand, setCurlCommand] = useState("");

  useEffect(() => {
    if (!url) { setCurlCommand(""); return; }
    let cmd = `curl -X ${method}`;
    headers.filter(h => h.key && h.value).forEach(h => { cmd += ` \\\n  -H "${h.key}: ${h.value}"`; });
    if (authType === "bearer" && authValue) cmd += ` \\\n  -H "Authorization: Bearer ${authValue}"`;
    if (authType === "basic" && authValue) cmd += ` \\\n  -H "Authorization: Basic ${btoa(authValue)}"`;
    if (body && ["POST", "PUT", "PATCH"].includes(method)) cmd += ` \\\n  -d '${body}'`;
    cmd += ` \\\n  "${url}"`;
    setCurlCommand(cmd);
  }, [method, url, headers, body, authType, authValue]);

  return (
    <ToolCard title="Curl Command Builder" description="Build complex curl commands with a visual interface">
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <div className="col-span-3"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/endpoint" /></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center"><Label>Headers</Label><Button variant="ghost" size="sm" onClick={() => setHeaders([...headers, { key: "", value: "" }])}><Plus className="h-4 w-4" /></Button></div>
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2">
              <Input value={h.key} onChange={(e) => { const n = [...headers]; n[i].key = e.target.value; setHeaders(n); }} placeholder="Header name" />
              <Input value={h.value} onChange={(e) => { const n = [...headers]; n[i].value = e.target.value; setHeaders(n); }} placeholder="Value" />
              <Button variant="ghost" size="icon" onClick={() => setHeaders(headers.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select value={authType} onValueChange={setAuthType}>
            <SelectTrigger><SelectValue placeholder="Auth Type" /></SelectTrigger>
            <SelectContent><SelectItem value="none">No Auth</SelectItem><SelectItem value="bearer">Bearer Token</SelectItem><SelectItem value="basic">Basic Auth</SelectItem></SelectContent>
          </Select>
          {authType !== "none" && <Input value={authValue} onChange={(e) => setAuthValue(e.target.value)} placeholder={authType === "basic" ? "user:password" : "token"} />}
        </div>
        {["POST", "PUT", "PATCH"].includes(method) && <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder='{"key": "value"}' className="font-mono min-h-[80px]" />}
        {curlCommand && (
          <div className="space-y-2">
            <div className="flex justify-between items-center"><Label>Generated Command</Label><CopyButton text={curlCommand} /></div>
            <pre className="p-3 bg-code-bg rounded font-mono text-sm overflow-x-auto whitespace-pre-wrap">{curlCommand}</pre>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
