import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { StrideProvider } from "@/contexts/StrideContext";

// STRIDE Redesign Pages
import { StrideConductorApp } from "./pages/StrideConductorApp";
import { UsabilityLabPage } from "./pages/UsabilityLab";
import { StrideCaseStudyPage } from "./pages/StrideCaseStudy";
import { PresentationDeckPage } from "./pages/PresentationDeck";

// Existing Aadhaar VC System Pages (Preserved)
import Index from "./pages/Index";
import ConductorLogin from "./pages/ConductorLogin";
import ConductorDashboard from "./pages/ConductorDashboard";
import PassengerVerification from "./pages/PassengerVerification";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <StrideProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* STRIDE Nielsen Conductor Experience */}
              <Route path="/" element={<StrideConductorApp />} />
              <Route path="/usability-lab" element={<UsabilityLabPage />} />
              <Route path="/case-study" element={<StrideCaseStudyPage />} />
              <Route path="/presentation" element={<PresentationDeckPage />} />

              {/* Preserved Legacy Aadhaar VC Verification Flow */}
              <Route path="/aadhaar-portal" element={<Index />} />
              <Route path="/conductor" element={<ConductorLogin />} />
              <Route path="/conductor/dashboard" element={<ConductorDashboard />} />
              <Route path="/verify/:tripId" element={<PassengerVerification />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </StrideProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
