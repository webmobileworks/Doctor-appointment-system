import { motion } from "framer-motion";
import { Star, MapPin, Clock, Languages, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DoctorProfileHeaderProps {
  doctor: any;
  backendUrl: string;
}

const DoctorProfileHeader = ({ doctor, backendUrl }: DoctorProfileHeaderProps) => {
  const initials = doctor.name
    .split(" ")
    .filter((n: string) => n !== "Dr." && n !== "Dr")
    .map((n: string) => n[0])
    .join("") || "DR";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 sm:p-8 relative overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 relative z-10">
        {/* Avatar */}
        <div className="relative mx-auto sm:mx-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-primary/10 shadow-lg">
            {doctor.image ? (
              <img
                src={`${backendUrl}${doctor.image}`}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-3xl">
                {initials}
              </div>
            )}
          </div>
          {/* Online badge */}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success border-4 border-card" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{doctor.name}</h1>
            <Badge variant="secondary" className="w-fit mx-auto sm:mx-0 gap-1 text-xs">
              <Shield className="w-3 h-3" /> Verified
            </Badge>
          </div>
          <p className="text-primary font-semibold text-lg">{doctor.specialty}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{doctor.qualification}</p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-5 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-primary" />
              {doctor.experience} yrs
            </span>
            <span className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {doctor.location || "Unknown"}
            </span>
            <span className="flex items-center gap-1.5 bg-warning/10 px-3 py-1.5 rounded-full text-warning">
              <Star className="w-3.5 h-3.5 fill-warning" />
              {doctor.rating} ({doctor.reviewCount})
            </span>
            {doctor.languages?.length > 0 && (
              <span className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full">
                <Languages className="w-3.5 h-3.5 text-primary" />
                {doctor.languages.join(", ")}
              </span>
            )}
          </div>

          {/* Quick highlights */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
            <Badge variant="outline" className="gap-1 text-xs font-normal border-success/30 text-success">
              <Award className="w-3 h-3" /> Top Rated
            </Badge>
            <Badge variant="outline" className="text-xs font-normal">
              ₹{doctor.fees} Consultation
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorProfileHeader;
