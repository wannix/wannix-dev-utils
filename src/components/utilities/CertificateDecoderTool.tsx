import { useState, useEffect } from "react";
import { ToolCard } from "@/components/common/ToolCard";
import { CopyButton } from "@/components/common/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Shield, ShieldCheck } from "lucide-react";
import { decodeCertificate } from "@/lib/converters/certificate";

export function CertificateDecoderTool() {
  const [pem, setPem] = useState("");
  const [info, setInfo] = useState<ReturnType<typeof decodeCertificate>["info"]>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pem.trim()) { setInfo(null); setError(""); return; }
    const result = decodeCertificate(pem);
    if (result.success && result.info) { setInfo(result.info); setError(""); }
    else { setError(result.error || "Failed to decode"); setInfo(null); }
  }, [pem]);

  return (
    <ToolCard title="X.509 Certificate Decoder" description="Decode PEM certificates and CSRs to view CN, SANs, expiry, and issuer">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">PEM Certificate or CSR</label>
          <Textarea value={pem} onChange={(e) => setPem(e.target.value)} placeholder="-----BEGIN CERTIFICATE-----&#10;MIIxxx...&#10;-----END CERTIFICATE-----" className="font-mono min-h-[300px]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Decoded Information</label>
          {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          {info && (
            <div className="p-4 bg-code-bg rounded space-y-3 text-sm">
              <div className="flex items-center gap-2 text-primary">
                {info.type === 'certificate' ? <ShieldCheck className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                <span className="font-semibold">{info.type === 'certificate' ? 'Certificate' : 'Certificate Signing Request'}</span>
              </div>
              <div className="grid gap-2">
                <div><span className="text-muted-foreground">Common Name:</span> <span className="font-mono">{info.commonName}</span></div>
                {info.organization && <div><span className="text-muted-foreground">Organization:</span> {info.organization}</div>}
                {info.country && <div><span className="text-muted-foreground">Country:</span> {info.country}</div>}
                {info.sans && info.sans.length > 0 && (
                  <div><span className="text-muted-foreground">SANs:</span> <span className="font-mono text-xs">{info.sans.join(", ")}</span></div>
                )}
                {info.issuer && <div><span className="text-muted-foreground">Issuer CN:</span> {info.issuer.commonName}</div>}
                {info.publicKeyAlgorithm && <div><span className="text-muted-foreground">Algorithm:</span> {info.publicKeyAlgorithm}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}
