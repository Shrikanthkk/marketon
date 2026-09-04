import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, MotionConfig } from "framer-motion";
import {
  PhoneCall,
  Mic,
  Volume2,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Activity,
} from "lucide-react";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";

export const Route = createFileRoute("/voice")({
  head: () => ({
    meta: [
      { title: "Voice AI & Autonomous Calling — MARKETHON" },
      {
        name: "description",
        content:
          "Human-like conversational Voice AI that handles outbound lead qualification, appointment booking, and inbound customer support at scale.",
      },
      { property: "og:title", content: "Voice AI — MARKETHON" },
    ],
  }),
  component: VoicePage,
});

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: <PhoneCall className="w-6 h-6 text-[#5278FF]" />,
    title: "Sub-500ms Conversational Latency",
    desc: "Ultra-low-latency voice synthesis and interruption handling creates seamless, natural telephone conversations.",
    badge: "Neural TTS",
  },
  {
    icon: <Calendar className="w-6 h-6 text-[#5278FF]" />,
    title: "Autonomous Calendar Scheduling",
    desc: "Syncs directly with Google Calendar, Outlook, and CRM schedules to confirm and rebook meetings in real time.",
    badge: "Calendar Sync",
  },
  {
    icon: <Volume2 className="w-6 h-6 text-[#5278FF]" />,
    title: "Multilingual & Accent Support",
    desc: "Fluent in 40+ languages and localized Indian & global accents with emotional tone modulation.",
    badge: "40+ Languages",
  },
  {
    icon: <Activity className="w-6 h-6 text-[#5278FF]" />,
    title: "Live Call Transcripts & Summaries",
    desc: "Instant structured CRM field updates, sentiment scores, and audio playback generated right after every call.",
    badge: "Instant Summary",
  },
];

const METRICS = [
  { val: "<480ms", label: "Response Latency" },
  { val: "72%", label: "Meeting Show-Up Rate" },
  { val: "10,000+", label: "Concurrent Calls" },
  { val: "99.9%", label: "Uptime Reliability" },
];

function VoicePage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-mk-bg text-mk-heading min-h-screen flex flex-col selection:bg-blue-500/20 selection:text-mk-navy">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 overflow-hidden bg-mk-bg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(850px 500px at 50% 20%, rgba(82,120,255,0.18), rgba(147,51,234,0.08) 45%, transparent 70%)",
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mk-orange/10 border border-mk-orange/30 text-mk-orange text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
            >
              <PhoneCall size={14} className="text-mk-orange" />
              <span>VOICE AI AGENT</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
              className="font-display text-[40px] md:text-[64px] leading-[1.08] text-mk-heading max-w-4xl tracking-tight mb-6"
            >
              Human-Quality Autonomous Voice Agents
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE_EXPO }}
              className="text-base md:text-lg text-mk-body max-w-2xl leading-relaxed mb-10"
            >
              Qualify leads, book appointments, and follow up with zero human delay. MARKETHON Voice AI
              speaks naturally, handles interruptions effortlessly, and syncs summaries directly to your CRM.
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-12">
              {METRICS.map((m, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-mk-border bg-card/75 backdrop-blur-sm shadow-sm"
                >
                  <div className="text-2xl md:text-3xl font-bold font-mono text-mk-orange">{m.val}</div>
                  <div className="text-[11px] text-mk-body mt-1 uppercase tracking-wider">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 bg-mk-bg border-t border-mk-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-display text-[30px] md:text-[42px] text-mk-heading mb-3">
                Enterprise Voice Automation Architecture
              </h2>
              <p className="text-mk-body text-sm md:text-base">
                Purpose-built telephony infrastructure powering millions of automated conversations monthly.
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
                  className="p-6 md:p-8 rounded-3xl border border-mk-border bg-card/75 backdrop-blur-sm flex flex-col gap-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-mk-orange/10 border border-mk-orange/30 flex items-center justify-center shadow-sm text-mk-orange">
                      {c.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-mk-orange/10 text-mk-orange border border-mk-orange/30">
                      {c.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-mk-heading text-xl">{c.title}</h3>
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
              Transform your phone outreach with Voice AI
            </h2>
            <p className="text-mk-body max-w-lg">
              Start making intelligent outbound calls and never miss an inbound inquiry.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                hash="top"
                className="mk-btn-navy px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/developer"
                className="mk-btn-outline px-7 py-3.5 rounded-full text-sm font-semibold transition flex items-center justify-center"
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
