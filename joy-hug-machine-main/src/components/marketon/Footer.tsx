import { motion } from "framer-motion";
import { Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Footer() {
  const cols = [
    {
      t: "Platform",
      links: [
        { label: "AI Lead Scoring", href: "/#platform" },
        { label: "Omnichannel", href: "/#platform" },
        { label: "Voice Agent", href: "/#platform" },
        { label: "Workflow Builder", href: "/#platform" },
        { label: "Analytics", href: "/#platform" },
      ],
    },
    {
      t: "Developers",
      links: [
        { label: "Developer APIs & SDKs", href: "/developer" },
        { label: "Interactive Playground", href: "/developer" },
        { label: "REST API Reference", href: "/developer" },
        { label: "Python & Node SDKs", href: "/developer" },
        { label: "Changelog", href: "/developer" },
      ],
    },
    {
      t: "Resources",
      links: [
        { label: "All Tools & Features", href: "/resources" },
        { label: "Blog", href: "/resources" },
        { label: "Case Studies", href: "/#company" },
        { label: "Help Center", href: "/resources" },
        { label: "Community", href: "/resources" },
      ],
    },
    {
      t: "Company",
      links: [
        { label: "About", href: "/#company" },
        { label: "Careers", href: "/#company" },
        { label: "Press", href: "/#company" },
        { label: "Partners", href: "/#company" },
        { label: "Contact", href: "/#company" },
      ],
    },
  ];

  return (
    <footer id="company" className="bg-white border-t border-mk-border">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-12">
          <div>
            <p className="text-2xl font-extrabold text-mk-navy">marketon</p>
            <p className="text-sm text-mk-body mt-1">AI Marketing Automation Platform</p>
          </div>
          <div className="flex gap-3">
            {[Twitter, Linkedin, Youtube, Instagram].map((Ic, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full bg-mk-bg text-mk-body hover:text-mk-navy hover:bg-mk-border flex items-center justify-center transition"
                aria-label="Social link"
              >
                <Ic size={16} />
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE_EXPO }}
            >
              <p className="font-bold text-mk-navy mb-3 text-sm">{c.t}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-mk-body hover:text-mk-orange transition cursor-pointer"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ originX: 0 }}
          className="h-px bg-mk-border mb-6"
        />
        <div className="flex flex-col md:flex-row justify-between gap-3 text-xs text-mk-body">
          <p>© 2026 MARKETON. All rights reserved.</p>
          <p>
            <a className="hover:text-mk-navy cursor-pointer">Privacy Policy</a> ·{" "}
            <a className="hover:text-mk-navy cursor-pointer">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
