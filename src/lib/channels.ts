import { EDUCATION, EMAIL, LINKS, REPOS } from "./site";

// optional links are hidden until they have an href; the rest show "coming soon"
export type ChannelLink = { label: string; href: string; external?: boolean; optional?: boolean };

export type ChannelContent = {
  eyebrow?: string;
  summary: string;
  bullets?: string[];
  links?: ChannelLink[];
  // tech used, shown as chips under the summary
  stack?: string[];
  // a screenshot or photo, e.g. { src: "/projects/ats.png", alt: "ATS dashboard" }
  image?: { src: string; alt: string };
  style?: "profile" | "forecast" | "shop" | "casefile" | "simple" | "tour";
  forecast?: { label: string; items: string[] }[];
  // show the Message Board form under the content
  messageBoard?: boolean;
};

export type ChannelAction =
  | { type: "panel" }
  | { type: "page"; target: number }
  | { type: "external"; href: string }
  | { type: "disc" }
  | { type: "none" };

export type ChannelSceneKind =
  | "shelley"
  | "tpa"
  | "greenspiegel"
  | "bothwell"
  | "lss"
  | "ats"
  | "coin"
  | "apera"
  | "cognexur"
  | "uryaskawa"
  | "ironcad"
  | "personalsite"
  | "github"
  | "linkedin";

export type Channel = {
  id: string;
  title: string;
  page: number;
  row: number;
  col: number;
  accent: string;
  iconKind: string;
  cover?: string;
  // animated banner; channels with one open into a splash screen before their content
  scene?: ChannelSceneKind;
  fixed?: boolean;
  action: ChannelAction;
  content?: ChannelContent;
};

// Outside links come from lib/site.ts; any left blank there show as "coming soon".

export const channels: Channel[] = [
  // ---------------- Page 1 ----------------
  {
    id: "disc",
    title: "Disc Channel",
    page: 1,
    row: 0,
    col: 0,
    accent: "#3b82c4",
    iconKind: "disc",
    fixed: true,
    action: { type: "disc" },
    // the Disc Channel "plays" the whole portfolio as a one-screen summary
    content: {
      style: "tour",
      eyebrow: "Quick Tour · the one-minute version",
      summary: "Short on time? Here's everything on this Wii in one place.",
    },
  },
  {
    id: "mii",
    title: "Mii Channel",
    page: 1,
    row: 0,
    col: 1,
    accent: "#e8b64c",
    iconKind: "mii",
    action: { type: "panel" },
    content: {
      style: "profile",
      eyebrow: "About Kelvin",
      summary:
        "Hey, I'm Kelvin. I graduated from Toronto Metropolitan University in April 2026 with a CS Honours degree (Dean's List), and across two-plus years of co-ops I bounced between software development, data integration, and IT operations trying to figure out which parts of building things I like best.",
      bullets: [
        "Turns out the answer is most of them — I like writing the script that fixes the annoying repetitive thing, just as much as designing the system around it.",
        "I care about software that actually gets used, not just software that's clever.",
        "Outside of work: probably tinkering with whatever half-finished project is on my Projects channel right now.",
      ],
    },
  },
  {
    id: "skills",
    title: "Skills Channel",
    page: 1,
    row: 0,
    col: 2,
    accent: "#5ba3d9",
    iconKind: "forecast",
    action: { type: "panel" },
    content: {
      style: "forecast",
      eyebrow: "Today's forecast: mostly backend, chance of automation",
      summary: "A quick outlook on the stack I work in, and where I'm headed next.",
      forecast: [
        { label: "Languages", items: ["Java", "Python", "SQL", "C", "JavaScript", "PowerShell", "Visual Basic"] },
        { label: "Web & Data", items: ["HTML", "CSS", "XML", "CSV", "JSON", "REST"] },
        { label: "Databases", items: ["MySQL", "PostgreSQL", "MS SQL", "Access", "Supabase"] },
        { label: "Tools & Platforms", items: ["Git", "Linux", "Windows", "Unix"] },
        { label: "In progress", items: ["AWS Certified Developer", "Azure AI Engineer", "CISSP"] },
      ],
    },
  },
  {
    id: "resume",
    title: "Resume Channel",
    page: 1,
    row: 0,
    col: 3,
    accent: "#e05a4e",
    iconKind: "shop",
    action: { type: "panel" },
    content: {
      style: "shop",
      eyebrow: "Wii Shop Channel",
      summary: "The paper-trail version of everything on this site. Free. No Wii Points required.",
      links: [{ label: "Download Resume (PDF)", href: LINKS.resume }],
    },
  },
  {
    id: "shelley",
    title: "Shelley Automation",
    page: 1,
    row: 1,
    col: 0,
    accent: "#4f9d69",
    iconKind: "shelley",
    scene: "shelley",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "Applications Specialist · Current role",
      summary:
        "I work in machine vision and industrial automation — the layer between 'this robot could theoretically do that' and 'this robot is doing that on the customer's line.'",
      bullets: [
        "I run feasibility studies to figure out if a vision or automation solution will actually hold up on a real production line before anyone buys anything.",
        "I build and run customer demos, which means I spend a lot of time making finicky hardware behave on command.",
        "I sit across pre-sales and post-sales support, so I'm usually the person translating between 'what the customer needs' and 'what the hardware can actually do.'",
      ],
      stack: ["Machine vision", "Cognex", "Universal Robots", "Yaskawa", "Python", "PLCs"],
    },
  },
  {
    id: "projects",
    title: "Projects Channel",
    page: 1,
    row: 1,
    col: 1,
    accent: "#f2a63d",
    iconKind: "sd",
    action: { type: "page", target: 3 },
  },
  {
    id: "contact",
    title: "Contact Channel",
    page: 1,
    row: 1,
    col: 2,
    accent: "#d9534f",
    iconKind: "mail",
    action: { type: "panel" },
    content: {
      style: "simple",
      eyebrow: "Wii Message Board",
      summary: "Leave a message — or just reach out directly, I read all of these.",
      messageBoard: true,
      links: [
        { label: EMAIL, href: `mailto:${EMAIL}` },
        { label: "LinkedIn", href: LINKS.linkedin, external: true },
        { label: "GitHub", href: LINKS.github, external: true },
      ],
    },
  },
  {
    id: "github",
    title: "GitHub Channel",
    page: 1,
    row: 2,
    col: 0,
    accent: "#333333",
    iconKind: "github",
    scene: "github",
    action: { type: "external", href: LINKS.github },
  },
  {
    id: "linkedin",
    title: "LinkedIn Channel",
    page: 1,
    row: 2,
    col: 1,
    accent: "#2b6cb0",
    iconKind: "linkedin",
    scene: "linkedin",
    action: { type: "external", href: LINKS.linkedin },
  },

  {
    id: "work",
    title: "Work History",
    page: 1,
    row: 1,
    col: 3,
    accent: "#5b7fa6",
    iconKind: "briefcase",
    action: { type: "page", target: 2 },
  },
  {
    id: "education",
    title: "Education Channel",
    page: 1,
    row: 2,
    col: 2,
    accent: "#7a5bc4",
    iconKind: "grad",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: [EDUCATION.school, EDUCATION.graduation].filter(Boolean).join(" · "),
      summary: `${EDUCATION.degree}, graduated April 2026 on the ${EDUCATION.honours}, with two-plus years of co-op terms in software, data and IT along the way.`,
      bullets: EDUCATION.coursework.length ? [`Relevant coursework: ${EDUCATION.coursework.join(", ")}.`] : undefined,
      forecast: [{ label: "Certifications in progress", items: ["AWS Certified Developer", "Azure AI Engineer", "CISSP"] }],
    },
  },

  // ---------------- Page 2 — Work History ----------------
  {
    id: "tpa",
    title: "Toronto Parking Authority",
    page: 2,
    row: 0,
    col: 1,
    accent: "#3a7d6b",
    iconKind: "parking",
    scene: "tpa",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "System Support Engineer Co-op · May–Dec 2025",
      summary:
        "GreenP Parking's field ops run on a lot of infrastructure most people never think about. I helped keep it running and made the boring parts faster.",
      bullets: [
        "Wrote PowerShell and Intune automation that cut manual machine setup time — no more setting up the same laptop by hand every time someone new joined.",
        "Built Power Apps chatbots and automated ticket routing so requests found the right person faster.",
        "Handled Level 1–3 support across the org, from 'my monitor won't turn on' to genuinely gnarly issues.",
        "Kept an eye on the fleet through CrowdStrike and Symantec monitoring, catching problems before they became incidents.",
      ],
      stack: ["PowerShell", "Microsoft Intune", "Power Apps", "CrowdStrike", "Symantec"],
    },
  },
  {
    id: "greenspiegel",
    title: "Green and Spiegel LLP",
    page: 2,
    row: 0,
    col: 2,
    accent: "#6b5b3e",
    iconKind: "legal",
    scene: "greenspiegel",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "Junior IT Developer Co-op · Sept 2023–Sept 2024",
      summary:
        "An immigration law firm generates an enormous amount of paperwork. I built the tools that made that paperwork move faster and more accurately.",
      bullets: [
        "Built a secure client intake portal with Java, REST APIs, and AWS.",
        "Automated PDF generation with SQL, Python, and Java — cut manual workload by 53%.",
        "Built CSV/XML data pipelines to move client data between systems without anyone touching a spreadsheet.",
        "Reviewed code with the team on Git, which is where I actually learned what a good pull request looks like.",
      ],
      stack: ["Java", "REST APIs", "AWS", "SQL", "Python", "XML / CSV", "Git"],
    },
  },
  {
    id: "bothwell",
    title: "Bothwell Accurate Co.",
    page: 2,
    row: 0,
    col: 3,
    accent: "#8a5a2b",
    iconKind: "manufacturing",
    scene: "bothwell",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "IT Developer Co-op · May–Sept 2023",
      summary:
        "My first real IT job — a manufacturing company with Windows and Linux machines that both needed to just work.",
      bullets: [
        "Resolved 200+ hardware and software tickets across Windows and Linux.",
        "Automated new-hire onboarding with PowerShell so setting up a new employee's machine stopped being an afternoon-long task.",
      ],
      stack: ["PowerShell", "Windows", "Linux"],
    },
  },

  // ---------------- Page 3 — Projects ----------------
  {
    id: "lifesaving",
    title: "LSS Test Sheet App",
    page: 3,
    row: 0,
    col: 1,
    accent: "#2e8bc0",
    iconKind: "lifesaving",
    scene: "lss",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "Lifesaving Society Test Sheet App",
      summary:
        "A Python/JS tool built for the City of Markham that automates official Lifesaving Society test-sheet generation. Over 200 instructors use it.",
      bullets: [
        "Built a CSV/JSON → standardized PDF pipeline that hits 100% data accuracy — no more hand-transcribing test results.",
        "Freed up roughly 20% more effective learning time by getting paperwork out of instructors' way.",
      ],
      stack: ["Python", "JavaScript", "CSV / JSON", "PDF generation"],
      links: [
        { label: "Live Demo", href: LINKS.lssDemo, external: true },
        { label: "Source Code", href: REPOS.lss, external: true, optional: true },
      ],
    },
  },
  {
    id: "ats",
    title: "ATS Benchmarker",
    page: 3,
    row: 0,
    col: 2,
    accent: "#6c4fd9",
    iconKind: "ats",
    scene: "ats",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "Full-stack web app",
      summary:
        "A resume-vs-job-description benchmarker that runs three engines in parallel: keyword matching, Cohere embeddings, and a Gemini-powered recruiter-style analysis.",
      bullets: [
        "Supabase auth with row-level security, so every user's history is actually private.",
        "Persistent history and animated dashboards so you can track how a resume improves over time.",
      ],
      stack: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Cohere", "Gemini"],
      links: [
        { label: "Live Demo", href: LINKS.atsDemo, external: true },
        { label: "Source Code", href: REPOS.ats, external: true, optional: true },
      ],
    },
  },
  {
    id: "cointrainer",
    title: "Coin Trainer",
    page: 3,
    row: 0,
    col: 3,
    accent: "#c9962f",
    iconKind: "coin",
    scene: "coin",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "Machine Vision · Cognex IS8912",
      summary:
        "A coin-inspection benchmark comparing classical machine vision against an AI-based classifier on a Cognex IS8912.",
      bullets: ["Built to answer a very practical question: when does the fancy AI model actually beat the classical approach on this kind of part?"],
      stack: ["Cognex In-Sight IS8912", "Classical vision", "AI classification"],
      links: [{ label: "Source Code", href: REPOS.coin, external: true, optional: true }],
    },
  },
  {
    id: "apera",
    title: "Apera PLC Bridge",
    page: 3,
    row: 1,
    col: 0,
    accent: "#3f6fa3",
    iconKind: "robotarm",
    scene: "apera",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "Apera AI · Allen-Bradley PLC",
      summary: "A Python socket bridge (pycomm3) connecting Apera AI's 3D vision system to an Allen-Bradley PLC.",
      bullets: ["Lets the vision system and the PLC actually talk to each other in real time instead of living in two separate worlds."],
      stack: ["Python", "pycomm3", "TCP sockets", "Allen-Bradley PLC", "Apera AI"],
      links: [{ label: "Source Code", href: REPOS.apera, external: true, optional: true }],
    },
  },
  {
    id: "cognexur",
    title: "Cognex → UR Configurator",
    page: 3,
    row: 1,
    col: 1,
    accent: "#5aa0d8",
    iconKind: "cognex",
    scene: "cognexur",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "GUI Tool",
      summary: "A GUI tool that generates UR scripts and streamlines the spreadsheet side of a Cognex In-Sight pick pipeline.",
      bullets: ["Took a process that lived in a spreadsheet and a lot of tribal knowledge, and turned it into a few clicks."],
      stack: ["Cognex In-Sight", "URScript", "Universal Robots"],
      links: [{ label: "Source Code", href: REPOS.cognexur, external: true, optional: true }],
    },
  },
  {
    id: "uryaskawa",
    title: "UR ↔ Yaskawa Translator",
    page: 3,
    row: 1,
    col: 2,
    accent: "#c0562f",
    iconKind: "translator",
    scene: "uryaskawa",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "Robot Motion Translation",
      summary: "A central UI that controls both a Universal Robots arm and a Yaskawa robot, translating motion between the two.",
      bullets: ["Two robot ecosystems that don't naturally speak the same language, made to work together from one interface."],
      stack: ["Universal Robots", "Yaskawa", "Motion translation"],
      links: [{ label: "Source Code", href: REPOS.uryaskawa, external: true, optional: true }],
    },
  },
  {
    id: "ironcad",
    title: "IronCAD MCP Server",
    page: 3,
    row: 1,
    col: 3,
    accent: "#4a4a52",
    iconKind: "ironcad",
    scene: "ironcad",
    action: { type: "panel" },
    content: {
      style: "casefile",
      eyebrow: "Local MCP Server",
      summary: "A local MCP server that lets Claude drive IronCAD directly — building parts from a sketch using my own parts catalog.",
      bullets: ["Basically: describe the part, watch Claude actually build it in CAD instead of just describing how to."],
      stack: ["Model Context Protocol", "Claude", "IronCAD"],
      links: [{ label: "Source Code", href: REPOS.ironcad, external: true, optional: true }],
    },
  },
  {
    id: "personalsite",
    title: "Personal Website",
    page: 3,
    row: 2,
    col: 0,
    accent: "#2f8fd1",
    iconKind: "wave",
    scene: "personalsite",
    action: { type: "external", href: LINKS.personalSite },
    content: {
      style: "casefile",
      eyebrow: "3D web experience",
      summary: "My ocean-themed 3D personal site — a project in its own right, not just a container for the rest of these.",
      stack: ["Next.js", "React Three Fiber", "Three.js"],
      links: [
        { label: "Visit Site", href: LINKS.personalSite, external: true },
        { label: "Source Code", href: REPOS.personalSite, external: true, optional: true },
      ],
    },
  },
];

export const TOTAL_PAGES = 3;
