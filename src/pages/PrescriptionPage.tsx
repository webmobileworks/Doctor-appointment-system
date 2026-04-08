import { motion } from "framer-motion";
import { FileText, Download, Calendar, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const PrescriptionPage = () => {
  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => {
      const res = await api.get('/appointments');
      return res.data;
    }
  });

  const handleDownload = (fileUrl: string) => {
    if (!fileUrl) {
      toast.error("Waiting for doctor to upload prescription.");
      return;
    }
    // In a real app, opens the S3 or local file URI
    window.open(`http://localhost:5051${fileUrl}`, "_blank");
    toast.success("Prescription opened!");
  };

  const rxAppointments = appointments.filter((apt: any) => apt.prescriptionFile || apt.status === 'completed' || apt.status === 'confirmed');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl flex-1">
        <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </Link>
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Prescriptions</h1>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl">
             <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>

        <div className="space-y-5">
          {isLoading ? (
             <div className="text-center py-12">
               <div className="w-8 h-8 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-muted-foreground">Loading your records...</p>
             </div>
          ) : rxAppointments.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border border-dashed border-border/50">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No prescriptions available yet.</p>
              <Button onClick={() => window.location.href = '/doctors'} variant="link" className="mt-2 text-primary">Consult a Doctor</Button>
            </div>
          ) : (
            rxAppointments.map((rx: any, i: number) => (
              <motion.div key={rx._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"><FileText className="w-5 h-5 text-primary-foreground" /></div>
                    <div>
                      <h3 className="font-semibold">{rx.doctor?.name || "Unknown Doctor"}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{rx.date} • {rx.time}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant={rx.prescriptionFile ? "default" : "outline"} 
                    className={`rounded-xl gap-1.5 ${rx.prescriptionFile ? "gradient-primary text-primary-foreground hover:opacity-90" : ""}`} 
                    onClick={() => handleDownload(rx.prescriptionFile)}
                  >
                    <Download className="w-3.5 h-3.5" /> {rx.prescriptionFile ? "Download" : "Pending"}
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-muted-foreground font-medium">Reported Symptoms:</span>
                    <span className="font-medium text-foreground">{rx.symptoms || "General Follow-up"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium text-sm block mb-1">Status:</span>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md uppercase tracking-wider ${
                        rx.status === "completed" ? "bg-success/10 text-success border border-success/20" : 
                        rx.status === "confirmed" ? "bg-primary/10 text-primary border border-primary/20" : 
                        "bg-warning/10 text-warning border border-warning/20"
                      }`}>
                        {rx.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrescriptionPage;
