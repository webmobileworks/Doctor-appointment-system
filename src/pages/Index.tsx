import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Heart, Stethoscope, Brain, Eye, Smile, Sparkles, Baby, Bone, ArrowRight, Star, Shield, Clock, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoctorCard from "@/components/doctors/DoctorCard";
import { specialties, doctors } from "@/data/mockData";
import heroImage from "@/assets/hero-doctor.jpg";

const iconMap: Record<string, React.ElementType> = {
  Heart, Smile, Brain, Bone, Baby, Sparkles, Eye, Stethoscope,
};

const stats = [
  { icon: Shield, label: "Verified Doctors", value: "500+" },
  { icon: Clock, label: "Appointments", value: "50K+" },
  { icon: Star, label: "Patient Rating", value: "4.8" },
  { icon: Video, label: "Video Consults", value: "10K+" },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                #1 Doctor Appointment Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Find & Book <span className="text-gradient">Top Doctors</span> Near You
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Book appointments with verified doctors, get online consultations, and manage your health — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
                <Link to="/doctors">
                  <Button className="h-12 px-6 rounded-xl gradient-primary border-0 text-primary-foreground">
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

      {/* Specialties */}
      <section className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Browse by Specialty</h2>
              <p className="text-muted-foreground mt-1">Find the right doctor for your needs</p>
            </div>
            <Link to="/doctors" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {specialties.map((spec, i) => {
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
      <section className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Top Rated Doctors</h2>
              <p className="text-muted-foreground mt-1">Trusted by thousands of patients</p>
            </div>
            <Link to="/doctors" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.slice(0, 3).map((doctor, i) => (
              <DoctorCard key={doctor.id} doctor={doctor} index={i} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl gradient-primary p-8 md:p-14 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">Are you a Doctor?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">Join our platform and reach thousands of patients. Manage appointments, consultations, and prescriptions — all in one place.</p>
          <Link to="/doctor-dashboard">
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
