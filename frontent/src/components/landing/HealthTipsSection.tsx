import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    title: "10 Tips for a Healthy Heart",
    category: "Cardiology",
    readTime: "5 min read",
    excerpt: "Simple lifestyle changes that can significantly reduce your risk of heart disease and keep your heart healthy.",
    color: "hsl(0 72% 55%)",
  },
  {
    title: "Managing Stress in Daily Life",
    category: "Mental Health",
    readTime: "4 min read",
    excerpt: "Practical techniques to manage stress effectively and improve your overall mental well-being.",
    color: "hsl(280 60% 55%)",
  },
  {
    title: "Importance of Regular Check-ups",
    category: "General Health",
    readTime: "3 min read",
    excerpt: "Why annual health check-ups are crucial for early detection and prevention of diseases.",
    color: "hsl(160 45% 48%)",
  },
  {
    title: "Nutrition for Strong Immunity",
    category: "Nutrition",
    readTime: "6 min read",
    excerpt: "Foods and nutrients that boost your immune system and help fight infections naturally.",
    color: "hsl(38 92% 50%)",
  },
];

const HealthTipsSection = () => {
  return (
    <section className="container mx-auto px-4 py-12 sm:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Health Blog
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Health Tips & Articles</h2>
            <p className="text-muted-foreground mt-2">Stay informed about your health</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {articles.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card-hover p-5 flex flex-col group cursor-pointer"
            >
              <div
                className="w-full h-2 rounded-full mb-4"
                style={{ background: `linear-gradient(90deg, ${a.color}, ${a.color}80)` }}
              />
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full w-fit mb-3"
                style={{ backgroundColor: `${a.color}15`, color: a.color }}
              >
                {a.category}
              </span>
              <h3 className="font-semibold text-foreground text-sm sm:text-base mb-2 group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{a.excerpt}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {a.readTime}
                </span>
                <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read More <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HealthTipsSection;
