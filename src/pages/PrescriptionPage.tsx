import { motion } from "framer-motion";
import { FileText, Download, Calendar, ArrowLeft, RefreshCw, Pill, Stethoscope, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const PrescriptionPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
    window.open(`http://localhost:5050${fileUrl}`, "_blank");
    toast.success("Prescription opened!");
  };

  const rxAppointments = appointments
    .filter((apt: any) => apt.prescriptionFile || apt.status === 'completed' || apt.status === 'confirmed')
    .filter((apt: any) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (apt.doctor?.name || "").toLowerCase().includes(q) || (apt.diagnosis || "").toLowerCase().includes(q);
    });

  const stats = [
    { icon: FileText, label: "Total", value: rxAppointments.length, color: "text-primary bg-primary/10" },
    { icon: Pill, label: "With Prescription", value: rxAppointments.filter((a: any) => a.prescriptionFile).length, color: "text-success bg-success/10" },
    { icon: Clock, label: "Awaiting", value: rxAppointments.filter((a: any) => !a.prescriptionFile).length, color: "text-warning bg-warning/10" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-3xl flex-1">
        <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Profile
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              My Prescriptions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">View and download your medical prescriptions</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl self-start">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 text-center"
            >
              <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by doctor or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl h-11 bg-card/80"
          />
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Loading your records...</p>
            </div>
          ) : rxAppointments.length === 0 ? (
            <div className="text-center py-16 glass-card">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="font-medium text-foreground mb-1">No prescriptions yet</p>
              <p className="text-sm text-muted-foreground mb-4">Your prescriptions will appear here after consultations</p>
              <Button onClick={() => window.location.href = '/doctors'} className="rounded-xl gradient-primary border-0 text-primary-foreground">
                Find a Doctor
              </Button>
            </div>
          ) : (
            rxAppointments.map((rx: any, i: number) => (
              <motion.div
                key={rx._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {(rx.doctor?.name || "D")[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{rx.doctor?.name || "Unknown Doctor"}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {rx.date} • {rx.time}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={rx.prescriptionFile ? "default" : "outline"}
                    className={`rounded-xl gap-1.5 text-xs ${rx.prescriptionFile ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-sm" : ""}`}
                    onClick={() => handleDownload(rx.prescriptionFile)}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{rx.prescriptionFile ? "Download" : "Awaiting"}</span>
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-muted/20 border border-border/30 space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground font-medium">Diagnosis & Notes</span>
                    <p className="text-sm font-medium text-foreground mt-0.5 whitespace-pre-wrap">
                      {rx.diagnosis || rx.symptoms || "General Follow-up"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase tracking-wider font-semibold ${
                        rx.status === "completed" ? "border-success/30 text-success bg-success/5" :
                        rx.status === "confirmed" ? "border-primary/30 text-primary bg-primary/5" :
                        "border-warning/30 text-warning bg-warning/5"
                      }`}
                    >
                      {rx.status}
                    </Badge>
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
