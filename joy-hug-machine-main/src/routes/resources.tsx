import { createFileRoute } from "@tanstack/react-router";
import { motion, MotionConfig } from "framer-motion";
import {
  Brain,
  Cpu,
  Radio,
  PhoneCall,
  Target,
  PenTool,
  Calendar as CalendarIcon,
  Bell,
  Users,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";
import { type ReactNode } from "react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources & Features — MARKETHON AI" },
      {
        name: "description",
        content:
          "Every tool you need to convert leads. Explore the AI Brain Engine, Decision Engine, Omnichannel Automation, Voice Agents, and CRM tools.",
      },
      { property: "og:title", content: "Resources — MARKETHON AI Marketing Automation" },
      {
        property: "og:description",
        content: "Every tool you need to convert leads into loyal customers.",
      },
    ],
  }),
  component: ResourcesPage,
});

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
  badge: string;
  highlight: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: <Brain className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "AI Brain Engine",
    description: "Understands intent, sentiment, and behavior to personalize every touch.",
    badge: "Core Intelligence",
    highlight: "Deep NLP intent & sentiment analysis",
  },
  {
    icon: <Cpu className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "AI Decision Engine",
    description: "Picks the best channel, time, and message for each lead automatically.",
    badge: "Automation Core",
    highlight: "Dynamic multi-channel routing",
  },
  {
    icon: <Radio className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Omnichannel Automation",
    description: "WhatsApp, SMS, Email, Voice, Social — one orchestration layer.",
    badge: "Unified Messaging",
    highlight: "Synchronized across 7+ channels",
  },
  {
    icon: <PhoneCall className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "AI Voice Agent",
    description: "Natural conversations that qualify, schedule, and convert leads.",
    badge: "Ultra-Low Latency",
    highlight: "Human-like conversational intelligence",
  },
  {
    icon: <Target className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Retargeting Engine",
    description: "Win back drop-offs across every channel with smart audiences.",
    badge: "Conversion Boost",
    highlight: "Automated abandonment recovery",
  },
  {
    icon: <PenTool className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Content AI Studio",
    description: "Generate ads, emails, captions, and scripts in seconds.",
    badge: "Generative AI",
    highlight: "High-converting multi-variant copy",
  },
  {
    icon: <CalendarIcon className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Appointment & Calendar",
    description: "Smart scheduling with reminders, sync, and reschedules.",
    badge: "Direct Sync",
    highlight: "Google, Outlook & CRM calendar sync",
  },
  {
    icon: <Bell className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Reminder System",
    description: "Automated reminders that keep your customers on-track.",
    badge: "Show-Up Protection",
    highlight: "Multi-touch timed alert sequences",
  },
  {
    icon: <Users className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "CRM & Team Management",
    description: "Roles, assignments, activity logs, and performance dashboards.",
    badge: "Enterprise Ready",
    highlight: "Granular roles & activity audit trails",
  },
];

function ResourcesPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-mk-bg text-mk-heading min-h-screen flex flex-col selection:bg-mk-orange/20 selection:text-mk-navy">
        <Navbar />

        {/* Hero Banner with Cosmic Ambient Glow */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-mk-bg">
          {/* Cosmic Atmospheric Backdrops */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(900px 500px at 50% 15%, rgba(168,85,247,0.18), transparent 65%), radial-gradient(700px 450px at 15% 55%, rgba(34,211,238,0.12), transparent 60%), radial-gradient(800px 500px at 85% 65%, rgba(217,70,239,0.10), transparent 60%)",
            }}
          />

          {/* Subtle Grid Lines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(27,43,75,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(27,43,75,0.12) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 80%)",
            }}
          />

          <div className="max-w-6xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5FF] border border-purple-200/80 text-mk-orange text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.25)]"
            >
              <Sparkles size={14} className="text-mk-orange" />
              <span>MARKETHON RESOURCE HUB</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
              className="font-display text-[40px] md:text-[64px] leading-[1.08] text-mk-heading max-w-4xl tracking-tight mb-6"
            >
              Every Tool You Need to Convert Leads
            </motion.h1>

            {/* Supporting Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE_EXPO }}
              className="text-base md:text-lg text-mk-body max-w-2xl leading-relaxed mb-10"
            >
              Explore our full suite of AI decision engines, omnichannel automation layers,
              and intelligent conversion systems built to automate and scale your marketing.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE_EXPO }}
              className="flex flex-wrap items-center justify-center gap-3.5"
            >
              <a
                href="/#platform"
                className="px-6 py-3 rounded-full bg-mk-navy text-white text-sm font-semibold hover:scale-[1.02] shadow-[0_12px_28px_-8px_rgba(27,43,75,0.45)] transition flex items-center gap-2"
              >
                <span>Interactive Platform Demo</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="/#developers"
                className="px-6 py-3 rounded-full bg-white border border-mk-border text-mk-navy text-sm font-semibold hover:border-mk-orange hover:text-mk-orange hover:shadow-md transition flex items-center gap-2"
              >
                <span>Developer API & SDK</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* 9 Feature Cards Section in Responsive Grid */}
        <section className="py-16 md:py-24 bg-white relative">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feat, index) => (
                <motion.article
                  key={feat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.6,
                    delay: (index % 3) * 0.08,
                    ease: EASE_EXPO,
                  }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl border border-mk-border bg-white p-7 flex flex-col justify-between overflow-hidden shadow-[0_4px_24px_-8px_rgba(27,43,75,0.06)] hover:shadow-[0_24px_48px_-16px_rgba(168,85,247,0.22)] hover:border-purple-300/80 transition-all duration-300"
                >
                  {/* Top Animated Color Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A855F7] via-[#C084FC] to-[#22D3EE] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                  <div>
                    {/* Top Header: Icon & Micro Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF5FF] border border-purple-200/70 flex items-center justify-center text-mk-orange shadow-[0_4px_16px_-4px_rgba(168,85,247,0.25)] group-hover:scale-110 transition-transform duration-300">
                        {feat.icon}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-mk-body/75 bg-mk-bg px-2.5 py-1 rounded-full border border-mk-border/80">
                        {feat.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-bold text-mk-navy text-[20px] mb-2.5 leading-snug group-hover:text-mk-orange transition-colors">
                      {feat.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-mk-body leading-relaxed mb-6">
                      {feat.description}
                    </p>
                  </div>

                  {/* Footer Micro Highlight */}
                  <div className="pt-4 border-t border-mk-border/60 flex items-center gap-2 text-xs font-semibold text-mk-body/90">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{feat.highlight}</span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="relative py-24 bg-mk-bg overflow-hidden border-t border-mk-border">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(700px 400px at 50% 50%, rgba(168,85,247,0.15), rgba(34,211,238,0.10) 45%, transparent 70%)",
            }}
          />
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-5">
            <div className="w-10 h-10 rounded-full bg-mk-orange/15 text-mk-orange flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h2 className="font-display text-[32px] md:text-[46px] text-mk-heading leading-tight">
              Ready to automate your marketing workflow?
            </h2>
            <p className="text-mk-body text-base max-w-lg mb-4">
              Get started with MARKETHON in minutes. Connect your favorite tools and launch AI
              orchestration across every channel.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/#top"
                className="px-7 py-3.5 rounded-full bg-mk-navy text-white text-sm font-semibold hover:scale-[1.02] shadow-[0_12px_28px_-8px_rgba(27,43,75,0.45)] transition flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="/#contact"
                className="px-7 py-3.5 rounded-full bg-white border border-mk-navy text-mk-navy text-sm font-semibold hover:bg-mk-navy hover:text-white transition flex items-center justify-center"
              >
                <span>Book a Demo</span>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </MotionConfig>
  );
}
