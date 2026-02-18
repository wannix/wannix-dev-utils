import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string, successMessage = "Copied to clipboard") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Success",
        description: successMessage,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return { copied, copyToClipboard };
}
