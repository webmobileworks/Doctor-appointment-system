import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Shield, Clock, Star, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-doctor.jpg";

const stats = [
  { icon: Shield, label: "Verified Doctors", value: "500+" },
  { icon: Clock, label: "Appointments", value: "50K+" },
  { icon: Star, label: "Patient Rating", value: "4.8" },
  { icon: Video, label: "Video Consults", value: "10K+" },
];

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container mx-auto px-4 py-10 sm:py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              #1 Doctor Appointment Platform
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
              Find & Book <span className="text-gradient">Top Doctors</span> Near You
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-lg">
              Book appointments with verified doctors, get online consultations, and manage your health — all in one place.
            </p>

            <div className="flex flex-col gap-3 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search doctors, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm"
                  />
                </div>
                <div className="relative flex-1 sm:max-w-[200px]">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Location" className="pl-11 h-12 rounded-xl border-border/50 bg-card/80 backdrop-blur-sm" />
                </div>
              </div>
              <Link to="/doctors" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 px-6 rounded-xl gradient-primary border-0 text-primary-foreground">
                  Search
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl gradient-primary opacity-10 blur-2xl" />
              <img src={heroImage} alt="Doctor" className="relative rounded-3xl shadow-card w-full max-w-md mx-auto" width={800} height={1024} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
