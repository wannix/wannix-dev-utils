import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { CodeDisplay } from "@/components/common/CodeDisplay";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { encodeBase64, decodeBase64 } from "@/lib/converters/base64";

export function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  // Auto-process when input or mode changes
  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      return;
    }

    const result = mode === "encode" ? encodeBase64(input) : decodeBase64(input);
    
    if (result.success && result.result) {
      setOutput(result.result);
      setError("");
    } else {
      setError(result.error || "An error occurred");
      setOutput("");
    }
  }, [input, mode]);

  return (
    <ToolCard
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 back to text. Supports UTF-8 characters."
    >
      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            onClick={() => setMode("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <Textarea
            placeholder={mode === "encode" ? "Enter text here..." : "Enter Base64 string here..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[150px] font-mono"
          />
          <div className="text-xs text-muted-foreground">
            {input.length.toLocaleString()} characters
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Output */}
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Result</label>
              <CopyButton text={output} />
            </div>
            <CodeDisplay>{output}</CodeDisplay>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
