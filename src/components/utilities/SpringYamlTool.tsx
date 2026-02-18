import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { propsToYaml, yamlToProps } from "@/lib/converters/springYaml";

export function SpringYamlTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [mode, setMode] = useState<"props-to-yaml" | "yaml-to-props">("props-to-yaml");

  useEffect(() => {
    if (mode === "props-to-yaml") {
      setRight(propsToYaml(left));
    } else {
      setRight(yamlToProps(left));
    }
  }, [left, mode]);

  const toggleMode = () => {
    setMode(m => m === "props-to-yaml" ? "yaml-to-props" : "props-to-yaml");
    setLeft(right);
    setRight("");
  };

  return (
    <ToolCard title="Spring Properties ↔ YAML" description="Convert between application.properties and YAML format in real-time">
      <div className="flex items-center justify-center mb-4">
        <Button variant="outline" onClick={toggleMode} className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          {mode === "props-to-yaml" ? "Properties → YAML" : "YAML → Properties"}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">{mode === "props-to-yaml" ? "Properties" : "YAML"}</label>
          <Textarea value={left} onChange={(e) => setLeft(e.target.value)} placeholder={mode === "props-to-yaml" ? "server.port=8080\nspring.datasource.url=..." : "server:\n  port: 8080"} className="font-mono min-h-[300px]" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">{mode === "props-to-yaml" ? "YAML" : "Properties"}</label>
            <CopyButton text={right} />
          </div>
          <Textarea value={right} readOnly className="font-mono min-h-[300px] bg-code-bg text-foreground" />
        </div>
      </div>
    </ToolCard>
  );
}
