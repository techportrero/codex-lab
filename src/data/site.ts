export const siteConfig = {
  name: "Ian Wheeler",
  role: "Technical Business Analyst",
  headline:
    "Bridging business goals, enterprise systems, and decision-ready data with a practical, technical lens.",
  shortBio:
    "I help organizations turn ambiguous needs into well-structured requirements, connected systems, and measurable outcomes. My work spans enterprise implementations, cross-platform integrations, data engineering, and analytics that move decisions forward.",
  description:
    "Portfolio site for a technical Business Analyst focused on implementations, integrations, data, and practical AI.",
  availability: "Open to senior business analysis, systems analysis, and transformation-focused roles.",
  location: "U.S. based",
  email: "hello@yourdomain.com",
  siteUrl: "https://portfolio.vercel.app",
  socialLinks: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle/" },
    { label: "GitHub", href: "https://github.com/your-handle" },
    { label: "X", href: "https://x.com/your-handle" },
    { label: "Medium", href: "https://medium.com/@your-handle" }
  ],
  buyMeACoffeeUrl: "https://www.buymeacoffee.com/your-handle"
} as const;

export const proofPoints = [
  {
    label: "Enterprise Delivery",
    value: "Implementations",
    detail: "Translate strategy into requirements, workflows, and launch-ready operating models."
  },
  {
    label: "Systems Thinking",
    value: "Integrations",
    detail: "Map processes across platforms and reduce friction between business-critical systems."
  },
  {
    label: "Data Maturity",
    value: "Analytics",
    detail: "Bring together fragmented data sources to surface insights teams can act on."
  },
  {
    label: "Applied Innovation",
    value: "AI + Automation",
    detail: "Use emerging tools pragmatically to improve analysis quality, speed, and execution."
  }
] as const;

export const capabilityPillars = [
  {
    title: "Business Analysis Foundations",
    body:
      "Requirements discovery, process analysis, stakeholder alignment, backlog shaping, and solution validation grounded in business outcomes."
  },
  {
    title: "Technical Depth Without the Noise",
    body:
      "Comfortable working with APIs, data models, integration patterns, and platform constraints so business decisions stay technically realistic."
  },
  {
    title: "Implementation and Change Delivery",
    body:
      "Experienced in enterprise rollouts where success depends on aligning process design, systems configuration, testing, and user adoption."
  },
  {
    title: "Decision-Ready Data",
    body:
      "Use ETL thinking, data transformation, and reporting design to turn disconnected systems into useful operational intelligence."
  }
] as const;

export const currentFocus = [
  "Embedding AI-assisted analysis into discovery, documentation, and delivery workflows without adding noise or risk.",
  "Designing cleaner handoffs between ERP, CRM, finance, and reporting systems so teams spend less time reconciling information.",
  "Building practical analytics that connect business operations with timely, trustworthy measures for action.",
  "Staying current with modern tooling and trends so new technology shows up as better execution, not just better headlines."
] as const;

export const selectedGitHubWork = [
  {
    title: "Portfolio Site Foundation",
    summary:
      "A lightweight Astro build focused on performance, clarity, and structured content for professional storytelling.",
    href: "https://github.com/your-handle/portfolio-site",
    meta: "Frontend architecture"
  },
  {
    title: "Integration Reference Patterns",
    summary:
      "Reference notes and implementation examples for system handoffs, field mapping, and business-process continuity.",
    href: "https://github.com/your-handle/integration-patterns",
    meta: "Systems analysis"
  },
  {
    title: "Analytics Workflow Demos",
    summary:
      "Small data-focused prototypes showing how raw operational data can be shaped into dashboards and decision support.",
    href: "https://github.com/your-handle/analytics-demos",
    meta: "Data engineering"
  }
] as const;

export const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects/" },
  { label: "Contact", href: "/contact/" }
] as const;
