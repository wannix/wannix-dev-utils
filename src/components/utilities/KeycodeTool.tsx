import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Keyboard } from "lucide-react";

export function KeycodeTool() {
  const [lastKey, setLastKey] = useState<{ key: string; code: string; keyCode: number; which: number } | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      setLastKey({ key: e.key, code: e.code, keyCode: e.keyCode, which: e.which });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <ToolCard title="Keycode Info" description="Press any key to see its JavaScript event properties">
      <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-code-bg rounded">
        {lastKey ? (
          <div className="space-y-4 text-center">
            <div className="text-6xl font-bold text-primary">{lastKey.key === " " ? "Space" : lastKey.key}</div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-background rounded">
                <div className="text-muted-foreground">event.key</div>
                <div className="font-mono flex items-center justify-center gap-2">"{lastKey.key}"<CopyButton text={`"${lastKey.key}"`} /></div>
              </div>
              <div className="p-3 bg-background rounded">
                <div className="text-muted-foreground">event.code</div>
                <div className="font-mono flex items-center justify-center gap-2">"{lastKey.code}"<CopyButton text={`"${lastKey.code}"`} /></div>
              </div>
              <div className="p-3 bg-background rounded">
                <div className="text-muted-foreground">event.keyCode</div>
                <div className="font-mono flex items-center justify-center gap-2">{lastKey.keyCode}<CopyButton text={String(lastKey.keyCode)} /></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <Keyboard className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Press any key to see its properties</p>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
