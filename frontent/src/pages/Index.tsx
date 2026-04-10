import { motion } from "framer-motion";
import { Heart, Stethoscope, Brain, Eye, Smile, Sparkles, Baby, Bone, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DoctorCard from "@/components/doctors/DoctorCard";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import HealthTipsSection from "@/components/landing/HealthTipsSection";
import AppDownloadSection from "@/components/landing/AppDownloadSection";
import StatsCounterSection from "@/components/landing/StatsCounterSection";
import { specialties as mockSpecialties } from "@/data/mockData";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  Heart, Smile, Brain, Bone, Baby, Sparkles, Eye, Stethoscope,
};

const getSpecTheme = (name: string) => {
  const mock = mockSpecialties.find(s => s.name.toLowerCase() === name.toLowerCase());
  if (mock) return { icon: mock.icon, color: mock.color };
  return { icon: "Stethoscope", color: "#6366F1" };
};

const Index = () => {
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

  const displaySpecialties = apiSpecialties.length > 0 ? apiSpecialties.map((s: any) => {
    const theme = getSpecTheme(s.name);
    return { ...s, ...theme };
  }) : mockSpecialties;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <HeroSection />

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

      <HowItWorksSection />

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

      <WhyChooseUsSection />
      <TestimonialsSection />
      <HealthTipsSection />

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
