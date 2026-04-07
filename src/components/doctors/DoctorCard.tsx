import { Star, MapPin, Clock, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Doctor } from "@/data/mockData";

interface DoctorCardProps {
  doctor: Doctor;
  index?: number;
  layout?: "grid" | "list";
}

const DoctorCard = ({ doctor, index = 0, layout = "grid" }: DoctorCardProps) => {
  const initials = doctor.name.split(" ").slice(1).map(n => n[0]).join("");

  if (layout === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="glass-card-hover p-5"
      >
        <div className="flex flex-col sm:flex-row gap-5">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground">{doctor.name}</h3>
                <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{doctor.experience} yrs</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{doctor.location}</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-warning fill-warning" />{doctor.rating} ({doctor.reviewCount})</span>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <p className="text-lg font-bold text-foreground flex items-center"><IndianRupee className="w-4 h-4" />{doctor.fees}</p>
                <Link to={`/doctor/${doctor.id}`}>
                  <Button size="sm" className="rounded-xl gradient-primary border-0 text-primary-foreground">Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card-hover p-5 flex flex-col"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
          <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
          <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{doctor.experience} yrs</span>
        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{doctor.location}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-warning fill-warning" />
          <span className="text-sm font-semibold">{doctor.rating}</span>
          <span className="text-xs text-muted-foreground">({doctor.reviewCount})</span>
        </div>
        <p className="font-bold text-foreground flex items-center"><IndianRupee className="w-3.5 h-3.5" />{doctor.fees}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
        <span className="text-xs text-success font-medium">Available {doctor.nextAvailable}</span>
        <Link to={`/doctor/${doctor.id}`}>
          <Button size="sm" className="rounded-xl gradient-primary border-0 text-primary-foreground">Book Now</Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
