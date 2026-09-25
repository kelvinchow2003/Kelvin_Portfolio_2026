// Every outside link on the site lives here. Leave a value as "" until it's
// real: the UI shows those as "coming soon" instead of a dead link.
export const EMAIL = "kelvinchow2014@gmail.com";

export const LINKS = {
  github: "", // e.g. "https://github.com/<username>"
  linkedin: "", // e.g. "https://www.linkedin.com/in/<handle>"
  personalSite: "",
  // drop resume.pdf into /public, then set this to "/resume.pdf"
  resume: "",
  atsDemo: "",
  lssDemo: "",
};

export const hasLink = (href: string | undefined): href is string => !!href && href !== "#";
