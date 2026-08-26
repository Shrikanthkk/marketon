import React, { useId } from "react";
import { useTheme } from "@/lib/theme";

interface ThemeToggleProps {
  className?: string;
  checked?: boolean;
  onChange?: () => void;
  id?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  checked,
  onChange,
  id,
  showLabel = false,
}: ThemeToggleProps) {
  const { isGalaxy, toggleTheme } = useTheme();
  const generatedId = useId();
  const toggleId = id || `rocket-toggle-${generatedId.replace(/:/g, "")}`;

  const isChecked = checked !== undefined ? checked : isGalaxy;
  const handleToggle = onChange || toggleTheme;

  return (
    <div className={`rocket-toggle-wrapper inline-flex items-center gap-2 ${className}`}>
      <label htmlFor={toggleId} className="rocket-switch">
        <input
          id={toggleId}
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          aria-label="Toggle light and galaxy theme"
        />

        <span className="slider">
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
                fill="#fff"
                className="star"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
              </svg>
            ))}
          </div>
        </span>
      </label>

      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider text-mk-muted">
          {isChecked ? "Galaxy Mode" : "Light Mode"}
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

        .rocket-switch {
          font-size: 14px;
          position: relative;
          display: inline-block;
          width: 3.5em;
          height: 2em;
          flex-shrink: 0;
          margin: 0;
          cursor: pointer;
        }

        .rocket-switch input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }

        .rocket-switch .slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: rgb(199, 219, 215);
          transition:
            background-color 0.4s ease,
            border-color 0.4s ease,
            box-shadow 0.4s ease;
          border-radius: 30px;
          box-shadow: 0 0.3rem 0.7rem rgba(0, 0, 0, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.9);
          overflow: hidden;
        }

        .rocket-switch .slider .fug .nav {
          position: absolute;
          height: 1.35em;
          width: 1.4em;
          left: 0.28em;
          bottom: 0.3em;
          transition: transform 0.4s ease;
          z-index: 10;
          transform: rotate(45deg);
          fill: #ffffff;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
        }

        .rocket-switch input:checked + .slider {
          background-color: #182c45;
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow:
            inset 0 0 8px rgba(74, 126, 184, 0.22),
            0 0.3rem 0.7rem rgba(0, 0, 0, 0.25);
        }

        .rocket-switch input:focus-visible + .slider {
          outline: 2px solid rgba(100, 160, 255, 0.95);
          outline-offset: 2px;
        }

        .rocket-switch input:checked + .slider .fug .nav {
          transform: translateX(1.3em) rotate(45deg);
          animation: rocketFloat 4s linear infinite;
        }

        @keyframes rocketFloat {
          0% {
            transform: translateX(1.3em) rotate(45deg);
          }
          10% {
            transform: translateX(1.12em) rotate(45deg);
          }
          30% {
            transform: translateX(1.22em) rotate(45deg);
          }
          50% {
            transform: translateX(1.05em) rotate(45deg);
          }
          70% {
            transform: translateX(1.22em) rotate(45deg);
          }
          80% {
            transform: translateX(1.08em) rotate(45deg);
          }
          90% {
            transform: translateX(1.2em) rotate(45deg);
          }
          100% {
            transform: translateX(1.3em) rotate(45deg);
          }
        }

        .rocket-switch .star {
          opacity: 0;
          transition: opacity 0.2s linear;
          pointer-events: none;
        }

        .rocket-switch input:checked + .slider .star {
          opacity: 1;
          animation: twinkleStar 2s linear infinite;
        }

        .rocket-switch .star:nth-child(1) {
          position: absolute;
          top: 5px;
          left: 9px;
        }

        .rocket-switch .star:nth-child(2) {
          position: absolute;
          top: 11px;
          left: 15px;
          animation-delay: 0.3s !important;
        }

        .rocket-switch .star:nth-child(3) {
          position: absolute;
          top: 15px;
          left: 7px;
          animation-delay: 0.65s !important;
        }

        .rocket-switch .star:nth-child(4) {
          position: absolute;
          top: 19px;
          left: 18px;
          animation-delay: 0.9s !important;
        }

        @keyframes twinkleStar {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(0.75);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .rocket-switch input:checked + .slider .fug .nav,
          .rocket-switch input:checked + .slider .star {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
