import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
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
  X,
  Layers,
  Activity,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";
import { useTheme } from "@/lib/theme";

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
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  badge: string;
  highlight: string;
  overview: string;
  capabilities: string[];
  specs: { label: string; value: string }[];
  ctaText: string;
  ctaHref: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: "ai-brain-engine",
    icon: <Brain className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "AI Brain Engine",
    description: "Understands intent, sentiment, and behavior to personalize every touch.",
    badge: "Core Intelligence",
    highlight: "Deep NLP intent & sentiment analysis",
    overview:
      "The AI Brain Engine forms the cognitive neural foundation of MARKETHON. It analyzes multi-source customer interactions across WhatsApp, web sessions, email replies, and ad clicks in real time, calculating intent scores and behavioral affinities to drive precise conversion actions.",
    capabilities: [
      "Natural Language Understanding (NLU) tailored for conversational commerce",
      "Dynamic lead intent scoring (0–100) updated in milliseconds",
      "Sentiment classification and friction detection on live chats",
      "Behavior clustering and lookalike audience profile synthesis",
    ],
    specs: [
      { label: "Processing Latency", value: "< 45ms per inference" },
      { label: "Accuracy Confidence", value: "99.4% intent precision" },
      { label: "Model Architecture", value: "Custom fine-tuned transformer" },
      { label: "Supported Languages", value: "24+ Indian & Global languages" },
    ],
    ctaText: "Explore Interactive Brain Demo",
    ctaHref: "/#platform",
  },
  {
    id: "ai-decision-engine",
    icon: <Cpu className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "AI Decision Engine",
    description: "Picks the best channel, time, and message for each lead automatically.",
    badge: "Automation Core",
    highlight: "Dynamic multi-channel routing",
    overview:
      "Eliminating guesswork from marketing orchestration, the Decision Engine continuously evaluates dozens of real-time variables to determine the optimal channel (WhatsApp, Voice, Email, SMS), the exact second to reach out, and the highest-converting copy variant.",
    capabilities: [
      "Autonomous channel routing based on historical lead response propensity",
      "Send-time optimization targeting highest individual open windows",
      "Algorithmic A/B and multi-armed bandit message routing",
      "Smart auto-escalation to human sales reps upon high purchase intent",
    ],
    specs: [
      { label: "Decision Throughput", value: "25,000 decisions / sec" },
      { label: "Routing Latency", value: "< 12ms routing decision" },
      { label: "Optimization Type", value: "Contextual Multi-Armed Bandit" },
      { label: "Channel Adapters", value: "WhatsApp, SMS, Voice, Email, Push" },
    ],
    ctaText: "Test Decision Engine API",
    ctaHref: "/developer",
  },
  {
    id: "omnichannel-automation",
    icon: <Radio className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Omnichannel Automation",
    description: "WhatsApp, SMS, Email, Voice, Social — one orchestration layer.",
    badge: "Unified Messaging",
    highlight: "Synchronized across 7+ channels",
    overview:
      "A unified messaging backbone that bridges WhatsApp Official Cloud API, Instagram Direct, Telegram, SMS gateways, transactional emails, and web push notifications into a synchronized customer timeline without broken context or duplicate alerts.",
    capabilities: [
      "Official Meta WhatsApp Cloud API with interactive templates and rich catalogs",
      "Cross-channel conversation state synchronization across devices",
      "Automated drop-off follow-ups triggered across secondary channels",
      "Real-time webhook events and delivery receipt tracking",
    ],
    specs: [
      { label: "Delivery Rate", value: "99.98% SLA delivery guarantee" },
      { label: "API Rate Limit", value: "Up to 10,000 msgs / sec" },
      { label: "Channel Breadth", value: "7 integrated channels" },
      { label: "Compliance", value: "TRAI, DLT & GDPR compliant" },
    ],
    ctaText: "See Omnichannel in Action",
    ctaHref: "/omni",
  },
  {
    id: "ai-voice-agent",
    icon: <PhoneCall className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "AI Voice Agent",
    description: "Natural conversations that qualify, schedule, and convert leads.",
    badge: "Ultra-Low Latency",
    highlight: "Human-like conversational intelligence",
    overview:
      "Hyper-realistic voice agents capable of conducting human-like telephony calls with sub-250ms latency. The AI voice agent answers inquiries, qualifies prospects with situational awareness, handles objections, and directly books calendar appointments.",
    capabilities: [
      "Sub-250ms voice turnaround with natural breathing and cadence",
      "Multilingual voice synthesis covering English, Hindi, and regional accents",
      "Real-time live call transcription and key entity extraction",
      "Seamless warm transfer to human sales representatives when required",
    ],
    specs: [
      { label: "Voice Latency", value: "220ms response time" },
      { label: "Audio Codecs", value: "Opus, G.711, WebRTC HD" },
      { label: "Concurrent Calls", value: "50,000+ simultaneous lines" },
      { label: "Dialer Integration", value: "SIP trunk, Twilio, Exotel" },
    ],
    ctaText: "Experience Voice AI Demo",
    ctaHref: "/voice",
  },
  {
    id: "retargeting-engine",
    icon: <Target className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Retargeting Engine",
    description: "Win back drop-offs across every channel with smart audiences.",
    badge: "Conversion Boost",
    highlight: "Automated abandonment recovery",
    overview:
      "Recapture high-value abandoned leads and checkout drop-offs with personalized re-engagement workflows. The Retargeting Engine connects audience signals back to ad platforms and direct channels with dynamically tailored incentives.",
    capabilities: [
      "Real-time cart and lead form abandonment recapture",
      "Custom audience and lookalike sync with Meta Ads & Google Ads",
      "Dynamic discount and personalized incentive assignment",
      "Fatigue prevention with cross-channel frequency capping",
    ],
    specs: [
      { label: "Recovery Lift", value: "+38% average conversion lift" },
      { label: "Signal Sync Time", value: "< 1s real-time pixel sync" },
      { label: "Ad Platform Connectors", value: "Meta, Google, LinkedIn, TikTok" },
      { label: "Attribution Tracking", value: "Multi-touch multi-channel" },
    ],
    ctaText: "Explore Retargeting Workflows",
    ctaHref: "/rev",
  },
  {
    id: "content-ai-studio",
    icon: <PenTool className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Content AI Studio",
    description: "Generate ads, emails, captions, and scripts in seconds.",
    badge: "Generative AI",
    highlight: "High-converting multi-variant copy",
    overview:
      "An automated copy and creative generator tuned on millions of high-performing marketing campaigns. Content AI Studio generates conversion-optimized ad headlines, WhatsApp template copy, cold email sequences, and video scripts in seconds.",
    capabilities: [
      "Multi-variant copy generation with automatic persona customization",
      "Brand voice and tone guardrails for uniform communications",
      "Predictive readability, click-through rate, and engagement scoring",
      "One-click multi-language localization and translation",
    ],
    specs: [
      { label: "Generation Speed", value: "< 1.5s per multi-variant batch" },
      { label: "Output Formats", value: "Ads, WhatsApp, Emails, SMS, Scripts" },
      { label: "Tone Profiles", value: "Persuasive, Professional, Casual, Direct" },
      { label: "Compliance Checks", value: "Automated spam & policy check" },
    ],
    ctaText: "Try Content Studio",
    ctaHref: "/ai",
  },
  {
    id: "appointment-calendar",
    icon: <CalendarIcon className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Appointment & Calendar",
    description: "Smart scheduling with reminders, sync, and reschedules.",
    badge: "Direct Sync",
    highlight: "Google, Outlook & CRM calendar sync",
    overview:
      "Frictionless booking infrastructure that integrates directly into conversation flows. Prospects can book, reschedule, or cancel appointments through WhatsApp or Voice AI with live two-way sync across Google Calendar, Outlook, and your CRM.",
    capabilities: [
      "In-chat conversational booking with no external link redirection required",
      "Round-robin and skillset-based sales rep meeting distribution",
      "Automatic timezone detection and buffer time enforcement",
      "Bi-directional calendar sync preventing double booking",
    ],
    specs: [
      { label: "Calendar Providers", value: "Google, Microsoft 365, Outlook, CalDAV" },
      { label: "Sync Latency", value: "Instant real-time webhook sync" },
      { label: "Routing Modes", value: "Round-robin, Priority, Closest rep" },
      { label: "Reschedule Rate", value: "92% automated show-up rate" },
    ],
    ctaText: "View Smart Scheduling",
    ctaHref: "/flow",
  },
  {
    id: "reminder-system",
    icon: <Bell className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "Reminder System",
    description: "Automated reminders that keep your customers on-track.",
    badge: "Show-Up Protection",
    highlight: "Multi-touch timed alert sequences",
    overview:
      "An automated show-up protection engine that sends timely, personalized nudges before scheduled meetings, webinars, payment renewals, and expiring offers across the recipient's most active channel.",
    capabilities: [
      "Multi-touch reminder cadences (24h, 1h, 10m before event)",
      "Interactive confirmation buttons ('Confirm', 'Reschedule', 'Cancel')",
      "Automated fallback to SMS or Voice call if WhatsApp message is unread",
      "Dynamic calendar attachment and location map integration",
    ],
    specs: [
      { label: "Attendance Impact", value: "+42% increase in show-up rate" },
      { label: "Cadence Flexibility", value: "Fully custom delay triggers" },
      { label: "Channel Fallback", value: "Automatic multi-tier escalation" },
      { label: "Trigger Reliability", value: "99.999% timed job delivery" },
    ],
    ctaText: "Discover Reminder Automation",
    ctaHref: "/leads",
  },
  {
    id: "crm-team-management",
    icon: <Users className="w-6 h-6 text-mk-orange" aria-hidden="true" />,
    title: "CRM & Team Management",
    description: "Roles, assignments, activity logs, and performance dashboards.",
    badge: "Enterprise Ready",
    highlight: "Granular roles & activity audit trails",
    overview:
      "Enterprise-grade collaboration tools providing unified lead pipelines, team performance analytics, role-based access control (RBAC), and automated rep assignment rules tailored for modern revenue teams.",
    capabilities: [
      "Visual Kanban pipeline with customizable deal stages and AI indicators",
      "Granular role-based permissions, data masking, and SOC2 compliance",
      "Real-time team leaderboards, response-time metrics, and SLA monitoring",
      "Comprehensive audit logs tracking every customer edit and touchpoint",
    ],
    specs: [
      { label: "User Capacity", value: "Unlimited seats & workspace teams" },
      { label: "Security Standard", value: "AES-256 encryption & TLS 1.3" },
      { label: "Audit Retention", value: "365-day immutable activity logs" },
      { label: "CRM Connectors", value: "HubSpot, Salesforce, Zoho, Custom REST" },
    ],
    ctaText: "Explore CRM Features",
    ctaHref: "/crm",
  },
];

function ResourcesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLElement | null>>({});
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isBrownGold = theme === "brown-gold";

  const selectedFeature = FEATURES.find((f) => f.id === selectedId) || null;

  // Background scroll lock & keyboard escape handler
  useEffect(() => {
    if (selectedId) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSelectedId(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      // Focus modal container for accessibility
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedId]);

  // Return focus to trigger button after close
  const handleClose = () => {
    const idToRefocus = selectedId;
    setSelectedId(null);
    if (idToRefocus && triggerRefs.current[idToRefocus]) {
      setTimeout(() => {
        triggerRefs.current[idToRefocus]?.focus();
      }, 100);
    }
  };

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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mk-orange/10 border border-mk-orange/30 text-mk-orange text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
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
                className="mk-btn-navy px-6 py-3 rounded-full text-sm font-semibold shadow-lg transition flex items-center gap-2"
              >
                <span>Interactive Platform Demo</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="/#developers"
                className="mk-btn-outline px-6 py-3 rounded-full text-sm font-semibold transition flex items-center gap-2"
              >
                <span>Developer API & SDK</span>
              </a>
            </motion.div>
          </div>
        </section>

        {/* 9 Feature Cards Section in Responsive Grid */}
        <section className="py-16 md:py-24 bg-mk-bg relative border-t border-mk-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feat, index) => {
                const isCardSelected = selectedId === feat.id;

                return (
                  <motion.article
                    key={feat.id}
                    layoutId={`resource-card-container-${feat.id}`}
                    ref={(el) => {
                      triggerRefs.current[feat.id] = el;
                    }}
                    tabIndex={0}
                    role="button"
                    aria-haspopup="dialog"
                    aria-expanded={isCardSelected}
                    aria-label={`Open details for ${feat.title}`}
                    onClick={() => setSelectedId(feat.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(feat.id);
                      }
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.6,
                      delay: (index % 3) * 0.08,
                      ease: EASE_EXPO,
                    }}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-2xl border border-mk-border bg-card/75 backdrop-blur-sm p-7 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:border-mk-orange/50 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-mk-orange"
                    style={{
                      opacity: selectedId && !isCardSelected ? 0.35 : 1,
                      filter: selectedId && !isCardSelected ? "blur(1px)" : "none",
                    }}
                  >
                    {/* Top Animated Color Bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mk-orange to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />

                    <div>
                      {/* Top Header: Icon & Micro Tag */}
                      <div className="flex items-center justify-between mb-5">
                        <motion.div
                          layoutId={`resource-card-icon-${feat.id}`}
                          className="w-12 h-12 rounded-xl bg-mk-orange/10 border border-mk-orange/30 flex items-center justify-center text-mk-orange shadow-sm group-hover:scale-110 transition-transform duration-300"
                        >
                          {feat.icon}
                        </motion.div>
                        <motion.span
                          layoutId={`resource-card-badge-${feat.id}`}
                          className="text-[11px] font-bold uppercase tracking-wider text-mk-body bg-mk-bg px-2.5 py-1 rounded-full border border-mk-border"
                        >
                          {feat.badge}
                        </motion.span>
                      </div>

                      {/* Title */}
                      <motion.h2
                        layoutId={`resource-card-title-${feat.id}`}
                        className="font-bold text-mk-heading text-[20px] mb-2.5 leading-snug group-hover:text-mk-orange transition-colors"
                      >
                        {feat.title}
                      </motion.h2>

                      {/* Description */}
                      <motion.p
                        layoutId={`resource-card-desc-${feat.id}`}
                        className="text-sm text-mk-body leading-relaxed mb-6"
                      >
                        {feat.description}
                      </motion.p>
                    </div>

                    {/* Footer Micro Highlight + Tap to Expand Cue */}
                    <div className="pt-4 border-t border-mk-border/60 flex items-center justify-between text-xs font-semibold text-mk-body">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{feat.highlight}</span>
                      </div>
                      <span className="text-[11px] text-mk-orange font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform shrink-0">
                        <span>Expand</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Full-Screen FLIP Modal Overlay */}
        <AnimatePresence>
          {selectedId && selectedFeature && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8">
              {/* Dark Semi-transparent Overlay with Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={handleClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                aria-hidden="true"
              />

              {/* Expanded Card Shared Element */}
              <motion.div
                ref={modalRef}
                layoutId={`resource-card-container-${selectedFeature.id}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`dialog-title-${selectedFeature.id}`}
                tabIndex={-1}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 28,
                  mass: 0.9,
                }}
                className="resource-expanded-card relative z-10 w-full max-w-4xl h-[92vh] max-h-[850px] rounded-3xl border border-mk-border bg-card shadow-2xl flex flex-col overflow-hidden focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header Strip with Accent Glow & Close Button */}
                <div className="relative border-b border-mk-border/70 px-6 sm:px-8 py-5 flex items-center justify-between gap-4 shrink-0 bg-mk-bg/40 backdrop-blur">
                  <div className="flex items-center gap-4 min-w-0">
                    <motion.div
                      layoutId={`resource-card-icon-${selectedFeature.id}`}
                      className="w-12 h-12 rounded-xl bg-mk-orange/15 border border-mk-orange/40 flex items-center justify-center text-mk-orange shadow-md shrink-0"
                    >
                      {selectedFeature.icon}
                    </motion.div>
                    <div className="min-w-0">
                      <motion.span
                        layoutId={`resource-card-badge-${selectedFeature.id}`}
                        className="inline-block text-[10px] font-bold uppercase tracking-wider text-mk-orange bg-mk-orange/10 border border-mk-orange/30 px-2.5 py-0.5 rounded-full mb-1"
                      >
                        {selectedFeature.badge}
                      </motion.span>
                      <motion.h2
                        id={`dialog-title-${selectedFeature.id}`}
                        layoutId={`resource-card-title-${selectedFeature.id}`}
                        className="font-bold text-mk-heading text-xl sm:text-2xl truncate leading-tight"
                      >
                        {selectedFeature.title}
                      </motion.h2>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close details view"
                    className="w-10 h-10 rounded-full bg-mk-bg border border-mk-border hover:border-mk-orange/60 text-mk-heading hover:text-mk-orange flex items-center justify-center shadow-md transition-all hover:scale-105 shrink-0 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Scrollable Content Container */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-8 mk-no-scrollbar">
                  {/* Lead Description & Full Overview */}
                  <div>
                    <motion.p
                      layoutId={`resource-card-desc-${selectedFeature.id}`}
                      className="text-base sm:text-lg text-mk-heading font-medium leading-relaxed mb-4"
                    >
                      {selectedFeature.description}
                    </motion.p>
                    <p className="text-sm sm:text-base text-mk-body leading-relaxed">
                      {selectedFeature.overview}
                    </p>
                  </div>

                  {/* Key Capabilities Grid */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-mk-heading flex items-center gap-2 mb-4">
                      <Layers size={16} className="text-mk-orange" />
                      <span>Key Architectural Capabilities</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {selectedFeature.capabilities.map((cap, i) => (
                        <div
                          key={i}
                          className="resource-card-feature-box p-4 rounded-xl border border-mk-border bg-mk-bg/60 backdrop-blur-sm flex items-start gap-3 shadow-sm"
                        >
                          <CheckCircle2
                            size={18}
                            className="text-emerald-500 shrink-0 mt-0.5"
                          />
                          <span className="text-xs sm:text-sm text-mk-body font-medium leading-relaxed">
                            {cap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical Benchmarks & Specs */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-mk-heading flex items-center gap-2 mb-4">
                      <Activity size={16} className="text-mk-orange" />
                      <span>Technical Performance & Specs</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedFeature.specs.map((spec, i) => (
                        <div
                          key={i}
                          className="resource-card-spec-box p-3.5 rounded-xl border border-mk-border bg-mk-bg/40 flex flex-col justify-between"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-mk-muted mb-1">
                            {spec.label}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-mk-heading">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security & Reliability Banner */}
                  <div className="p-4 rounded-2xl border border-mk-border/80 bg-mk-orange/5 flex items-center gap-3.5">
                    <ShieldCheck size={22} className="text-mk-orange shrink-0" />
                    <div className="text-xs sm:text-sm text-mk-body">
                      <strong className="text-mk-heading">Enterprise Production Ready:</strong> Built with end-to-end TLS 1.3 encryption, automatic failover clusters, and 99.99% uptime SLA.
                    </div>
                  </div>
                </div>

                {/* Footer Modal Actions */}
                <div className="border-t border-mk-border/70 px-6 sm:px-8 py-4 bg-mk-bg/60 backdrop-blur flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <span className="text-xs font-medium text-mk-muted hidden sm:inline-block">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-mk-border/40 text-mk-heading font-mono text-[10px]">Esc</kbd> or click outside to close
                  </span>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="mk-btn-outline px-5 py-2.5 rounded-full text-xs font-semibold transition"
                    >
                      <span>Close</span>
                    </button>
                    <a
                      href={selectedFeature.ctaHref}
                      className="mk-btn-navy px-6 py-2.5 rounded-full text-xs font-semibold shadow-md transition flex items-center gap-2"
                    >
                      <span>{selectedFeature.ctaText}</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
                className="mk-btn-navy px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="/#contact"
                className="mk-btn-outline px-7 py-3.5 rounded-full text-sm font-semibold transition flex items-center justify-center"
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

