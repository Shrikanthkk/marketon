import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, MotionConfig } from "framer-motion";
import {
  GitBranch,
  Workflow,
  Cpu,
  Zap,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sliders,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";

export const Route = createFileRoute("/flow")({
  head: () => ({
    meta: [
      { title: "Visual Workflow Builder & Automation Engine — MARKETHON" },
      {
        name: "description",
        content:
          "Visual drag-and-drop canvas for complex multi-stage marketing automation with conditional branches, webhooks, and AI logic gates.",
      },
      { property: "og:title", content: "Workflow Engine — MARKETHON" },
    ],
  }),
  component: FlowPage,
});

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES = [
  {
    icon: <Workflow className="w-6 h-6 text-[#8B5CF6]" />,
    title: "Visual Drag & Drop Canvas",
    desc: "Build sophisticated multi-step automations in minutes with visual trigger blocks, delays, splits, and AI nodes.",
    badge: "Infinite Canvas",
  },
  {
    icon: <GitBranch className="w-6 h-6 text-[#8B5CF6]" />,
    title: "Dynamic Conditional Logic",
    desc: "Branch based on lead score, website pageviews, cart values, or custom webhook responses with zero code.",
    badge: "Smart Branching",
  },
  {
    icon: <Sliders className="w-6 h-6 text-[#8B5CF6]" />,
    title: "Prebuilt Playbook Templates",
    desc: "100+ turnkey workflows for SaaS onboarding, e-commerce cart recovery, webinar nurture, and real estate scheduling.",
    badge: "100+ Templates",
  },
  {
    icon: <Cpu className="w-6 h-6 text-[#8B5CF6]" />,
    title: "AI Action Nodes",
    desc: "Insert AI decision steps that automatically draft personalized emails, synthesize audio voice scripts, or query external models.",
    badge: "AI Action Nodes",
  },
];

const METRICS = [
  { val: "100+", label: "Turnkey Templates" },
  { val: "<10ms", label: "Node Execution" },
  { val: "100%", label: "Visual Customization" },
  { val: "50M+", label: "Tasks Executed/Mo" },
];

function FlowPage() {
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
                "radial-gradient(850px 500px at 50% 20%, rgba(139,92,246,0.18), rgba(217,70,239,0.08) 45%, transparent 70%)",
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
              <GitBranch size={14} className="text-mk-orange" />
              <span>WORKFLOW BUILDER</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_EXPO }}
              className="font-display text-[40px] md:text-[64px] leading-[1.08] text-mk-heading max-w-4xl tracking-tight mb-6"
            >
              Visual Drag-and-Drop Automation Engine
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE_EXPO }}
              className="text-base md:text-lg text-mk-body max-w-2xl leading-relaxed mb-10"
            >
              Build end-to-end customer journeys visually without writing a single line of code.
              Combine AI logic nodes, time delays, and multi-channel dispatches on an infinite canvas.
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
                Built for High-Complexity Enterprise Journeys
              </h2>
              <p className="text-mk-body text-sm md:text-base">
                Design, test, and deploy resilient customer workflows that scale smoothly to millions of users.
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
              Start building your first workflow
            </h2>
            <p className="text-mk-body max-w-lg">
              Choose from 100+ proven marketing templates or create your custom pipeline today.
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
