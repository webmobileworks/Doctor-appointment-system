import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Heart, Stethoscope, Brain, Eye, Smile, Sparkles, Baby, Bone, ArrowRight, Star, Shield, Clock, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoctorCard from "@/components/doctors/DoctorCard";
import { specialties as mockSpecialties } from "@/data/mockData";
import heroImage from "@/assets/hero-doctor.jpg";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const iconMap: Record<string, React.ElementType> = {
  Heart, Smile, Brain, Bone, Baby, Sparkles, Eye, Stethoscope,
};

const stats = [
  { icon: Shield, label: "Verified Doctors", value: "500+" },
  { icon: Clock, label: "Appointments", value: "50K+" },
  { icon: Star, label: "Patient Rating", value: "4.8" },
  { icon: Video, label: "Video Consults", value: "10K+" },
];

// Fallback logic for colors and icons
const getSpecTheme = (name: string) => {
  const mock = mockSpecialties.find(s => s.name.toLowerCase() === name.toLowerCase());
  if (mock) return { icon: mock.icon, color: mock.color };
  return { icon: "Stethoscope", color: "#6366F1" }; // Default Indigo
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: topDoctors = [] } = useQuery({
    queryKey: ['top-doctors'],
    queryFn: async () => {
      const res = await api.get('/doctors/top');
      return res.data;
    }
  });

  const { data: apiSpecialties = [] } = useQuery({
    queryKey: ['api-specialties'],
    queryFn: async () => {
      const res = await api.get('/doctors/specialties');
      return res.data;
    }
  });

  // Merge API counts with mock icons/colors
  const displaySpecialties = apiSpecialties.length > 0 ? apiSpecialties.map((s: any) => {
    const theme = getSpecTheme(s.name);
    return { ...s, ...theme };
  }) : mockSpecialties;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
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

      {/* Specialties */}
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Browse by Specialty</h2>
              <p className="text-muted-foreground mt-1">Find the right doctor for your needs</p>
            </div>
            <Link to="/doctors" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {displaySpecialties.map((spec: any, i: number) => {
              const Icon = iconMap[spec.icon] || Stethoscope;
              return (
                <motion.div
                  key={spec.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/doctors?specialty=${spec.name}`}
                    className="glass-card-hover p-5 flex flex-col items-center text-center group"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${spec.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: spec.color }} />
                    </div>
                    <h3 className="font-medium text-sm text-foreground">{spec.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{spec.count} Doctors</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Featured Doctors */}
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Top Rated Doctors</h2>
              <p className="text-muted-foreground mt-1">Trusted by thousands of patients</p>
            </div>
            <Link to="/doctors" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topDoctors.slice(0, 6).map((doctor: any, i: number) => (
              <DoctorCard key={doctor._id} doctor={{
                id: doctor._id,
                name: doctor.name,
                specialty: doctor.doctorDetails?.specialty || "General Medicine",
                experience: doctor.doctorDetails?.experience || 5,
                rating: doctor.doctorDetails?.rating || 0,
                reviewCount: doctor.doctorDetails?.reviewCount || 0,
                fees: doctor.doctorDetails?.fees || 500,
                location: doctor.doctorDetails?.location || "Remote",
                image: doctor.doctorDetails?.image || "",
                qualification: doctor.doctorDetails?.qualification || "MBBS",
                about: doctor.doctorDetails?.about || "",
                languages: doctor.doctorDetails?.languages || ["English"],
                availableSlots: doctor.doctorDetails?.availableSlots || [],
                nextAvailable: doctor.doctorDetails?.nextAvailable || "Today"
              }} index={i} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl sm:rounded-3xl gradient-primary p-6 sm:p-8 md:p-14 text-center"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-3 sm:mb-4">Are you a Doctor?</h2>
          <p className="text-primary-foreground/80 mb-6 sm:mb-8 max-w-lg mx-auto text-sm sm:text-base">Join our platform and reach thousands of patients. Manage appointments, consultations, and prescriptions — all in one place.</p>
          <Link to="/login?role=doctor">
            <Button size="lg" className="rounded-xl bg-card text-foreground hover:bg-card/90 border-0">
              Join as Doctor <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
