import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DoctorListing from "./pages/DoctorListing";
import DoctorProfile from "./pages/DoctorProfile";
import LoginPage from "./pages/LoginPage";
import BookingPage from "./pages/BookingPage";
import ConsultationPage from "./pages/ConsultationPage";
import PaymentPage from "./pages/PaymentPage";
import PrescriptionPage from "./pages/PrescriptionPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import ProfilePage from "./pages/ProfilePage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ProtectedRoute from "./components/shared/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/doctors" element={<DoctorListing />} />
          <Route path="/doctor/:id" element={<DoctorProfile />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/consultation" element={<ProtectedRoute><ConsultationPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* Doctor Only Routes */}
          <Route path="/doctor-dashboard" element={<ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute requiredRole="doctor"><PrescriptionPage /></ProtectedRoute>} />
          
          {/* Admin Only Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><SuperAdminDashboard /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
