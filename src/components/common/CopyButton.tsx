import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface CopyButtonProps {
  text: string;
  successMessage?: string;
}

export function CopyButton({ text, successMessage }: CopyButtonProps) {
  const { copied, copyToClipboard } = useCopyToClipboard();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(text, successMessage)}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy
        </>
      )}
    </Button>
  );
}
