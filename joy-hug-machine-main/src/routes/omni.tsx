import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, MotionConfig } from "framer-motion";
import {
  Zap,
  MessageSquare,
  Mail,
  Send,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Radio,
} from "lucide-react";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";

export const Route = createFileRoute("/omni")({
  head: () => ({
    meta: [
      { title: "Omnichannel Messaging & Orchestration — MARKETHON" },
      {
        name: "description",
        content:
          "Orchestrate WhatsApp, SMS, Email, Telegram, Messenger, and Web Push with one unified AI automation engine.",
      },
      { property: "og:title", content: "Omnichannel Automation — MARKETHON" },
    ],
  }),
  component: OmniPage,
});

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: <MessageSquare className="w-6 h-6 text-[#10B981]" />,
    title: "Official WhatsApp Cloud API",
    desc: "Send interactive catalogs, verification OTPs, rich carousels, and two-way AI conversational nurture at scale.",
    badge: "Meta Verified",
  },
  {
    icon: <Mail className="w-6 h-6 text-[#10B981]" />,
    title: "Dynamic AI Email Personalization",
    desc: "Generate individualized subject lines and body copy for every recipient to boost open rates and click-throughs.",
    badge: "Dynamic AI",
  },
  {
    icon: <Radio className="w-6 h-6 text-[#10B981]" />,
    title: "Channel Fallback Routing",
    desc: "If WhatsApp is unread after 15 minutes, automatically route to SMS or trigger a push notification without dropping context.",
    badge: "Smart Fallback",
  },
  {
    icon: <Layers className="w-6 h-6 text-[#10B981]" />,
    title: "Unified Customer Inbox",
    desc: "Every conversation across WhatsApp, Instagram, Telegram, and Email unified in a single, high-speed shared team inbox.",
    badge: "Single Pane",
  },
];

const METRICS = [
  { val: "98.2%", label: "WhatsApp Open Rate" },
  { val: "7+ Channels", label: "Unified Messaging" },
  { val: "<1.2s", label: "Message Delivery" },
  { val: "25M+", label: "Monthly Dispatches" },
];

function OmniPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-mk-bg text-mk-heading min-h-screen flex flex-col selection:bg-emerald-500/20 selection:text-mk-navy">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 overflow-hidden bg-mk-bg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(850px 500px at 50% 20%, rgba(16,185,129,0.18), rgba(82,120,255,0.08) 45%, transparent 70%)",
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5FF] border border-emerald-200/80 text-[#10B981] text-xs font-bold uppercase tracking-wider mb-6 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.25)]"
            >
              <Zap size={14} className="text-[#10B981]" />
              <span>OMNICHANNEL ORCHESTRATION</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
              className="font-display text-[40px] md:text-[64px] leading-[1.08] text-mk-heading max-w-4xl tracking-tight mb-6"
            >
              One Orchestration Layer for Every Channel
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE_EXPO }}
              className="text-base md:text-lg text-mk-body max-w-2xl leading-relaxed mb-10"
            >
              Engage your customers where they are. Seamlessly coordinate WhatsApp, SMS, Email,
              Instagram DMs, Telegram, and Voice calls into one continuous conversation.
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-12">
              {METRICS.map((m, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-mk-border bg-white/60 backdrop-blur-sm shadow-sm"
                >
                  <div className="text-2xl md:text-3xl font-bold font-mono text-[#10B981]">{m.val}</div>
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
                Full-Stack Channel Capabilities
              </h2>
              <p className="text-mk-body text-sm md:text-base">
                Direct enterprise telecom gateways and API integrations for instant global delivery.
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
                    <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200/80 flex items-center justify-center shadow-sm">
                      {c.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF5FF] text-[#10B981] border border-emerald-200/60">
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
              Connect all your channels in one click
            </h2>
            <p className="text-mk-body max-w-lg">
              Launch personalized omnichannel sequences and multiply your customer reach.
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
