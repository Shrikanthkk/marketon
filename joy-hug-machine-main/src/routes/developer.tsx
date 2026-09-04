import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, Component, type ReactNode, type ErrorInfo } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  Play,
  Square,
  RotateCcw,
  Terminal,
  ArrowRight,
  Code2,
  Sparkles,
  Zap,
  Globe,
  Shield,
  Database,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import Navbar from "@/components/marketon/Navbar";
import Footer from "@/components/marketon/Footer";
import AIOperationsRoom from "@/components/marketon/AIOperationsRoom";

export const Route = createFileRoute("/developer")({
  head: () => ({
    meta: [
      { title: "Developer Platform & APIs — MARKETHON" },
      {
        name: "description",
        content:
          "Build anything with MARKETHON APIs. Integrate AI lead scoring, WhatsApp automation, and omnichannel workflows in Python, TypeScript, Node.js, Go, cURL, and more.",
      },
      { property: "og:title", content: "Developer Platform & APIs — MARKETHON" },
      {
        property: "og:description",
        content:
          "Full REST API, Python SDK, Node.js packages, and live AI operations sandbox.",
      },
    ],
  }),
  component: DeveloperPage,
});

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

type LangKey =
  | "Python"
  | "JavaScript"
  | "TypeScript"
  | "Node.js"
  | "React"
  | "cURL"
  | "Go"
  | "PHP"
  | "Java"
  | "Next.js";

const LANGS: LangKey[] = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "React",
  "cURL",
  "Go",
  "PHP",
  "Java",
  "Next.js",
];

const FILE_NAMES: Record<LangKey, string> = {
  Python: "lead_scoring.py",
  JavaScript: "whatsapp-bot.js",
  TypeScript: "workflow.ts",
  "Node.js": "crm-sync.mjs",
  React: "useAnalytics.tsx",
  cURL: "request.sh",
  Go: "automation.go",
  PHP: "lead-capture.php",
  Java: "EnterpriseSync.java",
  "Next.js": "route.ts",
};

const ENDPOINTS: Record<LangKey, string> = {
  Python: "POST /v1/lead-scoring",
  JavaScript: "POST /v1/whatsapp/send",
  TypeScript: "POST /v1/workflows/run",
  "Node.js": "POST /v1/crm/sync",
  React: "GET  /v1/analytics/live",
  cURL: "POST /v1/campaigns/optimize",
  Go: "POST /v1/automation/batch",
  PHP: "POST /v1/leads/capture",
  Java: "POST /v1/enterprise/sync",
  "Next.js": "POST /api/ai/predict",
};

const TAGLINES: Record<LangKey, string> = {
  Python: "Add AI Lead Scoring in minutes",
  JavaScript: "Send WhatsApp automations at scale",
  TypeScript: "Orchestrate type-safe AI workflows",
  "Node.js": "Sync CRMs in real time",
  React: "Live analytics, drop-in hook",
  cURL: "One-line API access from anywhere",
  Go: "10k automations / sec in production",
  PHP: "Capture leads from any PHP backend",
  Java: "Enterprise-grade automation pipeline",
  "Next.js": "Edge AI predictions, zero latency",
};

const CODE_SNIPPETS: Record<LangKey, string> = {
  Python: `from markethon import MarkethonAI

client = MarkethonAI(api_key="sk_live_...")

lead = client.lead_scoring.analyze(
    name="Rahul Sharma",
    source="whatsapp",
    behavior="clicked_offer",
    budget="high_intent",
)

print(lead.score, lead.recommended_action)`,

  JavaScript: `import { MarkethonAI } from "markethon";

const mk = new MarkethonAI({ apiKey: process.env.MK_KEY });

await mk.whatsapp.send({
  to: "+91 98765 43210",
  template: "offer_followup",
  variables: { name: "Priya", offer: "20% off" },
  trackOpens: true,
});`,

  TypeScript: `import { defineWorkflow, ai } from "markethon";

export const onboarding = defineWorkflow({
  trigger: "lead.created",
  steps: [
    ai.score({ model: "mk-intent-v3" }),
    ai.route({ when: "score > 80", to: "sales" }),
    ai.message({ channel: "whatsapp", template: "welcome" }),
  ],
});`,

  "Node.js": `import { MarkethonAI } from "markethon";

const mk = new MarkethonAI({ apiKey: process.env.MK_KEY });

const result = await mk.crm.sync({
  provider: "hubspot",
  records: leads,
  upsertOn: "email",
  enrich: true,
});

console.log(\`synced \${result.count} contacts\`);`,

  React: `import { useMarkethonAnalytics } from "@markethon/react";

export function Dashboard() {
  const { data, live } = useMarkethonAnalytics({
    metric: "conversion_rate",
    window: "24h",
    realtime: true,
  });

  return <LiveChart points={data} pulse={live} />;
}`,

  cURL: `curl -X POST https://api.markethon.ai/v1/campaigns/optimize \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "campaign_id": "cmp_8821",
    "objective": "maximize_roas",
    "channels": ["whatsapp","email","voice"]
  }'`,

  Go: `package main

import "github.com/markethon/markethon-go"

func main() {
    mk := markethon.New("sk_live_...")
    res, _ := mk.Automation.Batch(markethon.BatchInput{
        Workflow: "wf_nurture_v4",
        Leads:    leads,
        Parallel: 256,
    })
    fmt.Println(res.Processed, "leads ok")
}`,

  PHP: `<?php
require 'vendor/autoload.php';
use Markethon\\Client;

$mk = new Client(getenv('MK_KEY'));

$lead = $mk->leads->capture([
  'name'    => 'Aisha Khan',
  'phone'   => '+91 90000 12345',
  'source'  => 'landing_page',
  'consent' => true,
]);

echo "lead {$lead->id} scored {$lead->score}";`,

  Java: `import ai.markethon.MarkethonClient;
import ai.markethon.enterprise.SyncRequest;

MarkethonClient mk = MarkethonClient.builder()
    .apiKey(System.getenv("MK_KEY"))
    .region("ap-south-1")
    .build();

SyncResult r = mk.enterprise().sync(
    SyncRequest.of("salesforce", batch, "idempotent")
);`,

  "Next.js": `import { NextResponse } from "next/server";
import { MarkethonAI } from "markethon";

const mk = new MarkethonAI({ apiKey: process.env.MK_KEY! });

export async function POST(req: Request) {
  const { leadId } = await req.json();
  const p = await mk.ai.predict({ leadId, model: "intent-v3" });
  return NextResponse.json(p, { status: 200 });
}`,
};

const RESPONSE_LOGS: Record<LangKey, string[]> = {
  Python: [
    "→ POST /v1/lead-scoring",
    "✓ Initializing workflow engine…",
    "✓ Connecting AI orchestration layer",
    "✓ Lead enriched (whatsapp · clicked_offer)",
    "✓ Intent model mk-intent-v3 → 0.97",
    "✓ Intent classified: HIGH",
    "✓ Score: 92 · routed to sales",
    "✓ CRM sync completed",
    "✓ WhatsApp automation triggered",
    "✓ 200 OK · predicted_ltv $4,820",
    "✓ Workflow execution completed successfully",
  ],
  JavaScript: [
    "→ POST /v1/whatsapp/send",
    "✓ Auth handshake · TLS 1.3",
    "✓ Template offer_followup resolved",
    "✓ Variables substituted (2)",
    "✓ Rate-limit ok · 0.4% of quota",
    "✓ Delivered to +91 98765 43210",
    "✓ Read receipt subscribed",
    "✓ 200 OK · message_id wamid.4f29",
  ],
  TypeScript: [
    "→ POST /v1/workflows/run",
    "✓ Trigger lead.created accepted",
    "✓ ai.score → 87 · branch matched",
    "✓ ai.route → assignee sales-12",
    "✓ ai.message queued",
    "✓ Pipeline advanced: New → Qualified",
    "✓ Audit log written",
    "✓ 200 OK · 142ms",
  ],
  "Node.js": [
    "→ POST /v1/crm/sync",
    "✓ Provider hubspot authenticated",
    "✓ 1,284 records normalized",
    "✓ Upsert on email · 0 conflicts",
    "✓ Webhook fan-out (3 endpoints)",
    "✓ 200 OK · synced 1,284 contacts",
  ],
  React: [
    "→ GET /v1/analytics/live",
    "✓ Subscribed to conversion_rate",
    "✓ Stream open · 24h window",
    "● tick 14.2% (+0.3)",
    "● tick 14.5% (+0.3)",
    "● tick 14.9% (+0.4)",
    "✓ Snapshot persisted",
  ],
  cURL: [
    "→ POST /v1/campaigns/optimize",
    "✓ Campaign cmp_8821 loaded",
    "✓ AI reallocating spend across 3 channels",
    "✓ Predicted ROAS 4.7x (+38%)",
    "✓ Budget plan applied",
    "✓ 200 OK · applied",
  ],
  Go: [
    "→ POST /v1/automation/batch",
    "✓ Workflow wf_nurture_v4 compiled",
    "✓ 10,000 leads · 256 workers",
    "✓ Processed in 1.42s",
    "✓ Retry queue drained",
    "✓ 200 OK · 9,987 ok · 13 retried",
  ],
  PHP: [
    "→ POST /v1/leads/capture",
    "✓ Consent verified",
    "✓ Duplicate check passed",
    "✓ Lead lead_7Q21 created · score 76",
    "✓ Webhook fired · crm.lead.created",
    "✓ 200 OK",
  ],
  Java: [
    "→ POST /v1/enterprise/sync",
    "✓ Region ap-south-1 · TLS 1.3",
    "✓ Idempotency key locked",
    "✓ Salesforce upsert 4,210 records",
    "✓ Audit logged · SOC2",
    "✓ 200 OK · 318ms",
  ],
  "Next.js": [
    "→ POST /api/ai/predict (edge)",
    "✓ Cold start 0ms (warm)",
    "✓ Model intent-v3 loaded",
    "✓ Prediction: convert 0.91",
    "✓ Cache-Control: s-maxage=60",
    "✓ 200 OK · 38ms edge",
  ],
};

const KEYWORDS: Record<LangKey, RegExp> = {
  Python: /^(from|import|def|return|print|class|async|await|if|else|for|in)$/,
  JavaScript: /^(import|from|const|let|var|new|await|async|function|return|export)$/,
  TypeScript: /^(import|from|const|let|export|type|interface|new|await|async|return|defineWorkflow)$/,
  "Node.js": /^(import|from|const|let|new|await|async|console|return|export)$/,
  React: /^(import|from|export|function|return|const|let)$/,
  cURL: /^(curl|-X|-H|-d|POST|GET)$/,
  Go: /^(package|import|func|return|var|main|fmt|Println)$/,
  PHP: /^(require|use|echo|new|function|return|public|private)$/,
  Java: /^(import|public|private|class|static|void|new|return|builder)$/,
  "Next.js": /^(import|from|export|async|function|const|return)$/,
};

function highlightFor(lang: LangKey, code: string): ReactNode {
  const kw = KEYWORDS[lang];
  const lines = code.split("\n");
  return lines.map((line, idx) => (
    <div key={idx} className="whitespace-pre">
      {line.split(/(\s+|[(){}[\]:,;=<>])/).map((tok, i) => {
        if (!tok) return null;
        if (/^("[^"]*"|'[^']*'|`[^`]*`)$/.test(tok))
          return <span key={i} className="text-emerald-300">{tok}</span>;
        if (/^(\/\/|#).*/.test(line) && i === 0)
          return <span key={i} className="text-gray-500">{line}</span>;
        if (kw.test(tok)) return <span key={i} className="text-mk-orange">{tok}</span>;
        if (/^[0-9]+(\.[0-9]+)?$/.test(tok)) return <span key={i} className="text-amber-300">{tok}</span>;
        if (/^[A-Z][A-Za-z0-9]+$/.test(tok)) return <span key={i} className="text-sky-300">{tok}</span>;
        return <span key={i} className="text-gray-100">{tok}</span>;
      })}
    </div>
  ));
}

class PlaygroundErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Playground] caught render error:", error, info);
  }
  reset = () => this.setState({ error: null });
  render() {
    if (this.state.error) {
      return (
        <div className="bg-[#0B1020] rounded-3xl border border-amber-500/30 p-6 font-mono text-[12px] text-amber-200/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-300">⚠ Temporary playground glitch — recovering…</span>
          </div>
          <pre className="text-amber-200/70 whitespace-pre-wrap text-[11px] leading-relaxed">
{`✓ Workflow engine still online
✓ Sandbox state preserved
✓ Hot-reloading SDK module…`}
          </pre>
          <button
            type="button"
            onClick={this.reset}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-mk-orange/20 hover:bg-mk-orange/30 text-mk-orange text-[11px] transition"
          >
            <RotateCcw size={12} /> Retry execution
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function DeveloperApiSection() {
  const [lang, setLang] = useState<LangKey>("Python");
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [latency, setLatency] = useState(142);
  const [reqCount, setReqCount] = useState(2847);
  const [autoSwitch, setAutoSwitch] = useState(true);
  const [runId, setRunId] = useState(0);
  const [succeeded, setSucceeded] = useState(false);
  const [copied, setCopied] = useState(false);
  const userTouched = useRef(false);
  const runIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // typing animation
  useEffect(() => {
    setTyped("");
    setDone(false);
    setLogLines([]);
    setRunning(false);
    setSucceeded(false);
    const full = CODE_SNIPPETS[lang] ?? "";
    let i = 0;
    const id = setInterval(() => {
      i += 2 + Math.floor(Math.random() * 3);
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(id);
        setTyped(full);
        setDone(true);
      }
    }, 22);
    return () => clearInterval(id);
  }, [lang, runId]);

  // streaming response logs
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      setRunning(true);
      setLatency(80 + Math.floor(Math.random() * 140));
      const logs = RESPONSE_LOGS[lang] ?? [];
      let i = 0;
      const id = setInterval(() => {
        const next = logs[i];
        if (next == null) {
          clearInterval(id);
          runIntervalRef.current = null;
          setRunning(false);
          setSucceeded(true);
          setReqCount((c) => c + 1);
          return;
        }
        setLogLines((prev) => [...prev, next]);
        i++;
      }, 280);
      runIntervalRef.current = id;
      return () => {
        clearInterval(id);
        runIntervalRef.current = null;
      };
    }, 350);
    return () => clearTimeout(t);
  }, [done, lang, runId]);

  // auto cycle languages
  useEffect(() => {
    if (!autoSwitch || running) return;
    const t = setTimeout(() => {
      const idx = LANGS.indexOf(lang);
      setLang(LANGS[(idx + 1) % LANGS.length]);
    }, 9000);
    return () => clearTimeout(t);
  }, [lang, running, autoSwitch, logLines.length]);

  // live request counter
  useEffect(() => {
    const id = setInterval(() => setReqCount((c) => c + Math.floor(Math.random() * 4)), 1500);
    return () => clearInterval(id);
  }, []);

  const handleRun = () => {
    userTouched.current = true;
    setAutoSwitch(false);
    if (runIntervalRef.current) {
      clearInterval(runIntervalRef.current);
      runIntervalRef.current = null;
    }
    setRunId((n) => n + 1);
  };

  const handleStop = () => {
    if (runIntervalRef.current) {
      clearInterval(runIntervalRef.current);
      runIntervalRef.current = null;
    }
    setRunning(false);
    setLogLines((prev) => [...prev, "⚠ Execution paused by user"]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[lang] ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = Math.max(typed.split("\n").length, 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
      {/* Code Editor Column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE_EXPO }}
        className="w-full min-w-0"
      >
        <div
          className="relative developer-sandbox-card bg-[#0B1020] rounded-2xl overflow-hidden border border-white/10 shadow-xl flex flex-col justify-between h-full"
          onMouseEnter={() => setAutoSwitch(false)}
          onMouseLeave={() => {
            if (!userTouched.current) setAutoSwitch(true);
          }}
        >
          {/* scanning line */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-px pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(168,85,247,0.7), rgba(34,211,238,0.7), transparent)",
            }}
            animate={{ y: [0, 480, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          <div>
            {/* window chrome */}
            <div className="relative flex items-center justify-between px-3.5 py-2 border-b border-white/5 bg-black/30">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <div className="ml-2.5 flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    markethon-sdk
                  </span>
                  <span>›</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={lang}
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 3 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-300"
                    >
                      {FILE_NAMES[lang]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-mono text-gray-300 transition cursor-pointer"
                  title="Copy code"
                >
                  {copied ? <Check size={9} className="text-emerald-400" /> : <Copy size={9} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                {running ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-mono text-rose-300 transition cursor-pointer"
                  >
                    <Square size={8} fill="currentColor" /> Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleRun}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-mk-orange/15 hover:bg-mk-orange/25 border border-mk-orange/30 text-[9px] font-mono text-mk-orange transition cursor-pointer"
                  >
                    <Play size={8} fill="currentColor" /> Run
                  </button>
                )}

                <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 pl-0.5">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                  <span>LIVE</span>
                </div>
              </div>
            </div>

            {/* lang tabs — horizontally scrollable */}
            <div className="relative border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-0 px-2.5 pt-1.5 overflow-x-auto mk-no-scrollbar">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      userTouched.current = true;
                      setAutoSwitch(false);
                      setLang(l);
                    }}
                    className={`relative shrink-0 px-2.5 py-1.5 text-[10px] font-mono transition cursor-pointer ${
                      lang === l ? "text-white font-semibold" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {l}
                    {lang === l && (
                      <motion.span
                        layoutId="dev-tab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute bottom-0 left-1 right-1 h-0.5 bg-mk-orange shadow-[0_0_8px_rgba(168,85,247,0.7)]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* code body with line numbers */}
            <div className="relative px-3.5 pt-3 pb-2">
              <div className="text-[10px] text-gray-500 font-mono mb-1.5 flex items-center gap-2 flex-wrap">
                <span>
                  <span className="text-mk-orange font-semibold">{ENDPOINTS[lang].split(" ")[0]}</span>{" "}
                  {ENDPOINTS[lang].split(" ").slice(1).join(" ")}
                </span>
                <span className="text-gray-600">·</span>
                <span className="truncate">{TAGLINES[lang]}</span>
              </div>
              <div className="relative flex text-[12px] font-mono leading-[1.45] min-h-[165px] max-h-[175px] overflow-auto mk-no-scrollbar">
                <div className="select-none text-right pr-2.5 text-gray-600 border-r border-white/5 mr-2.5 text-[11px]">
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <pre className="flex-1 overflow-x-auto mk-no-scrollbar">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={lang}
                      initial={{ opacity: 0, filter: "blur(3px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(3px)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {highlightFor(lang, typed)}
                    </motion.div>
                  </AnimatePresence>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    className="inline-block w-1 h-3.5 bg-mk-orange align-middle"
                  />
                </pre>
              </div>
            </div>
          </div>

          <div>
            {/* response terminal */}
            <div className="relative developer-sandbox-terminal border-t border-white/5 bg-black/40">
              <div className="flex items-center justify-between px-3.5 py-1.5 text-[9px] font-mono text-gray-400">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <motion.span
                      animate={running ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                      transition={{ duration: 0.6, repeat: running ? Infinity : 0 }}
                      className={`w-1.5 h-1.5 rounded-full ${
                        running
                          ? "bg-mk-orange"
                          : succeeded
                          ? "bg-emerald-400"
                          : "bg-gray-500"
                      }`}
                    />
                    <span
                      className={
                        running
                          ? "text-mk-orange"
                          : succeeded
                          ? "text-emerald-400"
                          : "text-gray-400"
                      }
                    >
                      {running
                        ? "executing…"
                        : succeeded
                        ? "200 OK"
                        : logLines.length
                        ? "ready"
                        : "idle"}
                    </span>
                  </span>
                  <span>· {latency}ms</span>
                  <span>· {reqCount.toLocaleString()} req</span>
                  {succeeded && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-1 py-0.2 rounded bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-[8px]"
                    >
                      AI ACTIVE
                    </motion.span>
                  )}
                </div>
                <span className="text-gray-500 flex items-center gap-1 text-[9px]">
                  <Terminal size={9} /> stdout
                </span>
              </div>
              <div className="px-3.5 pb-2.5 text-[11px] font-mono leading-relaxed min-h-[95px] max-h-[105px] overflow-y-auto mk-no-scrollbar">
                {logLines.map((ln, i) => {
                  const isWarn = ln.startsWith("⚠");
                  const isOk = ln.startsWith("✓");
                  const isReq = ln.startsWith("→");
                  const isTick = ln.startsWith("●");
                  return (
                    <motion.div
                      key={`${lang}-${runId}-${i}`}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2 ${
                        isWarn
                          ? "text-amber-300/90"
                          : isOk
                          ? "text-emerald-300/90"
                          : isReq
                          ? "text-sky-300/90"
                          : isTick
                          ? "text-amber-300/90"
                          : "text-gray-400"
                      }`}
                    >
                      <span className="text-gray-600 shrink-0 tabular-nums text-[10px]">
                        {String(Math.floor(i * 0.28)).padStart(2, "0")}:
                        {String(Math.floor(((i * 280) % 1000) / 10)).padStart(2, "0")}
                      </span>
                      <span className="break-all">{ln}</span>
                    </motion.div>
                  );
                })}
                {running && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1.5 text-gray-500 mt-0.5 text-[10px]"
                  >
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-2 h-2 border border-mk-orange/60 border-t-transparent rounded-full"
                    />
                    <span>streaming…</span>
                  </motion.div>
                )}
                {!logLines.length && !running && (
                  <span className="text-gray-600 text-[10px]">// press Run to execute workflow…</span>
                )}
              </div>
            </div>

            {/* status bar */}
            <div className="relative developer-sandbox-status flex items-center justify-between px-3.5 py-1.5 bg-[#070b18] border-t border-white/5 text-[9px] font-mono text-gray-500">
              <div className="flex items-center gap-2.5">
                <span className="text-mk-orange">●</span>
                <span>main</span>
                <span>· {lang.toLowerCase()}</span>
                <span>· UTF-8</span>
                <span>· Ln {lineCount}</span>
              </div>
              <button
                type="button"
                onClick={handleRun}
                className="text-mk-orange hover:underline cursor-pointer bg-transparent border-0 p-0 font-mono text-[9px]"
              >
                {succeeded ? "✓ Run again →" : "Get API key →"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Operations Room / System Graphic Column */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE_EXPO }}
        className="w-full min-w-0 flex flex-col justify-stretch"
      >
        <AIOperationsRoom />
      </motion.div>
    </div>
  );
}

function DeveloperPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="bg-mk-bg text-mk-heading min-h-screen flex flex-col selection:bg-mk-orange/20 selection:text-mk-navy">
        <Navbar />

        {/* Compact Hero Header with Subtle Ambient Aura */}
        <section className="relative pt-20 pb-2 md:pt-24 md:pb-3 overflow-hidden bg-mk-bg">
          {/* Atmospheric Backdrops */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(800px 400px at 50% 10%, rgba(168,85,247,0.12), transparent 65%), radial-gradient(600px 350px at 85% 45%, rgba(34,211,238,0.10), transparent 60%)",
            }}
          />

          {/* Grid Lines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(27,43,75,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(27,43,75,0.12) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 40%, black 40%, transparent 80%)",
            }}
          />

          <div className="max-w-6xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_EXPO }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mk-orange/10 border border-mk-orange/30 text-mk-orange text-[10px] font-bold uppercase tracking-wider mb-2 shadow-sm"
            >
              <Code2 size={12} className="text-mk-orange" />
              <span>MARKETHON DEVELOPER PLATFORM</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: EASE_EXPO }}
              className="font-display text-2xl sm:text-3xl md:text-[34px] leading-tight text-mk-heading max-w-3xl tracking-tight mb-1.5"
            >
              Build anything with MARKETHON APIs
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE_EXPO }}
              className="text-xs sm:text-sm text-mk-body max-w-xl leading-relaxed mb-3"
            >
              Integrate intelligent lead scoring, omnichannel automation, voice agents,
              and real-time analytics with simple, developer-first REST endpoints and SDKs.
            </motion.p>
          </div>
        </section>

        {/* Main Interactive Developer API Section */}
        <section id="developers" className="py-2 pb-14 md:pb-18 bg-mk-bg">
          <div className="max-w-6xl mx-auto px-6">
            <PlaygroundErrorBoundary>
              <DeveloperApiSection />
            </PlaygroundErrorBoundary>
          </div>
        </section>

        {/* Developer Feature Highlights */}
        <section className="developer-features-section relative z-20 py-16 md:py-20 bg-mk-bg border-t border-mk-border overflow-hidden">
          {/* Subtle Ambient Glow Behind Content */}
          <div
            aria-hidden="true"
            className="developer-features-glow pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(800px 400px at 50% 20%, rgba(168,85,247,0.06), transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
              <h2 className="developer-features-heading font-display text-[28px] md:text-[38px] lg:text-[42px] leading-tight text-mk-heading mb-3 font-bold">
                Engineered for speed, scale & resilience
              </h2>
              <p className="developer-features-desc text-mk-body text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                Production-ready developer infrastructure with sub-100ms response times and enterprise reliability.
              </p>
            </div>

            <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Globe className="w-5 h-5 text-mk-orange" />,
                  title: "18 Global Edge Regions",
                  desc: "Low-latency API execution delivered through worldwide edge POPs with 99.99% SLA.",
                },
                {
                  icon: <Shield className="w-5 h-5 text-mk-orange" />,
                  title: "Enterprise Grade Security",
                  desc: "End-to-end TLS 1.3 encryption, scoped API tokens, webhook signing, and RBAC.",
                },
                {
                  icon: <Cpu className="w-5 h-5 text-mk-orange" />,
                  title: "SDKs for Every Stack",
                  desc: "Native SDKs for Python, Node.js, Go, PHP, Java, and Next.js with automatic type generation.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-mk-border bg-card/70 backdrop-blur-sm flex flex-col gap-3 hover:shadow-lg hover:border-mk-orange/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-mk-orange/10 border border-mk-orange/30 flex items-center justify-center shadow-sm text-mk-orange">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-mk-heading text-lg">{item.title}</h3>
                  <p className="text-sm text-mk-body leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
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
              Ready to build with MARKETHON APIs?
            </h2>
            <p className="text-mk-body text-base max-w-lg mb-4">
              Get your API keys in 2 minutes and launch your first AI automation pipeline today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/#top"
                className="mk-btn-navy px-7 py-3.5 rounded-full text-sm font-semibold shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Get API Keys</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="/resources"
                className="mk-btn-outline px-7 py-3.5 rounded-full text-sm font-semibold transition flex items-center justify-center"
              >
                <span>Explore Resources</span>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </MotionConfig>
  );
}
