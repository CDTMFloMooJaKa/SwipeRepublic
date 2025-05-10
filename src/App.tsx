
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/Portfolio";
import Cash from "./pages/Cash";
import { WatchlistProvider } from "./contexts/WatchlistContext";
import PhoneFrame from "./components/PhoneFrame";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WatchlistProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PhoneFrame>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/cash" element={<Cash />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PhoneFrame>
        </BrowserRouter>
      </WatchlistProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
