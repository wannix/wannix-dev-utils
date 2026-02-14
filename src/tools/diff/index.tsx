import { useState, useCallback, useEffect } from "react";
import {
  RotateCcw,
  Split,
  FileDiff,
  Type,
  AlignLeft,
  Braces,
} from "lucide-react";
import { ToolShell } from "@/components/layout/ToolShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { computeDiff } from "./diff.utils";
import type { DiffMode } from "./diff.types";
import type { Change } from "diff";

export default function DiffTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [mode, setMode] = useState<DiffMode>("chars");
  const [diffResult, setDiffResult] = useState<Change[]>([]);

  const calculateDiff = useCallback(() => {
    if (!text1 && !text2) {
      setDiffResult([]);
      return;
    }
    const result = computeDiff(text1, text2, mode);
    setDiffResult(result);
  }, [text1, text2, mode]);

  useEffect(() => {
    calculateDiff();
  }, [calculateDiff]);

  const handleClear = () => {
    setText1("");
    setText2("");
    setDiffResult([]);
  };

  return (
    <ToolShell
      title="Diff Checker"
      description="Compare and highlight differences between two texts."
    >
      <div className="flex flex-col h-[calc(95vh-14rem)] min-h-[600px] gap-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20 p-2 rounded-lg border border-border/40">
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as DiffMode)}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-background border border-border/50">
              <TabsTrigger value="chars" className="gap-2">
                <Type className="h-4 w-4" /> Chars
              </TabsTrigger>
              <TabsTrigger value="words" className="gap-2">
                <AlignLeft className="h-4 w-4" /> Words
              </TabsTrigger>
              <TabsTrigger value="lines" className="gap-2">
                <Split className="h-4 w-4" /> Lines
              </TabsTrigger>
              <TabsTrigger value="json" className="gap-2">
                <Braces className="h-4 w-4" /> JSON
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* Input Area */}
          <div className="flex flex-col gap-4 min-h-0 h-full">
            <Card className="flex flex-col flex-1 min-h-0 border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="py-2 px-3 border-b border-border/40 bg-muted/20 shrink-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Original Text
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <Textarea
                  className="h-full w-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 leading-relaxed"
                  placeholder="Paste original text here..."
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card className="flex flex-col flex-1 min-h-0 border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="py-2 px-3 border-b border-border/40 bg-muted/20 shrink-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Modified Text
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <Textarea
                  className="h-full w-full font-mono text-sm resize-none border-0 focus-visible:ring-0 rounded-none bg-transparent p-4 leading-relaxed"
                  placeholder="Paste modified text here..."
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Output Area */}
          <Card className="flex flex-col min-h-0 border-border/50 bg-card shadow-sm overflow-hidden h-full">
            <CardHeader className="py-3 px-4 border-b border-border/40 bg-muted/20 shrink-0 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <FileDiff className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-semibold lowercase tracking-wider text-muted-foreground">
                  Diff Result
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 bg-muted/5 overflow-auto relative">
              {diffResult.length > 0 ? (
                <div className="p-4 font-mono text-sm whitespace-pre-wrap break-all leading-relaxed">
                  {diffResult.map((part, index) => {
                    const color = part.added
                      ? "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30"
                      : part.removed
                        ? "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30"
                        : "text-muted-foreground";

                    // For line diffs, ensure block display for readability,
                    // though standard diff display usually flows.
                    // Let's keep it inline-block or span.
                    const style =
                      part.added || part.removed
                        ? { borderRadius: "2px", padding: "0 2px" }
                        : {};

                    return (
                      <span key={index} className={`${color}`} style={style}>
                        {part.value}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground/40 text-sm italic">
                  Enter text in both fields to see differences...
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolShell>
  );
}
