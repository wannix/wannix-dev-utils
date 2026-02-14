import { useState, useCallback, useEffect } from "react";
import {
  Copy,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Terminal,
  Play,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { ToolShell } from "@/components/layout/ToolShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { generateCurlCommand } from "./curl.utils";
import type { RequestMethod, Header, CurlState } from "./curl.types";

const METHODS: RequestMethod[] = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "HEAD",
  "OPTIONS",
];

export default function CurlTool() {
  const [method, setMethod] = useState<RequestMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([
    { id: uuidv4(), key: "", value: "" },
  ]);
  const [body, setBody] = useState("");
  const [output, setOutput] = useState("");

  const updateCurl = useCallback(() => {
    const state: CurlState = {
      method,
      url,
      headers: headers.filter((h) => h.key.trim() !== ""),
      body,
    };
    setOutput(generateCurlCommand(state));
  }, [method, url, headers, body]);

  useEffect(() => {
    updateCurl();
  }, [updateCurl]);

  const handleAddHeader = () => {
    setHeaders([...headers, { id: uuidv4(), key: "", value: "" }]);
  };

  const handleRemoveHeader = (id: string) => {
    setHeaders(headers.filter((h) => h.id !== id));
  };

  const handleHeaderChange = (
    id: string,
    field: "key" | "value",
    value: string,
  ) => {
    setHeaders(
      headers.map((h) => (h.id === id ? { ...h, [field]: value } : h)),
    );
  };

  const handleClear = () => {
    setMethod("GET");
    setUrl("");
    setHeaders([{ id: uuidv4(), key: "", value: "" }]);
    setBody("");
  };

  return (
    <ToolShell
      title="Curl Builder"
      description="Build complex cURL commands with a visual interface."
    >
      <div className="flex flex-col h-[calc(95vh-14rem)] min-h-[600px] gap-6">
        {/* Request Configuration */}
        <Card className="flex flex-col border-border/50 bg-card shadow-sm overflow-hidden flex-1">
          <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                Request Builder
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="gap-2 h-8 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </CardHeader>
          <CardContent className="p-6 space-y-6 overflow-y-auto">
            {/* Method & URL */}
            <div className="flex gap-4">
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as RequestMethod)}
              >
                <SelectTrigger className="w-[120px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="https://api.example.com/v1/resource"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>

            {/* Headers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Headers
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddHeader}
                  className="h-6 gap-1 text-xs"
                >
                  <Plus className="h-3 w-3" /> Add Header
                </Button>
              </div>
              <div className="space-y-2">
                {headers.map((header) => (
                  <div key={header.id} className="flex gap-2">
                    <Input
                      placeholder="Key (e.g. Content-Type)"
                      value={header.key}
                      onChange={(e) =>
                        handleHeaderChange(header.id, "key", e.target.value)
                      }
                      className="flex-1 h-9 font-mono text-xs"
                    />
                    <Input
                      placeholder="Value (e.g. application/json)"
                      value={header.value}
                      onChange={(e) =>
                        handleHeaderChange(header.id, "value", e.target.value)
                      }
                      className="flex-1 h-9 font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveHeader(header.id)}
                      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                      disabled={
                        headers.length === 1 &&
                        !headers[0].key &&
                        !headers[0].value
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Body (only for relevant methods) */}
            {["POST", "PUT", "PATCH"].includes(method) && (
              <div className="space-y-3 pt-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Request Body (JSON)
                </Label>
                <Textarea
                  placeholder='{"key": "value"}'
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="font-mono text-sm min-h-[150px] resize-y"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="flex flex-col border-border/50 bg-card shadow-sm overflow-hidden min-h-[150px] shrink-0">
          <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                Generated Command
              </CardTitle>
            </div>
            <CopyButton text={output} />
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-muted/5">
            <Textarea
              className="h-full w-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 leading-relaxed text-muted-foreground"
              value={output}
              readOnly
            />
          </CardContent>
        </Card>
      </div>
    </ToolShell>
  );
}

function CopyButton({ text }: { text: string }) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={
        copied
          ? "h-8 w-8 text-primary hover:text-primary"
          : "h-8 w-8 text-muted-foreground hover:text-foreground"
      }
      onClick={() => copyToClipboard(text)}
      title="Copy"
    >
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
