import { motion } from "framer-motion";
import { Users, Stethoscope, CalendarCheck, MapPin } from "lucide-react";

const counters = [
  { icon: Users, value: "1,00,000+", label: "Happy Patients", color: "hsl(210 80% 50%)" },
  { icon: Stethoscope, value: "500+", label: "Expert Doctors", color: "hsl(160 45% 48%)" },
  { icon: CalendarCheck, value: "50,000+", label: "Appointments Booked", color: "hsl(280 60% 55%)" },
  { icon: MapPin, value: "25+", label: "Cities Covered", color: "hsl(38 92% 50%)" },
];

const StatsCounterSection = () => {
  return (
    <section className="py-10 sm:py-16 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {counters.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center py-6"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${c.color}15` }}
              >
                <c.icon className="w-7 h-7" style={{ color: c.color }} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounterSection;
