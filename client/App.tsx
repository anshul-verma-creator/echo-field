import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import { StoreProvider } from "./state/store";
import Profile from "./pages/Profile";
import Add from "./pages/Add";
import Input from "./pages/Input";
import FixedExpenses from "./pages/FixedExpenses";
import History from "./pages/History";
import Charts from "./pages/Charts";
import Menu from "./pages/Menu";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StoreProvider>
        <BrowserRouter>
          <Header />
          <main className="mx-auto max-w-3xl px-4 pb-24 pt-4">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/add" element={<Add />} />
              <Route path="/input" element={<Input />} />
              <Route path="/fixed-expenses" element={<FixedExpenses />} />
              <Route path="/history" element={<History />} />
              <Route path="/stats" element={<Charts />} />
              <Route path="/notes" element={<History />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/settings" element={<Profile />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
