import { motion } from "framer-motion";
import { Search, Calendar, FileText } from "lucide-react";

interface EmptyStateProps {
  icon?: "search" | "calendar" | "file";
  title: string;
  description: string;
  action?: React.ReactNode;
}

const icons = {
  search: Search,
  calendar: Calendar,
  file: FileText,
};

const EmptyState = ({ icon = "search", title, description, action }: EmptyStateProps) => {
  const Icon = icons[icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 opacity-20">
        <Icon className="w-10 h-10 text-primary-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
};

export default EmptyState;
