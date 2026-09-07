import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll } from "framer-motion";
import { Rocket } from "lucide-react";
import { useTheme } from "@/lib/theme";

type MilestoneStatus = "inactive" | "animating" | "completed";

// Deep royal purple with toned-down brightness (rich, sophisticated, not neon)
const DEEP_PURPLE = "#6B21A8"; // Tailwind Purple-800
const DARK_PURPLE = "#4C1D95"; // Tailwind Purple-900

/* -------------------------------------------------------------------------- */
/*                            Week 1: Checkmark Icon                          */
/* -------------------------------------------------------------------------- */
function Week1Icon({ status }: { status: MilestoneStatus }) {
  const isCompleted = status === "completed";
  const isAnimating = status === "animating";
  const isActive = isAnimating || isCompleted;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Confirmation Pulse Ring */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 pointer-events-none"
          style={{ borderColor: DEEP_PURPLE }}
          initial={{ scale: 1, opacity: 0.85 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease: "easeOut" }}
        />
      )}

      {/* SVG Checkmark */}
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8 relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle fill that appears after check is drawn */}
        <motion.circle
          cx="16"
          cy="16"
          r="14"
          fill={DEEP_PURPLE}
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isActive
              ? { scale: 1, opacity: 1 }
              : { scale: 0, opacity: 0 }
          }
          transition={{
            delay: isAnimating ? 0.4 : 0,
            duration: 0.25,
            ease: "easeOut",
          }}
        />

        {/* Inactive state: visible outline checkmark so it's always clear */}
        {!isActive && (
          <path
            d="M 9 16.5 L 14 21.5 L 23 11"
            stroke="#94A3B8"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Active state: checkmark drawn smoothly from left to right */}
        {isActive && (
          <motion.path
            d="M 9 16.5 L 14 21.5 L 23 11"
            stroke="#FFFFFF"
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: isAnimating ? 0.4 : 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        )}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Week 2: Lightning Icon                           */
/* -------------------------------------------------------------------------- */
function Week2Icon({ status }: { status: MilestoneStatus }) {
  const isCompleted = status === "completed";
  const isAnimating = status === "animating";
  const isActive = isAnimating || isCompleted;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Electric Flash Effect */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ backgroundColor: "rgba(107, 33, 168, 0.2)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.85, 0, 0.5, 0] }}
          transition={{ delay: 0.35, duration: 0.22, times: [0, 0.2, 0.4, 0.6, 1] }}
        />
      )}

      {/* Lightning Bolt with Single Pulse */}
      <motion.div
        animate={
          isAnimating
            ? { scale: [1, 1, 1.2, 1] }
            : { scale: 1 }
        }
        transition={{
          delay: 0.5,
          duration: 0.35,
          times: [0, 0.1, 0.5, 1],
          ease: "easeOut",
        }}
        className="relative flex items-center justify-center"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 relative z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="lightning-fill-clip-path">
              <motion.rect
                x="0"
                y="0"
                width="24"
                initial={{ y: 24, height: 0 }}
                animate={
                  isActive
                    ? { y: 0, height: 24 }
                    : { y: 24, height: 0 }
                }
                transition={{
                  duration: isAnimating ? 0.5 : 0.05,
                  ease: "easeInOut",
                }}
              />
            </clipPath>
          </defs>

          {/* Background Neutral Outline */}
          <path
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
            fill="none"
            stroke="#94A3B8"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Filled Deep Purple Bolt (revealed from bottom to top) */}
          <g clipPath="url(#lightning-fill-clip-path)">
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              fill={DEEP_PURPLE}
              stroke={DEEP_PURPLE}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Week 3: Green Graph Bars                           */
/* -------------------------------------------------------------------------- */
function Week3Icon({ status }: { status: MilestoneStatus }) {
  const isCompleted = status === "completed";
  const isAnimating = status === "animating";
  const isActive = isAnimating || isCompleted;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Green Pulse Ring after settling */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-500 pointer-events-none"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.45], opacity: [0.85, 0] }}
          transition={{ delay: 1.5, duration: 0.65, ease: "easeOut" }}
        />
      )}

      {/* Graph Bars SVG (stays vibrant green when active, clear preview when inactive) */}
      <svg
        viewBox="0 0 32 32"
        className="w-8 h-8 relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Baseline */}
        <line
          x1="4"
          y1="25"
          x2="28"
          y2="25"
          stroke={isActive ? "#10B981" : "#94A3B8"}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Bar 1 (Leftmost) */}
        <motion.rect
          x="6"
          width="4"
          rx="1.5"
          fill={isActive ? "#10B981" : "#94A3B8"}
          animate={
            isAnimating
              ? {
                  y: [17, 11, 19, 13, 18, 17],
                  height: [8, 14, 6, 12, 7, 8],
                }
              : { y: 17, height: 8 }
          }
          transition={{
            duration: isAnimating ? 1.5 : 0.05,
            times: [0, 0.22, 0.44, 0.66, 0.88, 1],
            ease: "easeInOut",
          }}
        />

        {/* Bar 2 (Middle-Left) */}
        <motion.rect
          x="12"
          width="4"
          rx="1.5"
          fill={isActive ? "#10B981" : "#94A3B8"}
          animate={
            isAnimating
              ? {
                  y: [13, 7, 16, 9, 14, 12],
                  height: [12, 18, 9, 16, 11, 13],
                }
              : { y: 13, height: 12 }
          }
          transition={{
            duration: isAnimating ? 1.5 : 0.05,
            delay: isAnimating ? 0.08 : 0,
            times: [0, 0.22, 0.44, 0.66, 0.88, 1],
            ease: "easeInOut",
          }}
        />

        {/* Bar 3 (Middle-Right) */}
        <motion.rect
          x="18"
          width="4"
          rx="1.5"
          fill={isActive ? "#10B981" : "#94A3B8"}
          animate={
            isAnimating
              ? {
                  y: [9, 5, 13, 6, 11, 8],
                  height: [16, 20, 12, 19, 14, 17],
                }
              : { y: 9, height: 16 }
          }
          transition={{
            duration: isAnimating ? 1.5 : 0.05,
            delay: isAnimating ? 0.16 : 0,
            times: [0, 0.22, 0.44, 0.66, 0.88, 1],
            ease: "easeInOut",
          }}
        />

        {/* Bar 4 (Rightmost — Peak Upward Growth) */}
        <motion.rect
          x="24"
          width="4"
          rx="1.5"
          fill={isActive ? "#10B981" : "#94A3B8"}
          animate={
            isAnimating
              ? {
                  y: [5, 12, 8, 5, 9, 4],
                  height: [20, 13, 17, 20, 16, 21],
                }
              : { y: 5, height: 20 }
          }
          transition={{
            duration: isAnimating ? 1.5 : 0.05,
            delay: isAnimating ? 0.24 : 0,
            times: [0, 0.22, 0.44, 0.66, 0.88, 1],
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Week 4: Rocket Icon                             */
/* -------------------------------------------------------------------------- */
function Week4Icon({ status }: { status: MilestoneStatus }) {
  const isCompleted = status === "completed";
  const isAnimating = status === "animating";
  const isActive = isAnimating || isCompleted;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-full">
      {/* Subtle Dotted Orbit Path */}
      <svg
        viewBox="0 0 72 72"
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <motion.circle
          cx="36"
          cy="36"
          r="22"
          fill="none"
          stroke={DEEP_PURPLE}
          strokeWidth="1.3"
          strokeDasharray="3 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 0.35 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </svg>

      {/* Orbiting Proper Rocket Icon (using authentic Lucide Rocket) */}
      <motion.div
        animate={
          isAnimating
            ? {
                x: [0, 8, 0, -8, 0, 0],
                y: [0, -8, 0, 8, 0, -6, 0],
                rotate: [0, 90, 180, 270, 360, 360],
              }
            : { x: 0, y: 0, rotate: 0 }
        }
        transition={{
          duration: isAnimating ? 1.4 : 0.1,
          times: [0, 0.22, 0.44, 0.66, 0.88, 1],
          ease: "easeInOut",
        }}
        className="relative z-10 flex items-center justify-center"
      >
        <Rocket
          size={26}
          strokeWidth={1.8}
          fill={isActive ? DEEP_PURPLE : "none"}
          color={isActive ? DEEP_PURPLE : "#94A3B8"}
          className="transition-colors duration-300"
        />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Main TimelineRoadmap Component                     */
/* -------------------------------------------------------------------------- */
export default function TimelineRoadmap() {
  const { isGalaxy } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Pinned Scroll Runway:
   * containerRef spans min-h-[165vh] so the section stays comfortably locked in the
   * viewport while the user scrolls through the 4 weeks.
   * This guarantees:
   * 1. Week 1 is clearly visible as it starts and animates.
   * 2. Week 2 & Week 3 animate sequentially in full view.
   * 3. Week 4 triggers and completes with its rocket orbit in clear view.
   * 4. All 4 milestones stay completed and visible before the page scrolls to the next section.
   */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Purple progress line width / length (0.0 to 1.0)
  const [lineProgress, setLineProgress] = useState(0);

  // Milestone animation state tracking
  const [milestoneStates, setMilestoneStates] = useState<MilestoneStatus[]>([
    "inactive",
    "inactive",
    "inactive",
    "inactive",
  ]);

  // Check for prefers-reduced-motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  /**
   * Activation thresholds along the pinned scroll runway:
   * - Week 1: triggers right at 0.05 once the section locks in view
   * - Week 2: triggers at 0.35 as line reaches Circle 2
   * - Week 3: triggers at 0.65 as line reaches Circle 3
   * - Week 4: triggers at 0.88 as line reaches Circle 4
   */
  const THRESHOLDS = [0.05, 0.35, 0.65, 0.88];

  const handleProgress = useCallback((latest: number) => {
    const progress = Math.max(0, Math.min(1, latest));

    // Map scroll progress to the line length (from Week 1 at 0.05 to Week 4 at 0.88)
    const railProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.83));
    setLineProgress(railProgress);

    setMilestoneStates((prev) => {
      const next = [...prev];
      let hasChanged = false;

      THRESHOLDS.forEach((threshold, index) => {
        const reached = progress >= threshold;

        if (reached) {
          if (next[index] === "inactive") {
            if (prefersReducedMotion.current) {
              next[index] = "completed";
            } else {
              next[index] = "animating";
              const duration = index === 2 ? 1600 : index === 3 ? 1500 : 700;
              setTimeout(() => {
                setMilestoneStates((curr) => {
                  if (curr[index] === "animating") {
                    const updated = [...curr];
                    updated[index] = "completed";
                    return updated;
                  }
                  return curr;
                });
              }, duration);
            }
            hasChanged = true;
          }
        } else {
          // Scrolled backward past this milestone -> reset to inactive outline
          if (next[index] !== "inactive") {
            next[index] = "inactive";
            hasChanged = true;
          }
        }
      });

      return hasChanged ? next : prev;
    });
  }, []);

  useEffect(() => {
    handleProgress(scrollYProgress.get());

    const unsub = scrollYProgress.on("change", (latest) => {
      handleProgress(latest);
    });

    return () => unsub();
  }, [scrollYProgress, handleProgress]);

  const weeksData = [
    {
      week: "Week 1 — Foundation",
      desc: "CRM setup, lead source integration, WhatsApp Business API, basic flows.",
      renderIcon: (status: MilestoneStatus) => <Week1Icon status={status} />,
      borderColor: (status: MilestoneStatus) =>
        status !== "inactive" ? DEEP_PURPLE : "var(--section-border)",
    },
    {
      week: "Week 2 — AI Activation",
      desc: "Lead scoring, AI decision engine, omnichannel setup, content AI.",
      renderIcon: (status: MilestoneStatus) => <Week2Icon status={status} />,
      borderColor: (status: MilestoneStatus) =>
        status !== "inactive" ? DEEP_PURPLE : "var(--section-border)",
    },
    {
      week: "Week 3 — Optimization",
      desc: "Analytics, retargeting, voice AI, prediction models.",
      renderIcon: (status: MilestoneStatus) => <Week3Icon status={status} />,
      borderColor: (status: MilestoneStatus) =>
        status !== "inactive" ? "#10B981" : "var(--section-border)",
    },
    {
      week: "Week 4 — Scale",
      desc: "Campaign optimization, team expansion, advanced reporting, ROI tracking.",
      renderIcon: (status: MilestoneStatus) => <Week4Icon status={status} />,
      borderColor: (status: MilestoneStatus) =>
        status !== "inactive" ? DEEP_PURPLE : "var(--section-border)",
    },
  ];

  return (
    <div
      id="roadmap"
      ref={containerRef}
      className="relative min-h-[165vh] transition-colors duration-300"
    >
      {/* Sticky Content Wrapper: Locks comfortably below floating navbar */}
      <div className="sticky top-24 md:top-28 w-full py-12 md:py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h2
            className="font-display text-[32px] md:text-[48px] text-center mb-16 leading-tight"
            style={{ color: "var(--section-heading)" }}
          >
            Go live in 4 weeks
          </h2>

          <div className="relative">
            {/* DESKTOP TIMELINE TRACK (connects center of Circle 1 to center of Circle 4: 12.5% to 87.5%) */}
            <div
              className="hidden md:block absolute left-[12.5%] right-[12.5%] top-9 h-1 rounded-full pointer-events-none"
              style={{ backgroundColor: "var(--section-border, #E2E8F0)" }}
            />

            {/* DESKTOP PURPLE PROGRESS LINE (connects from Circle 1 to Circle 4) */}
            <div
              className="hidden md:block absolute left-[12.5%] top-9 h-1 rounded-full origin-left pointer-events-none transition-all duration-75"
              style={{
                width: `${Math.min(75, Math.max(0, lineProgress * 75))}%`,
                background: `linear-gradient(90deg, ${DARK_PURPLE} 0%, ${DEEP_PURPLE} 100%)`,
                boxShadow: "0 1px 3px rgba(88, 28, 135, 0.25)",
              }}
            />

            {/* MOBILE TIMELINE TRACK (vertical: connects Circle 1 to Circle 4) */}
            <div
              className="md:hidden absolute left-[35px] top-9 bottom-9 w-1 rounded-full pointer-events-none"
              style={{ backgroundColor: "var(--section-border, #E2E8F0)" }}
            />
            <div
              className="md:hidden absolute left-[35px] top-9 w-1 rounded-full origin-top pointer-events-none transition-all duration-75"
              style={{
                height: `${Math.min(100, Math.max(0, lineProgress * 100))}%`,
                background: `linear-gradient(180deg, ${DARK_PURPLE} 0%, ${DEEP_PURPLE} 100%)`,
                boxShadow: "0 1px 3px rgba(88, 28, 135, 0.25)",
              }}
            />

            {/* 4 MILESTONE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
              {weeksData.map((item, idx) => {
                const status = milestoneStates[idx];
                const isActive = status !== "inactive";

                return (
                  <div
                    key={item.week}
                    className="flex md:flex-col gap-4 items-start md:items-center text-left md:text-center relative"
                  >
                    {/* Circular Milestone Icon */}
                    <div
                      className="relative z-10 w-[72px] h-[72px] flex-shrink-0 rounded-full flex items-center justify-center border-2 backdrop-blur-md transition-colors duration-300"
                      style={{
                        backgroundColor: isGalaxy ? "#0b0f19" : "#FFFFFF",
                        borderColor: item.borderColor(status),
                        boxShadow: isActive
                          ? isGalaxy
                            ? "0 4px 18px rgba(107, 33, 168, 0.25)"
                            : "0 4px 16px rgba(107, 33, 168, 0.12)"
                          : isGalaxy
                          ? "0 4px 20px rgba(0,0,0,0.5)"
                          : "0 4px 20px rgba(0,0,0,0.06)",
                      }}
                    >
                      {item.renderIcon(status)}
                    </div>

                    {/* Text Content */}
                    <div className="md:text-center text-left">
                      <h4
                        className="font-bold text-lg leading-snug transition-colors duration-300"
                        style={{
                          color: isActive
                            ? idx === 2
                              ? "#10B981"
                              : DEEP_PURPLE
                            : "var(--section-heading)",
                        }}
                      >
                        {item.week}
                      </h4>
                      <p
                        className="text-sm mt-2 leading-relaxed"
                        style={{ color: "var(--section-text)" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
