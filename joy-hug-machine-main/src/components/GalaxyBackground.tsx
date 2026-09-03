import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";

interface Star {
  id: number;
  x: number;
  y: number;
  size: 1 | 2 | 3 | 4;
  opacity: number;
  color: string;
  hasGlow: boolean;
  twinkleDuration: number;
  twinkleDelay: number;
  twinkle: boolean;
}

export default function GalaxyBackground() {
  const { isGalaxy, theme } = useTheme();
  const isBrownGold = theme === "brown-gold";

  const stars: Star[] = useMemo(() => {
    const starList: Star[] = [];
    const count = 260;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      const randSize = Math.random();
      const size: 1 | 2 | 3 | 4 =
        randSize < 0.68 ? 1 : randSize < 0.9 ? 2 : randSize < 0.97 ? 3 : 4;

      const opacities = [0.25, 0.45, 0.7, 1.0];
      const opacity = opacities[Math.floor(Math.random() * opacities.length)];

      const randColor = Math.random();
      let color = "#FFFFFF";

      if (isBrownGold) {
        if (randColor < 0.5) {
          color = "#FFD76A";
        } else if (randColor < 0.82) {
          color = "#FFF8E7";
        } else if (randColor < 0.95) {
          color = "#F2C94C";
        } else {
          color = "#D4AF37";
        }
      } else {
        if (randColor < 0.5) {
          color = "#FFFFFF";
        } else if (randColor < 0.82) {
          color = "rgba(255, 255, 255, 0.85)";
        } else if (randColor < 0.95) {
          color = "rgba(180, 215, 255, 0.95)";
        } else {
          color = "rgba(255, 245, 230, 0.95)";
        }
      }

      const hasGlow = size >= 3 && Math.random() < 0.45;
      const twinkle = Math.random() < 0.6;
      const twinkleDuration = 2.2 + Math.random() * 4.2;
      const twinkleDelay = Math.random() * 5;

      starList.push({
        id: i,
        x,
        y,
        size,
        opacity,
        color,
        hasGlow,
        twinkleDuration,
        twinkleDelay,
        twinkle,
      });
    }

    return starList;
  }, [isBrownGold]);

  return (
    <AnimatePresence>
      {isGalaxy && (
        <motion.div
          key={isBrownGold ? "brown-gold-bg" : "dark-galaxy-bg"}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none z-[0] overflow-hidden"
          style={{
            backgroundColor: isBrownGold ? "#2B160D" : "#010104",
            willChange: "opacity",
          }}
        >
          {/* Subtle Radial Glow */}
          <div
            className="absolute inset-0"
            style={{
              background: isBrownGold
                ? `
                  radial-gradient(circle at 50% 42%, rgba(212, 175, 55, 0.12) 0%, rgba(58, 33, 20, 0.3) 35%, transparent 65%),
                  radial-gradient(700px 500px at 80% 20%, rgba(242, 201, 76, 0.08), transparent 60%),
                  radial-gradient(600px 400px at 20% 80%, rgba(212, 175, 55, 0.06), transparent 60%)
                `
                : `
                  radial-gradient(circle at 50% 42%, rgba(147, 51, 234, 0.08) 0%, rgba(15, 18, 35, 0.05) 30%, transparent 60%),
                  radial-gradient(700px 500px at 80% 20%, rgba(82, 120, 255, 0.07), transparent 60%),
                  radial-gradient(600px 400px at 20% 80%, rgba(147, 51, 234, 0.05), transparent 60%)
                `,
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: isBrownGold
                ? "linear-gradient(rgba(212, 175, 55, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.4) 1px, transparent 1px)"
                : "linear-gradient(rgba(82, 120, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(82, 120, 255, 0.4) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          {/* Starfield */}
          <div className="absolute inset-0 w-full h-full">
            {stars.map((star) => (
              <span
                key={star.id}
                className={`absolute rounded-full ${star.twinkle ? "galaxy-twinkle" : ""}`}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  backgroundColor: star.color,
                  opacity: star.opacity,
                  boxShadow: star.hasGlow
                    ? isBrownGold
                      ? "0 0 4px rgba(255, 215, 106, 0.9), 0 0 10px rgba(212, 175, 55, 0.6)"
                      : "0 0 4px rgba(255, 255, 255, 0.8), 0 0 10px rgba(160, 190, 255, 0.5)"
                    : star.size >= 3
                    ? `0 0 3px ${star.color}`
                    : "none",
                  animationDuration: `${star.twinkleDuration}s`,
                  animationDelay: `${star.twinkleDelay}s`,
                }}
              />
            ))}
          </div>

          <style>{`
            @keyframes galaxyTwinkle {
              0%, 100% {
                opacity: 0.35;
                transform: scale(0.9);
              }
              50% {
                opacity: 1;
                transform: scale(1.15);
              }
            }
            .galaxy-twinkle {
              animation: galaxyTwinkle ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .galaxy-twinkle {
                animation: none !important;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
