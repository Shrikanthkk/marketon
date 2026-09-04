import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, MotionConfig } from "framer-motion";
import {
  Brain,
  Database,
  RefreshCw,
  Share2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  Layers,
} from "lucide-react";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "CRM Automation & Two-Way Sync — MARKETHON" },
      {
        name: "description",
        content:
          "Bi-directional real-time synchronization with Salesforce, HubSpot, Zoho, Pipedrive, and custom data warehouses.",
      },
      { property: "og:title", content: "CRM Automation — MARKETHON" },
    ],
  }),
  component: CrmPage,
});

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: <RefreshCw className="w-6 h-6 text-[#F472B6]" />,
    title: "Bi-Directional Instant Sync",
    desc: "Update contact records, deal stages, and call notes in Salesforce and HubSpot within 200ms of any action.",
    badge: "2-Way Sync",
  },
  {
    icon: <Database className="w-6 h-6 text-[#F472B6]" />,
    title: "Automated Data Hygiene",
    desc: "Deduplicate contact entries, format phone numbers, verify email deliverability, and standardize addresses automatically.",
    badge: "Auto-Clean",
  },
  {
    icon: <Share2 className="w-6 h-6 text-[#F472B6]" />,
    title: "Custom Field Auto-Mapping",
    desc: "AI identifies and maps custom properties between MARKETHON pipelines and your existing CRM schema with zero manual config.",
    badge: "AI Mapping",
  },
  {
    icon: <Layers className="w-6 h-6 text-[#F472B6]" />,
    title: "Webhook & API Triggers",
    desc: "Trigger complex AI workflows from any CRM stage change, deal closed-won event, or status modification.",
    badge: "Event Driven",
  },
];

const METRICS = [
  { val: "<200ms", label: "Sync Latency" },
  { val: "50+ CRMs", label: "Native Connectors" },
  { val: "99.99%", label: "Data Accuracy" },
  { val: "0 min", label: "Setup Time" },
];

function CrmPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-mk-bg text-mk-heading min-h-screen flex flex-col selection:bg-pink-500/20 selection:text-mk-navy">
        <Navbar />

        {/* Hero Section */}
        <section className="relative pt-36 pb-16 md:pt-44 md:pb-24 overflow-hidden bg-mk-bg">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(850px 500px at 50% 20%, rgba(244,114,182,0.18), rgba(147,51,234,0.08) 45%, transparent 70%)",
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
              <Brain size={14} className="text-mk-orange" />
              <span>CRM AUTOMATION & SYNC</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
              className="font-display text-[40px] md:text-[64px] leading-[1.08] text-mk-heading max-w-4xl tracking-tight mb-6"
            >
              Zero-Friction CRM Synchronization
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE_EXPO }}
              className="text-base md:text-lg text-mk-body max-w-2xl leading-relaxed mb-10"
            >
              Keep your entire revenue stack unified in real time. MARKETHON writes call summaries,
              lead scores, and communication logs back to Salesforce, HubSpot, and Zoho seamlessly.
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
                Enterprise Integration Architecture
              </h2>
              <p className="text-mk-body text-sm md:text-base">
                Native integrations designed to preserve data integrity and prevent schema conflicts.
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
              Connect your CRM in 60 seconds
            </h2>
            <p className="text-mk-body max-w-lg">
              Eliminate manual data entry and keep your sales team aligned with live automation.
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
