import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "primary" | "accent" | "success" | "default";
  index?: number;
}

const variantStyles = {
  primary: "gradient-primary text-primary-foreground",
  accent: "gradient-accent text-accent-foreground",
  success: "gradient-success text-success-foreground",
  default: "bg-card border border-border",
};

const iconBgStyles = {
  primary: "bg-white/20",
  accent: "bg-white/20",
  success: "bg-white/20",
  default: "bg-primary/10",
};

const textStyles = {
  primary: "text-primary-foreground",
  accent: "text-accent-foreground",
  success: "text-success-foreground",
  default: "text-foreground",
};

const subtitleStyles = {
  primary: "text-primary-foreground/80",
  accent: "text-accent-foreground/80",
  success: "text-success-foreground/80",
  default: "text-muted-foreground",
};

export function ProgressCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = "default",
  index = 0 
}: ProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "rounded-xl p-5 shadow-card",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn("text-sm font-medium", subtitleStyles[variant])}>
            {title}
          </p>
          <p className={cn("text-3xl font-bold", textStyles[variant])}>
            {value}
          </p>
          {subtitle && (
            <p className={cn("text-sm", subtitleStyles[variant])}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconBgStyles[variant]
        )}>
          <Icon className={cn("w-6 h-6", variant === "default" ? "text-primary" : "")} />
        </div>
      </div>
    </motion.div>
  );
}
