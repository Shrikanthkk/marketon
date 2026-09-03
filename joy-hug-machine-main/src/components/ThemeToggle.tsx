import { useId } from "react";
import { useTheme, type Theme } from "@/lib/theme";

interface ThemeToggleProps {
  className?: string;
  id?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  id,
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const generatedId = useId();
  const toggleId = id || `rocket-toggle-${generatedId.replace(/:/g, "")}`;

  const getThemeLabel = (t: Theme) => {
    switch (t) {
      case "light":
        return "Light theme";
      case "dark":
        return "Dark theme";
      case "brown-gold":
        return "Brown and Gold theme";
    }
  };

  const currentLabel = getThemeLabel(theme);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (theme === "light") setTheme("dark");
      else if (theme === "dark") setTheme("brown-gold");
      else setTheme("light");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (theme === "brown-gold") setTheme("dark");
      else if (theme === "dark") setTheme("light");
      else setTheme("brown-gold");
    }
  };

  return (
    <div className={`rocket-toggle-wrapper inline-flex items-center gap-2 ${className}`}>
      <div
        id={toggleId}
        role="button"
        tabIndex={0}
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        className={`rocket-switch rocket-switch-3pos theme-${theme}`}
        aria-label={`Current theme: ${currentLabel}. Click to cycle themes.`}
        aria-pressed={theme !== "light"}
        title={`${currentLabel} (Click to switch)`}
      >
        <span className={`slider slider-${theme}`}>
          <div className="fug">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              fill="currentColor"
              className="nav bi bi-rocket-takeoff-fill"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.578 3.578 0 0 0-.108-.563 2.22 2.22 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2.35 2.35 0 0 0-.16-.045 3.797 3.797 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.552 2.552 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526l.24-2.408Zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361.599.599.437 1.732-.36 2.531Z" />
              <path d="M5.205 10.787a7.632 7.632 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925Z" />
            </svg>
          </div>

          <div className="stars">
            {[1, 2, 3, 4].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                width={4}
                height={4}
                fill={theme === "brown-gold" ? "#e6ca65" : "#ffffff"}
                className="star"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>
            ))}
          </div>
        </span>
      </div>

      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider text-mk-muted">
          {currentLabel}
        </span>
      )}

      <style>{`
        .rocket-toggle-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          margin: 0;
          padding: 0;
        }

        .rocket-switch-3pos {
          font-size: 14px;
          position: relative;
          display: inline-block;
          width: 4.85em;
          height: 2em;
          flex-shrink: 0;
          margin: 0;
          cursor: pointer;
          outline: none;
        }

        .rocket-switch-3pos:focus-visible .slider {
          outline: 2px solid #e6ca65;
          outline-offset: 2px;
        }

        .rocket-switch-3pos .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          transition:
            background-color 0.4s ease,
            border-color 0.4s ease,
            box-shadow 0.4s ease;
          border-radius: 30px;
          overflow: hidden;
        }

        /* 1. Light Theme Slider */
        .rocket-switch-3pos .slider-light {
          background-color: rgb(199, 219, 215);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 0.3rem 0.7rem rgba(0, 0, 0, 0.12);
        }

        /* 2. Dark / Galaxy Theme Slider */
        .rocket-switch-3pos .slider-dark {
          background-color: #182c45;
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow:
            inset 0 0 8px rgba(74, 126, 184, 0.3),
            0 0.3rem 0.7rem rgba(0, 0, 0, 0.3);
        }

        /* 3. Brown & Gold Theme Slider */
        .rocket-switch-3pos .slider-brown-gold {
          background-color: #3a2114;
          border: 1px solid rgba(212, 175, 55, 0.65);
          box-shadow:
            inset 0 0 10px rgba(212, 175, 55, 0.25),
            0 0.3rem 0.7rem rgba(43, 22, 13, 0.45);
        }

        /* Rocket Nav Icon Base */
        .rocket-switch-3pos .slider .fug .nav {
          position: absolute;
          height: 1.35em;
          width: 1.4em;
          left: 0.28em;
          bottom: 0.3em;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), fill 0.3s ease, filter 0.3s ease;
          z-index: 10;
          fill: #ffffff;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
        }

        /* Position 1: Light */
        .rocket-switch-3pos.theme-light .slider .fug .nav {
          transform: translateX(0) rotate(45deg);
          fill: #ffffff;
        }

        /* Position 2: Dark (Center) */
        .rocket-switch-3pos.theme-dark .slider .fug .nav {
          transform: translateX(1.35em) rotate(45deg);
          fill: #ffffff;
          filter: drop-shadow(0 0 6px rgba(168, 85, 247, 0.7));
          animation: rocketFloatDark 4s linear infinite;
        }

        /* Position 3: Brown & Gold (Right) */
        .rocket-switch-3pos.theme-brown-gold .slider .fug .nav {
          transform: translateX(2.75em) rotate(45deg);
          fill: #e6ca65;
          filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.8));
          animation: rocketFloatGold 4s linear infinite;
        }

        @keyframes rocketFloatDark {
          0%, 100% { transform: translateX(1.35em) rotate(45deg); }
          50% { transform: translateX(1.22em) rotate(45deg); }
        }

        @keyframes rocketFloatGold {
          0%, 100% { transform: translateX(2.75em) rotate(45deg); }
          50% { transform: translateX(2.62em) rotate(45deg); }
        }

        /* Stars */
        .rocket-switch-3pos .star {
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .rocket-switch-3pos.theme-dark .slider .star {
          opacity: 1;
          animation: twinkleStar 2s linear infinite;
        }

        .rocket-switch-3pos.theme-brown-gold .slider .star {
          opacity: 1;
          animation: twinkleStar 2s linear infinite;
        }

        .rocket-switch-3pos .star:nth-child(1) {
          position: absolute;
          top: 5px;
          left: 9px;
        }

        .rocket-switch-3pos .star:nth-child(2) {
          position: absolute;
          top: 11px;
          left: 17px;
          animation-delay: 0.3s !important;
        }

        .rocket-switch-3pos .star:nth-child(3) {
          position: absolute;
          top: 15px;
          left: 7px;
          animation-delay: 0.65s !important;
        }

        .rocket-switch-3pos .star:nth-child(4) {
          position: absolute;
          top: 19px;
          left: 20px;
          animation-delay: 0.9s !important;
        }

        @keyframes twinkleStar {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(0.75);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rocket-switch-3pos .slider .fug .nav,
          .rocket-switch-3pos .slider .star {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
