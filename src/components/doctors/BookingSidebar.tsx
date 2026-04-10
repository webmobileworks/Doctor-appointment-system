import { motion } from "framer-motion";
import { Video, Building, Shield, Clock, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Props {
  doctor: any;
  selectedDate: string | null;
  selectedSlot: string | null;
  user: any;
}

const BookingSidebar = ({ doctor, selectedDate, selectedSlot, user }: Props) => {
  const isReady = selectedDate && selectedSlot;

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-5 sm:p-6 sticky top-24"
      >
        <h3 className="font-semibold mb-5 text-lg">Book Appointment</h3>

        {/* Fee */}
        <div className="flex justify-between items-center mb-4 p-3 rounded-xl bg-success/5 border border-success/10">
          <span className="text-sm text-muted-foreground">Consultation Fee</span>
          <span className="text-xl font-bold text-foreground">₹{doctor.fees}</span>
        </div>

        {/* Selection Summary */}
        <div className="p-4 rounded-2xl bg-muted/30 space-y-3 mb-5">
          <div className="flex items-center gap-3 text-sm">
            <CalendarCheck className={`w-4 h-4 shrink-0 ${selectedDate ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-muted-foreground">Date:</span>
            <span className={`ml-auto font-medium ${selectedDate ? "text-foreground" : "text-muted-foreground"}`}>
              {selectedDate || "Select a date"}
            </span>
          </div>
          <div className="h-px bg-border/50" />
          <div className="flex items-center gap-3 text-sm">
            <Clock className={`w-4 h-4 shrink-0 ${selectedSlot ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-muted-foreground">Time:</span>
            <span className={`ml-auto font-medium ${selectedSlot ? "text-foreground" : "text-muted-foreground"}`}>
              {selectedSlot || "Select a slot"}
            </span>
          </div>
        </div>

        {/* Booking Buttons */}
        <div className="space-y-3">
          <Link
            to={!isReady ? "#" : user ? `/booking/${doctor.id}` : "/login"}
            state={user ? { selectedDate, selectedSlot } : { from: `/booking/${doctor.id}`, selectedDate, selectedSlot }}
          >
            <Button
              className="w-full rounded-xl gradient-primary border-0 text-primary-foreground h-12 text-sm font-semibold shadow-md hover:shadow-lg transition-shadow"
              disabled={!isReady}
            >
              <Building className="w-4 h-4 mr-2" /> Book In-Person Visit
            </Button>
          </Link>
          <Link
            to={!isReady ? "#" : user ? `/consultation` : "/login"}
            state={user ? { doctorId: doctor.id } : { from: "/consultation" }}
          >
            <Button
              variant="outline"
              className="w-full rounded-xl h-12 mt-2 text-sm font-semibold border-primary/30 hover:bg-primary/5 hover:border-primary"
              disabled={!isReady}
            >
              <Video className="w-4 h-4 mr-2" /> Online Consultation
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-5 pt-4 border-t border-border/50 space-y-2">
          {[
            { icon: Shield, text: "Verified & Trusted Doctor" },
            { icon: Clock, text: "Average wait time: 15 min" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <item.icon className="w-3.5 h-3.5 text-success" />
              {item.text}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSidebar;
