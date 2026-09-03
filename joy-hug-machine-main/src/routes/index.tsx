import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, Component, type ReactNode, type ErrorInfo } from "react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useTransform,
  useScroll,
  useInView,
  animate,
  MotionConfig,
} from "framer-motion";
import {
  Menu, X, ArrowRight, ChevronDown, Star, MessageCircle, Phone, Mail,
  Instagram, Send, Bell, Calendar as CalendarIcon, Brain, Cpu, Radio,
  PhoneCall, Target, PenTool, Users, Server, TrendingUp, Shield,
  CheckCircle2, Zap, BarChart3, Rocket, GitBranch, Trophy, Database,
  Sparkles, Workflow, Globe, Cloud,
  Twitter, Linkedin, Youtube, Play, Video, ChevronLeft, ChevronRight, Maximize2, Home, RotateCcw, Square, Terminal,
} from "lucide-react";
import { MessageSquare } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaTelegramPlane, FaFacebookMessenger } from "react-icons/fa";
import heroVideo from "@/assets/automation-hero.mp4.asset.json";
import HeroShaderBackground from "@/components/marketon/HeroShaderBackground";
import AIOperationsRoom from "@/components/marketon/AIOperationsRoom";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
} from "recharts";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MARKETON — AI Marketing Automation Platform" },
      { name: "description", content: "Marketing for all, Automated. Built on intelligent automation. Powered by AI decision engines. Delivering lead-to-customer conversion at scale." },
      { property: "og:title", content: "MARKETON — AI Marketing Automation Platform" },
      { property: "og:description", content: "AI-powered lead scoring, omnichannel automation, voice agents, and analytics — all in one platform." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: MarketonPage,
});

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ----------------------------- Primitives ----------------------------- */

function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 15 });
  const gx = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const gy = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [gx, gy] as any,
            ([gxv, gyv]: any) =>
              `radial-gradient(280px circle at ${gxv} ${gyv}, rgba(168,85,247,0.16), rgba(34,211,238,0.08) 45%, transparent 70%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
}

function Reveal({
  children, delay = 0, y = 24, className = "",
}: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 2.2,
      ease: EASE_EXPO,
      onUpdate: (v) => setVal(v),
    });
    return () => c.stop();
  }, [inView, to]);
  const formatted = decimals > 0
    ? val.toFixed(decimals)
    : Math.round(val).toLocaleString("en-IN");
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

/* ---------- Ornamental SVG divider ---------- */
function Divider() {
  return (
    <motion.svg
      width="200" height="14" viewBox="0 0 200 14" fill="none"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE_EXPO }}
      className="mx-auto"
      style={{ originX: 0.5 }}
    >
      <line x1="0" y1="7" x2="85" y2="7" stroke="#1B2B4B" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx="100" cy="7" r="3" fill="#9333EA" />
      <circle cx="100" cy="7" r="6" stroke="#9333EA" strokeOpacity="0.3" />
      <line x1="115" y1="7" x2="200" y2="7" stroke="#1B2B4B" strokeOpacity="0.25" strokeWidth="1" />
    </motion.svg>
  );
}



/* ----------------------------- Hero ----------------------------- */

/* Neural network canvas — particles that connect to each other and react to cursor */
function HeroNeuralCanvas({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number; active: boolean }> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isBrownGold = theme === "brown-gold";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; vx: number; vy: number; r: number; color: string };
    let particles: P[] = [];

    const resize = () => {
      const parent = canvas.parentElement!;
      const rect = parent.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(75, Math.floor((w * h) / 19000));
      particles = Array.from({ length: count }, () => {
        const rType = Math.random();
        let starColor: string;
        if (isBrownGold) {
          // Warm luxury metallic and champagne gold nodes:
          starColor = rType < 0.4 ? "212,175,55" : rType < 0.75 ? "229,193,88" : rType < 0.9 ? "245,224,154" : "255,249,238";
        } else {
          // Exact cosmic jewel star colors:
          starColor = rType < 0.45 ? "34,211,238" : rType < 0.8 ? "192,132,252" : "217,70,239";
        }
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: 0.8 + Math.random() * 1.8,
          color: starColor,
        };
      });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      const m = mouse.current;
      // update
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        if (m.active) {
          const dx = m.x - p.x, dy = m.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 22000) {
            const f = (1 - d2 / 22000) * 0.05;
            p.vx += (dx / Math.sqrt(d2 + 1)) * f;
            p.vy += (dy / Math.sqrt(d2 + 1)) * f;
          }
        }
        // velocity damping
        p.vx *= 0.985; p.vy *= 0.985;
        // gentle drift
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
      }
      // connections
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            const alpha = (1 - d2 / 14000) * 0.18;
            ctx.strokeStyle = `rgba(${a.color},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // dots
      for (const p of particles) {
        ctx.fillStyle = `rgba(${p.color},0.85)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${p.color},0.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [mouse, isBrownGold]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function HeroSignalLine() {
  const { theme, isGalaxy } = useTheme();
  const isBrownGold = theme === "brown-gold";
  const lineColor = isBrownGold ? "#d4af37" : isGalaxy ? "#7c3aed" : "#1B2B4B";
  const scanColor = isBrownGold ? "#e6ca65" : "#9333EA";
  const pulseColor = isBrownGold ? "#d4af37" : "#1B2B4B";

  return (
    <div className="relative mx-auto" style={{ width: 280, height: 22 }}>
      <svg width="280" height="22" viewBox="0 0 280 22" fill="none" className="absolute inset-0">
        <defs>
          <linearGradient id="heroLineGrad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={lineColor} stopOpacity="0" />
            <stop offset="0.5" stopColor={lineColor} stopOpacity="0.45" />
            <stop offset="1" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroScan" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={scanColor} stopOpacity="0" />
            <stop offset="0.5" stopColor={scanColor} stopOpacity="1" />
            <stop offset="1" stopColor={scanColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="11" x2="120" y2="11" stroke="url(#heroLineGrad)" strokeWidth="1" />
        <line x1="160" y1="11" x2="280" y2="11" stroke="url(#heroLineGrad)" strokeWidth="1" />
        {/* scanning beam */}
        <motion.rect
          y="10"
          height="2"
          width="80"
          fill="url(#heroScan)"
          initial={{ x: -80 }}
          animate={{ x: [-80, 280] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* AI waveform tiny pulses */}
        {[0, 1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx={20 + i * 28}
            cy="11"
            r="1"
            fill={pulseColor}
            animate={{ opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </svg>

      {/* AI reactor core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* shockwaves */}
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            className="block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mk-orange/40"
            animate={{ scale: [1, 3], opacity: [0.7, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 1.2 }}
            style={{ width: 14, height: 14 }}
          />
        ))}
        {/* orbiting ring */}
        <motion.span
          className="block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mk-orange/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ width: 22, height: 22 }}
        >
          <span
            className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-mk-orange"
            style={{
              boxShadow: isBrownGold
                ? "0 0 6px rgba(212,175,55,0.9)"
                : "0 0 6px rgba(147,51,234,0.9)",
            }}
          />
        </motion.span>
        <motion.span
          className="block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-mk-orange/25"
          animate={{ rotate: -360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ width: 32, height: 32 }}
        />
        {/* core */}
        <motion.span
          className="block w-[8px] h-[8px] rounded-full bg-mk-orange"
          animate={{
            boxShadow: isBrownGold
              ? [
                  "0 0 0 0 rgba(212,175,55,0.6), 0 0 10px rgba(212,175,55,0.9)",
                  "0 0 0 14px rgba(212,175,55,0), 0 0 20px rgba(212,175,55,0.5)",
                ]
              : [
                  "0 0 0 0 rgba(147,51,234,0.6), 0 0 10px rgba(147,51,234,0.9)",
                  "0 0 0 14px rgba(147,51,234,0), 0 0 20px rgba(147,51,234,0.5)",
                ],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function HeroMagneticButton({
  variant,
  children,
}: {
  variant: "navy" | "outline";
  children: ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const bgGlow = useTransform([gx, gy], ([cx, cy]) =>
    variant === "navy"
      ? `radial-gradient(160px circle at ${cx}% ${cy}%, rgba(192,132,252,0.5), rgba(34,211,238,0.2) 45%, transparent 70%)`
      : `radial-gradient(160px circle at ${cx}% ${cy}%, rgba(168,85,247,0.32), rgba(34,211,238,0.15) 50%, transparent 70%)`,
  );
  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        x.set((px - 0.5) * r.width * 0.35);
        y.set((py - 0.5) * r.height * 0.5);
        gx.set(px * 100);
        gy.set(py * 100);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`relative overflow-hidden group ${variant === "navy" ? "mk-btn-navy" : "mk-btn-outline"}`}
    >
      {/* cursor-tracking glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: bgGlow }}
      />
      {/* moving border energy */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          padding: 1,
          background:
            "conic-gradient(from 0deg, rgba(147,51,234,0) 0deg, rgba(147,51,234,0.9) 90deg, rgba(147,51,234,0) 180deg, rgba(120,150,255,0.7) 270deg, rgba(147,51,234,0) 360deg)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "heroBorderSpin 3s linear infinite",
        }}
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {/* shimmer sweep */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background:
            variant === "navy"
              ? "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)"
              : "linear-gradient(110deg, transparent 30%, rgba(147,51,234,0.22) 50%, transparent 70%)",
          transform: "translateX(-100%)",
          animation: "heroSweep 1.6s ease-in-out infinite",
        }}
      />
    </motion.button>
  );
}

function Hero() {
  const titleLines = ["Marketing for all,", "Automated."];
  const { isGalaxy, theme } = useTheme();
  const isBrownGold = theme === "brown-gold";

  const sectionRef = useRef<HTMLElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  const mx = useSpring(0, { stiffness: 50, damping: 22, mass: 0.8 });
  const my = useSpring(0, { stiffness: 50, damping: 22, mass: 0.8 });

  // Cursor glow follower (raw position, smoothed)
  const cursorX = useSpring(0, { stiffness: 140, damping: 22 });
  const cursorY = useSpring(0, { stiffness: 140, damping: 22 });

  // Multi-layer parallax depth
  const orb1X = useTransform(mx, [-1, 1], [-50, 50]);
  const orb1Y = useTransform(my, [-1, 1], [-35, 35]);
  const orb2X = useTransform(mx, [-1, 1], [40, -40]);
  const orb2Y = useTransform(my, [-1, 1], [25, -25]);
  const orb3X = useTransform(mx, [-1, 1], [-25, 25]);
  const orb3Y = useTransform(my, [-1, 1], [20, -20]);
  const gridX = useTransform(mx, [-1, 1], [14, -14]);
  const gridY = useTransform(my, [-1, 1], [10, -10]);
  const auroraR = useTransform(mx, [-1, 1], [-8, 8]);
  const contentX = useTransform(mx, [-1, 1], [-8, 8]);
  const contentY = useTransform(my, [-1, 1], [-6, 6]);

  // Scroll-based cinematic motion
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.35]);
  const bgY = useTransform(scrollY, [0, 600], [0, 120]);

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={(e) => {
        const r = sectionRef.current!.getBoundingClientRect();
        const lx = e.clientX - r.left;
        const ly = e.clientY - r.top;
        mx.set((lx / r.width - 0.5) * 2);
        my.set((ly / r.height - 0.5) * 2);
        cursorX.set(lx);
        cursorY.set(ly);
        mouse.current.x = lx;
        mouse.current.y = ly;
        mouse.current.active = true;
      }}
      onMouseLeave={() => { mouse.current.active = false; }}
      className={`relative pt-40 pb-32 md:pt-48 md:pb-40 overflow-hidden ${isGalaxy ? "bg-transparent" : ""}`}
    >
      <style>{`
        @keyframes heroSweep { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes heroBorderSpin { to { transform: rotate(360deg); } }
        @keyframes heroDrift1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-40px) scale(1.1)} }
        @keyframes heroDrift2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-60px,30px) scale(1.15)} }
        @keyframes heroDrift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,40px)} }
        @keyframes heroAurora { to { transform: rotate(360deg); } }
        @keyframes heroFog { 0%,100%{transform:translateX(-5%)} 50%{transform:translateX(5%)} }
        @keyframes heroStreak { 0%{transform:translateX(-30%) skewX(-20deg); opacity:0} 20%{opacity:.55} 100%{transform:translateX(130%) skewX(-20deg); opacity:0} }
        @keyframes heroBreathe { 0%,100%{opacity:.85} 50%{opacity:1} }
        @keyframes heroLetterGlow { 0%,100%{text-shadow:0 0 0 rgba(147,51,234,0)} 50%{text-shadow:0 0 22px rgba(147,51,234,0.18)} }
      `}</style>

      {/* ===== ADVANCED MULTI-LAYER BACKGROUND ===== */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ y: bgY }}
      >
        {/* WebGL volumetric shader (deepest layer in Light mode) */}
        {!isGalaxy && <HeroShaderBackground mouseRef={mouse} />}

        {/* slow rotating aurora conic (Light mode only) */}
        {!isGalaxy && (
          <motion.div
            style={{ rotate: auroraR }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%]"
          >
            <div
              className="absolute inset-0 opacity-[0.38]"
              style={{
                background:
                  "conic-gradient(from 90deg at 50% 50%, rgba(168,85,247,0) 0deg, rgba(168,85,247,0.45) 50deg, rgba(217,70,239,0.38) 100deg, rgba(34,211,238,0) 160deg, rgba(6,182,212,0.42) 220deg, rgba(99,102,241,0.28) 290deg, rgba(168,85,247,0) 360deg)",
                filter: "blur(70px)",
                animation: "heroAurora 60s linear infinite",
                maskImage:
                  "radial-gradient(ellipse 55% 45% at 50% 40%, black 30%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 55% 45% at 50% 40%, black 30%, transparent 75%)",
              }}
            />
          </motion.div>
        )}

        {/* parallax grid */}
        <motion.div
          style={{
            x: gridX,
            y: gridY,
            backgroundImage: isGalaxy
              ? "linear-gradient(rgba(82,120,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(82,120,255,0.3) 1px, transparent 1px)"
              : "linear-gradient(rgba(27,43,75,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(27,43,75,0.07) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: isGalaxy ? 0.06 : 1,
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 50% at 50% 40%, black 30%, transparent 75%)",
          }}
          className="absolute inset-0"
        />

        {/* drifting glow orbs matching reference cosmic palette */}
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          className="absolute left-1/2 top-[32%] -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="w-[780px] h-[400px] rounded-full"
            style={{
              background: isGalaxy
                ? "radial-gradient(circle at 50% 45%, rgba(147,51,234,.08), rgba(15,18,35,.04) 30%, transparent 60%)"
                : "radial-gradient(ellipse at center, rgba(192,132,252,0.55), rgba(217,70,239,0.3) 35%, rgba(124,58,237,0.12) 55%, transparent 70%)",
              filter: "blur(50px)",
              animation: "heroDrift1 14s ease-in-out infinite",
            }}
          />
        </motion.div>
        {!isGalaxy && (
          <>
            {/* Lower-left cyan supernova burst */}
            <motion.div
              style={{ x: orb2X, y: orb2Y }}
              className="absolute left-[12%] top-[58%]"
            >
              <div
                className="w-[480px] h-[480px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(34,211,238,0.52), rgba(6,182,212,0.25) 45%, transparent 68%)",
                  filter: "blur(70px)",
                  animation: "heroDrift2 18s ease-in-out infinite",
                }}
              />
            </motion.div>
            {/* Upper-right magenta & deep space dust */}
            <motion.div
              style={{ x: orb3X, y: orb3Y }}
              className="absolute right-[8%] top-[16%]"
            >
              <div
                className="w-[420px] h-[420px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(217,70,239,0.38), rgba(49,46,129,0.22) 45%, transparent 68%)",
                  filter: "blur(80px)",
                  animation: "heroDrift3 22s ease-in-out infinite",
                }}
              />
            </motion.div>
            {/* Bottom-center radiant celestial cyan supernova core (from image) */}
            <motion.div
              style={{ x: orb1X, y: orb2Y }}
              className="absolute left-1/2 bottom-[-8%] -translate-x-1/2 pointer-events-none"
            >
              <div
                className="w-[620px] h-[360px] rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(103,232,249,0.62), rgba(6,182,212,0.32) 35%, rgba(14,165,233,0.1) 60%, transparent 75%)",
                  filter: "blur(60px)",
                  animation: "heroDrift2 16s ease-in-out infinite",
                }}
              />
            </motion.div>

            {/* holographic light streaks (Light mode only) */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute h-[140%] w-[18%] -top-[20%] mix-blend-screen"
                style={{
                  left: `${15 + i * 28}%`,
                  background:
                    "linear-gradient(90deg, transparent, rgba(192,132,252,0.25), transparent)",
                  filter: "blur(20px)",
                  animation: `heroStreak ${9 + i * 2}s ease-in-out ${i * 2.4}s infinite`,
                }}
              />
            ))}

            {/* cinematic fog layer (Light mode only) */}
            <div
              className="absolute inset-x-[-10%] bottom-0 h-[55%]"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(244,244,251,0.55) 50%, rgba(244,244,251,0.9) 100%)",
                filter: "blur(8px)",
                animation: "heroFog 18s ease-in-out infinite",
              }}
            />
          </>
        )}

        {/* neural network constellation canvas (desktop only) */}
        <div className="hidden md:block absolute inset-0">
          <HeroNeuralCanvas mouse={mouse} />
        </div>

        {/* top vignette (Light mode only) */}
        {!isGalaxy && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 18%, transparent 82%, rgba(244,244,251,0.75) 100%)",
            }}
          />
        )}

        {/* SVG flowing AI energy beams behind title */}
        <svg
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[300px] opacity-70"
          viewBox="0 0 900 300"
          fill="none"
        >
          <defs>
            <linearGradient id="heroBeam" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#9333EA" stopOpacity="0" />
              <stop offset="0.5" stopColor="#9333EA" stopOpacity="0.6" />
              <stop offset="1" stopColor="#7896FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M 0 ${150 + i * 20} C 200 ${100 + i * 30}, 700 ${200 - i * 25}, 900 ${150 + i * 15}`}
              stroke="url(#heroBeam)"
              strokeWidth="1.2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 1.5, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </motion.div>

      {/* cursor reactive glow follower */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-[1] w-[420px] h-[420px] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          left: cursorX,
          top: cursorY,
          background: isGalaxy
            ? "radial-gradient(circle, rgba(168,85,247,0.14), transparent 70%)"
            : "radial-gradient(circle, rgba(192,132,252,0.30), rgba(34,211,238,0.14) 40%, transparent 70%)",
          filter: "blur(20px)",
          mixBlendMode: "screen",
        }}
      />

      {/* ===== CONTENT (scroll-parallaxed) ===== */}
      <motion.div
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity, x: contentX }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-7"
      >
        <motion.div
          style={{ y: contentY }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
        >
          <HeroSignalLine />
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.35, duration: 0.6, ease: EASE_EXPO }}
          className={`relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${
            isBrownGold
              ? "bg-[#3a2114]/85 backdrop-blur-md border border-[rgba(212,175,55,0.45)] text-[#e6ca65]"
              : isGalaxy
              ? "bg-[#FAF5FF] text-mk-orange border border-purple-200/70"
              : "bg-white/70 backdrop-blur-md border border-purple-200/70 text-mk-orange"
          } text-[13px] font-semibold ${
            isBrownGold
              ? "shadow-[0_8px_30px_-8px_rgba(212,175,55,0.3)]"
              : "shadow-[0_8px_30px_-8px_rgba(147,51,234,0.3)]"
          }`}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="inline-flex"
          >
            <Sparkles size={14} className={isBrownGold ? "text-[#d4af37]" : "text-mk-orange"} />
          </motion.span>
          AI Marketing Automation Platform
          <span
            aria-hidden
            className="absolute -inset-px rounded-full pointer-events-none"
            style={{
              background: isBrownGold
                ? "conic-gradient(from 0deg, rgba(212,175,55,0), rgba(212,175,55,0.7), rgba(212,175,55,0))"
                : "conic-gradient(from 0deg, rgba(147,51,234,0), rgba(147,51,234,0.6), rgba(147,51,234,0))",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: 1,
              animation: "heroBorderSpin 6s linear infinite",
              opacity: 0.6,
            }}
          />
        </motion.div>

        <h1 className="relative font-display text-[44px] leading-[1.08] md:text-[72px] md:leading-[1.05] text-mk-heading">
          {/* soft glow behind heading */}
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[160%] pointer-events-none -z-10"
            style={{
              background: isGalaxy
                ? "radial-gradient(circle at 50% 45%, rgba(147,51,234,.08), rgba(15,18,35,.04) 30%, transparent 60%)"
                : "radial-gradient(ellipse at center, rgba(192,132,252,0.45), transparent 60%)",
              filter: "blur(40px)",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* moving gradient sheen on letters */}
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(110deg, transparent 30%, rgba(216,180,254,0.35) 50%, transparent 70%)",
              backgroundSize: "200% 100%",
              mixBlendMode: "soft-light",
              animation: "heroSweep 6s ease-in-out infinite",
            }}
          />

          {titleLines.map((line, li) => {
            const chars = line.split("");
            let cumulative = li === 0 ? 0 : titleLines[0].length;
            return (
              <span key={li} className="block">
                {chars.map((ch, i) => {
                  const idx = cumulative + i;
                  return (
                    <motion.span
                      key={`${li}-${i}`}
                      initial={{ y: 80, opacity: 0, filter: "blur(12px)", rotateX: -40 }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0 }}
                      transition={{
                        delay: 0.55 + idx * 0.025,
                        duration: 1,
                        ease: EASE_EXPO,
                      }}
                      style={{
                        display: "inline-block",
                        transformOrigin: "50% 100%",
                        whiteSpace: "pre",
                        animation: `heroLetterGlow 5s ease-in-out ${idx * 0.05}s infinite`,
                      }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </motion.span>
                  );
                })}
              </span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-mk-body text-[17px] md:text-[18px] max-w-[620px] leading-relaxed"
          style={{
            animation: "heroBreathe 5s ease-in-out infinite",
            color: isGalaxy ? "rgba(255, 255, 255, 0.55)" : undefined,
          }}
        >
          Built on intelligent automation. Powered by AI decision engines. Delivering lead-to-customer conversion at scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.75, type: "spring", stiffness: 200, damping: 18 }}
          className="flex items-center justify-center"
        >
          <HeroMagneticButton variant="navy">
            Sign up <ArrowRight size={16} />
          </HeroMagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          className="mt-8 flex flex-col items-center gap-2 text-mk-muted"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0 rgba(147,51,234,0.4)", "0 0 0 14px rgba(147,51,234,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <ChevronDown />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ----------------------------- Integration marquee ----------------------------- */

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="mk-edge-fade overflow-hidden py-3"
    >
      <div
        ref={trackRef}
        className="mk-marquee-track flex gap-20 w-max items-center"
        style={{
          ["--marquee-duration" as any]: "55s",
          ["--marquee-state" as any]: paused ? "paused" : "running",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...items, ...items].map((it, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -10, 0, 10, 0] }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 7) * 0.35,
            }}
            whileHover={{ scale: 1.12, y: -6 }}
            className="text-[28px] md:text-[32px] font-extrabold tracking-tight whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#D8B4FE] hover:drop-shadow-[0_0_16px_rgba(192,132,252,0.65)] transition-all duration-300"
            style={{
              fontFamily: '"Space Grotesk", "Inter Tight", "Inter", system-ui, sans-serif',
              letterSpacing: "-0.02em",
              textShadow: "0 1px 0 rgba(255,255,255,0.6), 0 0 22px rgba(192,132,252,0.35)",
            }}
          >
            {it}
          </motion.span>
        ))}
      </div>
    </div>
  );
}


function IntegrationStrip() {
  const r1 = ["Meta", "Google Ads", "WhatsApp Business", "Instagram", "Messenger", "Zoho", "HubSpot", "Salesforce"];
  const r2 = ["Razorpay", "Freshworks", "Twilio", "SendGrid", "Google Calendar", "Zapier", "n8n", "Stripe"];
  return (
    <section className="py-20 bg-mk-bg">
      <p className="text-center text-[11px] tracking-[0.18em] text-mk-muted font-semibold mb-8">
        BUSINESSES THAT RUN ON MARKETON
      </p>
      <div className="flex flex-col gap-6">
        <MarqueeRow items={r1} />
        <MarqueeRow items={r2} reverse />
      </div>
    </section>
  );
}

/* ----------------------------- Platform tabs ----------------------------- */

const TABS = ["AI Lead Scoring", "Omnichannel", "Voice Agent", "Workflow Builder", "Analytics Dashboard"] as const;

function PlatformTabs() {
  const { isGalaxy } = useTheme();
  const [active, setActive] = useState<number>(0);
  return (
    <section id="platform" className="py-24 md:py-32 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2
            className="font-display text-[32px] md:text-[48px] text-center mb-10 leading-tight font-bold"
            style={{ color: "var(--section-heading)" }}
          >
            The AI Platform Marketers Build On
          </h2>
        </Reveal>
        <div className="flex gap-2 overflow-x-auto mk-no-scrollbar mb-8 md:justify-center pb-2">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setActive(i)}
              className="relative whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer"
              style={{
                color: active === i ? "#FFFFFF" : "var(--section-text)",
              }}
            >
              {active === i && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-mk-navy shadow-[0_8px_24px_-8px_rgba(27,43,75,0.5)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {active === i && (
                <motion.span
                  className="absolute inset-0 rounded-full ring-2 ring-mk-orange/40"
                  animate={{ opacity: [0.35, 0.9, 0.35] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              <span className="relative z-10">{t}</span>
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mk-card mk-card-lg shadow-[0_20px_60px_-30px_rgba(27,43,75,0.25)] p-6 md:p-10 min-h-[480px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: -8, scale: 1.02, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 8, scale: 0.96, filter: "blur(4px)" }}
              transition={{ duration: 0.3, ease: EASE_EXPO }}
              className="grid md:grid-cols-[58%_42%] gap-8"
            >
              {active === 0 && <LeadScoringTab />}
              {active === 1 && <OmnichannelTab />}
              {active === 2 && <VoiceAgentTab />}
              {active === 3 && <WorkflowTab />}
              {active === 4 && <AnalyticsTab />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

const LEAD_ROTATION = [
  { n: "Rahul Sharma", initial: "R", email: "rahul@company.com", phone: "+91 98765 43210", score: 87, type: "HOT LEAD", typeColor: "bg-mk-orange", channel: "WhatsApp", bestTime: "11:00 AM", action: "Send Offer", priority: "High", tags: ["WhatsApp", "Landing Page"], short: "Rahul S.", dotColor: "bg-mk-orange" },
  { n: "Priya Mehta", initial: "P", email: "priya@brandlab.io", phone: "+91 99220 11045", score: 62, type: "WARM LEAD", typeColor: "bg-yellow-500", channel: "Instagram", bestTime: "6:30 PM", action: "Send Brochure", priority: "Medium", tags: ["Instagram Ads", "Quiz Funnel"], short: "Priya M.", dotColor: "bg-yellow-400" },
  { n: "Arjun Patel", initial: "A", email: "arjun.p@nexora.in", phone: "+91 90123 87654", score: 91, type: "HOT LEAD", typeColor: "bg-mk-orange", channel: "WhatsApp", bestTime: "10:15 AM", action: "Book Demo", priority: "High", tags: ["Google Ads", "WhatsApp"], short: "Arjun P.", dotColor: "bg-mk-orange" },
  { n: "Sneha Reddy", initial: "S", email: "sneha@growloop.co", phone: "+91 88456 22198", score: 48, type: "COLD LEAD", typeColor: "bg-slate-400", channel: "Email", bestTime: "3:00 PM", action: "Nurture", priority: "Low", tags: ["Newsletter", "Blog"], short: "Sneha R.", dotColor: "bg-gray-400" },
  { n: "Vikram Rao", initial: "V", email: "vikram@stackup.dev", phone: "+91 97001 55620", score: 76, type: "WARM LEAD", typeColor: "bg-yellow-500", channel: "WhatsApp", bestTime: "8:45 PM", action: "Follow Up", priority: "Medium", tags: ["LinkedIn", "Webinar"], short: "Vikram R.", dotColor: "bg-yellow-400" },
];

function useCountUp(target: number, duration = 1100) {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function LeadScoringTab() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % LEAD_ROTATION.length), 4000);
    return () => clearInterval(id);
  }, []);
  const lead = LEAD_ROTATION[idx];
  const score = useCountUp(lead.score);
  return (
    <>
      <motion.div
        animate={{ y: [0, -4, 0], boxShadow: [
          "0 10px 30px -20px rgba(147,51,234,0.25)",
          "0 20px 50px -20px rgba(147,51,234,0.45)",
          "0 10px 30px -20px rgba(147,51,234,0.25)",
        ] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-mk-bg rounded-2xl p-6 flex flex-col gap-4 overflow-hidden"
      >
        {/* animated gradient border */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, rgba(147,51,234,0.0), rgba(147,51,234,0.35), rgba(147,51,234,0.0) 40%)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: 1,
          } as React.CSSProperties}
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
        {/* moving glass reflection */}
        <motion.span
          aria-hidden
          className="absolute -inset-y-4 w-1/3 pointer-events-none opacity-50"
          style={{ background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)" }}
          animate={{ x: ["-40%", "260%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
        />

        {/* LIVE badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur border border-mk-border">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-red-500"
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          />
          <span className="text-[9px] font-bold tracking-widest text-mk-navy">LIVE</span>
        </div>

        <div className="relative flex items-start gap-4 min-h-[88px]">
          <div className="relative">
            <motion.span
              aria-hidden
              className="absolute -inset-2 rounded-full border border-mk-orange/40"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={lead.initial + idx}
                initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 20 }}
                transition={{ duration: 0.5, ease: EASE_EXPO }}
                className="relative w-14 h-14 rounded-full bg-mk-navy text-white flex items-center justify-center text-lg font-bold"
              >
                {lead.initial}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -24, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE_EXPO }}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-mk-navy text-lg">{lead.n}</h4>
                  <span className={`px-2 py-0.5 rounded-full ${lead.typeColor} text-white text-[10px] font-bold tracking-wide inline-flex items-center gap-1`}>
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-white"
                      animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    {lead.type}
                  </span>
                </div>
                <p className="text-sm text-mk-body">{lead.email} · {lead.phone}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {lead.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="text-xs bg-white border border-mk-border px-2 py-0.5 rounded"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="relative flex gap-1 items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.18, 1], filter: ["drop-shadow(0 0 0 rgba(147,51,234,0))", "drop-shadow(0 0 6px rgba(147,51,234,0.7))", "drop-shadow(0 0 0 rgba(147,51,234,0))"] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            >
              <Star size={16} className="fill-mk-orange text-mk-orange" />
            </motion.span>
          ))}
          <motion.span
            aria-hidden
            className="ml-2 text-[10px] text-mk-muted uppercase tracking-widest"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            ● AI analyzing lead…
          </motion.span>
        </div>
        <div className="relative">
          <div className="flex justify-between text-xs font-semibold text-mk-navy mb-1.5">
            <span>AI Score</span>
            <span style={{ textShadow: "0 0 12px rgba(147,51,234,0.5)" }}>{score}/100</span>
          </div>
          <div className="relative h-2 bg-white rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${lead.score}%` }}
              transition={{ duration: 1.1, ease: EASE_EXPO }}
              className="h-full relative overflow-hidden rounded-full"
              style={{ background: "linear-gradient(90deg, #9333ea, #c084fc, #9333ea)", backgroundSize: "200% 100%" }}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, #9333ea, #c084fc, #9333ea)", backgroundSize: "200% 100%" }}
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                aria-hidden
                className="absolute inset-y-0 w-10"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)" }}
                animate={{ x: ["-100%", "350%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.span
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-mk-orange"
              animate={{ left: `${lead.score}%`, scale: [1, 1.5, 1], opacity: [0.9, 0.4, 0.9] }}
              transition={{ left: { duration: 1.1, ease: EASE_EXPO }, scale: { duration: 1.6, repeat: Infinity }, opacity: { duration: 1.6, repeat: Infinity } }}
              style={{ boxShadow: "0 0 16px rgba(147,51,234,0.9)" }}
            />
          </div>
        </div>
        <div className="relative bg-white rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="contents"
            >
              <Detail icon={<MessageCircle size={14} className="text-emerald-500" />} label="Channel" value={lead.channel} />
              <Detail icon={<CalendarIcon size={14} className="text-mk-navy" />} label="Best Time" value={lead.bestTime} />
              <Detail icon={<Zap size={14} className="text-mk-orange" />} label="Action" value={lead.action} />
              <Detail icon={<span className="w-2 h-2 rounded-full bg-mk-orange inline-block" />} label="Priority" value={lead.priority} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-mk-navy">Lead Profiles</h4>
          <a className="text-xs text-mk-orange font-semibold">View all →</a>
        </div>
        <div className="flex flex-col gap-2">
          {LEAD_ROTATION.map((l, i) => {
            const isActive = i === idx;
            return (
              <motion.div
                key={l.n}
                whileHover={{ x: 4, scale: 1.015, boxShadow: "0 12px 30px -18px rgba(147,51,234,0.45)" }}
                animate={isActive
                  ? { y: 0, boxShadow: ["0 0 0 0 rgba(147,51,234,0.0)", "0 0 0 6px rgba(147,51,234,0.18)", "0 0 0 0 rgba(147,51,234,0.0)"] }
                  : { y: [0, -2, 0] }}
                transition={isActive
                  ? { boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
                  : { duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                className={`group relative flex items-center justify-between p-3 rounded-xl border bg-white transition-colors ${isActive ? "border-mk-orange/70" : "border-mk-border hover:border-mk-orange/60"}`}
              >
                <div>
                  <p className="font-semibold text-mk-navy text-sm">{l.short}</p>
                  <p className="text-xs text-mk-body">{l.type === "HOT LEAD" ? "Hot Lead" : l.type === "WARM LEAD" ? "Warm Lead" : "Cold Lead"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.span
                    className={`w-2 h-2 rounded-full ${l.dotColor}`}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.4 + i * 0.2, repeat: Infinity }}
                  />
                  <span className={`font-bold text-sm transition-colors ${isActive ? "text-mk-orange" : "text-mk-navy group-hover:text-mk-orange"}`}>{l.score}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-mk-muted text-[11px] uppercase tracking-wide">{icon}{label}</div>
      <p className="font-semibold text-mk-navy mt-0.5">{value}</p>
    </div>
  );
}

type ChannelKey = "WhatsApp" | "SMS" | "Email" | "AI Voice Calls" | "Instagram DM" | "Facebook Messenger" | "Telegram" | "Web Push" | "In-App";

const OMNI_CHANNELS: { key: ChannelKey; icon: ReactNode; color: string }[] = [
  { key: "WhatsApp", icon: <MessageCircle size={16} className="text-emerald-500" />, color: "text-emerald-500" },
  { key: "SMS", icon: <MessageCircle size={16} className="text-blue-500" />, color: "text-blue-500" },
  { key: "Email", icon: <Mail size={16} className="text-rose-500" />, color: "text-rose-500" },
  { key: "AI Voice Calls", icon: <PhoneCall size={16} className="text-mk-orange" />, color: "text-mk-orange" },
  { key: "Instagram DM", icon: <Instagram size={16} className="text-pink-500" />, color: "text-pink-500" },
  { key: "Facebook Messenger", icon: <MessageCircle size={16} className="text-blue-600" />, color: "text-blue-600" },
  { key: "Telegram", icon: <Send size={16} className="text-sky-500" />, color: "text-sky-500" },
  { key: "Web Push", icon: <Bell size={16} className="text-violet-500" />, color: "text-violet-500" },
  { key: "In-App", icon: <Sparkles size={16} className="text-amber-500" />, color: "text-amber-500" },
];

type MobileView = "home" | "drawer" | ChannelKey;

const AD_REELS = [
  {
    tag: "REEL · LIVE",
    title: "Unlock 20% off",
    sub: "Launch campaign · Day 3",
    src: "/__l5e/assets-v1/3555cb99-0e7c-4108-8c5d-4b234e604a4e/reel-ecommerce-ad.mp4",
  },
  {
    tag: "STORY · LIVE",
    title: "Free demo today",
    sub: "Meta + Instagram ads",
    src: "/__l5e/assets-v1/df701072-1089-483e-8f8d-e6a9c07de93d/reel-saas-demo-ad.mp4",
  },
  {
    tag: "AD · LIVE",
    title: "AI that closes",
    sub: "Lookalike audience · IN",
    src: "/__l5e/assets-v1/0750f10a-7b16-48ca-988d-36554e6f9b17/reel-service-leads-ad.mp4",
  },
] as const;

function OmnichannelTab() {
  const [view, setView] = useState<MobileView>("home");
  const channel = view !== "home" && view !== "drawer" ? (view as ChannelKey) : null;
  const dark = channel === "AI Voice Calls" || channel === "Web Push" || view === "home";
  return (
    <div
      style={{ gridColumn: "1 / -1" }}
      className="bg-gradient-to-br from-mk-bg via-white to-mk-bg rounded-2xl p-6 flex justify-center items-center gap-8 relative overflow-hidden flex-wrap"
    >
      {/* ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-mk-orange/20 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full bg-indigo-400/20 blur-3xl"
        />
      </div>

      <PhoneFrame>
        <PhoneStatusBar dark={dark} />

        {/* HOME / BACK button — enhanced */}
        <motion.button
          onClick={() => setView(channel ? "home" : view === "drawer" ? "home" : "drawer")}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          initial={false}
          animate={{ width: channel ? 68 : 32 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className={`absolute top-6 right-3 z-30 h-8 rounded-full flex items-center justify-center gap-1 px-2 backdrop-blur-md shadow-lg ring-1 overflow-hidden ${
            dark ? "bg-white/15 text-white ring-white/30" : "bg-mk-navy/10 text-mk-navy ring-mk-navy/15"
          }`}
          aria-label={channel ? "Back to home" : view === "drawer" ? "Close apps" : "Open apps"}
        >
          {channel ? (
            <>
              <ChevronLeft size={14} />
              <span className="text-[10px] font-semibold tracking-wide">Back</span>
            </>
          ) : view === "drawer" ? (
            <X size={14} />
          ) : (
            <Menu size={14} />
          )}
        </motion.button>


        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
            transition={{ duration: 0.42, ease: EASE_EXPO }}
            className="h-full"
          >
            {view === "home" && <LiveAdDashboard />}
            {view === "drawer" && <AppDrawer onOpen={(c) => setView(c)} />}
            {channel && <ChannelPreview channel={channel} />}
          </motion.div>
        </AnimatePresence>

        {/* home indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-24 h-1 rounded-full bg-white/30" />
      </PhoneFrame>

      <ChannelsSidePanel active={channel} onSelect={(c) => setView(c)} />
    </div>
  );
}

const CHANNEL_ICONS: Partial<Record<ChannelKey, { Icon: React.ComponentType<{ size?: number; className?: string }>; color: string }>> = {
  "WhatsApp":           { Icon: (p) => <FaWhatsapp {...p} />,        color: "text-emerald-500" },
  "Instagram DM":       { Icon: (p) => <FaInstagram {...p} />,       color: "text-pink-500" },
  "SMS":                { Icon: (p) => <MessageSquare {...p} />,     color: "text-green-500" },
  "Email":              { Icon: (p) => <Mail {...p} />,              color: "text-sky-500" },
  "Telegram":           { Icon: (p) => <FaTelegramPlane {...p} />,   color: "text-sky-400" },
  "Facebook Messenger": { Icon: (p) => <FaFacebookMessenger {...p} />, color: "text-blue-500" },
  "AI Voice Calls":     { Icon: (p) => <PhoneCall {...p} />,         color: "text-mk-orange" },
  "Web Push":           { Icon: (p) => <Bell {...p} />,              color: "text-violet-500" },
};

function ChannelsSidePanel({ active, onSelect }: { active: ChannelKey | null; onSelect: (c: ChannelKey) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: EASE_EXPO }}
      className="relative z-10 w-[220px] max-w-full"
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-mk-navy/50 font-semibold mb-3">Channels</p>
      <ul className="flex flex-col gap-1">
        {HOME_APPS.map((app, i) => {
          const isActive = active === app.key;
          const meta = CHANNEL_ICONS[app.key] ?? { Icon: (p: { size?: number }) => <MessageSquare {...p} />, color: "text-mk-navy/60" };
          const Icon = meta.Icon;
          return (
            <motion.li
              key={app.key}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 + i * 0.035, ease: EASE_EXPO }}
            >
              <button
                onClick={() => onSelect(app.key)}
                className={`group relative w-full flex items-center gap-2.5 py-1.5 text-left transition-colors ${
                  isActive ? "text-mk-orange" : "text-mk-navy/80 hover:text-mk-navy"
                }`}
              >
                <span className={`inline-flex w-5 h-5 items-center justify-center transition-transform ${isActive ? meta.color + " scale-110" : meta.color + " group-hover:scale-110"}`}>
                  <Icon size={16} />
                </span>
                <span className="text-[13px] font-medium tracking-tight">{app.key}</span>
                {isActive && (
                  <motion.span
                    layoutId="channel-name-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-mk-orange"
                  />
                )}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function PhoneStatusBar({ dark = false }: { dark?: boolean }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  const hh = time.getHours().toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");
  const color = dark ? "text-white/90" : "text-mk-navy/80";
  return (
    <div className={`absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-5 pt-1.5 text-[10px] font-semibold ${color} pointer-events-none`}>
      <span>{hh}:{mm}</span>
      <span className="flex items-center gap-1">
        <span className="flex items-end gap-[1px]">
          {[3,5,7,9].map((h,i)=>(<span key={i} className="w-[2px] rounded-sm bg-current" style={{ height: h }} />))}
        </span>
        <span className="opacity-80">5G</span>
        <span className="relative inline-block w-5 h-2.5 rounded-[3px] border border-current">
          <span className="absolute left-0.5 top-0.5 bottom-0.5 right-1 bg-current rounded-[1px]" />
          <span className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 bg-current rounded-r-sm" />
        </span>
      </span>
    </div>
  );
}

const HOME_APPS: { key: ChannelKey; label: string; bg: string; emoji: string; badge?: number }[] = [
  { key: "WhatsApp",          label: "WhatsApp",  bg: "from-emerald-400 to-emerald-600", emoji: "💬", badge: 3 },
  { key: "Instagram DM",      label: "Instagram", bg: "from-yellow-400 via-pink-500 to-purple-600", emoji: "📸", badge: 7 },
  { key: "SMS",               label: "Messages",  bg: "from-green-400 to-green-600", emoji: "✉️", badge: 1 },
  { key: "Email",             label: "Mail",      bg: "from-sky-400 to-blue-600", emoji: "📧", badge: 12 },
  { key: "Telegram",          label: "Telegram",  bg: "from-sky-400 to-sky-600", emoji: "✈️" },
  { key: "Facebook Messenger",label: "Messenger", bg: "from-blue-500 to-indigo-600", emoji: "💭", badge: 2 },
  { key: "AI Voice Calls",    label: "AI Voice",  bg: "from-mk-orange to-fuchsia-500", emoji: "🎙️" },
  { key: "Web Push",          label: "Push",      bg: "from-violet-500 to-fuchsia-500", emoji: "🔔", badge: 5 },
];

function LiveAdDashboard() {
  const [visitors, setVisitors] = useState(1247);
  const [leads, setLeads] = useState(38);
  const [reelIdx, setReelIdx] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const t = setInterval(() => {
      setVisitors((v) => v + Math.floor(Math.random() * 5) + 1);
      if (Math.random() > 0.5) setLeads((l) => l + 1);
    }, 1500);
    const r = setInterval(() => setReelIdx((i) => (i + 1) % AD_REELS.length), 9000);
    return () => { clearInterval(t); clearInterval(r); };
  }, []);
  const bars = Array.from({ length: 16 }, (_, i) => 22 + ((i * 41) % 60));
  const reel = AD_REELS[reelIdx];

  useEffect(() => {
    setIsVideoReady(false);
    setHasVideoError(false);
    const frame = requestAnimationFrame(() => {
      const el = videoRef.current;
      if (!el) return;
      el.muted = true;
      el.controls = false;
      el.currentTime = 0;
      el.load();
      const play = el.play();
      if (play) play.catch(() => undefined);
    });
    return () => cancelAnimationFrame(frame);
  }, [reelIdx]);

  const goFullscreen = () => {
    const el = videoRef.current as any;
    if (!el) return;
    const req = el.requestFullscreen || el.webkitEnterFullscreen || el.webkitRequestFullscreen;
    if (req) {
      try {
        el.muted = false;
        el.controls = true;
        el.play?.();
        req.call(el);
      } catch {/* noop */}
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-mk-navy via-[#0c1a3a] to-[#0a1530] text-white relative overflow-hidden">
      {/* scanning beam */}
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 h-20 bg-gradient-to-b from-mk-orange/25 to-transparent pointer-events-none"
        initial={{ y: -60 }}
        animate={{ y: 540 }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
      />

      {/* live ad reel — REAL VIDEO */}
      <div className="mx-3 mt-8 rounded-2xl overflow-hidden relative h-[180px] ring-1 ring-white/15 shadow-xl bg-black">
        <AnimatePresence mode="wait">
          <motion.video
            key={reelIdx}
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setIsVideoReady(true)}
            onCanPlay={() => setIsVideoReady(true)}
            onPlaying={() => setIsVideoReady(true)}
            onError={() => setHasVideoError(true)}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: isVideoReady && !hasVideoError ? 1 : 0.35, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={reel.src} type="video/mp4" />
          </motion.video>
        </AnimatePresence>

        {(!isVideoReady || hasVideoError) && (
          <div className="absolute inset-0 bg-gradient-to-br from-mk-navy via-[#0f2553] to-mk-orange/70 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30"
            >
              <Play size={18} className="ml-0.5" />
            </motion.div>
          </div>
        )}

        {/* overlay UI */}
        <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
              <motion.span animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.2, repeat:Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {reel.tag}
            </span>
            <button
              onClick={goFullscreen}
              className="pointer-events-auto flex items-center gap-1 text-[9px] font-bold bg-black/50 hover:bg-black/70 backdrop-blur-md px-2 py-1 rounded-full ring-1 ring-white/20"
              aria-label="Open fullscreen"
            >
              <Maximize2 size={10} /> Fullscreen
            </button>
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={reel.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-[14px] font-bold drop-shadow"
              >{reel.title}</motion.p>
            </AnimatePresence>
            <p className="text-[10px] opacity-80">{reel.sub}</p>
            {/* progress bar */}
            <div className="mt-1.5 h-1 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                key={reelIdx}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 9, ease: "linear" }}
                className="h-full bg-white"
              />
            </div>
          </div>
        </div>
      </div>



      {/* live metrics */}
      <div className="grid grid-cols-2 gap-2 px-3 mt-3">
        <div className="rounded-xl bg-white/5 border border-white/10 p-2">
          <p className="text-[9px] opacity-60 uppercase tracking-wide">Live viewers</p>
          <motion.p key={visitors} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-sm font-bold text-emerald-300">
            {visitors.toLocaleString()}
          </motion.p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-2">
          <p className="text-[9px] opacity-60 uppercase tracking-wide">Leads today</p>
          <motion.p key={leads} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-sm font-bold text-mk-orange">
            {leads}
          </motion.p>
        </div>
      </div>

      {/* moving chart */}
      <div className="mx-3 mt-2 rounded-xl bg-white/5 border border-white/10 p-2">
        <div className="flex justify-between items-center mb-1">
          <p className="text-[9px] opacity-60">Campaign performance</p>
          <p className="text-[9px] text-emerald-300">▲ 18.2%</p>
        </div>
        <div className="flex items-end gap-0.5 h-10">
          {bars.map((h, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-mk-orange to-fuchsia-300"
              animate={{ height: [`${h}%`, `${Math.min(95, h + 28)}%`, `${h}%`] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.07 }}
            />
          ))}
        </div>
      </div>

      {/* hint */}
      <div className="mt-auto px-3 pb-5 pt-2 flex items-center justify-between text-[9px] opacity-80">
        <span className="flex items-center gap-1">
          <motion.span animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.4, repeat:Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          AI orchestrating 8 channels
        </span>
        <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
          <Menu size={9} /> Tap to open
        </span>
      </div>
    </div>
  );
}

function AppDrawer({ onOpen }: { onOpen: (c: ChannelKey) => void }) {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a1530]/95 via-[#0c1a3a]/95 to-mk-navy/95 backdrop-blur-xl text-white relative overflow-hidden">
      <div className="absolute -top-10 left-1/3 w-40 h-40 rounded-full bg-mk-orange/30 blur-3xl" />
      <div className="absolute bottom-10 -right-10 w-40 h-40 rounded-full bg-indigo-400/30 blur-3xl" />

      <div className="pt-9 px-4 relative z-10">
        <p className="text-[10px] uppercase tracking-widest opacity-60">App Drawer</p>
        <p className="text-base font-bold">Choose a channel</p>
      </div>

      <div className="flex-1 px-4 pt-5 grid grid-cols-4 gap-y-4 gap-x-2 content-start relative z-10">
        {HOME_APPS.map((app, i) => (
          <motion.button
            key={app.key}
            onClick={() => onOpen(app.key)}
            initial={{ opacity: 0, y: 16, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.04 + i * 0.045, type: "spring", stiffness: 260, damping: 18 }}
            whileTap={{ scale: 0.85 }}
            whileHover={{ y: -3, scale: 1.04 }}
            className="flex flex-col items-center gap-1"
          >
            <div className={`relative w-12 h-12 rounded-[14px] bg-gradient-to-br ${app.bg} shadow-lg shadow-black/40 flex items-center justify-center text-xl ring-1 ring-white/30`}>
              <span className="drop-shadow-sm">{app.emoji}</span>
              <span className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              {app.badge && (
                <motion.span
                  animate={{ scale: [1, 1.18, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-mk-navy"
                >{app.badge}</motion.span>
              )}
            </div>
            <span className="text-[10px] font-medium text-white/85">{app.label}</span>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-[9px] opacity-50 pb-5">Tap an app to open · top-left arrow returns home</p>
    </div>
  );
}




function PhoneFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="w-[270px] h-[520px] rounded-[40px] border-[10px] border-mk-navy bg-mk-navy shadow-2xl p-1.5 relative">
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-mk-navy rounded-b-2xl z-20" />
      <div className={`w-full h-full rounded-[30px] overflow-hidden relative ${dark ? "bg-[#0b141a]" : "bg-white"}`}>
        {children}
      </div>
    </div>
  );
}

function Bubble({ side, children, tail = true, className = "" }: { side: "in" | "out"; children: ReactNode; tail?: boolean; className?: string }) {
  return (
    <div className={`max-w-[78%] px-3 py-2 text-[12px] leading-snug ${
      side === "in"
        ? `self-start rounded-2xl ${tail ? "rounded-bl-md" : ""}`
        : `self-end rounded-2xl ${tail ? "rounded-br-md" : ""}`
    } ${className}`}>
      {children}
    </div>
  );
}

type ChatSide = "in" | "out";
type ChatScenario = {
  name: string;
  avatar: string;
  sub?: string;
  preset: { side: ChatSide; text: string }[];
  draft: string;
  reply: string;
};

type ChatTheme = {
  bg: string;
  header: string;
  headerSub: string;
  avatar: string;
  inBubble: string;
  outBubble: string;
  inputBar: string;
  input: string;
  inputText: string;
  sendBg: string;
  cursor: string;
  seen: string;
};

const THEMES: Record<"WhatsApp"|"Instagram DM"|"SMS"|"Telegram"|"Facebook Messenger", ChatTheme> = {
  "WhatsApp": {
    bg: "bg-[#efeae2]",
    header: "bg-[#075e54] text-white",
    headerSub: "text-white/80",
    avatar: "bg-emerald-300 text-[#075e54]",
    inBubble: "bg-white text-mk-navy shadow-sm",
    outBubble: "bg-[#dcf8c6] text-mk-navy shadow-sm",
    inputBar: "bg-[#f0f0f0]",
    input: "bg-white",
    inputText: "text-mk-navy",
    sendBg: "bg-[#075e54]",
    cursor: "bg-mk-navy",
    seen: "text-sky-500",
  },
  "Instagram DM": {
    bg: "bg-white",
    header: "bg-white text-mk-navy border-b border-gray-100",
    headerSub: "text-mk-muted",
    avatar: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white",
    inBubble: "bg-gray-100 text-mk-navy",
    outBubble: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    inputBar: "bg-white border-t border-gray-100",
    input: "bg-gray-100",
    inputText: "text-mk-navy",
    sendBg: "bg-gradient-to-r from-purple-500 to-pink-500",
    cursor: "bg-mk-navy",
    seen: "text-pink-500",
  },
  "SMS": {
    bg: "bg-white",
    header: "bg-white text-mk-navy border-b border-gray-200",
    headerSub: "text-mk-muted",
    avatar: "bg-blue-100 text-blue-600",
    inBubble: "bg-gray-200 text-mk-navy",
    outBubble: "bg-blue-500 text-white",
    inputBar: "bg-white border-t border-gray-200",
    input: "bg-gray-100",
    inputText: "text-mk-navy",
    sendBg: "bg-blue-500",
    cursor: "bg-mk-navy",
    seen: "text-blue-500",
  },
  "Telegram": {
    bg: "bg-[#e7ebf0]",
    header: "bg-[#517da2] text-white",
    headerSub: "text-white/80",
    avatar: "bg-white text-[#517da2]",
    inBubble: "bg-white text-mk-navy shadow-sm",
    outBubble: "bg-[#effdde] text-mk-navy shadow-sm",
    inputBar: "bg-white border-t border-gray-200",
    input: "bg-gray-100",
    inputText: "text-mk-navy",
    sendBg: "bg-[#517da2]",
    cursor: "bg-mk-navy",
    seen: "text-[#517da2]",
  },
  "Facebook Messenger": {
    bg: "bg-white",
    header: "bg-white text-mk-navy border-b border-gray-100",
    headerSub: "text-emerald-500",
    avatar: "bg-blue-600 text-white",
    inBubble: "bg-gray-100 text-mk-navy",
    outBubble: "bg-blue-600 text-white",
    inputBar: "bg-white border-t border-gray-100",
    input: "bg-gray-100",
    inputText: "text-mk-navy",
    sendBg: "bg-blue-600",
    cursor: "bg-mk-navy",
    seen: "text-blue-600",
  },
};

const CHAT_SCENARIOS: Record<keyof typeof THEMES, ChatScenario[]> = {
  "WhatsApp": [
    { name: "Rahul Sharma", avatar: "🧑🏽", sub: "online",
      preset: [{ side:"in", text:"Hey 👋 wanted pricing details." }, { side:"out", text:"Sure! Sending our latest plans 😊" }],
      draft: "We can also schedule a quick demo tomorrow 🚀", reply: "Perfect, 11 AM works for me ✅" },
    { name: "Priya Mehta", avatar: "👩🏻", sub: "online",
      preset: [{ side:"in", text:"Is the launch offer still live?" }, { side:"out", text:"Yes! 20% off till midnight 🎁" }],
      draft: "Want me to share the checkout link?", reply: "Yes please, send it now 🙏" },
    { name: "Arjun Patel", avatar: "🧑🏻", sub: "typing…",
      preset: [{ side:"in", text:"Saw your ad — sounds great!" }, { side:"out", text:"Glad you liked it 🙌" }],
      draft: "Booking a free strategy call for you…", reply: "Awesome, looking forward 🔥" },
  ],
  "Instagram DM": [
    { name: "creator.maya", avatar: "🎨", sub: "Active now",
      preset: [{ side:"in", text:"Loved your latest reel 🔥" }, { side:"out", text:"Thanks!! Want early access?" }],
      draft: "Sending you the beta invite now ✨", reply: "OMG yes please 🙌" },
    { name: "zara.fits", avatar: "👗", sub: "Active 2m ago",
      preset: [{ side:"in", text:"Do you ship to Mumbai? 🥺" }, { side:"out", text:"Yes we do 🚚💨" }],
      draft: "Here's a 10% code: INSTA10 🎟️", reply: "Just placed the order 💖" },
    { name: "fit.with.nik", avatar: "💪", sub: "Active now",
      preset: [{ side:"in", text:"reply to my story 👀" }, { side:"out", text:"On it! Such a vibe 🎵" }],
      draft: "Wanna collab on a reel next week?", reply: "100% let's do it 🚀" },
  ],
  "SMS": [
    { name: "Marketon", avatar: "✉️", sub: "SMS · Today",
      preset: [{ side:"in", text:"MARKETON: Your demo is confirmed for tomorrow 11 AM." }, { side:"in", text:"Reply YES to confirm, NO to reschedule." }],
      draft: "YES", reply: "✅ Confirmed. Calendar invite sent." },
    { name: "Marketon OTP", avatar: "🔐", sub: "SMS",
      preset: [{ side:"in", text:"Your OTP is 482910. Valid for 5 min." }],
      draft: "Got it, thanks!", reply: "✅ Verified. Welcome to Marketon." },
    { name: "Marketon", avatar: "🎁", sub: "SMS",
      preset: [{ side:"in", text:"Flash sale 🚀 24h only — 20% off all plans." }],
      draft: "Send me the link please", reply: "Here you go: mktn.co/sale" },
  ],
  "Telegram": [
    { name: "Marketon Bot", avatar: "🤖", sub: "bot",
      preset: [{ side:"in", text:"/start — Welcome to Marketon 🚀" }, { side:"in", text:"Choose an option:" }],
      draft: "📊 View Dashboard", reply: "Loading live dashboard… ⚡" },
    { name: "LeadAlerts", avatar: "🔔", sub: "bot",
      preset: [{ side:"in", text:"🔥 New hot lead: Vikram R. — score 87" }],
      draft: "/assign me", reply: "Assigned to you ✅ Opening CRM." },
    { name: "CRM Sync", avatar: "🔄", sub: "bot",
      preset: [{ side:"in", text:"3 deals moved to Negotiation today." }],
      draft: "/report weekly", reply: "📈 Weekly report incoming…" },
  ],
  "Facebook Messenger": [
    { name: "Marketon Support", avatar: "💬", sub: "● Active",
      preset: [{ side:"in", text:"Hey! Saw you visited our pricing page 👀" }, { side:"out", text:"Yes, comparing plans." }],
      draft: "Want me to match a competitor quote?", reply: "Yes please 💪" },
    { name: "Sneha · Sales", avatar: "👩🏼", sub: "● Active",
      preset: [{ side:"in", text:"Quick question about your team size?" }, { side:"out", text:"We're around 25 people." }],
      draft: "Got it — recommending the Growth plan 🌱", reply: "Sounds perfect, let's go 🚀" },
    { name: "Marketon", avatar: "🛒", sub: "● Active",
      preset: [{ side:"in", text:"Left something in your cart? 🛒" }],
      draft: "Here's a 15% nudge: BACK15 🎁", reply: "Just checked out, thanks!" },
  ],
};

function useTypewriter(text: string, run: boolean, onDone: () => void) {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!run) { setTyped(""); return; }
    let i = 0;
    let cancelled = false;
    setTyped("");
    const tick = () => {
      if (cancelled) return;
      if (i >= text.length) { onDone(); return; }
      i++;
      setTyped(text.slice(0, i));
      const ch = text[i - 1];
      const base = ch === " " ? 60 : 38;
      const jitter = Math.random() * 80;
      const pause = /[.,!?]/.test(ch) ? 220 : 0;
      setTimeout(tick, base + jitter + pause);
    };
    const start = setTimeout(tick, 100);
    return () => { cancelled = true; clearTimeout(start); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, run]);
  return typed;
}

function LiveChat({ platform }: { platform: keyof typeof THEMES }) {
  const scenarios = CHAT_SCENARIOS[platform];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
    const t = setInterval(() => setIdx((i) => (i + 1) % scenarios.length), 15000);
    return () => clearInterval(t);
  }, [scenarios.length, platform]);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${platform}-${idx}`}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.45, ease: EASE_EXPO }}
        className="h-full"
      >
        <ChatShell theme={THEMES[platform]} scenario={scenarios[idx]} />
      </motion.div>
    </AnimatePresence>
  );
}

function ChatShell({ theme, scenario }: { theme: ChatTheme; scenario: ChatScenario }) {
  const [phase, setPhase] = useState<"preset"|"typing"|"sent"|"replyTyping"|"replyShown">("preset");
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    setPhase("preset"); setSeen(false);
    const t1 = setTimeout(() => setPhase("typing"), 1400 + scenario.preset.length * 350);
    return () => clearTimeout(t1);
  }, [scenario]);

  const typed = useTypewriter(scenario.draft, phase === "typing", () => {
    setTimeout(() => setPhase("sent"), 280);
  });

  useEffect(() => {
    if (phase !== "sent") return;
    const t1 = setTimeout(() => setSeen(true), 700);
    const t2 = setTimeout(() => setPhase("replyTyping"), 900);
    const t3 = setTimeout(() => setPhase("replyShown"), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  const bubbleClass = (side: ChatSide) =>
    `max-w-[78%] px-3 py-2 text-[12px] leading-snug rounded-2xl ${
      side === "in"
        ? `self-start rounded-bl-md ${theme.inBubble}`
        : `self-end rounded-br-md ${theme.outBubble}`
    }`;

  return (
    <div className={`flex flex-col h-full ${theme.bg}`}>
      <div className={`${theme.header} px-3 py-2 pt-7 flex items-center gap-2`}>
        <ChevronLeft size={14} />
        <div className={`w-8 h-8 rounded-full ${theme.avatar} flex items-center justify-center text-sm font-bold`}>
          <span>{scenario.avatar}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{scenario.name}</p>
          <p className={`text-[10px] flex items-center gap-1 ${theme.headerSub}`}>
            <motion.span animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.6, repeat:Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {scenario.sub ?? "online"}
          </p>
        </div>
        <PhoneCall size={13} className="opacity-70" />
        <Video size={13} className="opacity-70" />
      </div>

      <div className="flex-1 flex flex-col gap-1.5 p-3 overflow-hidden">
        {scenario.preset.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.35, duration: 0.35, ease: EASE_EXPO }}
            className={bubbleClass(m.side)}
          >
            {m.text}
          </motion.div>
        ))}

        {(phase === "sent" || phase === "replyTyping" || phase === "replyShown") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 22 }}
            className={bubbleClass("out")}
          >
            {scenario.draft}
            <span className={`block text-right text-[8px] mt-0.5 ${seen ? theme.seen : "opacity-60"}`}>
              {seen ? "✓✓ Seen" : "✓✓"}
            </span>
          </motion.div>
        )}

        {phase === "replyTyping" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`self-start px-3 py-2 rounded-2xl rounded-bl-md flex gap-1 ${theme.inBubble}`}
          >
            {[0,1,2].map(d => (
              <motion.span key={d} animate={{ y:[0,-3,0] }} transition={{ duration:.8, repeat:Infinity, delay:d*.15 }} className="w-1.5 h-1.5 rounded-full bg-mk-navy/40" />
            ))}
          </motion.div>
        )}

        {phase === "replyShown" && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            className={bubbleClass("in")}
          >
            {scenario.reply}
          </motion.div>
        )}
      </div>

      <div className={`${theme.inputBar} px-3 py-2 flex items-center gap-2`}>
        <div className={`flex-1 ${theme.input} rounded-full px-3 py-1.5 text-[11px] min-h-[28px] flex items-center ${theme.inputText}`}>
          {phase === "typing" || (phase === "preset" && false) ? (
            <>
              <span>{typed}</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
                className={`inline-block w-[1px] h-3 ${theme.cursor} ml-[1px]`}
              />
            </>
          ) : phase === "preset" ? (
            <span className="text-mk-muted">Message…</span>
          ) : (
            <span className="text-mk-muted">Message…</span>
          )}
        </div>
        <motion.button
          animate={phase === "sent" ? { scale: [1, 0.82, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`relative w-7 h-7 rounded-full ${theme.sendBg} flex items-center justify-center text-white shadow-md`}
        >
          <Send size={12} />
          {phase === "sent" && (
            <motion.span
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 rounded-full ${theme.sendBg} opacity-50`}
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}

function LiveEmail() {
  const scenarios = [
    { from: "Marketon Team", subject: "Your personalized offer is here 🎁", body: "Hi Rahul,\n\nBased on your interest, we've unlocked a 20% launch discount just for you.", code: "MARKETON20", cta: "Claim Offer" },
    { from: "Priya · Marketon", subject: "Quick follow-up on your demo 📅", body: "Hi! Just confirming tomorrow's demo at 11 AM. Reply to reschedule.", code: "DEMO11", cta: "Add to Calendar" },
    { from: "Marketon Insights", subject: "Your weekly leads report is ready 📊", body: "You captured 187 new leads this week — up 24% vs last week.", code: "REPORT", cta: "View Report" },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % scenarios.length), 15000);
    return () => clearInterval(t);
  }, [scenarios.length]);
  const s = scenarios[idx];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: EASE_EXPO }}
        className="flex flex-col h-full bg-white"
      >
        <div className="px-3 py-2 pt-7 border-b border-gray-200 flex items-center gap-2">
          <ChevronLeft size={14} className="text-blue-500" />
          <p className="text-[11px] font-semibold text-blue-500">Inbox</p>
          <motion.span animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.5, repeat:Infinity }} className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="p-3 border-b border-gray-100">
          <motion.p
            key={s.subject}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[13px] font-bold text-mk-navy leading-tight"
          >
            {s.subject}
          </motion.p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-mk-orange text-white flex items-center justify-center text-[10px] font-bold">M</div>
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-mk-navy">{s.from}</p>
              <p className="text-[10px] text-mk-muted">to me · just now</p>
            </div>
            <Star size={12} className="text-mk-muted" />
          </div>
        </div>
        <div className="p-3 flex-1 text-[11px] text-mk-navy leading-relaxed space-y-2 overflow-hidden">
          {s.body.split("\n").map((line, i) => (
            <motion.p key={i} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.2 + i*0.2 }}>{line}</motion.p>
          ))}
          <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.7 }} className="rounded-lg bg-gradient-to-br from-mk-orange to-fuchsia-500 text-white p-3 text-center my-2">
            <p className="text-[10px] opacity-80">EXCLUSIVE</p>
            <p className="text-base font-bold">{s.code}</p>
          </motion.div>
          <motion.button whileTap={{ scale: 0.96 }} className="w-full bg-mk-navy text-white rounded-md py-1.5 text-[11px] font-semibold">
            {s.cta} →
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ChannelPreview({ channel }: { channel: ChannelKey }) {
  switch (channel) {
    case "WhatsApp":
    case "Instagram DM":
    case "SMS":
    case "Telegram":
    case "Facebook Messenger":
      return <LiveChat platform={channel} />;
    case "Email":
      return <LiveEmail />;
    case "AI Voice Calls":
      return (
        <div className="flex flex-col h-full bg-gradient-to-b from-mk-navy to-[#0a1530] text-white">
          <div className="pt-8 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-60">Incoming AI Call</p>
            <p className="text-base font-semibold mt-1">Marketon Assistant</p>
            <p className="text-[11px] opacity-60">+1 (415) 555-0199</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <motion.div animate={{ scale:[1,1.15,1] }} transition={{ duration:2, repeat:Infinity }} className="w-24 h-24 rounded-full bg-mk-orange/30 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-mk-orange flex items-center justify-center"><PhoneCall size={28} /></div>
            </motion.div>
            <div className="flex items-end gap-1 h-10">
              {Array.from({length:18}).map((_,i)=>(
                <motion.span key={i} animate={{ height:[6, 4+Math.random()*30, 6] }} transition={{ duration:0.6+Math.random()*0.6, repeat:Infinity, delay:i*0.05 }} className="w-1 bg-mk-orange rounded-full" />
              ))}
            </div>
            <p className="text-[11px] opacity-80 px-6 text-center italic">"Hi Rahul, this is Marketon AI. I'd like to confirm your demo for tomorrow at 11 AM…"</p>
          </div>
          <div className="flex justify-around py-6">
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"><Mail size={16} /></div>
            <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center rotate-[135deg]"><PhoneCall size={18} /></div>
            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center"><Video size={16} /></div>
          </div>
        </div>
      );

    case "Web Push":
      return (
        <div className="flex flex-col h-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white">
          <div className="pt-8 text-center">
            <p className="text-[10px] uppercase tracking-widest opacity-80">Lock Screen</p>
            <p className="text-3xl font-light mt-1">10:42</p>
            <p className="text-[11px] opacity-80">Friday, June 6</p>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-3 justify-end pb-10">
            {[
              { t: "Your cart is waiting 🛒", b: "Complete checkout and get 10% off." },
              { t: "New lead just signed up 🎉", b: "Priya M. from Bengaluru — score 78." },
              { t: "Campaign hit 1,000 clicks 🚀", b: "Tap to view live analytics." },
            ].map((n,i)=>(
              <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.15 }} className="bg-white/20 backdrop-blur-md rounded-xl p-2.5 border border-white/30">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white/30 flex items-center justify-center"><Bell size={12} /></div>
                  <p className="text-[10px] font-semibold flex-1">MARKETON</p>
                  <p className="text-[9px] opacity-70">now</p>
                </div>
                <p className="text-[11px] font-semibold mt-1">{n.t}</p>
                <p className="text-[10px] opacity-90">{n.b}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case "In-App":
      return (
        <div className="flex flex-col h-full bg-mk-bg">
          <div className="px-3 py-2 pt-7 bg-white border-b border-mk-border flex items-center gap-2">
            <Sparkles size={14} className="text-mk-orange" />
            <p className="text-sm font-bold text-mk-navy flex-1">Marketon App</p>
            <Bell size={14} className="text-mk-navy" />
          </div>
          <div className="p-3 flex-1 flex flex-col gap-2">
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} className="bg-gradient-to-br from-mk-orange to-fuchsia-500 rounded-2xl p-3 text-white shadow-lg">
              <div className="flex items-center gap-2">
                <Zap size={14} /><p className="text-[10px] uppercase tracking-wide font-bold">Pro Tip</p>
              </div>
              <p className="text-[12px] font-semibold mt-1">Unlock AI scoring on 1,000+ leads</p>
              <p className="text-[10px] opacity-90 mt-0.5">Try free for 14 days. No card required.</p>
              <button className="mt-2 bg-white text-mk-orange rounded-md px-3 py-1 text-[11px] font-bold">Start trial →</button>
            </motion.div>
            <div className="bg-white rounded-xl p-3 border border-mk-border">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-mk-navy">Today's leads</p>
                <span className="text-[10px] text-emerald-500 font-bold">+24%</span>
              </div>
              <p className="text-2xl font-bold text-mk-navy mt-1">187</p>
              <div className="h-1.5 bg-mk-bg rounded-full mt-2 overflow-hidden">
                <motion.div initial={{ width:0 }} animate={{ width:"72%" }} transition={{ duration:1 }} className="h-full bg-mk-orange" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-mk-border flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 size={14} className="text-emerald-500" /></div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold text-mk-navy">Demo confirmed</p>
                <p className="text-[10px] text-mk-body">Rahul S. · 11:00 AM tomorrow</p>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

const VOICE_AGENTS = [
  { n: "SalesBot", a: "Conversational · Friendly" },
  { n: "SupportBot", a: "Professional · Clear" },
  { n: "ReminderBot", a: "Fast · Helpful" },
  { n: "BookingBot", a: "Polite · Efficient" },
  { n: "FollowupBot", a: "Warm · Persistent" },
  { n: "RecoveryBot", a: "Calm · Reassuring" },
  { n: "InsuranceBot", a: "Trusted · Detailed" },
  { n: "LoanAssistBot", a: "Advisory · Crisp" },
  { n: "RealEstateBot", a: "Engaging · Informative" },
  { n: "EcommerceBot", a: "Energetic · Upbeat" },
  { n: "EducationBot", a: "Patient · Encouraging" },
  { n: "HealthCareBot", a: "Empathetic · Soft" },
  { n: "FinanceBot", a: "Analytical · Precise" },
  { n: "HRBot", a: "Polite · Structured" },
  { n: "TravelBot", a: "Cheerful · Inspiring" },
  { n: "RestaurantBot", a: "Welcoming · Casual" },
  { n: "LegalBot", a: "Formal · Concise" },
  { n: "MarketingBot", a: "Persuasive · Crisp" },
  { n: "CRMbot", a: "Organised · Sharp" },
  { n: "OutreachBot", a: "Confident · Direct" },
];

const VOICE_CONVERSATIONS: { ai: string; lead: string; close: string; tag: string }[] = [
  { ai: "Hello, this is {bot} AI calling from Marketon.", lead: "Yes, I wanted to know more about pricing.", close: "Absolutely, I can schedule a quick demo today.", tag: "Pricing inquiry" },
  { ai: "Hi! {bot} from Marketon — got 30 seconds?", lead: "Sure, what is this about?", close: "Perfect, I'll send the proposal right after this call.", tag: "Cold outreach" },
  { ai: "Quick reminder from {bot} about tomorrow's appointment.", lead: "Oh yes, 11 AM works great.", close: "Confirmed — you'll get a WhatsApp reminder shortly.", tag: "Appointment" },
  { ai: "Hey, this is {bot} following up on your enquiry.", lead: "I'm still comparing a few options.", close: "Got it — I'll share a side-by-side comparison now.", tag: "Follow-up" },
  { ai: "Hi, {bot} here — your demo link is ready.", lead: "Awesome, can we move it to Friday?", close: "Done. Rescheduling to Friday 4 PM.", tag: "Reschedule" },
];

function VoiceAgentTab() {
  const [callTime, setCallTime] = useState(154);
  useEffect(() => { const id = setInterval(() => setCallTime((v) => v + 1), 1000); return () => clearInterval(id); }, []);
  const mm = String(Math.floor(callTime / 60)).padStart(2, "0");
  const ss = String(callTime % 60).padStart(2, "0");

  // rotate the 3 side cards every 15s through 20 agents
  const [rot, setRot] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRot((r) => r + 1), 15000);
    return () => clearInterval(id);
  }, []);
  // reset call timer on rotation for the "new call" feel
  useEffect(() => { setCallTime(0); }, [rot]);
  const visibleAgents = Array.from({ length: 3 }, (_, i) => VOICE_AGENTS[(rot * 3 + i) % VOICE_AGENTS.length]);
  const activeAgent = visibleAgents[0];
  const convo = VOICE_CONVERSATIONS[rot % VOICE_CONVERSATIONS.length];

  // active speaker (driven by audio when on, by timer when muted)
  const [speaker, setSpeaker] = useState<"ai" | "lead">("ai");
  const [audioOn, setAudioOn] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // load voices (async on some browsers)
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  // pick voices: one fixed premium AI voice for all agents, rotating realistic customer voices
  const pickBest = (matchers: RegExp[]) => {
    for (const re of matchers) {
      const v = voices.find((x) => re.test(x.name) || re.test(x.voiceURI));
      if (v) return v;
    }
    return undefined;
  };
  const aiVoice =
    pickBest([
      /Google US English/i,            // Chrome – very natural
      /Microsoft Aria.*Online.*Natural/i, // Edge neural
      /Microsoft Jenny.*Natural/i,
      /Samantha/i,                     // Safari macOS premium
      /Google UK English Female/i,
    ]) ||
    voices.find((v) => v.lang === "en-US") ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0];
  const customerCandidates = voices.filter(
    (v) =>
      v.lang.startsWith("en") &&
      v !== aiVoice &&
      // prefer high quality, drop low-quality eSpeak / compact voices
      !/eSpeak|espeak|compact/i.test(v.name),
  );
  const customerPool = customerCandidates.length ? customerCandidates : voices.filter((v) => v !== aiVoice);
  const customerVoice = customerPool.length ? customerPool[rot % customerPool.length] : aiVoice;



  // speech queue or visual-only fallback
  useEffect(() => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    if (!audioOn || !synth || !aiVoice) {
      setSpeaker("ai");
      const id = setInterval(() => setSpeaker((s) => (s === "ai" ? "lead" : "ai")), 2400);
      return () => clearInterval(id);
    }
    synth.cancel();
    const lines: { text: string; who: "ai" | "lead"; voice: SpeechSynthesisVoice; rate: number; pitch: number }[] = [
      { text: convo.ai.replace("{bot}", activeAgent.n), who: "ai", voice: aiVoice, rate: 1.05, pitch: 1.0 },
      { text: convo.lead, who: "lead", voice: customerVoice || aiVoice, rate: 0.92 + (rot % 4) * 0.06, pitch: 0.85 + (rot % 5) * 0.09 },
      { text: convo.close, who: "ai", voice: aiVoice, rate: 1.05, pitch: 1.0 },
    ];
    let cancelled = false;
    let i = 0;
    const speakNext = () => {
      if (cancelled || i >= lines.length) return;
      const ln = lines[i++];
      const u = new SpeechSynthesisUtterance(ln.text);
      u.voice = ln.voice;
      u.rate = ln.rate;
      u.pitch = ln.pitch;
      u.volume = 1;
      u.onstart = () => setSpeaker(ln.who);
      u.onend = () => window.setTimeout(speakNext, 450);
      synth.speak(u);
    };
    speakNext();
    return () => {
      cancelled = true;
      synth.cancel();
    };
  }, [rot, audioOn, aiVoice, customerVoice, activeAgent.n, convo]);

  const enableAudio = () => {
    // unlock speech synthesis inside the user gesture
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const warm = new SpeechSynthesisUtterance(" ");
      warm.volume = 0;
      window.speechSynthesis.speak(warm);
    }
    setAudioOn(true);
  };
  const muteAudio = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setAudioOn(false);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);



  return (
    <>
      <motion.div
        animate={{ boxShadow: [
          "0 10px 30px -20px rgba(147,51,234,0.2)",
          "0 18px 50px -20px rgba(147,51,234,0.45)",
          "0 10px 30px -20px rgba(147,51,234,0.2)",
        ]}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-mk-bg rounded-2xl p-6 flex flex-col gap-4 overflow-hidden"
      >
        {/* breathing glow sweep */}
        <motion.span
          aria-hidden
          className="absolute -inset-1 pointer-events-none rounded-3xl"
          style={{ background: "radial-gradient(60% 40% at 50% 0%, rgba(168,85,247,0.2), rgba(34,211,238,0.12) 40%, transparent 70%)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600">
            <motion.span
              className="w-2 h-2 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            /> LIVE CALL
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={audioOn ? muteAudio : enableAudio}
              className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full border transition-colors ${audioOn ? "bg-mk-orange text-white border-mk-orange" : "bg-white text-mk-navy border-mk-border hover:border-mk-orange"}`}
            >
              {audioOn ? "● SOUND ON" : "▶ ENABLE SOUND"}
            </button>
            <span className="font-mono text-mk-navy font-bold tabular-nums">00:{mm}:{ss}</span>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <motion.span
              aria-hidden
              className="absolute -inset-1.5 rounded-full border border-mk-orange/40"
              animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeAgent.n}
                initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 15 }}
                transition={{ duration: 0.5, ease: EASE_EXPO }}
                className="relative w-12 h-12 rounded-full bg-mk-navy text-white flex items-center justify-center font-bold"
              >
                {activeAgent.n[0]}
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAgent.n + "-meta"}
              initial={{ x: 14, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -14, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-bold text-mk-navy">{activeAgent.n} AI</p>
              <p className="text-xs text-mk-body">
                <motion.span
                  key={speaker}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={speaker === "ai" ? "text-mk-orange font-semibold" : "text-emerald-600 font-semibold"}
                >
                  {speaker === "ai" ? "● AI Speaking…" : "● Customer Responding…"}
                </motion.span>{" "} · {convo.tag}
              </p>

            </motion.div>
          </AnimatePresence>
        </div>
        <MkWaveform speaker={speaker} />
        <div className="relative bg-white rounded-xl p-4 text-sm flex flex-col gap-2 max-h-40 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={rot}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col gap-2"
            >
              <motion.p
                animate={speaker === "ai" ? { textShadow: "0 0 14px rgba(147,51,234,0.45)" } : { textShadow: "0 0 0 rgba(0,0,0,0)" }}
                transition={{ duration: 0.4 }}
              >
                <b className="text-mk-orange">AI:</b> {convo.ai.replace("{bot}", activeAgent.n)}
              </motion.p>
              <motion.p
                animate={speaker === "lead" ? { textShadow: "0 0 14px rgba(56,132,255,0.45)" } : { textShadow: "0 0 0 rgba(0,0,0,0)" }}
                transition={{ duration: 0.4 }}
              >
                <b className="text-mk-navy">Lead:</b> {convo.lead}
              </motion.p>
              <motion.p
                animate={speaker === "ai" ? { textShadow: "0 0 14px rgba(147,51,234,0.45)" } : { textShadow: "0 0 0 rgba(0,0,0,0)" }}
                transition={{ duration: 0.4 }}
              >
                <b className="text-mk-orange">AI:</b> {convo.close}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="flex flex-col gap-3 relative">
        <AnimatePresence mode="popLayout">
          {visibleAgents.map((b, i) => (
            <motion.div
              key={`${rot}-${b.n}`}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.96 }}
              transition={{ duration: 0.55, ease: EASE_EXPO, delay: i * 0.08 }}
              whileHover={{ y: -3, boxShadow: "0 14px 30px -18px rgba(147,51,234,0.45)" }}
              className={`relative flex items-center justify-between p-4 rounded-xl border bg-white overflow-hidden ${i === 0 ? "border-mk-orange/60" : "border-mk-border"}`}
            >
              {i === 0 && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(110deg, transparent 0%, rgba(147,51,234,0.10) 50%, transparent 100%)" }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-mk-bg text-mk-navy flex items-center justify-center font-bold">{b.n[0]}</div>
                <div>
                  <p className="font-semibold text-mk-navy text-sm">{b.n}</p>
                  <p className="text-xs text-mk-body">{b.a}</p>
                </div>
              </div>
              <motion.span
                className={`w-2 h-2 rounded-full ${i === 0 ? "bg-mk-orange" : "bg-emerald-500"}`}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.3 + i * 0.2, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
function MkWaveform({ speaker = "ai" }: { speaker?: "ai" | "lead" }) {
  const [heights, setHeights] = useState<number[]>(Array(28).fill(20));
  const seedsRef = useRef<number[]>(Array.from({ length: 28 }, () => Math.random() * Math.PI * 2));
  useEffect(() => {
    let raf = 0;
    const tick = (time: number) => {
      const t = time / 1000;
      const baseFreq = speaker === "ai" ? 5.2 : 3.6;
      const amp = speaker === "ai" ? 30 : 22;
      const center = 14;
      setHeights(
        Array.from({ length: 28 }, (_, i) => {
          const seed = seedsRef.current[i];
          const distance = 1 - Math.abs(i - center) / center;
          const wobble = Math.sin(t * baseFreq + seed) * 0.6 + Math.sin(t * baseFreq * 1.7 + seed * 1.3) * 0.4;
          const burst = Math.abs(Math.sin(t * 2 + i * 0.3));
          return 10 + Math.abs(wobble) * amp * (0.5 + distance * 0.8) + burst * 6;
        })
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speaker]);
  const color = speaker === "ai" ? "bg-mk-orange" : "bg-emerald-500";
  const glow = speaker === "ai" ? "rgba(147,51,234,0.5)" : "rgba(16,185,129,0.5)";
  return (
    <div className="relative flex items-center justify-center gap-1.5 h-16">
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{ boxShadow: [`0 0 0 rgba(0,0,0,0)`, `0 0 28px ${glow}`, `0 0 0 rgba(0,0,0,0)`] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {heights.map((h, i) => (
        <motion.span
          key={i}
          style={{ height: h }}
          className={`w-1.5 rounded-full ${i === 14 ? color : speaker === "ai" ? "bg-mk-navy/40" : "bg-mk-navy/30"}`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: (i % 6) * 0.06 }}
        />
      ))}
    </div>
  );
}


function WorkflowTab() {
  const modules = [
    { s: "Ingest",   sub: "lead.capture",     Icon: Users,        accent: "#6366F1", glow: "rgba(99,102,241,0.55)" },
    { s: "Enrich",   sub: "ai.personalize",   Icon: Mail,         accent: "#0EA5E9", glow: "rgba(14,165,233,0.55)" },
    { s: "Qualify",  sub: "ai.score.engine",  Icon: Brain,        accent: "#9333EA", glow: "rgba(147,51,234,0.7)"  },
    { s: "Schedule", sub: "calendar.sync",    Icon: CalendarIcon, accent: "#A855F7", glow: "rgba(168,85,247,0.55)" },
    { s: "Convert",  sub: "crm.revenue",      Icon: Trophy,       accent: "#10B981", glow: "rgba(16,185,129,0.55)" },
  ];

  const logTemplates = [
    { icon: Users,        text: "lead.new · #LD-{n} captured from instagram.dm", c: "#6366F1" },
    { icon: Brain,        text: "ai.score · #LD-{n} → 87 (hot)", c: "#9333EA" },
    { icon: Mail,         text: "msg.sent · welcome.seq:v3 → 312 inboxes", c: "#0EA5E9" },
    { icon: CalendarIcon, text: "appt.booked · #LD-{n} → tue 14:30", c: "#A855F7" },
    { icon: Database,     text: "crm.sync · 48 records → hubspot ✓", c: "#10B981" },
    { icon: PhoneCall,    text: "ai.call · #LD-{n} answered · 2m 14s", c: "#9333EA" },
    { icon: Zap,          text: "trigger · retarget.cohort:warm fired", c: "#F43F5E" },
    { icon: Sparkles,     text: "ai.decide · branch:nurture → mid-funnel", c: "#0EA5E9" },
    { icon: Trophy,       text: "deal.won · #LD-{n} · $4,820 mrr +", c: "#10B981" },
  ];

  const [tick, setTick] = useState(0);
  const [active, setActive] = useState(2);
  const [logs, setLogs] = useState<Array<{ id: number; icon: typeof Users; text: string; c: string; t: string }>>([]);
  const logId = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 900);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setActive((v) => (v + 1) % modules.length), 1500);
    return () => clearInterval(t);
  }, [modules.length]);
  useEffect(() => {
    const push = () => {
      const tpl = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const n = 8200 + Math.floor(Math.random() * 900);
      const d = new Date();
      const t = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
      logId.current += 1;
      setLogs((prev) => [{ id: logId.current, icon: tpl.icon, text: tpl.text.replace("{n}", String(n)), c: tpl.c, t }, ...prev].slice(0, 6));
    };
    push(); push(); push();
    const iv = setInterval(push, 1100);
    return () => clearInterval(iv);
  }, []);

  const leadsProcessed = 4832 + tick * 3;
  const aiDecisions = 1284 + tick * 2;
  const cpu = 38 + Math.round(Math.sin(tick / 2) * 6 + 12);
  const throughput = 240 + Math.round(Math.sin(tick / 3) * 30);

  return (
    <>
      {/* ============== LEFT — LIVE AI OS PANEL ============== */}
      <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10"
        style={{ background: "radial-gradient(120% 80% at 0% 0%, #1f2a4a 0%, #121a33 45%, #0a1024 100%)" }}>
        {/* moving mesh grid */}
        <motion.div
          aria-hidden
          animate={{ backgroundPositionX: ["0px", "48px"], backgroundPositionY: ["0px", "48px"] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.14] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 85%)",
          }}
        />
        {/* ambient orbs */}
        <motion.div
          animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-mk-orange/30 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.25, 1] }}
          transition={{ duration: 9, repeat: Infinity, delay: 1.5 }}
          className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none"
        />
        {/* floating particles */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/40 pointer-events-none"
            style={{ left: `${(i * 53) % 95 + 2}%`, top: `${(i * 37) % 85 + 5}%` }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}

        {/* === OS chrome === */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 text-[10px] font-mono uppercase tracking-[0.22em] text-white/55">marketon ▸ automation.engine</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]"
            />
            <span className="text-[10px] font-mono text-emerald-300/90">live</span>
          </div>
        </div>

        <div className="relative z-10 p-4 space-y-4">
          {/* === ACTIVITY STREAM === */}
          <div className="relative rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] backdrop-blur-md overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">event.stream</span>
              </div>
              <span className="text-[9px] font-mono text-white/40">{throughput}/s</span>
            </div>
            <div className="relative h-[112px] overflow-hidden">
              <AnimatePresence initial={false}>
                {logs.map((l, idx) => {
                  const Icon = l.icon;
                  return (
                    <motion.div
                      key={l.id}
                      initial={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                      animate={{ opacity: 1 - idx * 0.14, y: idx * 18, filter: "blur(0px)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_EXPO }}
                      className="absolute inset-x-3 top-1.5 flex items-center gap-2 text-[10.5px] font-mono"
                    >
                      <span className="text-white/35 tabular-nums">{l.t}</span>
                      <span className="w-4 h-4 rounded-md flex items-center justify-center" style={{ background: `${l.c}22`, color: l.c }}>
                        <Icon className="w-2.5 h-2.5" />
                      </span>
                      <span className="text-white/80 truncate">{l.text}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {/* fade bottom */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0a1024] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* === PIPELINE: overlapping floating modules + particle stream === */}
          <div className="relative h-[150px]">
            {/* streaming beam beneath cards */}
            <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-12 pointer-events-none" viewBox="0 0 500 48" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wfBeam" x1="0" x2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity="0.0" />
                  <stop offset="20%" stopColor="#6366F1" stopOpacity="0.7" />
                  <stop offset="55%" stopColor="#9333EA" stopOpacity="0.9" />
                  <stop offset="85%" stopColor="#10B981" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
                <filter id="wfGlow" x="-20%" y="-200%" width="140%" height="500%">
                  <feGaussianBlur stdDeviation="2.5" />
                </filter>
              </defs>
              <path d="M 10 24 Q 125 4 250 24 T 490 24" stroke="url(#wfBeam)" strokeWidth="1.4" fill="none" opacity="0.9" />
              <path d="M 10 24 Q 125 4 250 24 T 490 24" stroke="url(#wfBeam)" strokeWidth="3" fill="none" opacity="0.35" filter="url(#wfGlow)" />
              {/* travelling particles */}
              {[0, 0.18, 0.36, 0.55, 0.72, 0.88].map((delay, i) => (
                <motion.circle
                  key={i}
                  r="2.2"
                  fill="#fff"
                  initial={{ offsetDistance: "0%" }}
                  style={{ offsetPath: "path('M 10 24 Q 125 4 250 24 T 490 24')", offsetRotate: "0deg", filter: "drop-shadow(0 0 4px rgba(255,255,255,0.9))" } as any}
                  animate={{ offsetDistance: ["0%", "100%"] } as any}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: delay * 2.6 }}
                />
              ))}
            </svg>

            {/* floating module cards — overlapping, organic */}
            <div className="absolute inset-0 flex items-center justify-between">
              {modules.map((m, i) => {
                const isActive = active === i;
                const Icon = m.Icon;
                const yOffset = i % 2 === 0 ? -10 : 12;
                return (
                  <motion.div
                    key={m.s}
                    animate={{ y: [yOffset, yOffset - 4, yOffset] }}
                    transition={{ duration: 3.4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative -mx-1 first:ml-0 last:mr-0"
                    style={{ zIndex: isActive ? 30 : 10 + i }}
                  >
                    <motion.div
                      animate={isActive ? { scale: 1.06 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 18 }}
                      className="relative w-[88px] rounded-2xl px-2 py-2.5 backdrop-blur-xl ring-1 overflow-hidden"
                      style={{
                        background: `linear-gradient(180deg, ${m.accent}22, rgba(255,255,255,0.03))`,
                        borderColor: `${m.accent}66`,
                        boxShadow: isActive
                          ? `0 0 0 1px ${m.accent}, 0 12px 40px -8px ${m.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`
                          : `0 8px 22px -10px ${m.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                      }}
                    >
                      {/* breathing ring */}
                      {isActive && (
                        <motion.span
                          aria-hidden
                          initial={{ scale: 0.85, opacity: 0.7 }}
                          animate={{ scale: 1.35, opacity: 0 }}
                          transition={{ duration: 1.3, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl"
                          style={{ boxShadow: `0 0 0 2px ${m.accent}` }}
                        />
                      )}
                      {/* sweep */}
                      <motion.span
                        aria-hidden
                        animate={{ x: ["-120%", "220%"] }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                      />
                      <div className="relative flex flex-col items-center gap-1.5">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${m.accent}33`, color: "#fff" }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="text-[11px] font-semibold text-white leading-none">{m.s}</p>
                        <p className="text-[8.5px] font-mono text-white/45 leading-none truncate w-full text-center">{m.sub}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <motion.span
                            animate={isActive ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                            className="w-1 h-1 rounded-full"
                            style={{ background: isActive ? "#34D399" : "rgba(255,255,255,0.4)", boxShadow: isActive ? "0 0 6px rgba(16,185,129,0.9)" : "none" }}
                          />
                          <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: isActive ? "#6EE7B7" : "rgba(255,255,255,0.4)" }}>
                            {isActive ? "run" : "rdy"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* === STATUS BAR === */}
          <div className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] backdrop-blur-md px-3 py-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/55">
              <Cpu className="w-3 h-3 text-mk-orange" />
              <span>cpu</span>
              <span className="text-white tabular-nums">{cpu}%</span>
            </div>
            <div className="flex-1 mx-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                animate={{ width: `${cpu}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-mk-orange via-fuchsia-400 to-mk-orange"
              />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/55">
              <Workflow className="w-3 h-3 text-emerald-400" />
              <motion.span key={leadsProcessed} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} className="text-white tabular-nums">
                {leadsProcessed.toLocaleString()}
              </motion.span>
              <span>ops</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============== RIGHT — LIVE KPI STACK (dark, immersive) ============== */}
      <div className="flex flex-col gap-3">
        {[
          { l: "Active Workflows", v: "12",                         icon: Workflow, c: "#9333EA" },
          { l: "Leads Automated",  v: leadsProcessed.toLocaleString(), icon: Zap,      c: "#34D399" },
          { l: "AI Decisions / min", v: aiDecisions.toLocaleString(), icon: Brain,    c: "#818CF8" },
          { l: "Conversion Rate",  v: `${(34.2 + Math.sin(tick / 4) * 0.6).toFixed(1)}%`, icon: TrendingUp, c: "#FB7185" },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.l}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, ease: EASE_EXPO }}
              whileHover={{ y: -2, scale: 1.01 }}
              className="relative p-3.5 rounded-xl overflow-hidden group ring-1 ring-white/[0.08] backdrop-blur-xl"
              style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015))", boxShadow: "0 12px 30px -18px rgba(0,0,0,0.6)" }}
            >
              {/* scan shimmer */}
              <motion.div
                animate={{ x: ["-100%", "220%"] }}
                transition={{ duration: 3.8, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent pointer-events-none"
              />
              {/* corner glow */}
              <span aria-hidden className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none" style={{ background: `${k.c}33`, filter: "blur(28px)" }} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/45">{k.l}</p>
                  <motion.p
                    key={k.v}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-display text-2xl text-white mt-1 tabular-nums"
                  >
                    {k.v}
                  </motion.p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center ring-1 ring-white/10" style={{ background: `${k.c}22`, color: k.c }}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              {/* live mini sparkline */}
              <svg className="relative mt-2 w-full h-6" viewBox="0 0 100 24" preserveAspectRatio="none">
                <motion.path
                  d={Array.from({ length: 20 }, (_, idx) => {
                    const x = (idx / 19) * 100;
                    const y = 12 + Math.sin((idx + tick + i * 3) * 0.7) * 6;
                    return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                  }).join(" ")}
                  fill="none"
                  stroke={k.c}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

function AnalyticsTab() {
  const [tick, setTick] = useState(0);
  const [hoverBar, setHoverBar] = useState<number | null>(null);
  const [hoverPt, setHoverPt] = useState<number | null>(null);

  // Live bar data — smooth drift around base values
  const baseBars = [
    { n: "Leads", base: 25630, color: "from-indigo-400 to-indigo-600" },
    { n: "Qualified", base: 12410, color: "from-sky-400 to-cyan-500" },
    { n: "Engaged", base: 8200, color: "from-violet-400 to-fuchsia-500" },
    { n: "Appts", base: 4520, color: "from-emerald-400 to-teal-500" },
    { n: "Convert", base: 3245, color: "from-mk-orange to-fuchsia-500" },
  ];
  const bars = baseBars.map((b, i) => ({
    ...b,
    v: Math.round(b.base * (1 + Math.sin(tick / 3 + i) * 0.04 + tick * 0.0015)),
  }));
  const maxBar = Math.max(...bars.map((b) => b.v));

  // Live line data
  const line = Array.from({ length: 12 }, (_, i) => ({
    d: `D${i + 1}`,
    v: 1200 + Math.round(Math.sin(i * 0.7 + tick / 2) * 320) + i * 180 + tick * 4,
  }));
  const maxL = Math.max(...line.map((p) => p.v));
  const minL = Math.min(...line.map((p) => p.v));
  const W = 500;
  const H = 130;
  const padX = 18;
  const padY = 14;
  const px = (i: number) => padX + (i * (W - padX * 2)) / (line.length - 1);
  const py = (v: number) => H - padY - ((v - minL) / Math.max(1, maxL - minL)) * (H - padY * 2);
  // smooth catmull-rom to bezier path
  const path = line.reduce((acc, p, i, a) => {
    const x = px(i); const y = py(p.v);
    if (i === 0) return `M ${x} ${y}`;
    const p0 = a[i - 1]; const x0 = px(i - 1); const y0 = py(p0.v);
    const cx = (x0 + x) / 2;
    return `${acc} C ${cx} ${y0} ${cx} ${y} ${x} ${y}`;
  }, "");
  const areaPath = `${path} L ${px(line.length - 1)} ${H - padY} L ${px(0)} ${H - padY} Z`;

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1400);
    return () => clearInterval(t);
  }, []);

  const totalLeads = 25630 + tick * 7;
  const conv = (12.4 + Math.sin(tick / 4) * 1.6 + tick * 0.02).toFixed(1);

  return (
    <>
      <div className="bg-mk-bg rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden">
        {/* animated grid + glow backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(27,43,75,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(27,43,75,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
          }}
        />
        <motion.div
          animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-mk-orange/15 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-indigo-400/15 blur-3xl pointer-events-none"
        />

        {/* live header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-500"
            />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-mk-navy/70">Live AI Analytics</span>
            <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">SYNCING</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-mk-body">
            <span>Leads <motion.b key={totalLeads} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-mk-navy font-bold">{totalLeads.toLocaleString()}</motion.b></span>
            <span>Conv <motion.b key={conv} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-mk-orange font-bold">{conv}%</motion.b></span>
          </div>
        </div>

        {/* BAR CHART */}
        <div className="relative h-44 z-10">
          <div className="absolute inset-0 flex items-end justify-between gap-2 px-1">
            {bars.map((b, i) => {
              const h = (b.v / maxBar) * 100;
              const isHover = hoverBar === i;
              return (
                <div key={b.n}
                  onMouseEnter={() => setHoverBar(i)}
                  onMouseLeave={() => setHoverBar(null)}
                  className="relative flex-1 h-full flex flex-col items-center justify-end group"
                >
                  {/* tooltip */}
                  <AnimatePresence>
                    {isHover && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.9 }}
                        transition={{ duration: 0.18 }}
                        className="absolute -top-1 z-20 backdrop-blur-xl bg-white/80 ring-1 ring-mk-navy/15 shadow-xl rounded-lg px-2.5 py-1.5 text-[10px] min-w-[110px]"
                      >
                        <p className="font-bold text-mk-navy">{b.n}</p>
                        <p className="text-mk-navy/80">{b.v.toLocaleString()} leads</p>
                        <p className="text-emerald-600 font-semibold">▲ +{(Math.abs(Math.sin(tick + i)) * 12 + 2).toFixed(1)}%</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    animate={{ height: `${h}%` }}
                    transition={{ type: "spring", stiffness: 90, damping: 18, delay: i * 0.05 }}
                    className={`relative w-[70%] rounded-t-lg bg-gradient-to-t ${b.color} overflow-hidden ring-1 ring-white/40`}
                    style={{
                      boxShadow: isHover
                        ? "0 0 24px rgba(147,51,234,0.55), 0 0 0 1px rgba(255,255,255,0.5)"
                        : "0 6px 20px -8px rgba(27,43,75,0.4)",
                    }}
                  >
                    {/* glass overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />
                    {/* moving shine */}
                    <motion.div
                      animate={{ y: ["120%", "-20%"] }}
                      transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
                      className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-white/60 to-transparent blur-sm pointer-events-none"
                    />
                    {/* pulse */}
                    <motion.div
                      animate={{ opacity: [0.15, 0.45, 0.15] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                      className="absolute inset-0 bg-white/20 pointer-events-none"
                    />
                  </motion.div>
                  <span className="mt-1 text-[10px] text-mk-body font-medium">{b.n}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* LINE CHART */}
        <div className="relative h-32 z-10">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="aLineFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#9333EA" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#9333EA" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="aLineStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="50%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
              <filter id="aGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* gridlines */}
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={padX} x2={W - padX} y1={padY + g * (H - padY * 2)} y2={padY + g * (H - padY * 2)}
                stroke="rgba(27,43,75,0.07)" strokeDasharray="3 4" />
            ))}

            {/* area */}
            <motion.path
              d={areaPath}
              fill="url(#aLineFill)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            {/* stroke */}
            <motion.path
              key={`p-${tick % 30}`}
              d={path}
              stroke="url(#aLineStroke)"
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#aGlow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
            {/* flowing pulse dash */}
            <motion.path
              d={path}
              stroke="#fff"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="6 240"
              animate={{ strokeDashoffset: [0, -246] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              opacity={0.9}
            />

            {/* points */}
            {line.map((p, i) => {
              const x = px(i); const y = py(p.v);
              const active = hoverPt === i;
              return (
                <g key={i} onMouseEnter={() => setHoverPt(i)} onMouseLeave={() => setHoverPt(null)}>
                  {active && <circle cx={x} cy={y} r={10} fill="#9333EA" opacity={0.2} />}
                  <motion.circle
                    cx={x} cy={y}
                    r={active ? 5 : 3}
                    fill="#fff"
                    stroke="#9333EA"
                    strokeWidth={2}
                    animate={{ r: active ? 5 : [3, 4, 3] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.1 }}
                  />
                  <rect x={x - 12} y={padY} width={24} height={H - padY * 2} fill="transparent" />
                </g>
              );
            })}

            {/* moving live dot */}
            <motion.circle
              r={4}
              fill="#9333EA"
              animate={{
                cx: line.map((_, i) => px(i)),
                cy: line.map((p) => py(p.v)),
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
            </motion.circle>
          </svg>

          {/* hover tooltip */}
          <AnimatePresence>
            {hoverPt !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute pointer-events-none backdrop-blur-xl bg-white/80 ring-1 ring-mk-orange/30 shadow-xl rounded-lg px-2.5 py-1.5 text-[10px]"
                style={{
                  left: `${(px(hoverPt) / W) * 100}%`,
                  top: `${(py(line[hoverPt].v) / H) * 100}%`,
                  transform: "translate(-50%, -120%)",
                }}
              >
                <p className="font-bold text-mk-navy">{line[hoverPt].d}</p>
                <p className="text-mk-navy/80">{line[hoverPt].v.toLocaleString()} leads</p>
                <p className="text-emerald-600 font-semibold">AI · trending up</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          ["Total Leads", totalLeads.toLocaleString(), "+12.4%"],
          ["Hot Leads", (6521 + tick * 2).toLocaleString(), "+8.1%"],
          ["Revenue", "₹2.45 Cr", "+18.7%"],
          ["ROI", "320%", "+24%"],
          ["AI Confidence", `${(92 + Math.sin(tick / 3) * 1.4).toFixed(1)}%`, "live"],
          ["Conversions", `${conv}%`, "+2.3%"],
        ].map(([l, v, delta], i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className="relative p-3 rounded-xl border border-mk-border bg-white/60 backdrop-blur-sm overflow-hidden group"
          >
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3.6, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-mk-orange/10 to-transparent pointer-events-none"
            />
            <p className="text-[11px] text-mk-body uppercase relative">{l}</p>
            <div className="flex items-baseline justify-between relative">
              <motion.p key={String(v)} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl text-mk-navy">{v}</motion.p>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{delta}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

/* ----------------------------- Architecture (17 modules) ----------------------------- */

const MOD_LIST: { n: number; title: string; color: string; icon: ReactNode; items: string[] }[] = [
  { n: 1, title: "Lead Sources", color: "bg-blue-500", icon: <Globe />, items: ["Website Forms", "Landing Pages", "WhatsApp", "Facebook Ads", "Google Ads", "Instagram", "Referrals", "QR Codes", "Cold Calls", "Webinars", "Events", "Imports"] },
  { n: 2, title: "Data Capture & CRM", color: "bg-purple-500", icon: <Database />, items: ["Unified Profiles", "Behavioral Data", "Source Attribution", "Engagement History", "Custom Fields", "Tag Management", "Lifecycle Stage"] },
  { n: 3, title: "AI Brain Engine", color: "bg-mk-orange", icon: <Brain />, items: ["NLU", "Sentiment Analysis", "Intent Detection", "Persona Models", "Lookalike Audiences", "Behavior Clustering", "Pattern Mining", "Predictive Scoring"] },
  { n: 4, title: "AI Decision Engine", color: "bg-red-500", icon: <Cpu />, items: ["Best Channel", "Best Time", "Best Message", "Next Action", "Priority Score", "Confidence", "A/B Routing", "Auto-Escalation"] },
  { n: 5, title: "Omnichannel Automation", color: "bg-emerald-500", icon: <Radio />, items: ["WhatsApp", "SMS", "Email", "Voice", "Instagram", "Messenger", "Telegram", "Web Push", "In-App"] },
  { n: 6, title: "Customer Journey", color: "bg-teal-500", icon: <Workflow />, items: ["Capture", "Qualify", "Nurture", "Convert", "Retain", "Advocate"] },
  { n: 7, title: "AI Workflow Automation", color: "bg-mk-navy", icon: <GitBranch />, items: ["Visual Builder", "Triggers", "Conditions", "Branches", "Delays", "Webhooks", "Multi-step Flows"] },
  { n: 8, title: "AI Voice Agent", color: "bg-indigo-500", icon: <PhoneCall />, items: ["Natural Voice", "Multi-language", "Real-time Transcription", "Scheduling", "Qualification", "Handoff"] },
  { n: 9, title: "Retargeting Engine", color: "bg-pink-500", icon: <Target />, items: ["Custom Audiences", "Lookalikes", "Cart Recovery", "Drop-off Recapture", "Cross-channel Retarget", "Dynamic Ads"] },
  { n: 10, title: "Content AI Studio", color: "bg-yellow-500", icon: <PenTool />, items: ["Ad Copy", "Email Drafts", "Captions", "Landing Headlines", "Image Prompts", "Video Scripts", "Translation"] },
  { n: 11, title: "Appointment & Calendar", color: "bg-emerald-600", icon: <CalendarIcon />, items: ["Smart Scheduling", "Calendar Sync", "Reminders", "Reschedules", "Team Routing", "Timezone Aware", "Booking Pages"] },
  { n: 12, title: "Reminder System", color: "bg-amber-500", icon: <Bell />, items: ["Pre-call", "Pre-appointment", "Follow-ups", "Renewal", "Birthday", "Payment", "Custom"] },
  { n: 13, title: "CRM & Team Management", color: "bg-slate-600", icon: <Users />, items: ["Roles & Permissions", "Lead Assignment", "Activity Logs", "Notes", "Tasks", "Team Performance", "Goals"] },
  { n: 14, title: "Analytics & Reporting", color: "bg-blue-600", icon: <BarChart3 />, items: ["25,630+ Leads", "92% AI Confidence", "₹2.45 Cr Revenue", "320% ROI", "34% Conversion", "Channel ROI", "Funnel Metrics", "Cohorts", "LTV", "CAC", "Heatmaps", "Custom Reports"] },
  { n: 15, title: "System Infrastructure", color: "bg-gray-500", icon: <Server />, items: ["Multi-tenant", "Auto-scaling", "99.9% Uptime", "<100ms Latency", "Backups", "Encryption", "Compliance", "Audit Logs"] },
  { n: 16, title: "AI Insights & Predictions", color: "bg-violet-500", icon: <Sparkles />, items: ["Churn Risk", "Best Customer", "Revenue Forecast", "Trend Detection", "Anomalies", "Win-back", "Upsell Signals", "Seasonality", "Channel Mix"] },
  { n: 17, title: "Business Results", color: "bg-amber-400", icon: <Trophy />, items: ["3x Conversions", "60% Less Effort", "5x Faster Follow-up", "92% Show Rate", "320% ROI", "<24h Setup", "Scalable", "Always-on"] },
];

/* ===== AI Lead Command Center (replaces old Journey Builder flowchart) ===== */

function Architecture() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-white">
      {/* ambient backdrop */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 500px at 20% 10%, rgba(168,85,247,0.14), transparent 60%), radial-gradient(900px 600px at 85% 90%, rgba(34,211,238,0.12), transparent 60%), radial-gradient(700px 500px at 50% 50%, rgba(217,70,239,0.06), transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(27,43,75,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(27,43,75,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 80%)",
          }}
        />
        <CommandParticles />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <p className="text-center text-[11px] font-bold tracking-[0.28em] text-emerald-400 uppercase">
              AI Operations · Live
            </p>
          </div>
          <h2 className="font-display text-[32px] md:text-[52px] text-mk-navy text-center leading-[1.05]">
            Lead Command Center
          </h2>
          <p className="text-mk-body/85 max-w-2xl mx-auto text-center mt-4 text-[15px]">
            Real customers entering. <HighlightWord>AI qualifying</HighlightWord> intent. Omnichannel <HighlightWord>auto-replying</HighlightWord>.
            Voice agent booking. CRM syncing. <HighlightWord>Revenue growing</HighlightWord> — all happening right now.
          </p>
        </Reveal>

        <Reveal>
          <StoryFlow />
          <CommandHeader />
          <div className="mt-5 grid grid-cols-12 gap-4 auto-rows-[minmax(160px,auto)]">
            <div className="col-span-12 lg:col-span-4 lg:row-span-2"><LiveLeadFeed /></div>
            <div className="col-span-12 md:col-span-7 lg:col-span-5"><AIQualification /></div>
            <div className="col-span-12 md:col-span-5 lg:col-span-3"><OmnichannelLive /></div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4"><VoiceAgentLive /></div>
            <div className="col-span-12 md:col-span-6 lg:col-span-4"><CRMSyncLive /></div>
          </div>
          <CommandFooter />
        </Reveal>
      </div>
    </section>
  );
}

/* ---- ambient particle canvas (depth, no arrows / no diagram) ---- */
function CommandParticles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    type P = { x: number; y: number; vx: number; vy: number; r: number; w: boolean };
    let particles: P[] = [];
    let w = 0, h = 0;
    const resize = () => {
      const r = c.parentElement!.getBoundingClientRect();
      w = r.width; h = r.height;
      c.width = w * dpr; c.height = h * dpr;
      c.style.width = w + "px"; c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.floor(w * h / 18000));
      particles = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.6 + Math.random() * 1.4,
        w: Math.random() < 0.5,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(c.parentElement!);
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 11000) {
            const al = (1 - d2 / 11000) * 0.14;
            ctx.strokeStyle = a.w
              ? `rgba(147,51,234,${al})`
              : `rgba(120,150,255,${al})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.fillStyle = p.w ? "rgba(147,51,234,0.75)" : "rgba(120,150,255,0.75)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.w ? "rgba(147,51,234,0.6)" : "rgba(120,150,255,0.6)";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full opacity-70" />;
}

/* ---- highlight word with animated underline glow ---- */
function HighlightWord({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block font-semibold text-mk-navy">
      {children}
      <motion.span
        aria-hidden
        className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full"
        style={{ background: "linear-gradient(90deg,#9333EA,#5278FF)" }}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: [0, 1, 1, 0], transformOrigin: ["left", "left", "right", "right"] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </span>
  );
}

/* ---- StoryFlow: 4-step journey strip with flowing AI pulses between steps ---- */
function StoryFlow() {
  const steps = [
    { n: "01", icon: <Users size={14} />, label: "Leads Enter",      sub: "WhatsApp · IG · Web · Calls", c: "#22D3A5" },
    { n: "02", icon: <Brain size={14} />, label: "AI Qualifies",     sub: "Intent · Budget · Score",      c: "#D946EF" },
    { n: "03", icon: <Radio size={14} />, label: "Auto Replies",     sub: "Omnichannel · Voice agent",    c: "#5278FF" },
    { n: "04", icon: <TrendingUp size={14} />, label: "Revenue Grows", sub: "Booked · Closed · Synced",   c: "#9333EA" },
  ];
  return (
    <div className="mt-10 relative">
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0">
        {steps.map((s, i) => (
          <div key={s.n} className="relative flex items-center md:justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative z-10 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border border-mk-border bg-white/90 backdrop-blur"
              style={{ boxShadow: `0 12px 32px -16px ${s.c}55, inset 0 1px 0 rgba(255,255,255,0.9)` }}
            >
              <div
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${s.c}, ${s.c}cc)` }}
              >
                {s.icon}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-xl"
                  animate={{ boxShadow: [`0 0 0 0 ${s.c}66`, `0 0 0 10px ${s.c}00`] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold tracking-[0.18em] text-mk-muted">{s.n}</span>
                  <span className="text-[12.5px] font-bold text-mk-navy leading-none">{s.label}</span>
                </div>
                <p className="text-[10px] text-mk-body/80 mt-0.5 truncate">{s.sub}</p>
              </div>
            </motion.div>

            {/* connector with traveling pulse (desktop) */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-[2px] z-0 mx-2"
                   style={{ width: "calc(100% - 1rem)", transform: "translate(50%, -50%)" }}>
                <div
                  className="relative h-full rounded-full overflow-hidden"
                  style={{ background: `linear-gradient(90deg, ${s.c}33, ${steps[i + 1].c}33)` }}
                >
                  <motion.span
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{ background: s.c, boxShadow: `0 0 10px ${s.c}` }}
                    animate={{ left: ["-5%", "105%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 }}
                  />
                  <motion.span
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ background: steps[i + 1].c, boxShadow: `0 0 8px ${steps[i + 1].c}` }}
                    animate={{ left: ["-5%", "105%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.55 + 1.1 }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- shared glass panel ---- */
function GlassPanel({ children, className = "", glow = "rgba(147,51,234,0.18)" }: { children: ReactNode; className?: string; glow?: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`relative h-full rounded-2xl overflow-hidden border border-mk-border bg-mk-bg  ${className}`}
      style={{ boxShadow: `0 30px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(27,43,75,0.07), 0 0 60px -20px ${glow}` }}
    >
      {/* subtle top highlight */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mk-navy/20 to-transparent" />
      {/* breathing glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl"
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ boxShadow: `inset 0 0 40px ${glow}` }}
      />
      {children}
    </motion.div>
  );
}

function PanelHeader({ title, status, dotColor = "bg-emerald-400" }: { title: string; status: string; dotColor?: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-mk-border">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-mk-navy/90">{title}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`relative flex h-1.5 w-1.5`}>
          <span className={`absolute inset-0 rounded-full ${dotColor} animate-ping opacity-70`} />
          <span className={`relative h-1.5 w-1.5 rounded-full ${dotColor}`} />
        </span>
        <span className="text-[9.5px] font-semibold uppercase tracking-wider text-mk-body">{status}</span>
      </div>
    </div>
  );
}

/* ---- command header strip (live metrics) ---- */
function CommandHeader() {
  const [reqs, setReqs] = useState(48217);
  const [conv, setConv] = useState(14.8);
  const [rev, setRev] = useState(284100);
  useEffect(() => {
    const id = setInterval(() => {
      setReqs((r) => r + Math.floor(Math.random() * 7));
      setConv((c) => Math.max(11, Math.min(22, c + (Math.random() - 0.45) * 0.18)));
      setRev((r) => r + Math.floor(Math.random() * 380));
    }, 1300);
    return () => clearInterval(id);
  }, []);
  const items = [
    { l: "Automations / sec", v: "1,284", sub: "+12% vs avg", c: "text-mk-orange" },
    { l: "Live leads today", v: reqs.toLocaleString(), sub: "real-time", c: "text-emerald-400" },
    { l: "Conversion rate", v: `${conv.toFixed(1)}%`, sub: "24h window", c: "text-sky-400" },
    { l: "Revenue assisted", v: `$${rev.toLocaleString()}`, sub: "today", c: "text-fuchsia-400" },
  ];
  return (
    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <motion.div
          key={it.l}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="relative overflow-hidden rounded-xl border border-mk-border bg-mk-bg  px-4 py-3"
        >
          <p className="text-[10px] font-semibold tracking-wider uppercase text-mk-muted">{it.l}</p>
          <p className={`mt-1 text-[22px] font-bold ${it.c} tabular-nums`}>{it.v}</p>
          <p className="text-[10px] text-mk-muted mt-0.5">{it.sub}</p>
          <motion.div
            aria-hidden
            className="absolute inset-y-0 -left-1/2 w-1/2 pointer-events-none"
            style={{ background: "linear-gradient(90deg,transparent,rgba(27,43,75,0.07),transparent)" }}
            animate={{ x: ["-20%", "240%"] }}
            transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ))}
    </div>
  );
}

function CommandFooter() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border border-mk-border bg-white text-[11px] font-mono text-mk-body/85">
      <div className="flex items-center gap-3">
        <span className="text-mk-orange">●</span>
        <span>region: ap-south-1</span>
        <span>· uptime 99.998%</span>
        <span>· models v3.2</span>
      </div>
      <div className="flex items-center gap-3">
        <span suppressHydrationWarning>last_event {time || "—"}</span>
        <span className="text-emerald-400">healthy</span>
      </div>
    </div>
  );
}

/* ---- 1. Live Lead Feed ---- */
type Lead = {
  id: number;
  name: string;
  channel: "WhatsApp" | "Instagram" | "Website" | "Missed Call" | "Facebook" | "Email";
  intent: string;
  score: number;
  ago: string;
};
const NAMES = ["Rahul Sharma", "Priya Patel", "Aisha Khan", "Marcus Chen", "Sofia Reyes", "Diego Lopez", "Yuki Tanaka", "Liam O'Brien", "Hana Park", "Noah Williams", "Zara Ali", "Ethan Singh"];
const LEAD_CHANNELS: { name: Lead["channel"]; color: string; bg: string; ic: ReactNode }[] = [
  { name: "WhatsApp",    color: "text-emerald-400", bg: "bg-emerald-500/15", ic: <FaWhatsapp size={11} /> },
  { name: "Instagram",   color: "text-rose-400",    bg: "bg-rose-500/15",    ic: <FaInstagram size={11} /> },
  { name: "Website",     color: "text-sky-400",     bg: "bg-sky-500/15",     ic: <Globe size={11} /> },
  { name: "Missed Call", color: "text-amber-400",   bg: "bg-amber-500/15",   ic: <Phone size={11} /> },
  { name: "Facebook",    color: "text-blue-400",    bg: "bg-blue-500/15",    ic: <FaFacebookMessenger size={11} /> },
  { name: "Email",       color: "text-fuchsia-400", bg: "bg-fuchsia-500/15", ic: <Mail size={11} /> },
];
const INTENTS = ["pricing query", "demo request", "abandoned cart", "callback request", "feature ask", "offer click", "support → upsell", "renewal intent"];

function LiveLeadFeed() {
  const [leads, setLeads] = useState<Lead[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      name: NAMES[i % NAMES.length],
      channel: LEAD_CHANNELS[i % LEAD_CHANNELS.length].name,
      intent: INTENTS[i % INTENTS.length],
      score: 55 + Math.floor(Math.random() * 40),
      ago: `${i + 1}m ago`,
    })),
  );
  const nextId = useRef(100);
  useEffect(() => {
    const id = setInterval(() => {
      const ch = LEAD_CHANNELS[Math.floor(Math.random() * LEAD_CHANNELS.length)].name;
      const newLead: Lead = {
        id: nextId.current++,
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        channel: ch,
        intent: INTENTS[Math.floor(Math.random() * INTENTS.length)],
        score: 40 + Math.floor(Math.random() * 60),
        ago: "now",
      };
      setLeads((prev) => [newLead, ...prev.slice(0, 5)]);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <GlassPanel glow="rgba(34,211,165,0.22)">
      <PanelHeader title="Live Lead Feed" status="Streaming" dotColor="bg-emerald-400" />
      <div className="relative px-3 py-3 space-y-2">
        <AnimatePresence initial={false}>
          {leads.map((l) => {
            const ch = LEAD_CHANNELS.find((c) => c.name === l.channel)!;
            return (
              <motion.div
                key={l.id}
                layout
                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 240, damping: 24 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-mk-border bg-mk-bg"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ch.bg} ${ch.color}`}>
                  {ch.ic}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-mk-navy truncate">{l.name}</p>
                  <p className="text-[10px] text-mk-body/75 truncate">{l.channel} · {l.intent}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[12px] font-bold tabular-nums ${l.score >= 80 ? "text-emerald-400" : l.score >= 60 ? "text-amber-400" : "text-mk-body"}`}>{l.score}</p>
                  <p className="text-[9px] text-mk-muted">{l.ago === "now" ? "now" : l.ago}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

/* ---- 2. AI Qualification Engine ---- */
function AIQualification() {
  const [score, setScore] = useState(72);
  const [name, setName] = useState("Priya Patel");
  useEffect(() => {
    const id = setInterval(() => {
      setScore(45 + Math.floor(Math.random() * 50));
      setName(NAMES[Math.floor(Math.random() * NAMES.length)]);
    }, 3400);
    return () => clearInterval(id);
  }, []);
  const intents = [
    { l: "Purchase intent", v: Math.min(98, score + 4) },
    { l: "Budget fit",      v: Math.max(20, score - 12) },
    { l: "Engagement",      v: Math.min(96, score + 10) },
    { l: "Reply velocity",  v: Math.max(25, score - 5) },
  ];
  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (score / 100);
  return (
    <GlassPanel glow="rgba(217,70,239,0.22)">
      <PanelHeader title="AI Qualification Engine" status="Scanning" dotColor="bg-fuchsia-400" />
      <div className="grid grid-cols-[140px_1fr] gap-4 p-4 items-center">
        {/* radial score */}
        <div className="relative w-[140px] h-[140px]">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            <circle cx="70" cy="70" r={radius} stroke="rgba(27,43,75,0.10)" strokeWidth="8" fill="none" />
            <motion.circle
              cx="70" cy="70" r={radius}
              stroke="url(#qualGrad)" strokeWidth="8" fill="none" strokeLinecap="round"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: circ - dash }}
              transition={{ duration: 1.2, ease: EASE_EXPO }}
            />
            <defs>
              <linearGradient id="qualGrad" x1="0" x2="1">
                <stop offset="0" stopColor="#9333EA" />
                <stop offset="1" stopColor="#D946EF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              key={score}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
              className="text-[34px] font-bold text-mk-navy tabular-nums leading-none"
            >
              {score}
            </motion.p>
            <p className="text-[9px] uppercase tracking-widest text-mk-body/75 mt-1">AI Score</p>
          </div>
          {/* orbiting dot */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-mk-orange shadow-[0_0_10px_rgba(147,51,234,0.9)]" />
          </motion.div>
        </div>

        <div className="space-y-2.5 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-fuchsia-500/20 flex items-center justify-center"><Brain size={12} className="text-fuchsia-300" /></div>
            <div className="min-w-0">
              <p className="text-[11px] text-mk-body/85">Currently analyzing</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={name}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="text-[13px] font-semibold text-mk-navy truncate"
                >
                  {name}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          {intents.map((it) => (
            <div key={it.l} className="space-y-1">
              <div className="flex justify-between text-[10px] text-mk-body">
                <span>{it.l}</span>
                <span className="text-mk-navy tabular-nums">{it.v}%</span>
              </div>
              <div className="h-1 rounded-full bg-mk-bg overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#9333EA,#D946EF)" }}
                  animate={{ width: `${it.v}%` }}
                  transition={{ duration: 0.8, ease: EASE_EXPO }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

/* ---- 3. Omnichannel Automation ---- */
function OmnichannelLive() {
  const channels = [
    { name: "WhatsApp", color: "emerald", ic: <FaWhatsapp size={14} /> },
    { name: "Instagram", color: "rose", ic: <FaInstagram size={14} /> },
    { name: "Email", color: "fuchsia", ic: <Mail size={14} /> },
    { name: "SMS", color: "sky", ic: <MessageSquare size={14} /> },
  ];
  const [sentIdx, setSentIdx] = useState(0);
  const [counts, setCounts] = useState([4218, 1284, 2945, 832]);
  useEffect(() => {
    const id = setInterval(() => {
      setSentIdx((i) => (i + 1) % channels.length);
      setCounts((c) => c.map((n) => n + Math.floor(Math.random() * 5)));
    }, 1100);
    return () => clearInterval(id);
  }, []);
  return (
    <GlassPanel glow="rgba(120,150,255,0.2)">
      <PanelHeader title="Omnichannel" status="Auto-replying" dotColor="bg-sky-400" />
      <div className="p-4 space-y-2.5">
        {channels.map((c, i) => {
          const active = i === sentIdx;
          return (
            <motion.div
              key={c.name}
              animate={active ? { x: [0, 2, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className="relative flex items-center gap-3 px-3 py-2 rounded-lg border border-mk-border bg-mk-bg"
            >
              <div className={`w-7 h-7 rounded-md flex items-center justify-center bg-${c.color}-500/20 text-${c.color}-300`}>
                {c.ic}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-mk-navy">{c.name}</p>
                <p className="text-[9.5px] text-mk-muted tabular-nums">{counts[i].toLocaleString()} sent · 24h</p>
              </div>
              {active && (
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-[9.5px] font-bold text-emerald-400"
                >
                  <CheckCircle2 size={11} /> sent
                </motion.span>
              )}
              {active && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  initial={{ boxShadow: "0 0 0 0 rgba(34,211,165,0.5)" }}
                  animate={{ boxShadow: "0 0 0 8px rgba(34,211,165,0)" }}
                  transition={{ duration: 1 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

/* ---- 4. AI Voice Agent ---- */
function VoiceAgentLive() {
  const [phase, setPhase] = useState<"calling" | "talking" | "booking">("calling");
  useEffect(() => {
    const order: typeof phase[] = ["calling", "talking", "booking"];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % order.length;
      setPhase(order[i]);
    }, 2600);
    return () => clearInterval(id);
  }, []);
  const bars = 28;
  return (
    <GlassPanel glow="rgba(147,51,234,0.25)">
      <PanelHeader title="AI Voice Agent" status={phase === "booking" ? "Booked" : "On call"} dotColor={phase === "booking" ? "bg-emerald-400" : "bg-mk-orange"} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ boxShadow: ["0 0 0 0 rgba(147,51,234,0.5)", "0 0 0 14px rgba(147,51,234,0)"] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-mk-orange to-fuchsia-500 flex items-center justify-center text-white"
          >
            <PhoneCall size={16} />
          </motion.div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-mk-navy">Aria · AI Agent</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-[10.5px] text-mk-body/85"
              >
                {phase === "calling" && "Dialing +91 98765 43210…"}
                {phase === "talking" && "Customer interested in demo · qualifying"}
                {phase === "booking" && "Appointment booked · Tue 4:30 PM"}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        {/* waveform */}
        <div className="h-14 flex items-end justify-between gap-[2px] px-1">
          {Array.from({ length: bars }).map((_, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-full bg-gradient-to-t from-mk-orange/40 via-mk-orange to-fuchsia-400"
              animate={{
                scaleY: phase === "booking"
                  ? [0.2, 0.25, 0.2]
                  : [0.2, 0.4 + Math.random() * 0.8, 0.2],
              }}
              transition={{ duration: 0.6 + (i % 5) * 0.1, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
              style={{ transformOrigin: "bottom" }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { l: "Avg call", v: "1m 24s" },
            { l: "Booked / day", v: "318" },
            { l: "Conversion", v: "62%" },
          ].map((s) => (
            <div key={s.l} className="rounded-md border border-mk-border bg-mk-bg py-1.5">
              <p className="text-[9px] uppercase tracking-wider text-mk-muted">{s.l}</p>
              <p className="text-[12px] font-bold text-mk-navy tabular-nums">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}

/* ---- 5. CRM Sync ---- */
type Card = { id: number; name: string; stage: number; score: number };
function CRMSyncLive() {
  const stages = ["New", "Qualified", "Demo", "Won"];
  const [cards, setCards] = useState<Card[]>(() => [
    { id: 1, name: "Rahul S.", stage: 0, score: 72 },
    { id: 2, name: "Priya P.", stage: 1, score: 84 },
    { id: 3, name: "Aisha K.", stage: 1, score: 66 },
    { id: 4, name: "Diego L.", stage: 2, score: 91 },
    { id: 5, name: "Yuki T.",  stage: 2, score: 78 },
    { id: 6, name: "Noah W.",  stage: 3, score: 95 },
  ]);
  useEffect(() => {
    const id = setInterval(() => {
      setCards((prev) => {
        const idx = Math.floor(Math.random() * prev.length);
        return prev.map((c, i) =>
          i === idx && c.stage < 3 ? { ...c, stage: c.stage + 1 } : c,
        );
      });
    }, 1600);
    return () => clearInterval(id);
  }, []);
  return (
    <GlassPanel glow="rgba(82,120,255,0.22)">
      <PanelHeader title="CRM Sync · Pipeline" status="Syncing" dotColor="bg-sky-400" />
      <div className="p-3 grid grid-cols-4 gap-2 min-h-[180px]">
        {stages.map((st, si) => (
          <div key={st} className="rounded-lg bg-white border border-mk-border p-1.5">
            <p className="text-[9.5px] font-bold uppercase tracking-wider text-mk-body/85 mb-1.5 px-1">{st}</p>
            <div className="space-y-1.5 min-h-[120px]">
              <AnimatePresence>
                {cards.filter((c) => c.stage === si).map((c) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    className="rounded-md bg-gradient-to-br from-white/10 to-white/[0.03] border border-mk-border px-2 py-1.5"
                  >
                    <p className="text-[10px] font-semibold text-mk-navy truncate">{c.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[9px] font-bold tabular-nums ${c.score >= 80 ? "text-emerald-400" : "text-amber-400"}`}>{c.score}</span>
                      <span className="text-[8px] text-mk-muted">score</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}



/* ------------------ Interactive AI Modules Showcase ------------------ */

type ModKey = "scoring" | "voice" | "omni" | "workflow";

const MOD_LIST2: { key: ModKey; label: string; icon: ReactNode; accent: string; tag: string }[] = [
  { key: "scoring",  label: "AI Lead Scoring",   icon: <Brain className="w-4 h-4" />,     accent: "#9333EA", tag: "Scoring engine" },
  { key: "voice",    label: "AI Voice Agent",    icon: <PhoneCall className="w-4 h-4" />, accent: "#5278FF", tag: "Live call" },
  { key: "omni",     label: "Omnichannel Engine",icon: <Zap className="w-4 h-4" />,       accent: "#10B981", tag: "Auto reply" },
  { key: "workflow", label: "Workflow Builder",  icon: <GitBranch className="w-4 h-4" />, accent: "#8B5CF6", tag: "Orchestrating" },
];

function InteractiveModulesShowcase() {
  const [active, setActive] = useState<ModKey>("scoring");

  return (
    <div className="flex flex-col gap-4">
      {/* Module grid with shared-layout expansion */}
      <div className="relative">
        {/* ambient backdrop */}
        <div aria-hidden className="pointer-events-none absolute -inset-6 rounded-3xl bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.12),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_60%)]" />
        <div className="relative grid grid-cols-2 gap-3">
          {MOD_LIST2.map((m) => {
            const isActive = active === m.key;
            return (
              <motion.button
                key={m.key}
                type="button"
                layout
                onClick={() => setActive(m.key)}
                onMouseEnter={() => setActive(m.key)}
                transition={{ type: "spring", stiffness: 220, damping: 26 }}
                className={`relative text-left rounded-2xl border overflow-hidden cursor-pointer ${
                  isActive
                    ? "col-span-2 row-span-2 border-transparent shadow-[0_20px_60px_-20px_rgba(27,43,75,0.25)]"
                    : "border-mk-border bg-white hover:border-mk-navy/20"
                }`}
                style={isActive ? {
                  background: "linear-gradient(180deg, #ffffff 0%, #fafbff 100%)",
                  boxShadow: `0 24px 60px -28px ${m.accent}55, 0 0 0 1px ${m.accent}22 inset`,
                } : undefined}
              >
                {/* live ambient glow per card */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl"
                  style={{ background: `${m.accent}33` }}
                  animate={{ opacity: isActive ? [0.7, 1, 0.7] : [0.25, 0.45, 0.25] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.div
                        layout
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                        style={{ background: `linear-gradient(135deg, ${m.accent}, ${m.accent}cc)` }}
                      >
                        {m.icon}
                      </motion.div>
                      <motion.p layout className="font-semibold text-mk-navy text-sm">{m.label}</motion.p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-mk-body">
                      <motion.span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: m.accent }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                      {m.tag}
                    </span>
                  </div>

                  {/* Always-on tiny preview */}
                  {!isActive && <ModulePeek mod={m.key} accent={m.accent} />}

                  {/* Expanded interactive demo */}
                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={m.key}
                        initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -4, filter: "blur(6px)" }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <ModuleDemo mod={m.key} accent={m.accent} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SDK chips with hover code preview */}
      <SdkChips />
    </div>
  );
}

/* ---------- Tiny live previews shown on inactive cards ---------- */
function ModulePeek({ mod, accent }: { mod: ModKey; accent: string }) {
  if (mod === "scoring") {
    return (
      <div className="flex items-center gap-3">
        <ScoringRing size={48} accent={accent} duration={5} />
        <div className="flex-1 space-y-1">
          {[72, 55, 88].map((v, i) => (
            <motion.div key={i} className="h-1 rounded-full bg-mk-bg overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: accent }}
                animate={{ width: [`${v - 20}%`, `${v}%`, `${v - 10}%`] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  if (mod === "voice") {
    return <MkWaveform2 accent={accent} bars={28} compact />;
  }
  if (mod === "omni") {
    return (
      <div className="flex items-center gap-1.5">
        {[FaWhatsapp, FaInstagram, Mail, FaTelegramPlane, MessageSquare].map((Ic, i) => (
          <motion.div
            key={i}
            className="w-7 h-7 rounded-md bg-mk-bg flex items-center justify-center text-mk-navy"
            animate={{ y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.18 }}
          >
            <Ic className="w-3.5 h-3.5" />
          </motion.div>
        ))}
        <motion.span
          className="ml-auto text-[10px] font-mono text-emerald-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          ✓✓ delivered
        </motion.span>
      </div>
    );
  }
  // workflow
  return (
    <svg viewBox="0 0 200 48" className="w-full h-12">
      <defs>
        <linearGradient id="wfPeek" x1="0" x2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="50%" stopColor={accent} stopOpacity="1" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[12, 24, 36].map((y, i) => (
        <g key={i}>
          <path d={`M0 ${y} C 60 ${y - 8}, 140 ${y + 8}, 200 ${y}`} stroke="#E8E8F0" strokeWidth="1" fill="none" />
          <motion.path
            d={`M0 ${y} C 60 ${y - 8}, 140 ${y + 8}, 200 ${y}`}
            stroke="url(#wfPeek)" strokeWidth="1.5" fill="none" strokeDasharray="20 200"
            animate={{ strokeDashoffset: [0, -220] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "linear" }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ---------- Expanded immersive demos ---------- */
function ModuleDemo({ mod, accent }: { mod: ModKey; accent: string }) {
  if (mod === "scoring")  return <ScoringDemo accent={accent} />;
  if (mod === "voice")    return <VoiceDemo accent={accent} />;
  if (mod === "omni")     return <OmniDemo accent={accent} />;
  return <WorkflowDemo accent={accent} />;
}

/* ---- Scoring ---- */
const LEAD_POOL = [
  { name: "Aarav Sharma",  intent: "High",   score: 92, ch: "WhatsApp" },
  { name: "Priya Iyer",    intent: "Medium", score: 71, ch: "Instagram" },
  { name: "Rohan Mehta",   intent: "High",   score: 88, ch: "Email" },
  { name: "Sneha Kapoor",  intent: "Low",    score: 42, ch: "SMS" },
  { name: "Vikram Joshi",  intent: "High",   score: 95, ch: "Voice" },
  { name: "Neha Reddy",    intent: "Medium", score: 67, ch: "Telegram" },
];

function ScoringDemo({ accent }: { accent: string }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % LEAD_POOL.length), 1800);
    return () => clearInterval(id);
  }, []);
  const lead = LEAD_POOL[idx];
  return (
    <div className="mt-2 grid grid-cols-5 gap-3">
      <div className="col-span-2 flex flex-col items-center justify-center rounded-xl bg-mk-bg/60 p-3">
        <ScoringRing size={96} accent={accent} value={lead.score} duration={1.6} />
        <p className="mt-2 text-[10px] font-mono text-mk-body uppercase tracking-wider">Conversion · {lead.intent}</p>
      </div>
      <div className="col-span-3 space-y-1.5">
        <p className="text-[10px] font-mono text-mk-body uppercase tracking-wider">Live lead feed</p>
        <AnimatePresence mode="popLayout" initial={false}>
          {LEAD_POOL.slice(idx, idx + 3).concat(LEAD_POOL.slice(0, Math.max(0, idx + 3 - LEAD_POOL.length))).map((l, i) => (
            <motion.div
              key={`${l.name}-${idx}-${i}`}
              layout
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: i === 0 ? 1 : 0.55 - i * 0.15, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-between rounded-lg bg-white border border-mk-border px-2.5 py-1.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: accent }}>
                  {l.name.split(" ").map(p => p[0]).join("")}
                </span>
                <span className="truncate text-xs font-medium text-mk-navy">{l.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-mk-body">{l.ch}</span>
                <span className="text-xs font-mono font-semibold tabular-nums" style={{ color: accent }}>{l.score}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-mk-body pt-1">
          <motion.span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
          AI scanning intent · behavioral signals · qualification
        </div>
      </div>
    </div>
  );
}

function ScoringRing({ size, accent, value, duration = 2 }: { size: number; accent: string; value?: number; duration?: number }) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const target = value ?? 78;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#E8E8F0" strokeWidth="4" fill="none" />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          stroke={accent} strokeWidth="4" strokeLinecap="round" fill="none"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c - (c * target) / 100 }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <motion.div
        aria-hidden
        className="absolute inset-1 rounded-full"
        style={{ background: `radial-gradient(circle, ${accent}22, transparent 70%)` }}
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-mk-navy tabular-nums">{target}</span>
        <span className="text-[9px] font-mono text-mk-body uppercase">score</span>
      </div>
    </div>
  );
}

/* ---- Voice ---- */
const VOICE_LINES = [
  { who: "AI",   text: "Hi Aarav, this is Maya from Marketon. Is this a good time?" },
  { who: "User", text: "Yes, please go ahead." },
  { who: "AI",   text: "Great — I noticed you explored our growth plan. Want a quick walkthrough?" },
  { who: "User", text: "Sure, can we schedule for tomorrow at 4pm?" },
  { who: "AI",   text: "Booked. Calendar invite is on its way. ✓" },
];

function VoiceDemo({ accent }: { accent: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % VOICE_LINES.length), 2200);
    return () => clearInterval(id);
  }, []);
  const line = VOICE_LINES[i];
  const speaking = line.who === "AI";
  return (
    <div className="mt-2 rounded-xl bg-mk-bg/60 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ background: accent }}
            animate={{ boxShadow: [`0 0 0 0 ${accent}66`, `0 0 0 10px ${accent}00`] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <PhoneCall className="w-3.5 h-3.5" />
          </motion.div>
          <div>
            <p className="text-xs font-semibold text-mk-navy">Maya · AI Agent</p>
            <p className="text-[10px] font-mono text-mk-body">{speaking ? "Speaking…" : "Listening…"}</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-600">● live · 00:{String(12 + i * 8).padStart(2,"0")}</span>
      </div>

      <MkWaveform2 accent={accent} bars={36} active={speaking} />

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          className="rounded-lg bg-white border border-mk-border px-2.5 py-2"
        >
          <p className="text-[10px] font-mono uppercase tracking-wider mb-0.5"
            style={{ color: speaking ? accent : "#10B981" }}>
            {line.who === "AI" ? "AI" : "Customer"}
          </p>
          <MkTyped2 key={i} text={line.text} className="text-xs text-mk-navy leading-snug" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MkWaveform2({ accent, bars = 32, active = true, compact = false }: { accent: string; bars?: number; active?: boolean; compact?: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-[3px] ${compact ? "h-8" : "h-10"}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: accent }}
          animate={active
            ? { height: [4, 6 + ((i * 13) % 22), 4] }
            : { height: 4 }
          }
          transition={{ duration: 0.7 + ((i * 7) % 5) / 10, repeat: Infinity, ease: "easeInOut", delay: (i % 6) * 0.05 }}
        />
      ))}
    </div>
  );
}

function MkTyped2({ text, className }: { text: string; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), 22);
    return () => clearInterval(id);
  }, [text]);
  return <p className={className}>{text.slice(0, n)}<span className="opacity-50">{n < text.length ? "▍" : ""}</span></p>;
}

/* ---- Omnichannel ---- */
const OMNI_CHANNELS2 = [
  { name: "WhatsApp", Icon: FaWhatsapp,       color: "#25D366", msg: "Hey! Your demo is confirmed for 4 PM. ✓" },
  { name: "Instagram",Icon: FaInstagram,      color: "#E1306C", msg: "Thanks for the DM — sending pricing now." },
  { name: "Email",    Icon: Mail,             color: "#5278FF", msg: "Quick follow-up with your custom plan." },
  { name: "Telegram", Icon: FaTelegramPlane,  color: "#0088CC", msg: "Welcome aboard! Here's your getting-started kit." },
];

function OmniDemo({ accent }: { accent: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % OMNI_CHANNELS2.length), 2400);
    return () => clearInterval(id);
  }, []);
  const ch = OMNI_CHANNELS2[i];
  return (
    <div className="mt-2 grid grid-cols-5 gap-3">
      <div className="col-span-2 space-y-1.5">
        <p className="text-[10px] font-mono text-mk-body uppercase tracking-wider">Channels</p>
        {OMNI_CHANNELS2.map((c, idx) => (
          <motion.div key={c.name}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 border ${idx === i ? "bg-white border-mk-navy/20" : "bg-mk-bg/60 border-transparent"}`}
            animate={{ scale: idx === i ? 1.02 : 1 }}>
            <span className="w-6 h-6 rounded-md flex items-center justify-center text-white" style={{ background: c.color }}>
              <c.Icon className="w-3 h-3" />
            </span>
            <span className="text-xs font-medium text-mk-navy">{c.name}</span>
            {idx === i && <motion.span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: accent }}
              animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />}
          </motion.div>
        ))}
      </div>
      <div className="col-span-3 rounded-xl bg-white border border-mk-border p-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md flex items-center justify-center text-white" style={{ background: ch.color }}>
              <ch.Icon className="w-2.5 h-2.5" />
            </span>
            <span className="text-[11px] font-semibold text-mk-navy">{ch.name}</span>
          </div>
          <motion.span className="text-[9px] font-mono text-mk-body flex items-center gap-1"
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <span className="inline-flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-mk-body animate-bounce" />
              <span className="w-1 h-1 rounded-full bg-mk-body animate-bounce [animation-delay:0.1s]" />
              <span className="w-1 h-1 rounded-full bg-mk-body animate-bounce [animation-delay:0.2s]" />
            </span>
            typing
          </motion.span>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-lg px-2 py-1 bg-mk-bg text-[10px] text-mk-navy">Hi, interested in your platform.</div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.35 }}
            className="flex">
            <div className="max-w-[85%] rounded-lg px-2 py-1 text-[10px] text-white" style={{ background: ch.color }}>
              <MkTyped2 key={i} text={ch.msg} />
              <div className="text-[8px] opacity-80 text-right mt-0.5">✓✓ delivered</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---- Workflow ---- */
const WF_NODES = [
  { x: 12,  y: 30, label: "Trigger" },
  { x: 42,  y: 18, label: "AI Qualify" },
  { x: 42,  y: 60, label: "Enrich" },
  { x: 72,  y: 30, label: "Route" },
  { x: 92,  y: 30, label: "CRM Sync" },
];
const WF_EDGES: [number, number][] = [[0,1],[0,2],[1,3],[2,3],[3,4]];

function WorkflowDemo({ accent }: { accent: string }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % WF_NODES.length), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mt-2 rounded-xl bg-mk-bg/60 p-3 relative overflow-hidden">
      <svg viewBox="0 0 100 80" className="w-full h-32">
        <defs>
          <linearGradient id="wfFlow" x1="0" x2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0" />
            <stop offset="50%" stopColor={accent} stopOpacity="1" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {WF_EDGES.map(([a, b], i) => {
          const na = WF_NODES[a], nb = WF_NODES[b];
          const d = `M${na.x} ${na.y} C ${(na.x + nb.x)/2} ${na.y}, ${(na.x + nb.x)/2} ${nb.y}, ${nb.x} ${nb.y}`;
          return (
            <g key={i}>
              <path d={d} stroke="#E8E8F0" strokeWidth="0.6" fill="none" />
              <motion.path d={d} stroke="url(#wfFlow)" strokeWidth="1" fill="none" strokeDasharray="6 40"
                animate={{ strokeDashoffset: [0, -46] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: i * 0.2 }} />
            </g>
          );
        })}
        {WF_NODES.map((n, i) => (
          <g key={i}>
            <motion.circle cx={n.x} cy={n.y} r={i === step ? 4 : 2.6}
              fill={i === step ? accent : "#fff"}
              stroke={accent} strokeWidth="0.8"
              animate={{ r: i === step ? [3, 4.5, 3] : 2.6 }}
              transition={{ duration: 0.8, repeat: i === step ? Infinity : 0 }} />
            <text x={n.x} y={n.y + 9} fontSize="3" textAnchor="middle" fill="#1B2B4B" fontFamily="monospace">{n.label}</text>
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-3 gap-2 mt-1">
        {[
          { l: "Leads", v: 1284 + step * 7 },
          { l: "Routed", v: 982 + step * 5 },
          { l: "Synced", v: 877 + step * 4 },
        ].map((s) => (
          <div key={s.l} className="rounded-lg bg-white border border-mk-border px-2 py-1.5">
            <p className="text-[9px] font-mono text-mk-body uppercase">{s.l}</p>
            <p className="text-sm font-bold text-mk-navy tabular-nums">{s.v.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- SDK chips with code peek ---------- */
const SDK_SNIPPETS: Record<string, { lang: string; code: string }> = {
  "REST API":  { lang: "bash",  code: `curl -X POST https://api.marketon.ai/v1/score \\\n  -H "Authorization: Bearer $KEY" \\\n  -d '{"lead_id":"ld_812"}'` },
  "Python SDK":{ lang: "py",    code: `from marketon import Client\nc = Client(api_key=KEY)\nc.leads.score("ld_812")` },
  "JS SDK":    { lang: "ts",    code: `import { Marketon } from "marketon";\nconst mk = new Marketon({ key: KEY });\nawait mk.leads.score("ld_812");` },
  "Go SDK":    { lang: "go",    code: `client := marketon.New(KEY)\nclient.Leads.Score(ctx, "ld_812")` },
  "Java SDK":  { lang: "java",  code: `Marketon mk = new Marketon(KEY);\nmk.leads().score("ld_812");` },
  "Playground":{ lang: "info",  code: `// Try every endpoint live\n// → playground.marketon.ai` },
};

function SdkChips() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2">
        {Object.keys(SDK_SNIPPETS).map((p) => {
          const isOpen = open === p;
          return (
            <motion.button
              key={p}
              type="button"
              onClick={() => setOpen(isOpen ? null : p)}
              whileHover={{ y: -2 }}
              className={`relative px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                isOpen
                  ? "bg-mk-navy text-white border border-mk-navy"
                  : "bg-white border border-mk-border text-mk-navy hover:border-mk-navy/40"
              }`}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ boxShadow: `0 0 0 0 rgba(82,120,255,0)` }}
                animate={isOpen ? { boxShadow: ["0 0 0 0 rgba(82,120,255,0.45)", "0 0 0 8px rgba(82,120,255,0)"] } : {}}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="relative">{p}</span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -6, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="mt-3 rounded-xl bg-[#0b1124] border border-white/10 overflow-hidden shadow-[0_20px_60px_-20px_rgba(11,17,36,0.5)]"
          >
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#070b18] border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <span className="w-2 h-2 rounded-full bg-[#28c840]" />
                <span className="ml-2 text-[10px] font-mono text-gray-500">{open.toLowerCase()}.{SDK_SNIPPETS[open].lang}</span>
              </div>
              <span className="text-[10px] font-mono text-mk-orange">live snippet ●</span>
            </div>
            <pre className="p-3 text-[11px] leading-relaxed font-mono text-gray-200 whitespace-pre-wrap">
              {SDK_SNIPPETS[open].code}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- Businesses Can ----------------------------- */



function BusinessesCan() {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <motion.div
        aria-hidden
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full bg-mk-orange/15 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.15, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="pointer-events-none absolute -bottom-24 -right-24 w-[460px] h-[460px] rounded-full bg-indigo-300/25 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="text-mk-orange text-xs font-bold uppercase tracking-widest mb-3">For Every Business</p>
          <h2 className="font-display text-[32px] md:text-[40px] text-mk-heading mb-5 leading-[1.1]">
            {"Businesses Can".split(" ").map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE_EXPO }}
                className="inline-block mr-2"
              >
                {i === 1 ? <span className="bg-gradient-to-r from-mk-orange to-fuchsia-500 bg-clip-text text-transparent">{w}</span> : w}
              </motion.span>
            ))}
          </h2>
          <p className="text-mk-body leading-relaxed mb-6 max-w-md">
            From small startups acquiring their first 100 customers to enterprises automating thousands of leads daily, AI that understands your customers is changing what's possible.
          </p>
          <button className="mk-btn-navy">Sign Up <ArrowRight size={16} /></button>
        </Reveal>
        <Reveal delay={0.1}>
          <CinematicAutomationPlayer />
        </Reveal>
      </div>
    </section>
  );
}

/* ---- Cinematic Automation Player (real video ad) ---- */



function CinematicAutomationPlayer() {
  const [open, setOpen] = useState(false);
  const inlineRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLVideoElement>(null);

  const VideoBody = ({ large = false, vref }: { large?: boolean; vref: React.RefObject<HTMLVideoElement | null> }) => (
    <div
      className={`relative w-full ${large ? "aspect-video" : "aspect-[4/3]"} rounded-3xl overflow-hidden ring-1 ring-black/10 bg-black`}
      style={{ boxShadow: "0 30px 80px -30px rgba(15,20,40,0.55)" }}
    >
      <video
        ref={vref}
        src={heroVideo.url}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* cinematic letterbox + vignette */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
      <div aria-hidden className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* TOP HUD */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-white/85">
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.25, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]"
          />
          <span>rec</span>
          <span className="text-white/40">·</span>
          <span>marketon.ai</span>
        </div>
        <span className="text-white/70">cinematic reel</span>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-end justify-between">
        <div>
          <p className="font-display text-white text-lg md:text-2xl leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.6)]">
            Automate Everything.
          </p>
          <p className="text-white/80 text-xs font-mono uppercase tracking-[0.22em] mt-1">
            Grow Faster.
          </p>
        </div>
      </div>

      {/* CENTER PLAY BUTTON (expand to fullscreen) */}
      {!large && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open cinematic view"
          className="absolute inset-0 z-30 flex items-center justify-center group/play cursor-pointer"
        >
          <span className="relative">
            <motion.span
              aria-hidden
              animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-white/30"
            />
            <motion.span
              aria-hidden
              animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
              className="absolute inset-0 rounded-full bg-white/20"
            />
            <span
              className="relative w-16 h-16 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-xl ring-1 ring-white/50 transition-transform duration-300 group-hover/play:scale-110"
              style={{ boxShadow: "0 14px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.35)" }}
            >
              <Play size={22} className="text-white fill-white ml-0.5" />
            </span>
          </span>
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="relative">
        <VideoBody vref={inlineRef} />
        <div className="mt-3 flex items-center justify-between text-[11px] text-mk-body">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Marketon · cinematic ad reel</span>
          </div>
          <span className="font-mono uppercase tracking-wider text-mk-muted">tap to expand</span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ ease: EASE_EXPO, duration: 0.45 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoBody large vref={modalRef} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-mk-navy flex items-center justify-center shadow-xl ring-1 ring-black/5 hover:scale-105 transition"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ----------------------------- Marketing-First Future ----------------------------- */

/* AI Energy Core — cinematic orbital visual.
   Pure framer-motion + SVG/CSS — no WebGL, GPU-friendly. */
/* ---------------- AI Energy Core (cinematic) ---------------- */

function AiEnergyCore({ intensity = 1 }: { intensity?: number }) {
  const orbiters = Array.from({ length: 12 });
  const sparks = Array.from({ length: 22 });

  // cursor-reactive parallax
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const tx = useTransform(sx, (v) => v * 14);
  const ty = useTransform(sy, (v) => v * 14);
  const tx2 = useTransform(sx, (v) => v * -8);
  const ty2 = useTransform(sy, (v) => v * -8);

  const containerRef = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect(); if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const glow = 0.7 + intensity * 0.4;
  const speedBoost = 1 / (0.6 + intensity * 0.6);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative aspect-square w-full max-w-[460px] mx-auto"
    >
      {/* volumetric backdrop layers */}
      <motion.div
        aria-hidden
        className="absolute -inset-10 pointer-events-none"
        style={{ x: tx2, y: ty2 }}
      >
        <div className="absolute inset-0 rounded-full" style={{
          background: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.25), rgba(34,211,238,0.20) 45%, transparent 70%)",
          filter: "blur(36px)",
        }} />
      </motion.div>

      {/* neural grid */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full opacity-[0.45] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(82,120,255,0.18) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(circle at center, black 38%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 38%, transparent 75%)",
        }}
      />

      {/* parallax orbital layer */}
      <motion.div className="absolute inset-0" style={{ x: tx, y: ty }}>

        {/* outermost slow ring */}
        <motion.div
          aria-hidden
          className="absolute inset-[2%] rounded-full"
          style={{
            border: "1px solid rgba(82,120,255,0.18)",
            boxShadow: `inset 0 0 60px rgba(82,120,255,${0.12 * glow})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80 * speedBoost, repeat: Infinity, ease: "linear" }}
        />

        {/* second ring — dashed indigo */}
        <motion.div
          aria-hidden
          className="absolute inset-[10%] rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 60 * speedBoost, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#5278FF" strokeOpacity="0.4" strokeWidth="0.4" strokeDasharray="1 3" />
          </svg>
        </motion.div>

        {/* third ring — conic shimmer */}
        <motion.div
          aria-hidden
          className="absolute inset-[18%] rounded-full pointer-events-none"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, rgba(221,231,255,0.55) 20%, transparent 45%, transparent 100%)",
            filter: "blur(2px)",
            maskImage: "radial-gradient(circle, transparent 65%, black 67%, black 70%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 65%, black 67%, black 70%, transparent 72%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 22 * speedBoost, repeat: Infinity, ease: "linear" }}
        />

        {/* reactor ring with bright sweep */}
        <motion.svg
          viewBox="0 0 300 300"
          className="absolute inset-0 w-full h-full pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 18 * speedBoost, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="ringTrail" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9333EA" stopOpacity="0" />
              <stop offset="60%" stopColor="#9333EA" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="1" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" />
            </filter>
          </defs>
          <circle cx="150" cy="150" r="120" fill="none" stroke="#9333EA" strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="4 8" />
          <motion.circle
            cx="150" cy="150" r="120" fill="none"
            stroke="url(#ringTrail)" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray="120 634" filter="url(#softGlow)"
            animate={{ strokeDashoffset: [0, -754] }}
            transition={{ duration: 5 * speedBoost, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="150" cy="150" r="92" fill="none" stroke="rgba(27,43,75,0.12)" strokeWidth="1" strokeDasharray="2 6" />
        </motion.svg>

        {/* counter-rotating tick marks */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 50 * speedBoost, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 w-px h-2.5 origin-bottom"
              style={{
                background: i % 9 === 0 ? "rgba(147,51,234,0.9)" : "rgba(27,43,75,0.22)",
                boxShadow: i % 9 === 0 ? "0 0 6px rgba(147,51,234,0.7)" : undefined,
                transform: `translate(-50%, -50%) rotate(${(i * 360) / 36}deg) translateY(-148px)`,
              }}
            />
          ))}
        </motion.div>

        {/* orbiting particles */}
        {orbiters.map((_, i) => {
          const orbitDur = 8 + (i % 3) * 2;
          const radius = i % 2 === 0 ? 120 : 98;
          const delay = (i / orbiters.length) * orbitDur;
          return (
            <motion.div
              key={`orb-${i}`}
              className="absolute left-1/2 top-1/2 pointer-events-none"
              style={{ width: 0, height: 0 }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: orbitDur * speedBoost, repeat: Infinity, ease: "linear", delay: -delay }}
            >
              <div className="absolute" style={{ transform: `translate(-50%, -50%) translateY(-${radius}px)` }}>
                <motion.span
                  className="block rounded-full"
                  style={{
                    width: i % 2 === 0 ? 6 : 4,
                    height: i % 2 === 0 ? 6 : 4,
                    background: i % 3 === 0 ? "#9333EA" : i % 3 === 1 ? "#5278FF" : "#FFFFFF",
                    boxShadow: i % 3 === 0
                      ? `0 0 12px rgba(147,51,234,${glow}), 0 0 24px rgba(147,51,234,0.5)`
                      : i % 3 === 1
                      ? `0 0 12px rgba(82,120,255,${glow})`
                      : "0 0 10px rgba(255,255,255,0.95)",
                  }}
                  animate={{ opacity: [0.55, 1, 0.55], scale: [0.85, 1.2, 0.85] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.13 }}
                />
              </div>
            </motion.div>
          );
        })}

        {/* central reactor core */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-[36%] aspect-square">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: i % 2 === 0 ? "rgba(147,51,234,0.5)" : "rgba(82,120,255,0.45)" }}
                animate={{ scale: [1, 2.4], opacity: [0.6 * glow, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut", delay: i * 0.85 }}
              />
            ))}

            <motion.span
              aria-hidden
              className="absolute -inset-8 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(34,211,238,0.22) 45%, transparent 75%)",
                filter: "blur(14px)",
                opacity: glow,
              }}
              animate={{ opacity: [0.6 * glow, glow, 0.6 * glow], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="relative w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, #F5F3FF 0%, #E9D5FF 20%, #C084FC 45%, #7C3AED 80%, #4C1D95 100%)",
                boxShadow:
                  "0 16px 50px -10px rgba(168,85,247,0.75), 0 0 30px rgba(34,211,238,0.35), inset 0 -12px 28px rgba(76,29,149,0.7), inset 0 12px 24px rgba(245,243,255,0.7)",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.2 / (0.6 + intensity * 0.4), repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                aria-hidden
                className="absolute inset-1 rounded-full opacity-80 mix-blend-screen"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,1) 50deg, transparent 110deg, transparent 360deg)",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2 * speedBoost, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                aria-hidden
                className="absolute inset-3 rounded-full opacity-60 mix-blend-overlay"
                style={{
                  background:
                    "conic-gradient(from 180deg, transparent 0deg, rgba(192,132,252,0.9) 40deg, transparent 90deg, transparent 360deg)",
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 4.6 * speedBoost, repeat: Infinity, ease: "linear" }}
              />
              <span aria-hidden className="absolute top-[10%] left-[16%] w-[40%] h-[28%] rounded-full bg-white/60 blur-[7px]" />

              {/* nucleus sigil */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[44%] h-[44%] rounded-full border-2 border-white/70"
                  style={{ boxShadow: "inset 0 0 10px rgba(255,255,255,0.7)" }}
                />
                <motion.span
                  animate={{ rotate: -360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[28%] h-[28%] rounded-full border border-white/80 border-dashed"
                />
                <motion.span
                  aria-hidden
                  className="absolute w-2 h-2 rounded-full bg-white"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.7, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ boxShadow: "0 0 14px rgba(255,255,255,1)" }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* energy beams left + right with flowing pulses */}
        {(["left", "right"] as const).map((side) => (
          <div
            key={side}
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ [side]: "-4%", width: "26%", height: "2px" } as React.CSSProperties}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  side === "left"
                    ? "linear-gradient(90deg, transparent 0%, rgba(82,120,255,0.35) 30%, rgba(147,51,234,0.85) 100%)"
                    : "linear-gradient(270deg, transparent 0%, rgba(82,120,255,0.35) 30%, rgba(147,51,234,0.85) 100%)",
                filter: "blur(0.5px)",
                boxShadow: `0 0 14px rgba(147,51,234,${0.7 * glow})`,
              }}
            />
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: "#9333EA", boxShadow: `0 0 10px rgba(147,51,234,${glow})` }}
                animate={{
                  left: side === "left" ? ["0%", "100%"] : ["100%", "0%"],
                  opacity: [0, 1, 1, 0],
                  scale: [0.6, 1, 1, 0.6],
                }}
                transition={{ duration: 1.6 * speedBoost, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              />
            ))}
          </div>
        ))}
      </motion.div>

      {/* holographic dust */}
      {sparks.map((_, i) => {
        const top = 6 + ((i * 37) % 88);
        const left = 4 + ((i * 53) % 92);
        const dur = 4 + ((i * 7) % 5);
        const size = 1.5 + (i % 3);
        return (
          <motion.span
            key={`sp-${i}`}
            aria-hidden
            className="absolute rounded-full pointer-events-none"
            style={{
              top: `${top}%`, left: `${left}%`, width: size, height: size,
              boxShadow: i % 3 === 0 ? "0 0 8px rgba(147,51,234,0.7)" : "0 0 6px rgba(82,120,255,0.6)",
              background: i % 3 === 0 ? "rgba(147,51,234,0.9)" : "rgba(82,120,255,0.85)",
              filter: "blur(0.3px)",
            }}
            animate={{ y: [0, -14, 0], opacity: [0.15, 0.95, 0.15], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay: (i % 7) * 0.3 }}
          />
        );
      })}
    </motion.div>
  );
}

/* ---------------- Marketing Future (cinematic narrative) ---------------- */

function MarketingFuture() {
  const { isGalaxy } = useTheme();
  const points = [
    { t: "Intelligent by design", d: "Build, deploy, and run automated marketing systems with complete control.", hl: ["intelligent systems"] },
    { t: "AI decision engines",   d: "Marketon decides the best channel, time, message, follow-up, and next action.", hl: ["AI decision engines"] },
    { t: "Human at the core",     d: "Sales and marketing teams stay in control while AI handles repetitive execution.", hl: ["human control"] },
  ];

  const [hovered, setHovered] = useState<number | null>(null);
  const intensity = hovered === null ? 1 : 1.6;

  return (
    <section className="relative py-28 md:py-36 bg-mk-bg overflow-hidden">
      {/* ambient atmospheric backdrop */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] left-[10%] w-[60%] h-[60%] rounded-full blur-[160px] bg-[#9333EA]/8" />
        <div className="absolute -bottom-[25%] right-[5%] w-[60%] h-[60%] rounded-full blur-[160px] bg-[#5278FF]/10" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(27,43,75,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(27,43,75,0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <Reveal>
          <p
            className="text-center text-[11px] tracking-[0.32em] text-mk-orange font-bold mb-4 uppercase"
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            · The Neural Engine ·
          </p>
          <h2 className="font-display text-[34px] md:text-[56px] text-mk-heading text-center leading-[1.05] tracking-tight max-w-4xl mx-auto">
            Powering the marketing-first future
          </h2>
          <p className="text-center text-mk-body mt-5 max-w-2xl mx-auto text-[15px] md:text-[16px]">
            One intelligence core. Three principles. Continuous decisions across every channel.
          </p>
        </Reveal>

        <Reveal>
          <div
            className="relative mt-16 rounded-[28px] overflow-hidden"
            style={{
              background: isGalaxy
                ? "radial-gradient(800px 500px at 28% 30%, rgba(168,85,247,0.18), transparent 60%), radial-gradient(700px 500px at 80% 70%, rgba(34,211,238,0.14), transparent 60%), rgba(255,255,255,0.03)"
                : "radial-gradient(800px 500px at 28% 30%, rgba(168,85,247,0.10), transparent 60%), radial-gradient(700px 500px at 80% 70%, rgba(34,211,238,0.08), transparent 60%), #FFFFFF",
              border: isGalaxy ? "1px solid rgba(255,255,255,0.10)" : "1px solid #E5E7EB",
              boxShadow: isGalaxy
                ? "0 30px 80px -40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "0 30px 80px -40px rgba(27,43,75,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* top hairline */}
            <div className="absolute inset-x-0 top-0 h-px" style={{
              background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(34,211,238,0.5), transparent)",
            }} />

            <div className="grid lg:grid-cols-[48%_52%] gap-8 lg:gap-12 items-center p-8 md:p-14">
              <AiEnergyCore intensity={intensity} />

              <div className="flex flex-col gap-4">
                {points.map((p, i) => (
                  <motion.div
                    key={p.t}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    onHoverStart={() => setHovered(i)}
                    onHoverEnd={() => setHovered(null)}
                    className="group relative rounded-2xl p-5 md:p-6 transition-all cursor-default"
                    style={{
                      background: isGalaxy
                        ? (hovered === i ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)")
                        : (hovered === i ? "#F9FAFB" : "#FFFFFF"),
                      backdropFilter: "blur(8px)",
                      border: isGalaxy
                        ? (hovered === i ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.08)")
                        : (hovered === i ? "1px solid #A855F7" : "1px solid #E5E7EB"),
                      boxShadow: isGalaxy
                        ? (hovered === i ? "0 20px 50px -20px rgba(168,85,247,0.35)" : "0 4px 12px rgba(0,0,0,0.4)")
                        : (hovered === i ? "0 12px 30px -10px rgba(168,85,247,0.2)" : "0 2px 8px rgba(0,0,0,0.04)"),
                    }}
                  >
                    {/* sweep highlight on hover */}
                    <motion.span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
                      initial={false}
                    >
                      <motion.span
                        className="absolute -inset-y-2 -left-1/2 w-1/2 rotate-12"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                        }}
                        animate={hovered === i ? { x: ["0%", "320%"] } : { x: "0%" }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                      />
                    </motion.span>

                    <div className="relative flex gap-5 items-start">
                      {/* glowing number badge */}
                      <div className="relative flex-shrink-0">
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(147,51,234,0.55), transparent 70%)",
                            filter: "blur(8px)",
                          }}
                          animate={hovered === i
                            ? { opacity: [0.6, 1, 0.6], scale: [1, 1.25, 1] }
                            : { opacity: 0.5, scale: 1 }}
                          transition={{ duration: 1.8, repeat: hovered === i ? Infinity : 0, ease: "easeInOut" }}
                        />
                        <div
                          className="relative w-11 h-11 rounded-full flex items-center justify-center font-mono text-white"
                          style={{
                            background:
                              "radial-gradient(circle at 30% 30%, #E9D5FF, #9333EA 55%, #581C87)",
                            boxShadow:
                              "0 8px 22px -6px rgba(147,51,234,0.7), inset 0 -3px 8px rgba(88,28,135,0.6), inset 0 2px 4px rgba(255,255,255,0.6)",
                          }}
                        >
                          <span className="text-[15px] font-bold tracking-tight">{String(i + 1).padStart(2, "0")}</span>
                        </div>
                        {/* connector tick */}
                        {i < points.length - 1 && (
                          <span
                            aria-hidden
                            className="absolute left-1/2 top-full -translate-x-1/2 mt-1 w-px h-4"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(147,51,234,0.5), transparent)",
                            }}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-[18px] md:text-[20px] font-bold tracking-tight"
                          style={{
                            fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif",
                            color: isGalaxy ? "#FFFFFF" : "#000000",
                          }}
                        >
                          {p.t}
                        </h4>
                        <p
                          className="mt-1.5 text-[14.5px] leading-relaxed"
                          style={{
                            color: isGalaxy ? "#D1D5DB" : "#111827",
                          }}
                        >
                          {p.d}
                        </p>
                        {/* underline sweep */}
                        <motion.span
                          aria-hidden
                          className="block mt-3 h-px origin-left"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(147,51,234,0.8), rgba(82,120,255,0.6), transparent)",
                          }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: hovered === i ? 1 : 0.25 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* bottom hairline */}
            <div className="absolute inset-x-0 bottom-0 h-px" style={{
              background: "linear-gradient(90deg, transparent, rgba(82,120,255,0.4), rgba(147,51,234,0.4), transparent)",
            }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}



/* ----------------------------- Full-Stack Cards ----------------------------- */

function FullStackCards() {
  return (
    <section className="relative py-28 md:py-36 bg-white overflow-hidden">
      {/* Ambient mesh backdrop */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full blur-[140px] bg-[#5278FF]/15" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[55%] h-[55%] rounded-full blur-[140px] bg-[#9333EA]/15" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(rgba(27,43,75,0.18) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <Reveal>
          <p className="text-center text-[11px] tracking-[0.28em] text-mk-muted font-bold mb-3 uppercase">
            For Startups · Enterprises · Developers
          </p>
          <h2
            className="text-[34px] md:text-[60px] font-bold text-center max-w-4xl mx-auto tracking-tight leading-[1.05] text-mk-navy"
            style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            India's Full-Stack AI Marketing<br className="hidden md:block" /> Automation Platform
          </h2>
        </Reveal>

        <FloatingTrio />
      </div>
    </section>
  );
}

function FloatingTrio() {
  return (
    <div className="relative mt-16 md:mt-24 h-[760px] md:h-[640px]" style={{ fontFamily: "'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Card 1 — Lead Automation (top left, tilted) */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: -6 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE_EXPO }}
        whileHover={{ rotate: 0, y: -6 }}
        className="absolute top-0 left-1/2 md:left-[2%] -translate-x-1/2 md:translate-x-0 w-[320px] md:w-[340px] rounded-3xl p-6 border border-mk-border bg-white/85 backdrop-blur-xl z-30"
        style={{ boxShadow: "0 32px 80px -24px rgba(82,120,255,0.28), 0 0 0 1px rgba(255,255,255,0.6) inset" }}
      >
        <FloatHover>
          <div className="w-10 h-10 rounded-xl bg-[#5278FF]/12 flex items-center justify-center text-[#5278FF] mb-5">
            <Users size={18} />
          </div>
          <h3 className="text-mk-navy text-[18px] font-bold leading-tight mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Population-scale<br />Lead Automation
          </h3>
          <p className="text-mk-body text-[13px] leading-relaxed mb-4">
            Capture, qualify, and engage millions of leads with AI-driven personalization.
          </p>
          <LiveLeadStream />
        </FloatHover>
      </motion.div>

      {/* Card 2 — AI Engines (center hero, large) */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.1 }}
        whileHover={{ y: -4 }}
        className="absolute top-[36%] md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[360px] md:w-[420px] rounded-[40px] p-8 border border-mk-border bg-white z-40 flex flex-col items-center text-center"
        style={{ boxShadow: "0 48px 120px -32px rgba(147,51,234,0.35), 0 0 0 1px rgba(255,255,255,0.7) inset" }}
      >
        <NeuralCore />
        <h3 className="text-mk-navy text-[22px] md:text-[26px] font-bold mb-3 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          State-of-the-Art AI Engines
        </h3>
        <p className="text-mk-body text-[13px] leading-relaxed mb-5 px-2">
          Decision engines that learn your business and continuously improve outcomes.
        </p>
        <div className="grid grid-cols-2 gap-2.5 w-full">
          {["AI Brain", "Decision Engine", "Voice AI", "Content Studio"].map((l, i) => (
            <motion.div
              key={l}
              whileHover={{ y: -2, backgroundColor: "rgba(147,51,234,0.08)" }}
              className="px-3 py-2.5 bg-mk-bg rounded-2xl text-[11px] font-bold text-[#9333EA] border border-purple-100 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="w-1 h-1 rounded-full bg-[#9333EA] animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
              {l}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Card 3 — Infrastructure (bottom right, tilted) */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 6 }}
        whileInView={{ opacity: 1, y: 0, rotate: 3 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.2 }}
        whileHover={{ rotate: 0, y: -6 }}
        className="absolute bottom-0 left-1/2 md:left-auto md:right-[2%] -translate-x-1/2 md:translate-x-0 w-[320px] md:w-[340px] rounded-3xl p-6 border border-mk-border bg-white/85 backdrop-blur-xl z-30"
        style={{ boxShadow: "0 32px 80px -24px rgba(27,43,75,0.25), 0 0 0 1px rgba(255,255,255,0.6) inset" }}
      >
        <FloatHover delay={0.5}>
          <InfraGrid />
          <h3 className="text-mk-navy text-[18px] font-bold leading-tight mt-5 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Infrastructure to<br />Convert Efficiently
          </h3>
          <p className="text-mk-body text-[12px] leading-relaxed mb-4">
            Enterprise-grade infrastructure powering global, real-time automation.
          </p>
          <div className="flex justify-between items-end pt-3 border-t border-mk-border">
            <div>
              <div className="text-[20px] font-bold text-mk-navy tabular-nums" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>25.6k+</div>
              <div className="text-[9px] uppercase tracking-widest text-mk-muted font-bold">Leads/sec</div>
            </div>
            <div className="text-center">
              <div className="text-[20px] font-bold text-[#5278FF] tabular-nums" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>&lt;100ms</div>
              <div className="text-[9px] uppercase tracking-widest text-mk-muted font-bold">Latency</div>
            </div>
            <div className="text-right">
              <div className="text-[20px] font-bold text-emerald-500 tabular-nums" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>99.9%</div>
              <div className="text-[9px] uppercase tracking-widest text-mk-muted font-bold">Uptime</div>
            </div>
          </div>
        </FloatHover>
      </motion.div>
    </div>
  );
}

function FloatHover({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* Live streaming lead pills */
function LiveLeadStream() {
  const allLeads = [
    { id: 4291, color: "#5278FF", initials: "RV", channel: "WhatsApp", score: 98 },
    { id: 4292, color: "#9333EA", initials: "AS", channel: "Instagram", score: 92 },
    { id: 4293, color: "#C084FC", initials: "PK", channel: "Website", score: 95 },
    { id: 4294, color: "#10B981", initials: "MN", channel: "Email", score: 88 },
    { id: 4295, color: "#F59E0B", initials: "LJ", channel: "Voice", score: 91 },
  ];
  const [leads, setLeads] = useState(allLeads.slice(0, 3));
  const nextId = useRef(4296);
  useEffect(() => {
    const id = setInterval(() => {
      const channels = ["WhatsApp", "Instagram", "Website", "Email", "Voice"];
      const colors = ["#5278FF", "#9333EA", "#C084FC", "#10B981", "#F59E0B"];
      const idx = Math.floor(Math.random() * channels.length);
      const initials = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const newLead = {
        id: nextId.current++,
        color: colors[idx],
        initials,
        channel: channels[idx],
        score: 80 + Math.floor(Math.random() * 19),
      };
      setLeads((prev) => [newLead, ...prev.slice(0, 2)]);
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="space-y-2 h-[140px] overflow-hidden relative">
      <AnimatePresence initial={false}>
        {leads.map((l) => (
          <motion.div
            key={l.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="flex items-center gap-2.5 bg-mk-bg p-1.5 pr-2.5 rounded-full border border-mk-border"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0"
              style={{ background: l.color }}
            >
              {l.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-mk-navy leading-none">Lead #{l.id.toLocaleString()}</div>
              <div className="text-[9px] text-mk-muted mt-0.5">{l.channel}</div>
            </div>
            <span className="text-[9.5px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-bold whitespace-nowrap">
              {l.score}% AI
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ClaudeSparkIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  const rays = [
    { a: -105, l: 8.8 },
    { a: -80, l: 9.6 },
    { a: -50, l: 10.4 },
    { a: -30, l: 8.6 },
    { a: -10, l: 9.8 },
    { a: 12, l: 9.2 },
    { a: 35, l: 8.8 },
    { a: 65, l: 9.6 },
    { a: 90, l: 10.4 },
    { a: 120, l: 9.4 },
    { a: 145, l: 9.0 },
    { a: 170, l: 9.5 },
    { a: -170, l: 9.0 },
    { a: -140, l: 9.6 },
  ];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.2" />
      {rays.map((r, i) => {
        const rad = (r.a * Math.PI) / 180;
        const x2 = 12 + r.l * Math.cos(rad);
        const y2 = 12 + r.l * Math.sin(rad);
        return (
          <line
            key={i}
            x1="12"
            y1="12"
            x2={x2}
            y2={y2}
            strokeWidth="2.4"
          />
        );
      })}
    </svg>
  );
}

/* Neural core with rotating rings + orbiting particles */
function NeuralCore() {
  return (
    <div className="relative w-44 h-44 mb-6 flex items-center justify-center">
      {/* Outer dashed ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#9333EA]/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* Mid ring */}
      <motion.div
        className="absolute inset-4 rounded-full border-[1.5px] border-dashed border-[#9333EA]/45"
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner static ring */}
      <div className="absolute inset-8 rounded-full border-[1.5px] border-[#9333EA]/15" />

      {/* Core orb */}
      <motion.div
        className="relative w-20 h-20 rounded-full flex items-center justify-center text-white z-10"
        style={{
          background: "radial-gradient(circle at 30% 30%, #E9D5FF 0%, #C084FC 35%, #7C3AED 75%, #4C1D95 100%)",
          boxShadow: "0 0 50px rgba(168,85,247,0.6), 0 0 25px rgba(34,211,238,0.35), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <ClaudeSparkIcon size={30} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        {/* shock pulse */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full"
          animate={{ boxShadow: ["0 0 0 0 rgba(147,51,234,0.45)", "0 0 0 22px rgba(147,51,234,0)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Orbiting particles */}
      <Orbit color="#9333EA" duration={8} radius={86} size={10} />
      <Orbit color="#5278FF" duration={11} radius={76} size={7} reverse offset={120} />
      <Orbit color="#C084FC" duration={14} radius={92} size={6} offset={240} />
    </div>
  );
}

function Orbit({
  color,
  duration,
  radius,
  size,
  reverse = false,
  offset = 0,
}: {
  color: string;
  duration: number;
  radius: number;
  size: number;
  reverse?: boolean;
  offset?: number;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ rotate: offset }}
      animate={{ rotate: reverse ? offset - 360 : offset + 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <span
        className="absolute top-1/2 left-1/2 rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          boxShadow: `0 0 ${size * 1.5}px ${color}`,
          transform: `translate(-50%, -50%) translateX(${radius}px)`,
        }}
      />
    </motion.div>
  );
}

/* Infrastructure dot-grid with traveling data streams */
function InfraGrid() {
  return (
    <div className="relative h-32 w-full bg-mk-navy rounded-2xl overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(#5278FF 1.1px, transparent 1.1px)",
          backgroundSize: "12px 12px",
        }}
      />
      {/* Active nodes */}
      {[
        { top: "22%", left: "18%", c: "#9333EA", d: 0 },
        { top: "55%", left: "42%", c: "#5278FF", d: 0.6 },
        { top: "30%", left: "70%", c: "#10B981", d: 1.2 },
        { top: "68%", left: "82%", c: "#5278FF", d: 1.8 },
      ].map((n, i) => (
        <motion.span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ top: n.top, left: n.left, background: n.c, boxShadow: `0 0 10px ${n.c}` }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: n.d, ease: "easeInOut" }}
        />
      ))}
      {/* Data streams */}
      <motion.div
        className="absolute top-1/2 left-0 w-full h-px"
        style={{ background: "linear-gradient(90deg, transparent, #5278FF, transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/4 left-0 w-full h-px"
        style={{ background: "linear-gradient(90deg, transparent, #9333EA, transparent)" }}
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
      />
      <motion.div
        className="absolute top-3/4 left-0 w-full h-px"
        style={{ background: "linear-gradient(90deg, transparent, #10B981, transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1 }}
      />
      {/* Live uptime badge */}
      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[9px] text-white/85 font-mono tracking-widest font-bold">LIVE · 99.99%</span>
      </div>
      <div className="absolute top-2.5 left-2.5 text-[9px] text-white/55 font-mono tracking-widest font-bold">
        GLOBAL EDGE · 18 REGIONS
      </div>
    </div>
  );
}

/* ----------------------------- Case Studies ----------------------------- */

function CaseStudies() {
  const { isGalaxy } = useTheme();
  const c = [
    { tag: "Real Estate Agency", h: "3x increase in site visits", d: "Automated WhatsApp follow-ups and AI scheduling tripled qualified site visits within 60 days." },
    { tag: "Education Institute", h: "6,500+ student leads automated", d: "End-to-end lead capture, nurture, and admission counselling — fully automated across channels." },
    { tag: "Healthcare Clinic", h: "72% appointment confirmation rate", d: "Voice AI reminders and rebooking flows doubled show-up rates across three clinic locations." },
  ];
  return (
    <section id="case-studies" className="py-24 md:py-32 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <Reveal>
            <h2
              className="font-display text-[32px] md:text-[48px] max-w-2xl leading-tight"
              style={{ color: "var(--section-heading)" }}
            >
              Trusted by businesses that want more conversions
            </h2>
          </Reveal>
          <Reveal>
            <button className="mk-btn-outline">View all case studies →</button>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {c.map((x, i) => (
            <Reveal key={x.h} delay={i * 0.08}>
              <div
                className="p-6 rounded-2xl h-full flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 backdrop-blur-md"
                style={{
                  backgroundColor: "var(--section-card-bg)",
                  border: "1px solid var(--section-border)",
                  boxShadow: isGalaxy ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <span className="text-xs font-bold text-mk-orange uppercase tracking-wider">{x.tag}</span>
                <h3
                  className="font-display text-2xl font-bold leading-snug"
                  style={{ color: "var(--section-heading)" }}
                >
                  {x.h}
                </h3>
                <p
                  className="text-sm flex-1 leading-relaxed"
                  style={{ color: "var(--section-text)" }}
                >
                  {x.d}
                </p>
                <a
                  href="/#case-studies"
                  className="font-semibold text-sm hover:text-mk-orange transition-colors flex items-center gap-1.5"
                  style={{ color: "var(--section-heading)" }}
                >
                  <span>Read case study</span>
                  <span>→</span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Stats ----------------------------- */

function Stats() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2
            className="font-display text-[32px] md:text-[48px] text-center mb-14 leading-tight"
            style={{ color: "var(--section-heading)" }}
          >
            Delivering results at scale
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 md:divide-x" style={{ borderColor: "var(--section-border)" }}>
          {[
            { v: <><CountUp to={25630} />+</>, l: "Leads Captured" },
            { v: <><CountUp to={92} />%</>, l: "AI Confidence Score" },
            { v: <>₹<CountUp to={2.45} decimals={2} /> Cr</>, l: "Revenue Generated" },
            { v: <><CountUp to={320} />%</>, l: "Average ROI" },
          ].map((s, i) => (
            <div key={i} className="text-center px-4">
              <p
                className="font-display text-[40px] md:text-[56px] leading-none font-bold"
                style={{ color: "var(--section-heading)" }}
              >
                {s.v}
              </p>
              <p
                className="mt-2 text-sm font-medium"
                style={{ color: "var(--section-text)" }}
              >
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Enterprise Grade ----------------------------- */

function Enterprise() {
  const { isGalaxy } = useTheme();
  const cols = [
    { i: <Shield className="text-mk-orange" size={24} />, t: "Secure by default", items: ["SSL/TLS", "AES-256", "RBAC", "Audit logs"] },
    { i: <Server className="text-[#5278FF]" size={24} />, t: "Deployment flexibility", items: ["Cloud", "Private cloud", "API-first", "Webhooks"] },
    { i: <TrendingUp className="text-emerald-400" size={24} />, t: "Scalable operations", items: ["Multi-tenant", "Auto-scaling", "Backup", "99.9% uptime"] },
  ];
  return (
    <section className="py-24 md:py-32 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2
            className="font-display text-[32px] md:text-[48px] text-center mb-4 leading-tight"
            style={{ color: "var(--section-heading)" }}
          >
            Enterprise-grade. Out of the box.
          </h2>
          <p
            className="text-center max-w-2xl mx-auto mb-12 text-base leading-relaxed"
            style={{ color: "var(--section-text)" }}
          >
            Security, deployment, and scale — engineered from day one.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cols.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <div
                className="p-7 rounded-2xl h-full flex flex-col gap-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  backgroundColor: "var(--section-card-bg)",
                  border: "1px solid var(--section-border)",
                  boxShadow: isGalaxy ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: isGalaxy ? "rgba(255,255,255,0.05)" : "rgba(168,85,247,0.08)",
                    borderColor: isGalaxy ? "rgba(255,255,255,0.1)" : "rgba(168,85,247,0.2)",
                  }}
                >
                  {c.i}
                </div>
                <h4
                  className="font-bold text-xl leading-snug"
                  style={{ color: "var(--section-heading)" }}
                >
                  {c.t}
                </h4>
                <ul className="space-y-2 mt-1">
                  {c.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-center gap-2.5 text-sm"
                      style={{ color: "var(--section-text)" }}
                    >
                      <CheckCircle2 size={16} className="text-mk-orange flex-shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Roadmap ----------------------------- */

function Roadmap() {
  const { isGalaxy } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const weeks = [
    { i: <CheckCircle2 size={24} className="text-mk-orange" />, t: "Week 1 — Foundation", d: "CRM setup, lead source integration, WhatsApp Business API, basic flows." },
    { i: <Zap size={24} className="text-[#5278FF]" />, t: "Week 2 — AI Activation", d: "Lead scoring, AI decision engine, omnichannel setup, content AI." },
    { i: <BarChart3 size={24} className="text-emerald-400" />, t: "Week 3 — Optimization", d: "Analytics, retargeting, voice AI, prediction models." },
    { i: <Rocket size={24} className="text-purple-400" />, t: "Week 4 — Scale", d: "Campaign optimization, team expansion, advanced reporting, ROI tracking." },
  ];
  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal>
          <h2
            className="font-display text-[32px] md:text-[48px] text-center mb-16 leading-tight"
            style={{ color: "var(--section-heading)" }}
          >
            Go live in 4 weeks
          </h2>
        </Reveal>
        <div className="relative">
          <div className="hidden md:block absolute left-0 right-0 top-9 h-0.5" style={{ backgroundColor: "var(--section-border)" }} />
          <motion.div style={{ scaleX: scaleY }} className="hidden md:block absolute left-0 right-0 top-9 h-0.5 bg-mk-orange origin-left" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {weeks.map((w) => (
              <div key={w.t} className="flex md:flex-col gap-4 items-start md:items-center text-center">
                <div
                  className="relative z-10 w-[72px] h-[72px] flex-shrink-0 rounded-full flex items-center justify-center border-2 backdrop-blur-md"
                  style={{
                    backgroundColor: "var(--section-card-bg)",
                    borderColor: "var(--section-border)",
                    boxShadow: isGalaxy ? "0 4px 20px rgba(0,0,0,0.5)" : "0 4px 20px rgba(0,0,0,0.06)",
                  }}
                >
                  {w.i}
                </div>
                <div className="md:text-center text-left">
                  <h4
                    className="font-bold text-lg leading-snug"
                    style={{ color: "var(--section-heading)" }}
                  >
                    {w.t}
                  </h4>
                  <p
                    className="text-sm mt-2 leading-relaxed"
                    style={{ color: "var(--section-text)" }}
                  >
                    {w.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Final CTA ----------------------------- */

function FinalCta() {
  return (
    <section className="relative py-32 bg-mk-bg overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[240px] mk-orb pointer-events-none opacity-70" />
      <div className="relative max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6">
        <Divider />
        <p className="text-mk-orange text-xs uppercase tracking-widest font-bold">Get Started</p>
        <h2 className="font-display text-[40px] md:text-[56px] leading-[1.05] text-mk-heading">
          Start automating your<br />marketing today.
        </h2>
        <p className="text-mk-body max-w-md">
          Join 500+ businesses converting more leads with MARKETON.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="mk-btn-navy">Sign up <ArrowRight size={16} /></button>
          <button className="mk-btn-outline">Contact Us</button>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- Page ----------------------------- */

function MarketonPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-mk-bg text-mk-heading">
        <Navbar />
        <Hero />
        <IntegrationStrip />
        <PlatformTabs />
        <Architecture />
        <BusinessesCan />
        <MarketingFuture />
        <FullStackCards />
        <CaseStudies />
        <Stats />
        <Enterprise />
        <Roadmap />
        <FinalCta />
        <Footer />
      </main>
    </MotionConfig>
  );
}
