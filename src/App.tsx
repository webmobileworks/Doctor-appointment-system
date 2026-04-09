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
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/prescriptions" element={<PrescriptionPage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<SuperAdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
