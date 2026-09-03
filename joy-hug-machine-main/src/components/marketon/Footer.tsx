import { motion } from "framer-motion";

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
      t: "Solutions",
      links: [
        { label: "Real Estate", href: "/#case-studies" },
        { label: "Education", href: "/#case-studies" },
        { label: "Healthcare", href: "/#case-studies" },
        { label: "E-Commerce", href: "/#case-studies" },
        { label: "BFSI", href: "/#case-studies" },
      ],
    },
    {
      t: "Resources",
      links: [
        { label: "Resource Hub", href: "/resources" },
        { label: "Documentation", href: "/developer" },
        { label: "API Reference", href: "/developer" },
        { label: "SDKs & Integrations", href: "/developer" },
        { label: "Community", href: "/#platform" },
      ],
    },
    {
      t: "Company",
      links: [
        { label: "About", href: "/#company" },
        { label: "Blog", href: "/resources" },
        { label: "Careers", href: "/#company" },
        { label: "Press", href: "/#company" },
        { label: "Contact", href: "/#company" },
      ],
    },
  ];

  return (
    <footer id="company" className="site-footer border-t transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:justify-between gap-6 mb-12">
          <div>
            <p className="footer-brand text-2xl font-extrabold">marketon</p>
            <p className="text-sm mt-1">AI Marketing Automation Platform</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE_EXPO }}
            >
              <h4 className="font-bold mb-3 text-sm">{c.t}</h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm transition-colors cursor-pointer inline-block"
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
          className="h-px bg-current opacity-15 mb-6"
        />
        <div className="flex flex-col md:flex-row justify-between gap-3 text-xs">
          <p>© 2026 MARKETON. All rights reserved.</p>
          <p>
            <a className="cursor-pointer hover:underline">Privacy Policy</a> ·{" "}
            <a className="cursor-pointer hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
