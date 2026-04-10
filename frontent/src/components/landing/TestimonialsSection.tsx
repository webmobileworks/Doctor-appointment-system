import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ankit Mehta",
    location: "Mumbai",
    rating: 5,
    comment: "MediBook made finding a cardiologist so easy! Booked an appointment in minutes and the video consultation was seamless.",
    avatar: "AM",
    doctor: "Dr. Sarah Johnson",
  },
  {
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    comment: "Best healthcare platform I've used. The doctors are verified and truly professional. Highly recommend for everyone!",
    avatar: "PS",
    doctor: "Dr. Rajesh Kumar",
  },
  {
    name: "Rahul Verma",
    location: "Bangalore",
    rating: 5,
    comment: "Got an appointment with a top dermatologist within hours. The prescription was sent digitally — so convenient!",
    avatar: "RV",
    doctor: "Dr. Priya Sharma",
  },
  {
    name: "Sneha Patel",
    location: "Hyderabad",
    rating: 4,
    comment: "My kids love visiting Dr. Meera! Booking through MediBook saves so much time compared to calling clinics.",
    avatar: "SP",
    doctor: "Dr. Meera Reddy",
  },
  {
    name: "Vikram Singh",
    location: "Chennai",
    rating: 5,
    comment: "Video consultation feature is a game changer. I consulted a neurologist from home during lockdown. Excellent service!",
    avatar: "VS",
    doctor: "Dr. Amit Patel",
  },
  {
    name: "Kavita Joshi",
    location: "Pune",
    rating: 5,
    comment: "From booking to prescription, everything is digital and smooth. The reminders before appointments are super helpful.",
    avatar: "KJ",
    doctor: "Dr. Arjun Singh",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Patient Stories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">What Our Patients Say</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">Real experiences from real patients</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 sm:p-6 flex flex-col"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={`w-3.5 h-3.5 ${si < t.rating ? "text-warning fill-warning" : "text-border"}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location} • Patient of {t.doctor}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
