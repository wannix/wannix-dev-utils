import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Key,
  Fingerprint,
  FileCode,
  ArrowRightLeft,
  ShieldCheck,
  Clock,
  Zap,
  Lock,
  Terminal,
  FileDiff,
  Calendar,
  Image,
  Search,
  Keyboard
} from "lucide-react";
import { Link } from "react-router-dom";

const utilities = [
  {
    title: "Base64 Encoder/Decoder",
    description: "Encode text to Base64 or decode Base64 back to text. Supports UTF-8 characters.",
    icon: FileText,
    path: "/base64",
    keywords: ["b64", "encoding", "decoding"],
  },
  {
    title: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens. View header, payload, and signature information.",
    icon: Key,
    path: "/jwt",
    keywords: ["token", "auth", "json web token"],
  },
  {
    title: "UUID Generator",
    description: "Generate cryptographically secure UUID v4 identifiers with customizable formatting.",
    icon: Fingerprint,
    path: "/uuid",
    keywords: ["guid", "identifier", "unique"],
  },
  {
    title: "Spring YAML Converter",
    description: "Convert Spring Boot properties files to YAML format and vice versa.",
    icon: FileCode,
    path: "/spring-yaml",
    keywords: ["java", "properties", "config"],
  },
  {
    title: "JSON <> YAML Converter",
    description: "Convert between JSON and YAML formats with real-time validation and preview.",
    icon: ArrowRightLeft,
    path: "/json-yaml",
    keywords: ["parser", "transformer", "format"],
  },
  {
    title: "Certificate Decoder",
    description: "Decode and inspect X.509 certificates to view details like expiration, issuer, and subject.",
    icon: ShieldCheck,
    path: "/certificate",
    keywords: ["ssl", "tls", "pem", "crt"],
  },
  {
    title: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates. Supports various formats.",
    icon: Clock,
    path: "/timestamp",
    keywords: ["epoch", "time", "date", "iso"],
  },
  {
    title: "ID Generator",
    description: "Generate various types of unique identifiers including NanoID, CUID, and more.",
    icon: Zap,
    path: "/id-generator",
    keywords: ["unique", "random", "string"],
  },
  {
    title: "Hash Generator",
    description: "Generate cryptographic hashes (MD5, SHA-1, SHA-256, etc.) from text input.",
    icon: Lock,
    path: "/hash",
    keywords: ["crypto", "encryption", "digest"],
  },
  {
    title: "cURL Builder",
    description: "Build and format cURL commands for API testing. Specify headers and methods.",
    icon: Terminal,
    path: "/curl",
    keywords: ["api", "request", "http"],
  },
  {
    title: "Text Diff Checker",
    description: "Compare two text inputs and highlight the differences line by line.",
    icon: FileDiff,
    path: "/diff",
    keywords: ["comparison", "changes", "merge"],
  },
  {
    title: "Cron Expression Tester",
    description: "Test and understand Cron expressions with human-readable explanations and next run dates.",
    icon: Calendar,
    path: "/cron",
    keywords: ["schedule", "job", "timer"],
  },
  {
    title: "SVG Optimizer",
    description: "Optimize SVG files to reduce size without losing quality. Copy the result instantly.",
    icon: Image,
    path: "/svg",
    keywords: ["vector", "graphics", "minify"],
  },
  {
    title: "Regex Tester",
    description: "Test regular expressions against text. Real-time highlighting and match groups.",
    icon: Search,
    path: "/regex",
    keywords: ["pattern", "match", "regexp"],
  },
  {
    title: "Keycode Info",
    description: "Get JavaScript event key codes, codes, and location information on key press.",
    icon: Keyboard,
    path: "/keycode",
    keywords: ["event", "press", "input"],
  },
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUtilities = utilities.filter((utility) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      utility.title.toLowerCase().includes(searchLower) ||
      utility.description.toLowerCase().includes(searchLower) ||
      utility.keywords?.some((k) => k.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent sm:text-6xl">
          Developer Utilities Hub
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          A suite of essential tools for your daily development workflow. <br className="hidden sm:inline" />
          All processing happens locally in your browser for maximum implementation security.
        </p>

        <div className="relative max-w-md mx-auto mt-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search tools (e.g., 'json', 'jwt', 'hash')..."
            className="pl-10 h-12 text-lg shadow-sm border-muted-foreground/20 focus-visible:ring-primary/30 focus-visible:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredUtilities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredUtilities.map((utility, index) => (
            <Link
              key={utility.path}
              to={utility.path}
              className="block h-full"
            >
              <Card
                className="h-full hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-muted-foreground/10 bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <utility.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {utility.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {utility.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 opacity-20" />
          </div>
          <p className="text-xl font-medium">No tools found matching "{searchTerm}"</p>
          <p className="mt-2">Try searching for something else like "encode" or "generator".</p>
        </div>
      )}

      <div className="border-t border-border/40 pt-12 mt-16 text-center text-sm text-muted-foreground">
        <h3 className="text-lg font-semibold text-foreground mb-6">Why use DevUtils Hub?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="space-y-2">
            <div className="font-medium text-primary flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Secure
            </div>
            <p>100% Client-side processing. Data never leaves your device.</p>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-primary flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Fast
            </div>
            <p>Instant results with no server latency or loading times.</p>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-primary flex items-center justify-center gap-2">
              <Fingerprint className="h-4 w-4" />
              Private
            </div>
            <p>No tracking, no analytics, no login required.</p>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-primary flex items-center justify-center gap-2">
              <Terminal className="h-4 w-4" />
              Offline
            </div>
            <p>Works perfectly offline. Installable as PWA.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
