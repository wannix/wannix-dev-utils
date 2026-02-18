import { useState, useEffect } from "react";
import { Copy, RotateCcw, Check, X, AlertTriangle } from "lucide-react";
import { CopyButton } from "@/components/common/CopyButton";
import { CodeDisplay } from "@/components/common/CodeDisplay";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { decodeJWT } from "@/lib/converters/jwt";
import { cn } from "@/lib/utils";

export function JWTDecoder() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token.trim()) {
      setDecoded(null);
      setError("");
      return;
    }

    const result = decodeJWT(token.trim());

    if (result.success) {
      setDecoded(result);
      setError("");
    } else {
      setError(result.error || "An error occurred");
      setDecoded(null);
    }
  }, [token]);

  const handleClear = () => {
    setToken("");
    setDecoded(null);
    setError("");
  };

  const getStatusColor = () => {
    if (!token) return "bg-muted text-muted-foreground";
    if (error) return "bg-destructive/10 text-destructive border-destructive/20";
    if (decoded?.isExpired) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  const StatusBanner = () => {
    if (!token) return null;

    let Icon = Check;
    let mainText = "Valid JWT";
    let subText = decoded?.expiresAt ? `Expires: ${decoded.expiresAt.toLocaleString()}` : null;
    let iconClass = "h-4 w-4";

    if (error) {
      Icon = X;
      mainText = `Invalid JWT: ${error}`;
      subText = null;
    } else if (decoded?.isExpired) {
      Icon = AlertTriangle;
      mainText = "Token Expired";
    }

    return (
      <div className={cn("p-3 rounded-md border mb-4 text-sm font-medium transition-colors", getStatusColor())}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Icon className={iconClass} />
            <span>{mainText}</span>
          </div>
          {subText && (
            <span className="text-xs ml-6 opacity-80">
              {subText}
            </span>
          )}
        </div>
      </div>
    );
  };

  const ClaimsTable = ({ data, colorClass }: { data: any; colorClass?: string }) => {
    if (!data || typeof data !== "object") return null;

    return (
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">Claim</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(data).map(([key, value]: [string, any]) => (
              <TableRow key={key}>
                <TableCell className="font-mono font-medium">{key}</TableCell>
                <TableCell className={cn("font-mono text-xs break-all", colorClass)}>
                  {["iat", "exp", "nbf"].includes(key) && typeof value === "number" ? (
                    <div className="flex flex-col">
                      <span>{value}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(value * 1000).toLocaleString()}
                      </span>
                    </div>
                  ) : typeof value === "object" ? (
                    JSON.stringify(value)
                  ) : (
                    String(value)
                  )}
                </TableCell>
                <TableCell>
                  <span title="Description would go here" className="cursor-help text-muted-foreground text-xs">?</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const DecodedSection = ({
    title,
    data,
    colorClass,
    subtitle
  }: {
    title: string;
    data: any;
    colorClass?: string;
    subtitle?: string;
  }) => {
    if (!data) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <CopyButton text={JSON.stringify(data, null, 2)} />
        </div>

        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="table">Claims Table</TabsTrigger>
          </TabsList>
          <TabsContent value="json">
            <CodeDisplay className={cn("max-h-[300px] overflow-auto", colorClass)}>
              {JSON.stringify(data, null, 2)}
            </CodeDisplay>
          </TabsContent>
          <TabsContent value="table">
            <ClaimsTable data={data} colorClass={colorClass} />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Column: Input */}
      <div className="flex-1 flex flex-col min-h-0 bg-card rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center justify-between bg-muted/30">
          <h2 className="font-semibold">Encoded Value</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => navigator.clipboard.readText().then(text => setToken(text))}
            >
              Paste
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={handleClear}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col min-h-0 overflow-y-auto">
          <StatusBanner />
          <Textarea
            placeholder="Paste a JWT here..."
            className="flex-1 font-mono text-sm resize-none border-0 focus-visible:ring-0 p-0 bg-transparent leading-relaxed"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoFocus={true}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Right Column: Output */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        {decoded ? (
          <>
            <DecodedSection
              title="Decoded Header"
              subtitle="Algorithm & Token Type"
              data={decoded.header}
              colorClass="text-red-500"
            />

            <DecodedSection
              title="Decoded Payload"
              subtitle="Data & Claims"
              data={decoded.payload}
              colorClass="text-purple-500"
            />

          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center border rounded-lg border-dashed">
            <div className="bg-muted p-4 rounded-full mb-4">
              <RotateCcw className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">No JWT Provided</h3>
            <p className="text-sm max-w-xs">
              Paste a JSON Web Token in the input field to decode its header, payload and signature.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
