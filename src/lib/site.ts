// Every outside link and piece of personal info on the site lives here. Leave
// a value as "" until it's real: the UI shows those as "coming soon" (or
// hides them, for optional links) instead of a dead link.

export const NAME = "Kelvin Chow";
export const EMAIL = "kelvinchow2014@gmail.com";

// one line under your name on the intro screen and in link previews
export const ROLE = "Computer Science grad (TMU '26) · Applications Specialist at Shelley Automation";

// optional: what you're looking for, e.g. "Open to software and automation roles in Toronto."
export const LOOKING_FOR = "";

// the deployed address, e.g. "https://kelvinchow.dev" (used for link previews,
// the sitemap and robots.txt). NEXT_PUBLIC_SITE_URL overrides it when set.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export const EDUCATION = {
  school: "Toronto Metropolitan University",
  degree: "B.Sc. Computer Science (Honours)",
  honours: "Dean's List",
  // e.g. "Sept 2021 – April 2026"
  graduation: "Sept 2021 – April 2026",
  // e.g. ["Data Structures", "Operating Systems", "Databases"]
  coursework: [] as string[],
};

export const LINKS = {
  github: "https://github.com/kelvinchow2003",
  linkedin: "https://www.linkedin.com/in/kelchow/",
  personalSite: "",
  // drop resume.pdf into /public, then set this to "/resume.pdf"
  resume: "",
  atsDemo: "",
  lssDemo: "",
};

// source code per project; blank ones are simply hidden (some work is private)
export const REPOS = {
  lss: "",
  ats: "",
  coin: "",
  apera: "",
  cognexur: "",
  uryaskawa: "",
  ironcad: "",
  personalSite: "",
};

export const hasLink = (href: string | undefined): href is string => !!href && href !== "#";
