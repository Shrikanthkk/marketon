import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, MotionConfig } from "framer-motion";
import {
  Users,
  Target,
  Filter,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Gauge,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Lead Intelligence & Scoring — MARKETHON" },
      {
        name: "description",
        content:
          "AI-powered lead scoring and enrichment that identifies high-intent prospects and routes them to closed-won deals.",
      },
      { property: "og:title", content: "Lead Intelligence — MARKETHON" },
    ],
  }),
  component: LeadsPage,
});

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: <Flame className="w-6 h-6 text-[#9333EA]" />,
    title: "Predictive Lead Scoring (0–100)",
    desc: "Machine learning models evaluate multi-channel engagement, demographic fit, and behavioral signals to score every contact in milliseconds.",
    badge: "Predictive AI",
  },
  {
    icon: <Filter className="w-6 h-6 text-[#9333EA]" />,
    title: "Automated Data Enrichment",
    desc: "Enrich incoming leads with firmographics, LinkedIn titles, verified phone numbers, and revenue ranges with zero manual data entry.",
    badge: "Auto-Enrich",
  },
  {
    icon: <Target className="w-6 h-6 text-[#9333EA]" />,
    title: "Intelligent Routing & Distribution",
    desc: "Instantly match high-score leads to the most qualified sales reps or launch automated omnichannel sequences instantly.",
    badge: "Instant Handoff",
  },
  {
    icon: <Gauge className="w-6 h-6 text-[#9333EA]" />,
    title: "Real-time Lead Heatmaps",
    desc: "Track lead velocity, surge alerts, and buyer signals across WhatsApp, web forms, social ads, and inbound phone inquiries.",
    badge: "Live Telemetry",
  },
];

const METRICS = [
  { val: "3.2x", label: "Lead-to-Meeting Rate" },
  { val: "88%", label: "Pipeline Quality Score" },
  { val: "0 min", label: "Lead Assignment Latency" },
  { val: "500k+", label: "Leads Scored Daily" },
];

function LeadsPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-mk-bg text-mk-heading min-h-screen flex flex-col selection:bg-purple-500/20 selection:text-mk-navy">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 overflow-hidden bg-mk-bg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(850px 500px at 50% 20%, rgba(147,51,234,0.18), rgba(82,120,255,0.08) 45%, transparent 70%)",
            }}
          />

          <div className="max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
            <Link
              to="/"
              hash="platform"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-mk-border bg-white/60 backdrop-blur text-xs font-mono uppercase tracking-[0.2em] text-mk-navy hover:bg-white/90 transition mb-6 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Operations Room
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5FF] border border-purple-200/80 text-[#9333EA] text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_4px_20px_-4px_rgba(147,51,234,0.25)]"
            >
              <Users size={14} className="text-[#9333EA]" />
              <span>LEAD INTELLIGENCE & SCORING</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
              className="font-display text-[40px] md:text-[64px] leading-[1.08] text-mk-heading max-w-4xl tracking-tight mb-6"
            >
              Capture, Score & Convert Population-Scale Leads
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE_EXPO }}
              className="text-base md:text-lg text-mk-body max-w-2xl leading-relaxed mb-10"
            >
              Stop wasting sales rep time on dead-end leads. MARKETHON AI filters signal from noise,
              predicts purchase readiness, and automates fast follow-ups within 60 seconds.
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-12">
              {METRICS.map((m, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-mk-border bg-white/60 backdrop-blur-sm shadow-sm"
                >
                  <div className="text-2xl md:text-3xl font-bold font-mono text-[#9333EA]">{m.val}</div>
                  <div className="text-[11px] text-mk-body mt-1 uppercase tracking-wider">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 bg-white border-t border-mk-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-display text-[30px] md:text-[42px] text-mk-heading mb-3">
                Precision Lead Pipeline Capabilities
              </h2>
              <p className="text-mk-body text-sm md:text-base">
                Everything your revenue team needs to turn anonymous traffic into high-value customers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FEATURES.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="p-6 md:p-8 rounded-3xl border border-mk-border bg-mk-bg/40 flex flex-col gap-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-purple-200/80 flex items-center justify-center shadow-sm">
                      {c.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF5FF] text-[#9333EA] border border-purple-200/60">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-mk-navy text-xl">{c.title}</h3>
                  <p className="text-sm text-mk-body leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 bg-mk-bg border-t border-mk-border text-center">
          <div className="max-w-3xl mx-auto px-6 flex flex-col items-center gap-6">
            <h2 className="font-display text-[32px] md:text-[46px] text-mk-heading leading-tight">
              Scale your lead operations today
            </h2>
            <p className="text-mk-body max-w-lg">
              Unlock intelligent lead capture and AI-driven qualification in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                hash="top"
                className="px-7 py-3.5 rounded-full bg-mk-navy text-white text-sm font-semibold hover:scale-[1.02] shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/developer"
                className="px-7 py-3.5 rounded-full bg-white border border-mk-navy text-mk-navy text-sm font-semibold hover:bg-mk-navy hover:text-white transition flex items-center justify-center"
              >
                <span>Developer APIs</span>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </MotionConfig>
  );
}
