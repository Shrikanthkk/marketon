import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function MagneticLink({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isDeveloper = label === "Developer" || label === "Developers";
  const isResources = label === "Resources";
  const targetHref = isDeveloper
    ? "/developer"
    : isResources
    ? "/resources"
    : pathname === "/"
    ? `#${label.toLowerCase()}`
    : `/#${label.toLowerCase()}`;

  return (
    <motion.a
      ref={ref}
      href={targetHref}
      onClick={onClick}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`relative py-1 text-[13px] font-semibold tracking-wider transition-colors uppercase ${
        isActive
          ? "text-mk-orange font-bold drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]"
          : "text-mk-body hover:text-mk-navy"
      }`}
    >
      <span>{label}</span>
      {isActive && (
        <motion.span
          layoutId="nav-active-indicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-mk-orange shadow-[0_0_10px_rgba(168,85,247,0.8)]"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </motion.a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isGalaxy, theme } = useTheme();
  const isBrownGold = theme === "brown-gold";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 30);
    onS();
    window.addEventListener("scroll", onS);
    return () => window.removeEventListener("scroll", onS);
  }, []);

  const links = ["Platform", "Developer", "Resources", "Company"];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_EXPO }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1100px,calc(100%-2rem))]"
    >
      <motion.div
        animate={{
          paddingTop: scrolled ? 8 : 12,
          paddingBottom: scrolled ? 8 : 12,
          backgroundColor: isBrownGold
            ? scrolled
              ? "rgba(43, 22, 13, 0.95)"
              : "rgba(43, 22, 13, 0.85)"
            : isGalaxy
            ? scrolled
              ? "rgba(5, 5, 8, 0.92)"
              : "rgba(5, 5, 8, 0.78)"
            : scrolled
            ? "rgba(255,255,255,0.95)"
            : "rgba(255,255,255,0.75)",
          borderColor: isBrownGold
            ? "rgba(212, 175, 55, 0.45)"
            : isGalaxy
            ? "rgba(255,255,255,0.12)"
            : "var(--mk-border)",
          boxShadow: isBrownGold
            ? scrolled
              ? "0 8px 32px rgba(43, 22, 13, 0.7), 0 0 15px rgba(212, 175, 55, 0.15)"
              : "0 4px 24px rgba(43, 22, 13, 0.5)"
            : isGalaxy
            ? scrolled
              ? "0 8px 32px rgba(0,0,0,0.6), 0 0 15px rgba(255,255,255,0.03)"
              : "0 4px 24px rgba(0,0,0,0.4)"
            : scrolled
            ? "0 8px 32px rgba(27,43,75,0.12)"
            : "0 4px 24px rgba(0,0,0,0.05)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex items-center justify-between rounded-full border border-mk-border px-5 backdrop-blur-xl"
      >
        <Link
          to="/"
          className="text-[20px] font-extrabold text-mk-navy tracking-tight hover:opacity-90 transition-opacity"
        >
          marketon
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {links.map((l) => {
            const isDeveloper = (l === "Developer" || l === "Developers") && pathname === "/developer";
            const isResources = l === "Resources" && pathname === "/resources";
            const isActive = isDeveloper || isResources;
            return <MagneticLink key={l} label={l} isActive={isActive} />;
          })}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-mk-navy text-white text-[13px] font-semibold hover:scale-[1.03] transition cursor-pointer"
          >
            Log in
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-white border border-mk-navy text-mk-navy text-[13px] font-semibold hover:bg-mk-navy hover:text-white transition cursor-pointer"
          >
            Contact Us
          </button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="p-2 text-mk-navy"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <motion.div animate={{ rotate: open ? 90 : 0 }}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
          </button>
        </div>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`md:hidden mt-2 rounded-2xl p-5 shadow-xl flex flex-col gap-4 ${
              isBrownGold
                ? "bg-[#2b160d]/95 border border-[rgba(212,175,55,0.45)] text-[#fff8e7] backdrop-blur-2xl shadow-[0_12px_32px_rgba(43,22,13,0.8)]"
                : isGalaxy
                ? "bg-[#0a0d16]/95 border border-white/12 text-white backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
                : "bg-white border border-mk-border"
            }`}
          >
            {links.map((l) => {
              const isDeveloper = l === "Developer" || l === "Developers";
              const isResources = l === "Resources";
              const targetHref = isDeveloper
                ? "/developer"
                : isResources
                ? "/resources"
                : pathname === "/"
                ? `#${l.toLowerCase()}`
                : `/#${l.toLowerCase()}`;
              const isActive =
                (isDeveloper && pathname === "/developer") ||
                (isResources && pathname === "/resources");
              return (
                <a
                  key={l}
                  href={targetHref}
                  onClick={() => setOpen(false)}
                  className={`font-semibold uppercase text-sm tracking-wider flex items-center justify-between ${
                    isActive ? "text-mk-orange font-bold" : "text-mk-navy"
                  }`}
                >
                  <span>{l}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-mk-orange shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  )}
                </a>
              );
            })}
            <div className="flex items-center justify-between py-2 border-t border-b border-mk-border/50 my-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-mk-muted">
                Appearance Theme
              </span>
              <ThemeToggle showLabel />
            </div>
            <button type="button" className="mk-btn-navy justify-center w-full">Log in</button>
            <button type="button" className="mk-btn-outline justify-center w-full">Contact Us</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
