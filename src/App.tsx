
import { Toaster } from "@/components/ui/toaster";
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
import AppointmentsPage from "./components/ehr/appointments/AppointmentsPage";
import PatientSearchPage from "./components/ehr/search/PatientSearchPage";
import ProvidersPage from "./components/ehr/providers/ProvidersPage";
import PatientsPage from "./components/ehr/patients/PatientsPage";
import AccessManagementPage from "./components/ehr/access/AccessManagementPage";
import UploadDataPage from "./components/ehr/upload/UploadDataPage";
import AuditLogPage from "./components/ehr/audit/AuditLogPage";
import AnalyticsPage from "./components/ehr/analytics/AnalyticsPage";
import SettingsPage from "./components/ehr/settings/SettingsPage";
import SecurityPage from "./components/ehr/security/SecurityPage";
import SupportPage from "./components/ehr/support/SupportPage";

// Import the EhrAuthProvider
import { EhrAuthProvider } from "./contexts/EhrAuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <EhrAuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* EHR Routes */}
            <Route path="/ehr/login" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={<MainLayout />}>
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/provider-dashboard" element={<ProviderDashboard />} />
              <Route path="/medical-records/:patientId?" element={<MedicalRecords />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/patient-search" element={<PatientSearchPage />} />
              <Route path="/providers" element={<ProvidersPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/access" element={<AccessManagementPage />} />
              <Route path="/upload" element={<UploadDataPage />} />
              <Route path="/audit" element={<AuditLogPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/support" element={<SupportPage />} />
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
