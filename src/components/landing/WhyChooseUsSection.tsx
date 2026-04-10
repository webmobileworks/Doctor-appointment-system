import { motion } from "framer-motion";
import { Shield, Clock, Video, CreditCard, Bell, HeartPulse } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Verified Doctors",
    description: "All doctors are verified with valid medical licenses and credentials",
    color: "hsl(210 80% 50%)",
  },
  {
    icon: Clock,
    title: "Instant Booking",
    description: "Book appointments in seconds with real-time availability",
    color: "hsl(160 45% 48%)",
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Consult doctors from home via HD video calls",
    color: "hsl(280 60% 55%)",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "100% secure payment gateway with multiple payment options",
    color: "hsl(38 92% 50%)",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss an appointment with automated notifications",
    color: "hsl(330 60% 55%)",
  },
  {
    icon: HeartPulse,
    title: "Health Records",
    description: "Access your complete medical history and prescriptions anytime",
    color: "hsl(0 72% 55%)",
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why MediBook
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Why Choose Us</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">Everything you need for your healthcare journey</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover p-5 sm:p-6 text-center sm:text-left"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 mx-auto sm:mx-0"
                style={{ backgroundColor: `${f.color}15` }}
              >
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">{f.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default WhyChooseUsSection;
