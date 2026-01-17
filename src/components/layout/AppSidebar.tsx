import { useState } from "react";
import { Home, Search, Music, CheckCircle, BarChart3, Target, BookOpen, Users, Settings, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const mainNavItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Browse Songs", url: "/browse", icon: Search },
  { title: "Now Learning", url: "/learning", icon: Music },
  { title: "Completed", url: "/completed", icon: CheckCircle },
  { title: "My Progress", url: "/progress", icon: BarChart3 },
  { title: "Challenges", url: "/challenges", icon: Target },
];

const secondaryNavItems = [
  { title: "Vocabulary", url: "/vocabulary", icon: BookOpen },
  { title: "Friends", url: "/friends", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { progress } = useUser();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden md:flex flex-col bg-card border-r border-border h-screen sticky top-0"
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Music className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">LyricLab</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Streak Badge */}
      <div className="p-3">
        <div className={cn(
          "rounded-xl gradient-accent p-3 flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="relative">
            <Flame className="w-6 h-6 text-accent-foreground animate-streak-fire" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm font-semibold text-accent-foreground">{progress.currentStreak} Day Streak</p>
                <p className="text-xs text-accent-foreground/80">Keep it going!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "hover:bg-muted",
              isActive(item.url) 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:text-foreground",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}

        <div className="pt-4 pb-2">
          {!collapsed && (
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              More
            </p>
          )}
        </div>

        {secondaryNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "hover:bg-muted",
              isActive(item.url) 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:text-foreground",
              collapsed && "justify-center"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.title}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User Progress Mini */}
      <div className="p-3 border-t border-border">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold">
            {progress.level}
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="font-medium text-sm text-foreground">Level {progress.level}</p>
                <p className="text-xs text-muted-foreground">{progress.totalPoints} XP</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
