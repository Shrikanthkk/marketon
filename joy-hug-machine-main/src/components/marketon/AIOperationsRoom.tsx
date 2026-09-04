import { useEffect, useMemo, useRef, useState, type ReactNode, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  Brain, PhoneCall, Zap, GitBranch, BarChart3, Users, TrendingUp, Sparkles,
  Volume2, VolumeX, ArrowLeft, Cpu, Activity, Compass,
} from "lucide-react";

/* ============================================================
   AI OPERATIONS ROOM
   - Interactive Joystick Neural Core navigation
   - 8 orbiting modules; drag joystick or click to navigate to route
   - Web Audio synthesized cinematic UI sounds + SpeechSynthesis voice
   ============================================================ */

type ModKey =
  | "leads" | "voice" | "omni" | "workflow"
  | "analytics" | "crm" | "revenue" | "decisions";

type Mod = {
  key: ModKey;
  label: string;
  short: string;
  icon: ReactNode;
  color: string;
  route: string;
};

const MODS: Mod[] = [
  { key: "leads",     label: "Lead Intelligence", short: "LEADS",     icon: <Users className="w-5 h-5" />,       color: "#9333EA", route: "/leads" },
  { key: "voice",     label: "Voice AI",          short: "VOICE",     icon: <PhoneCall className="w-5 h-5" />,   color: "#5278FF", route: "/voice" },
  { key: "omni",      label: "Omnichannel",       short: "OMNI",      icon: <Zap className="w-5 h-5" />,         color: "#10B981", route: "/omni" },
  { key: "workflow",  label: "Workflow Engine",   short: "FLOW",      icon: <GitBranch className="w-5 h-5" />,   color: "#8B5CF6", route: "/flow" },
  { key: "analytics", label: "Analytics",         short: "DATA",      icon: <BarChart3 className="w-5 h-5" />,   color: "#22D3EE", route: "/data" },
  { key: "crm",       label: "CRM Automation",    short: "CRM",       icon: <Brain className="w-5 h-5" />,       color: "#F472B6", route: "/crm" },
  { key: "revenue",   label: "Revenue Tracking",  short: "REV",       icon: <TrendingUp className="w-5 h-5" />,  color: "#FBBF24", route: "/rev" },
  { key: "decisions", label: "AI Decisions",      short: "AI",        icon: <Sparkles className="w-5 h-5" />,    color: "#A78BFA", route: "/ai" },
];

/* ---------------- Sound engine (Web Audio synthesized) ---------------- */
function useSoundEngine(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<{ stop: () => void } | null>(null);

  const ensureCtx = () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume().catch(() => {});
    return ctxRef.current;
  };

  const tone = (freq: number, dur = 0.18, type: OscillatorType = "sine", gain = 0.06) => {
    if (!enabled) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur + 0.02);
  };

  const hover = () => tone(880, 0.08, "triangle", 0.025);
  const click = () => { tone(520, 0.1, "sine", 0.05); setTimeout(() => tone(780, 0.14, "sine", 0.04), 40); };
  const open  = () => { tone(220, 0.22, "sawtooth", 0.04); setTimeout(() => tone(660, 0.26, "sine", 0.05), 60); setTimeout(() => tone(990, 0.3, "sine", 0.04), 140); };
  const close = () => { tone(660, 0.18, "sine", 0.04); setTimeout(() => tone(220, 0.22, "sine", 0.04), 60); };
  const pulse = () => tone(140, 0.5, "sine", 0.03);

  const startAmbient = () => {
    if (!enabled) return;
    const ctx = ensureCtx();
    if (!ctx || ambientRef.current) return;
    const o1 = ctx.createOscillator(); o1.type = "sine"; o1.frequency.value = 60;
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = 92;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 6;
    const g = ctx.createGain(); g.gain.value = 0;
    g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.5);
    lfo.connect(lfoGain).connect(o2.frequency);
    o1.connect(g); o2.connect(g); g.connect(ctx.destination);
    o1.start(); o2.start(); lfo.start();
    ambientRef.current = {
      stop: () => {
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        setTimeout(() => { try { o1.stop(); o2.stop(); lfo.stop(); } catch {} }, 700);
        ambientRef.current = null;
      },
    };
  };
  const stopAmbient = () => ambientRef.current?.stop();

  const speak = (text: string) => {
    if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1; u.pitch = 1; u.volume = 0.9;
      window.speechSynthesis.speak(u);
    } catch {}
  };
  const stopSpeak = () => { try { window.speechSynthesis?.cancel(); } catch {} };

  useEffect(() => {
    if (!enabled) { stopAmbient(); stopSpeak(); }
    return () => { stopAmbient(); stopSpeak(); };
  }, [enabled]);

  return { hover, click, open, close, pulse, startAmbient, stopAmbient, speak, stopSpeak };
}

/* ---------------- Main ---------------- */
export default function AIOperationsRoom() {
  const [active, setActive] = useState<ModKey | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const sound = useSoundEngine(soundOn);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax cursor
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const driftX = useTransform(sx, (v) => v * 12);
  const driftY = useTransform(sy, (v) => v * 12);
  const driftX2 = useTransform(sx, (v) => v * -6);
  const driftY2 = useTransform(sy, (v) => v * -6);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  useEffect(() => {
    if (soundOn) sound.startAmbient();
    else sound.stopAmbient();
  }, [soundOn]); // eslint-disable-line

  // Pulse heartbeat
  useEffect(() => {
    if (!soundOn) return;
    const id = setInterval(() => sound.pulse(), 2400);
    return () => clearInterval(id);
  }, [soundOn]); // eslint-disable-line

  const activeMod = MODS.find((m) => m.key === active) ?? null;

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      className="relative w-full overflow-hidden rounded-2xl border border-white/10"
      style={{
        background: "radial-gradient(900px 500px at 50% 30%, #0d1430 0%, #060814 60%, #03050f 100%)",
        height: "min(500px, 58vh)",
        minHeight: 450,
      }}
    >
      {/* Backdrop */}
      <Backdrop driftX={driftX} driftY={driftY} driftX2={driftX2} driftY2={driftY2} />

      {/* HUD chrome */}
      <Hud soundOn={soundOn} onToggleSound={() => { setSoundOn((s) => !s); sound.click(); }} />

      {/* Orbit stage */}
      <AnimatePresence mode="wait">
        {!active && (
          <motion.div
            key="orbit"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <OrbitStage
              onHover={() => sound.hover()}
              onSelect={(k) => { sound.open(); setActive(k); }}
              driftX={driftX} driftY={driftY}
              sound={sound}
            />
          </motion.div>
        )}

        {active && activeMod && (
          <motion.div
            key={`focus-${active}`}
            initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <FocusedModule
              mod={activeMod}
              onBack={() => { sound.close(); setActive(null); }}
              speak={sound.speak}
              stopSpeak={sound.stopSpeak}
              soundOn={soundOn}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Backdrop ---------------- */
function Backdrop({ driftX, driftY, driftX2, driftY2 }: any) {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-[0.14]"
        style={{
          x: driftX, y: driftY,
          backgroundImage:
            "linear-gradient(rgba(82,120,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(82,120,255,0.25) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* Floating particles */}
      <Particles />
      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.65) 100%)" }}
      />
    </>
  );
}

function Particles() {
  const dots = useMemo(
    () => Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: (i * 53) % 100,
      top: (i * 37) % 100,
      delay: (i % 9) * 0.4,
      dur: 8 + (i % 5),
      size: 1 + (i % 2),
    })),
    [],
  );
  return (
    <div className="absolute inset-0 pointer-events-none">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white/50"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -18, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ---------------- HUD ---------------- */
function Hud({ soundOn, onToggleSound }: { soundOn: boolean; onToggleSound: () => void }) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const u = () => setTime(new Date().toLocaleTimeString([], { hour12: false }));
    u(); const id = setInterval(u, 1000); return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 text-[9px] uppercase tracking-[0.2em] text-white/50 font-mono pointer-events-auto">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          MARKETHON · AIOS
        </span>
        <span className="hidden sm:inline text-white/30">|</span>
        <span className="hidden sm:inline">SECURE</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="hidden sm:inline">CORE ONLINE</span>
        <span className="text-white/60">{time}</span>
        <button
          onClick={onToggleSound}
          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/70 hover:bg-white/10 transition text-[9px] cursor-pointer"
        >
          {soundOn ? <Volume2 className="w-2.5 h-2.5" /> : <VolumeX className="w-2.5 h-2.5" />}
          {soundOn ? "SOUND ON" : "SOUND OFF"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Orbit Stage & Interactive Joystick ---------------- */
const ACTIVATION_DIST = 26;

function OrbitStage({
  onHover, driftX, driftY, sound,
}: {
  onHover: () => void;
  onSelect: (k: ModKey) => void;
  driftX: any; driftY: any;
  sound: ReturnType<typeof useSoundEngine>;
}) {
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const [joystickOffset, setJoystickOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [targetedModKey, setTargetedModKey] = useState<ModKey | null>(null);
  const isPointerDownRef = useRef(false);

  // Measure stage size for accurate SVG coordinate percentage
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({ width: 400, height: 400 });

  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setStageSize({ width: rect.width, height: rect.height });
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const targetedMod = useMemo(
    () => MODS.find((m) => m.key === targetedModKey) ?? null,
    [targetedModKey]
  );

  // Compute targeted module from offset
  const computeTargetFromOffset = useCallback((x: number, y: number): ModKey | null => {
    const dist = Math.hypot(x, y);
    if (dist < ACTIVATION_DIST) return null;

    const angle = Math.atan2(y, x);
    let bestDiff = Infinity;
    let bestKey: ModKey = MODS[0].key;

    MODS.forEach((m, idx) => {
      const modAngle = (idx / MODS.length) * Math.PI * 2 - Math.PI / 2;
      let diff = Math.abs(angle - modAngle);
      while (diff > Math.PI) diff = Math.abs(diff - 2 * Math.PI);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestKey = m.key;
      }
    });

    return bestDiff < Math.PI / 3.4 ? bestKey : null;
  }, []);

  // Full 360-degree orbit tracking across the entire stage
  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawDx = e.clientX - centerX;
    const rawDy = e.clientY - centerY;
    const dist = Math.hypot(rawDx, rawDy);

    // Max radius covers the entire large orbital circle (leaving clearance for module cards)
    const maxRadius = Math.min(rect.width * 0.30, 120);

    let clampedX = rawDx;
    let clampedY = rawDy;
    if (dist > maxRadius) {
      const angle = Math.atan2(rawDy, rawDx);
      clampedX = Math.cos(angle) * maxRadius;
      clampedY = Math.sin(angle) * maxRadius;
    }

    setJoystickOffset({ x: clampedX, y: clampedY });
    const target = computeTargetFromOffset(clampedX, clampedY);
    setTargetedModKey((prev) => {
      if (prev !== target && target) {
        sound.hover();
      }
      return target;
    });
  };

  const handleStagePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    onHover();
    handleStagePointerMove(e);
  };

  const handleStagePointerLeave = () => {
    isPointerDownRef.current = false;
    setJoystickOffset({ x: 0, y: 0 });
    setTargetedModKey(null);
  };

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    if (e.pointerType === "touch") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      handleStagePointerMove(e);
    }
  };

  const handleStagePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
    isPointerDownRef.current = false;
    if (targetedMod) {
      sound.open();
      navigate({ to: targetedMod.route as any });
    }
    setJoystickOffset({ x: 0, y: 0 });
    setTargetedModKey(null);
  };

  const handleStageClick = () => {
    if (targetedMod) {
      sound.open();
      navigate({ to: targetedMod.route as any });
    }
  };

  const handleNodeClick = (mod: Mod, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.click();
    navigate({ to: mod.route as any });
  };

  // Dynamic core center percentage for SVG connector lines
  const coreXPct = 50 + (stageSize.width ? (joystickOffset.x / stageSize.width) * 100 : 0);
  const coreYPct = 50 + (stageSize.height ? (joystickOffset.y / stageSize.height) * 100 : 0);

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center select-none pt-4 pb-2" style={{ x: driftX, y: driftY }}>
      <div
        ref={stageRef}
        onPointerEnter={handleStagePointerEnter}
        onPointerMove={handleStagePointerMove}
        onPointerLeave={handleStagePointerLeave}
        onPointerDown={handleStagePointerDown}
        onPointerUp={handleStagePointerUp}
        onClick={handleStageClick}
        className="relative cursor-pointer touch-none"
        style={{ width: "min(400px, 88%)", aspectRatio: "1 / 1" }}
      >
        {/* Subtle orbital guide rings */}
        {[0.56, 0.82, 1].map((s, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-white/[0.07] pointer-events-none"
            style={{ transform: `scale(${s})` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 70 + i * 30, ease: "linear", repeat: Infinity }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                borderTop: "1px dashed rgba(255,255,255,0.18)",
                borderRadius: "50%",
                maskImage: "conic-gradient(from 0deg, black, transparent 70%)",
                WebkitMaskImage: "conic-gradient(from 0deg, black, transparent 70%)",
              }}
            />
          </motion.div>
        ))}

        {/* Dynamic Connector lines core → nodes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {MODS.map((m, i) => {
            const angle = (i / MODS.length) * Math.PI * 2 - Math.PI / 2;
            const r = 44; // % of container
            const x = 50 + Math.cos(angle) * r;
            const y = 50 + Math.sin(angle) * r;
            const isTargeted = targetedModKey === m.key;

            return (
              <g key={m.key}>
                <line
                  x1={coreXPct}
                  y1={coreYPct}
                  x2={x}
                  y2={y}
                  stroke={isTargeted ? m.color : "rgba(255,255,255,0.12)"}
                  strokeOpacity={isTargeted ? "1" : "0.3"}
                  strokeWidth={isTargeted ? "0.45" : "0.15"}
                  strokeDasharray={isTargeted ? "1 0.5" : "0.6 0.8"}
                />
              </g>
            );
          })}
        </svg>

        {/* Central Interactive AI Core Joystick (Enlarged + Free Orbit Movement) */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <JoystickAiCore
            offset={joystickOffset}
            targetedMod={targetedMod}
          />
        </div>

        {/* Orbiting modules — fixed angular positions */}
        {MODS.map((m, i) => {
          const angle = (i / MODS.length) * Math.PI * 2 - Math.PI / 2;
          const r = 44; // % of container
          const x = 50 + Math.cos(angle) * r;
          const y = 50 + Math.sin(angle) * r;
          const isTargeted = targetedModKey === m.key;

          return (
            <OrbitNode
              key={m.key}
              mod={m}
              xPct={x}
              yPct={y}
              delay={i * 0.05}
              isTargeted={isTargeted}
              onHover={onHover}
              onClick={(e) => handleNodeClick(m, e)}
            />
          );
        })}

        {/* Core label placed cleanly at the bottom */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-center pointer-events-none whitespace-nowrap z-20">
          <div className="text-[9px] uppercase tracking-[0.25em] text-white/45 font-mono flex items-center justify-center gap-1">
            <Compass className="w-2.5 h-2.5 text-purple-400 animate-spin" style={{ animationDuration: "10s" }} />
            <span>HOVER TO NAVIGATE</span>
          </div>
          <div className="text-white/80 text-[11px] font-mono mt-0.5 tracking-wider font-semibold">
            NEURAL CORE — MARKETHON · ENGINE
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Interactive Joystick Neural Core ---------------- */
function JoystickAiCore({
  offset,
  targetedMod,
}: {
  offset: { x: number; y: number };
  targetedMod: Mod | null;
}) {
  // 3D tilt calculation
  const maxTiltRadius = 120;
  const tiltX = (-offset.y / maxTiltRadius) * 16;
  const tiltY = (offset.x / maxTiltRadius) * 16;

  return (
    <div className="relative flex items-center justify-center pointer-events-none">
      {/* Target Preview Tooltip / Pill Badge */}
      <AnimatePresence>
        {targetedMod && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ duration: 0.16 }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-3.5 py-1.5 rounded-full border bg-black/90 backdrop-blur-md shadow-xl flex items-center gap-2 pointer-events-none"
            style={{
              borderColor: targetedMod.color,
              boxShadow: `0 4px 20px rgba(0,0,0,0.5)`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: targetedMod.color }}
            />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">
              Click to open {targetedMod.short}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Purple Central Ball (~28% larger: 98px diameter) */}
      <motion.div
        className="relative flex items-center justify-center rounded-full select-none"
        style={{
          width: 98,
          height: 98,
          background: "linear-gradient(145deg, #7E22CE 0%, #6B21A8 50%, #4C1D95 100%)",
          boxShadow: "0 6px 22px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.25)",
          border: targetedMod ? `2px solid ${targetedMod.color}` : "1.5px solid rgba(255, 255, 255, 0.18)",
        }}
        animate={{
          x: offset.x,
          y: offset.y,
          rotateX: tiltX,
          rotateY: tiltY,
          scale: targetedMod ? 1.06 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
          mass: 0.8,
        }}
      >
        {/* Subtle rotating dashed inner ring */}
        <motion.div
          className="absolute inset-1.5 rounded-full border border-dashed border-white/15 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        />

        {/* Sharp, Centered Processor Symbol */}
        <Cpu className="w-9 h-9 text-white pointer-events-none" />
      </motion.div>
    </div>
  );
}

/* ---------------- Orbit Node Button ---------------- */
function OrbitNode({
  mod, xPct, yPct, delay, isTargeted, onHover, onClick,
}: {
  mod: Mod; xPct: number; yPct: number; delay: number;
  isTargeted?: boolean;
  onHover: () => void; onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      type="button"
      onMouseEnter={onHover}
      onClick={onClick}
      className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-30 cursor-pointer pointer-events-auto"
      style={{ left: `${xPct}%`, top: `${yPct}%` }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: isTargeted ? 1.14 : 1,
      }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`relative flex flex-col items-center gap-1 rounded-xl border backdrop-blur-md px-2 py-1.5 transition-all duration-200 ${
          isTargeted
            ? "border-white/60 bg-white/20 shadow-md"
            : "border-white/10 bg-white/5 group-hover:border-white/30 group-hover:bg-white/10"
        }`}
        style={{
          borderColor: isTargeted ? mod.color : undefined,
        }}
      >
        <span
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-transform duration-200"
          style={{
            background: mod.color,
            color: "white",
          }}
        >
          {mod.icon}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-white/90 font-mono">
          {mod.short}
        </span>
      </div>
    </motion.button>
  );
}

/* ---------------- Focused Module ---------------- */
function FocusedModule({
  mod, onBack, speak, stopSpeak, soundOn,
}: {
  mod: Mod; onBack: () => void; speak: (t: string) => void; stopSpeak: () => void; soundOn: boolean;
}) {
  useEffect(() => () => stopSpeak(), [stopSpeak]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="absolute top-14 left-5 z-30">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-white/80 hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to core
        </button>
      </div>

      <div className="absolute top-14 right-5 z-30 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/60 font-mono">
        <Activity className="w-3.5 h-3.5" style={{ color: mod.color }} />
        <span>{mod.label} · LIVE</span>
      </div>

      <div className="relative flex-1 flex items-center justify-center p-6 sm:p-10 pt-24">
        <div
          className="relative w-full max-w-5xl h-full rounded-3xl border border-white/10 overflow-hidden"
          style={{
            background: `radial-gradient(800px 500px at 50% 0%, ${mod.color}22, transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))`,
            boxShadow: `inset 0 0 60px ${mod.color}11`,
          }}
        >
          <ModuleDemo modKey={mod.key} color={mod.color} speak={speak} soundOn={soundOn} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Demos ---------------- */
function ModuleDemo({
  modKey, color, speak, soundOn,
}: { modKey: ModKey; color: string; speak: (t: string) => void; soundOn: boolean }) {
  switch (modKey) {
    case "leads":     return <LeadsDemo color={color} />;
    case "voice":     return <VoiceDemo color={color} speak={speak} soundOn={soundOn} />;
    case "omni":      return <OmniDemo color={color} />;
    case "workflow":  return <WorkflowDemo color={color} />;
    case "analytics": return <AnalyticsDemo color={color} />;
    case "crm":       return <CrmDemo color={color} />;
    case "revenue":   return <RevenueDemo color={color} />;
    case "decisions": return <DecisionsDemo color={color} />;
  }
}

/* ---- Leads ---- */
const LEAD_POOL = [
  { name: "Priya Sharma",  src: "Instagram Ads",  intent: 94 },
  { name: "Rahul Verma",   src: "Google Search",  intent: 81 },
  { name: "Aisha Khan",    src: "WhatsApp Click", intent: 88 },
  { name: "Karan Patel",   src: "Landing Page",   intent: 72 },
  { name: "Neha Gupta",    src: "Referral",       intent: 96 },
  { name: "Vikram Singh",  src: "YouTube Pre-roll", intent: 67 },
];
function LeadsDemo({ color }: { color: string }) {
  const [feed, setFeed] = useState(LEAD_POOL.slice(0, 4));
  useEffect(() => {
    let i = 4;
    const id = setInterval(() => {
      const next = LEAD_POOL[i % LEAD_POOL.length];
      setFeed((f) => [next, ...f].slice(0, 4));
      i++;
    }, 2200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 h-full">
      <div>
        <Title color={color}>Live Lead Stream</Title>
        <div className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {feed.map((l, i) => (
              <motion.div
                key={`${l.name}-${i}`}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
              >
                <div>
                  <div className="text-white text-sm font-medium">{l.name}</div>
                  <div className="text-white/50 text-[11px] font-mono uppercase tracking-wider">{l.src}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${l.intent}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full"
                      style={{ background: color }}
                    />
                  </div>
                  <span className="text-white/85 text-sm font-mono w-9 text-right">{l.intent}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Title color={color}>Neural Scoring</Title>
        <NeuralRing color={color} value={feed[0]?.intent ?? 88} />
        <div className="text-white/70 text-xs font-mono mt-3 uppercase tracking-[0.2em]">Conversion Probability</div>
      </div>
    </div>
  );
}

function NeuralRing({ color, value }: { color: string; value: number }) {
  const C = 2 * Math.PI * 70;
  return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
        <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
        <motion.circle
          cx="80" cy="80" r="70" stroke={color} strokeWidth="6" fill="none"
          strokeLinecap="round" strokeDasharray={C}
          animate={{ strokeDashoffset: C - (C * value) / 100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={value}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-white text-4xl font-mono"
        >
          {value}
        </motion.div>
        <div className="text-white/50 text-[10px] uppercase tracking-[0.3em] mt-1">intent score</div>
      </div>
    </div>
  );
}

/* ---- Voice ---- */
const VOICE_SCRIPT = [
  { who: "AI", text: "Hi Priya, this is Aria from MARKETHON. I'm calling about your interest in our automation plan." },
  { who: "Customer", text: "Yes, I filled out the form yesterday." },
  { who: "AI", text: "Great. May I share a 30-second overview tailored to your business?" },
  { who: "Customer", text: "Sure, go ahead." },
  { who: "AI", text: "You'll get AI lead scoring, omnichannel automation, and a voice agent like me — handling outreach 24/7." },
];
function VoiceDemo({ color, speak, soundOn }: { color: string; speak: (t: string) => void; soundOn: boolean }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % VOICE_SCRIPT.length), 3800);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const cur = VOICE_SCRIPT[idx];
    if (cur.who === "AI" && soundOn) speak(cur.text);
  }, [idx, soundOn, speak]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6 sm:p-8 h-full">
      <div className="md:col-span-3 flex flex-col">
        <Title color={color}>Live Voice Call</Title>
        <Waveform color={color} />
        <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-4 font-mono">
          <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">Live Transcript</div>
          <div className="space-y-2">
            {VOICE_SCRIPT.slice(0, idx + 1).map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm"
              >
                <span
                  className="inline-block w-20 text-[10px] uppercase tracking-wider"
                  style={{ color: l.who === "AI" ? color : "rgba(255,255,255,0.5)" }}
                >
                  {l.who}
                </span>
                <span className="text-white/85">{l.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="md:col-span-2 flex flex-col gap-3">
        <Title color={color}>Voice Analytics</Title>
        <Metric label="Sentiment" value="Positive" color={color} />
        <Metric label="Intent confidence" value="92%" color={color} />
        <Metric label="Call duration" value="01:42" color={color} />
        <Metric label="Next step" value="Demo booked" color={color} />
        <div className="text-[10px] text-white/45 font-mono mt-1">
          {soundOn ? "🔊 AI voice playing via system synthesizer" : "Enable sound (top-right) to hear the AI speak"}
        </div>
      </div>
    </div>
  );
}

function Waveform({ color }: { color: string }) {
  const bars = useMemo(() => Array.from({ length: 48 }, (_, i) => i), []);
  return (
    <div className="mt-4 flex items-end justify-center gap-1 h-24 rounded-xl bg-white/[0.03] border border-white/10 px-3">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full"
          style={{ background: `linear-gradient(180deg, ${color}, ${color}50)` }}
          animate={{ height: [6, 10 + ((i * 7) % 56), 6] }}
          transition={{ duration: 1 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut", delay: (i % 9) * 0.05 }}
        />
      ))}
    </div>
  );
}

/* ---- Omni ---- */
const OMNI_FEED = [
  { ch: "WhatsApp", color: "#25D366", msg: "Hey! Your demo is confirmed for tomorrow 4pm.", who: "AI" },
  { ch: "Instagram", color: "#E1306C", msg: "Thanks for the DM — sending pricing now ✨", who: "AI" },
  { ch: "Email", color: "#5278FF", msg: "Subject: Your custom proposal is ready", who: "AI" },
  { ch: "SMS", color: "#10B981", msg: "Reminder: your call starts in 15 min.", who: "AI" },
  { ch: "Telegram", color: "#22D3EE", msg: "Hi! Here's the onboarding link 👉", who: "AI" },
];
function OmniDemo({ color }: { color: string }) {
  const [n, setN] = useState(2);
  useEffect(() => { const id = setInterval(() => setN((x) => Math.min(OMNI_FEED.length, x + 1)), 1300); return () => clearInterval(id); }, []);
  useEffect(() => { if (n >= OMNI_FEED.length) setTimeout(() => setN(1), 1500); }, [n]);
  return (
    <div className="p-6 sm:p-8 h-full">
      <Title color={color}>Omnichannel Engine · Auto-replying</Title>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OMNI_FEED.slice(0, n).map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: m.color }}>
                {m.ch}
              </span>
              <span className="text-[10px] text-white/40 font-mono">Delivered · 0.4s</span>
            </div>
            <Typewriter text={m.msg} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Typewriter({ text }: { text: string }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut(""); let i = 0;
    const id = setInterval(() => {
      i++; setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, [text]);
  return <div className="text-white/85 text-sm">{out}<span className="ml-0.5 inline-block w-1 h-3 bg-white/60 align-middle animate-pulse" /></div>;
}

/* ---- Workflow ---- */
function WorkflowDemo({ color }: { color: string }) {
  return (
    <div className="relative p-6 sm:p-8 h-full">
      <Title color={color}>Workflow Engine · Live Orchestration</Title>
      <div className="absolute inset-0 mt-20 mb-4 mx-6 sm:mx-8">
        <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wfg" x1="0" x2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.1" />
              <stop offset="50%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {[
            "M30,160 C150,40 300,40 570,160",
            "M30,160 C150,160 300,160 570,160",
            "M30,160 C150,280 300,280 570,160",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke="rgba(255,255,255,0.12)" strokeWidth="1" fill="none" />
              <path
                d={d}
                stroke={color}
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="14 320"
                style={{ filter: `drop-shadow(0 0 6px ${color})` }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-334"
                  dur={`${3.4 + i * 0.4}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.6}s`}
                />
              </path>
            </g>
          ))}
          {[{ x: 30, y: 160, label: "Trigger" }, { x: 300, y: 40, label: "AI Decision" }, { x: 300, y: 160, label: "Enrich" }, { x: 300, y: 280, label: "Notify" }, { x: 570, y: 160, label: "Convert" }].map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="14" fill="#0b1024" stroke={color} />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fill="white" fontFamily="monospace">{i + 1}</text>
              <text x={n.x} y={n.y + 32} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="monospace">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ---- Analytics ---- */
function AnalyticsDemo({ color }: { color: string }) {
  const [pts, setPts] = useState<number[]>(() => Array.from({ length: 24 }, (_, i) => 30 + Math.sin(i / 2) * 18 + i));
  useEffect(() => {
    const id = setInterval(() => {
      setPts((p) => {
        const next = [...p.slice(1), Math.max(20, Math.min(100, p[p.length - 1] + (Math.random() - 0.4) * 8))];
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);
  const max = Math.max(...pts);
  const path = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * 100} ${100 - (v / max) * 90}`).join(" ");
  return (
    <div className="p-6 sm:p-8 h-full grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Title color={color}>Live Revenue Velocity</Title>
        <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4 h-[260px]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="ag" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path d={`${path} L 100 100 L 0 100 Z`} fill="url(#ag)" animate={{ d: `${path} L 100 100 L 0 100 Z` }} />
            <motion.path d={path} stroke={color} strokeWidth="0.6" fill="none" animate={{ d: path }} style={{ filter: `drop-shadow(0 0 2px ${color})` }} />
          </svg>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Title color={color}>Today</Title>
        <Metric label="Revenue" value="₹ 4,82,300" color={color} />
        <Metric label="Conversions" value="312" color={color} />
        <Metric label="Avg deal" value="₹ 1,547" color={color} />
        <Metric label="AI uplift" value="+38%" color={color} />
      </div>
    </div>
  );
}

/* ---- CRM ---- */
function CrmDemo({ color }: { color: string }) {
  const stages = [
    { name: "New",       count: 184 },
    { name: "Qualified", count: 96 },
    { name: "Engaged",   count: 58 },
    { name: "Negotiating", count: 22 },
    { name: "Won",       count: 11 },
  ];
  return (
    <div className="p-6 sm:p-8 h-full">
      <Title color={color}>CRM Automation · Pipeline</Title>
      <div className="mt-6 grid grid-cols-5 gap-3">
        {stages.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
            style={{ boxShadow: `inset 0 -3px 0 ${color}` }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/55">{s.name}</div>
            <div className="text-white text-2xl font-mono mt-1">{s.count}</div>
            <motion.div
              className="mt-2 h-1 rounded-full"
              style={{ background: color }}
              initial={{ width: 0 }} animate={{ width: `${(s.count / 200) * 100}%` }} transition={{ duration: 1 }}
            />
          </motion.div>
        ))}
      </div>
      <div className="mt-6 text-[11px] font-mono text-white/60">
        AI auto-moves deals · Last action: Priya Sharma → Engaged · 12s ago
      </div>
    </div>
  );
}

/* ---- Revenue ---- */
function RevenueDemo({ color }: { color: string }) {
  const [val, setVal] = useState(482300);
  useEffect(() => {
    const id = setInterval(() => setVal((v) => v + Math.floor(Math.random() * 1800)), 1200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="p-6 sm:p-8 h-full flex flex-col items-center justify-center">
      <Title color={color}>Live Revenue Tracking</Title>
      <div className="mt-6 text-white text-6xl sm:text-7xl font-mono tracking-tight" style={{ textShadow: `0 0 30px ${color}66` }}>
        ₹ {val.toLocaleString("en-IN")}
      </div>
      <div className="text-white/55 mt-2 text-xs font-mono uppercase tracking-[0.3em]">Today · streaming</div>
      <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-2xl">
        <Metric label="MRR" value="₹ 38.4L" color={color} />
        <Metric label="Growth" value="+24%" color={color} />
        <Metric label="LTV" value="₹ 1.92L" color={color} />
      </div>
    </div>
  );
}

/* ---- Decisions ---- */
const DECISIONS = [
  "Reallocating ₹12,000 budget from Meta → Google Search",
  "Pausing low-intent audience segment 'Cold-37'",
  "Triggering nurture flow for 42 dormant leads",
  "Routing call to senior closer for Priya Sharma",
  "Drafting personalized proposal for Acme Inc.",
];
function DecisionsDemo({ color }: { color: string }) {
  const [log, setLog] = useState<string[]>(DECISIONS.slice(0, 2));
  useEffect(() => {
    let i = 2;
    const id = setInterval(() => {
      setLog((l) => [DECISIONS[i % DECISIONS.length], ...l].slice(0, 5));
      i++;
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="p-6 sm:p-8 h-full grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center justify-center">
        <NeuralRing color={color} value={97} />
      </div>
      <div>
        <Title color={color}>AI Decision Stream</Title>
        <div className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {log.map((d, i) => (
              <motion.div
                key={`${d}-${i}`}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
              >
                <Sparkles className="w-3.5 h-3.5 mt-0.5" style={{ color }} />
                <span className="text-white/85 text-sm">{d}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---- shared bits ---- */
function Title({ color, children }: { color: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      <h3 className="text-white/90 text-sm font-mono uppercase tracking-[0.22em]">{children}</h3>
    </div>
  );
}
function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/55">{label}</div>
      <div className="text-white text-lg font-mono mt-0.5" style={{ textShadow: `0 0 14px ${color}55` }}>{value}</div>
    </div>
  );
}
