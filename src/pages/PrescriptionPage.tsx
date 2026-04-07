import { motion } from "framer-motion";
import { FileText, Download, Calendar, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const prescriptions = [
  { id: "1", doctor: "Dr. Sarah Johnson", date: "April 7, 2026", diagnosis: "Migraine", medicines: ["Sumatriptan 50mg", "Paracetamol 500mg", "Domperidone 10mg"] },
  { id: "2", doctor: "Dr. Rajesh Kumar", date: "April 5, 2026", diagnosis: "Lower Back Pain", medicines: ["Ibuprofen 400mg", "Thiocolchicoside 4mg"] },
];

const PrescriptionPage = () => {
  const handleDownload = () => toast.success("Prescription downloaded!");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl flex-1">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>

        <div className="space-y-5">
          {prescriptions.map((rx, i) => (
            <motion.div key={rx.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card-hover p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"><FileText className="w-5 h-5 text-primary-foreground" /></div>
                  <div>
                    <h3 className="font-semibold">{rx.doctor}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{rx.date}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl gap-1.5" onClick={handleDownload}>
                  <Download className="w-3.5 h-3.5" /> PDF
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Diagnosis:</span>
                  <span className="font-medium">{rx.diagnosis}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Medicines:</p>
                  <ul className="space-y-1">
                    {rx.medicines.map((med) => (
                      <li key={med} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {med}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrescriptionPage;
