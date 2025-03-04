
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Import EHR components
import PatientDashboard from "./components/ehr/dashboard/PatientDashboard";
import ProviderDashboard from "./components/ehr/dashboard/ProviderDashboard";
import MainLayout from "./components/ehr/layout/MainLayout";
import MedicalRecords from "./components/ehr/records/MedicalRecords";
import LoginPage from "./components/ehr/auth/LoginPage";

// Import the EhrAuthProvider
import { EhrAuthProvider } from "./contexts/EhrAuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <EhrAuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* EHR Routes */}
            <Route path="/ehr/login" element={<LoginPage />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/provider-dashboard" element={<ProviderDashboard />} />
              <Route path="/medical-records/:patientId?" element={<MedicalRecords />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </EhrAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
