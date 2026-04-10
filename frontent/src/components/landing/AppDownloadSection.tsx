import { motion } from "framer-motion";
import { Smartphone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  "Book appointments on the go",
  "Video consultations from anywhere",
  "Digital prescriptions & health records",
  "Instant notifications & reminders",
];

const AppDownloadSection = () => {
  return (
    <section className="py-12 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl sm:rounded-3xl glass-card p-6 sm:p-10 md:p-14"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Coming Soon
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                Download the <span className="text-gradient">MediBook</span> App
              </h2>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                Get the full MediBook experience on your smartphone. Available soon on iOS and Android.
              </p>
              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="rounded-xl gradient-primary border-0 text-primary-foreground h-12 px-6">
                  <Smartphone className="w-4 h-4 mr-2" /> Get Early Access
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] rounded-[3rem] border-4 border-border bg-card shadow-xl flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                      <img src="/logo.png" alt="MediBook" className="w-12 h-12 rounded-xl" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg mb-1">MediBook</h3>
                    <p className="text-xs text-muted-foreground">Your Health, Our Priority</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl gradient-primary opacity-20 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl gradient-secondary opacity-20 blur-xl" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AppDownloadSection;
