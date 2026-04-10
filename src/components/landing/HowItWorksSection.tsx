import { motion } from "framer-motion";
import { Search, CalendarCheck, Video, FileText } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Doctor",
    description: "Browse through our verified doctors by specialty, location, or name",
    color: "hsl(210 80% 50%)",
  },
  {
    icon: CalendarCheck,
    title: "Book Appointment",
    description: "Choose a convenient time slot and book your appointment instantly",
    color: "hsl(160 45% 48%)",
  },
  {
    icon: Video,
    title: "Consult Online",
    description: "Connect with your doctor via video call from the comfort of home",
    color: "hsl(280 60% 55%)",
  },
  {
    icon: FileText,
    title: "Get Prescription",
    description: "Receive digital prescriptions and follow-up care instructions",
    color: "hsl(38 92% 50%)",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="text-center mb-10 sm:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">Get started in 4 easy steps</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 bg-border" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: step.color }} />
              </div>
              <span className="inline-block w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold leading-7 mb-3">
                {i + 1}
              </span>
              <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">{step.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;
