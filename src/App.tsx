import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import Base64Page from "./pages/Base64Page";
import JWTPage from "./pages/JWTPage";
import UUIDPage from "./pages/UUIDPage";
import SpringYamlPage from "./pages/SpringYamlPage";
import JsonYamlPage from "./pages/JsonYamlPage";
import CertificatePage from "./pages/CertificatePage";
import TimestampPage from "./pages/TimestampPage";
import IdGeneratorPage from "./pages/IdGeneratorPage";
import HashPage from "./pages/HashPage";
import CurlPage from "./pages/CurlPage";
import DiffPage from "./pages/DiffPage";
import CronPage from "./pages/CronPage";
import SvgPage from "./pages/SvgPage";
import RegexPage from "./pages/RegexPage";
import KeycodePage from "./pages/KeycodePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/base64" element={<Base64Page />} />
              <Route path="/jwt" element={<JWTPage />} />
              <Route path="/uuid" element={<UUIDPage />} />
              <Route path="/spring-yaml" element={<SpringYamlPage />} />
              <Route path="/json-yaml" element={<JsonYamlPage />} />
              <Route path="/certificate" element={<CertificatePage />} />
              <Route path="/timestamp" element={<TimestampPage />} />
              <Route path="/id-generator" element={<IdGeneratorPage />} />
              <Route path="/hash" element={<HashPage />} />
              <Route path="/curl" element={<CurlPage />} />
              <Route path="/diff" element={<DiffPage />} />
              <Route path="/cron" element={<CronPage />} />
              <Route path="/svg" element={<SvgPage />} />
              <Route path="/regex" element={<RegexPage />} />
              <Route path="/keycode" element={<KeycodePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
