type Props = {
  kind: string;
  accent: string;
};

// Simple flat placeholder illustrations, one per channel kind. These stand
// in for the final custom icon art while the core grid/tile system is being
// validated.
export default function ChannelIcon({ kind, accent }: Props) {
  switch (kind) {
    case "disc":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="26" fill={accent} />
          <circle cx="32" cy="32" r="10" fill="#eef6fb" />
          <circle cx="32" cy="32" r="4" fill={accent} />
        </svg>
      );
    case "mii":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="24" r="14" fill={accent} />
          <path d="M12 54c2-14 10-20 20-20s18 6 20 20" fill={accent} opacity="0.85" />
        </svg>
      );
    case "forecast":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="26" cy="26" r="12" fill="#f5c95d" />
          <ellipse cx="34" cy="40" rx="20" ry="12" fill={accent} />
        </svg>
      );
    case "shop":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="14" y="26" width="36" height="26" rx="4" fill={accent} />
          <path d="M20 26v-4a12 12 0 0 1 24 0v4" fill="none" stroke={accent} strokeWidth="4" />
        </svg>
      );
    case "factory":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="10" y="34" width="44" height="20" rx="3" fill={accent} />
          <path d="M16 34V22l10 8V22l10 8V22l10 8v4" fill="none" stroke={accent} strokeWidth="4" strokeLinejoin="round" />
        </svg>
      );
    case "shelley":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          {/* conveyor */}
          <rect x="6" y="52" width="40" height="4" rx="2" fill={accent} opacity="0.35" />
          <circle cx="12" cy="54" r="2.4" fill={accent} opacity="0.5" />
          <circle cx="40" cy="54" r="2.4" fill={accent} opacity="0.5" />
          {/* workpiece on conveyor */}
          <rect x="30" y="45" width="9" height="7" rx="1.5" fill={accent} />

          {/* robot base */}
          <circle cx="16" cy="46" r="6" fill={accent} />

          {/* articulated arm + vision camera head */}
          <g className="shelley-arm" style={{ transformOrigin: "16px 46px" }}>
            <path d="M16 46V28h14" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="28" r="3.4" fill={accent} />
            <circle cx="30" cy="28" r="3.4" fill={accent} />
            <g transform="translate(30 28)">
              <rect x="-2" y="0" width="16" height="10" rx="2" fill={accent} />
              <circle cx="14" cy="5" r="4.2" fill="#1c1e22" />
              <circle cx="14" cy="5" r="2.1" fill="#eef6fb" />
              <circle className="shelley-led" cx="1" cy="2.4" r="1.2" fill="#7cfc9a" />
            </g>
          </g>

          {/* vision scan beam onto the part */}
          <line className="shelley-scan" x1="44" y1="33" x2="34.5" y2="48" stroke="#7cfc9a" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "sd":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M20 10h18l8 8v36a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" fill={accent} />
          <rect x="23" y="14" width="14" height="10" fill="#eef6fb" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="10" y="18" width="44" height="30" rx="4" fill={accent} />
          <path d="M12 20l20 16 20-16" fill="none" stroke="#eef6fb" strokeWidth="3" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="24" fill={accent} />
          <path
            d="M32 18c-7.7 0-14 6.3-14 14 0 6.2 4 11.4 9.6 13.3.7.1 1-.3 1-.7v-2.6c-3.9.9-4.7-1.7-4.7-1.7-.6-1.6-1.6-2-1.6-2-1.3-.9.1-.9.1-.9 1.4.1 2.2 1.5 2.2 1.5 1.3 2.2 3.4 1.6 4.2 1.2.1-.9.5-1.6.9-2-3.1-.4-6.4-1.6-6.4-7 0-1.6.6-2.8 1.5-3.9-.2-.4-.6-1.9.1-4 0 0 1.2-.4 4 1.5a14 14 0 0 1 7.3 0c2.8-1.9 4-1.5 4-1.5.7 2.1.3 3.6.1 4 .9 1.1 1.5 2.3 1.5 3.9 0 5.4-3.3 6.6-6.4 7 .5.5 1 1.4 1 2.8v4.1c0 .4.3.8 1 .7C42 43.4 46 38.2 46 32c0-7.7-6.3-14-14-14z"
            fill="#eef6fb"
          />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="8" y="8" width="48" height="48" rx="8" fill={accent} />
          <rect x="18" y="26" width="7" height="22" fill="#eef6fb" />
          <circle cx="21.5" cy="18" r="4" fill="#eef6fb" />
          <path d="M30 26h7v3.4c1-1.9 3.4-3.8 7-3.8 7.5 0 8.9 4.9 8.9 11.3V48h-7V38.4c0-2.3 0-5.3-3.2-5.3-3.3 0-3.8 2.6-3.8 5.2V48h-7V26z" fill="#eef6fb" />
        </svg>
      );
    case "parking":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="10" y="10" width="44" height="44" rx="6" fill={accent} />
          <path d="M24 46V18h9a9 9 0 0 1 0 18h-9" fill="none" stroke="#eef6fb" strokeWidth="5" strokeLinejoin="round" />
        </svg>
      );
    case "legal":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="29.5" y="10" width="5" height="34" fill={accent} />
          <path d="M12 20l8-6 8 6-8 16-8-16z" fill="none" stroke={accent} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M36 20l8-6 8 6-8 16-8-16z" fill="none" stroke={accent} strokeWidth="3.5" strokeLinejoin="round" />
          <rect x="16" y="48" width="32" height="6" rx="2" fill={accent} />
        </svg>
      );
    case "manufacturing":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="12" fill="none" stroke={accent} strokeWidth="5" />
          <circle cx="32" cy="32" r="4" fill={accent} />
          <path d="M32 12v6M32 46v6M12 32h6M46 32h6" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "lifesaving":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="20" fill="none" stroke={accent} strokeWidth="8" />
          <circle cx="32" cy="32" r="20" fill="none" stroke="#eef6fb" strokeWidth="8" strokeDasharray="10 15.7" />
          <circle cx="32" cy="32" r="8" fill="#eef6fb" />
        </svg>
      );
    case "ats":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="12" y="10" width="28" height="36" rx="3" fill={accent} />
          <rect x="17" y="16" width="18" height="3" fill="#eef6fb" />
          <rect x="17" y="23" width="18" height="3" fill="#eef6fb" />
          <rect x="17" y="30" width="12" height="3" fill="#eef6fb" />
          <circle cx="42" cy="42" r="10" fill="none" stroke={accent} strokeWidth="4" />
          <path d="M49 49l6 6" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "coin":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="22" fill={accent} />
          <circle cx="32" cy="32" r="22" fill="none" stroke="#eef6fb" strokeWidth="2" strokeDasharray="3 4" />
          <text x="32" y="40" textAnchor="middle" fontSize="22" fontWeight="700" fill="#eef6fb">$</text>
        </svg>
      );
    case "robotarm":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="14" cy="50" r="5" fill={accent} />
          <path d="M14 50V34h18V20" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="20" r="6" fill={accent} />
          <path d="M38 20h10" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    case "cognex":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="10" y="20" width="30" height="22" rx="4" fill={accent} />
          <circle cx="25" cy="31" r="7" fill="#eef6fb" />
          <path d="M40 27l14-8v26l-14-8z" fill={accent} />
        </svg>
      );
    case "translator":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M8 24h24" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M24 16l8 8-8 8" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M56 40H32" stroke={accent} strokeWidth="4" strokeLinecap="round" />
          <path d="M40 32l-8 8 8 8" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "ironcad":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M32 8l22 12v24L32 56 10 44V20z" fill="none" stroke={accent} strokeWidth="3.5" strokeLinejoin="round" />
          <path d="M32 8v24M10 20l22 12M54 20l-22 12" fill="none" stroke={accent} strokeWidth="3.5" strokeLinejoin="round" />
        </svg>
      );
    case "wave":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M6 26c6-8 12-8 18 0s12 8 18 0 12-8 18 0" fill="none" stroke={accent} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M6 38c6-8 12-8 18 0s12 8 18 0 12-8 18 0" fill="none" stroke={accent} strokeWidth="4.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case "briefcase":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M24 20v-4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4" fill="none" stroke={accent} strokeWidth="4" />
          <rect x="10" y="20" width="44" height="32" rx="5" fill={accent} />
          <rect x="10" y="32" width="44" height="3" fill="#eef6fb" opacity="0.7" />
          <rect x="28" y="29" width="8" height="9" rx="1.5" fill="#eef6fb" />
        </svg>
      );
    case "grad":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <path d="M32 12L6 24l26 12 26-12z" fill={accent} />
          <path d="M18 30v10c0 4 6.3 8 14 8s14-4 14-8V30l-14 6.5z" fill={accent} opacity="0.8" />
          <path d="M52 26v14" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <circle cx="52" cy="42" r="3" fill={accent} />
        </svg>
      );
    case "comingsoon":
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <circle cx="32" cy="32" r="20" fill="none" stroke={accent} strokeWidth="4" strokeDasharray="6 6" />
          <path d="M32 22v10l7 5" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className="h-full w-full">
          <rect x="12" y="12" width="40" height="40" rx="8" fill={accent} />
        </svg>
      );
  }
}
