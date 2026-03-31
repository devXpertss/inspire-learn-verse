import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { motion } from "framer-motion";
import { BookOpen, Code, Brain, Settings, Menu, X, Mail, Presentation } from "lucide-react";
import { useState } from "react";
import { useSiteContent } from "@/hooks/useFirebase";
import { defaultSiteContent } from "@/lib/defaultSiteContent";

const iconMap = {
  "/": BookOpen,
  "/subjects": BookOpen,
  "/playground": Code,
  "/presentations": Presentation,
  "/quiz": Brain,
  "/contact": Mail,
  "/admin": Settings,
};

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: siteContentData } = useSiteContent();
  const siteContent = siteContentData ?? defaultSiteContent;
  const navItems = siteContent.navigation.items;
  const brand = siteContent.brand;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={brand.logoUrl}
            alt={brand.logoAlt}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-heading text-xl font-bold text-gradient">{brand.name}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = iconMap[item.path as keyof typeof iconMap] ?? BookOpen;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-lg bg-secondary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-lg text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-border"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              (() => {
                const Icon = iconMap[item.path as keyof typeof iconMap] ?? BookOpen;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })()
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
