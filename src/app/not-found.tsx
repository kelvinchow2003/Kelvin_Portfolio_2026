import Link from "next/link";

// In the spirit of the Wii's plain "an error has occurred" screens.
export default function NotFound() {
  return (
    <div className="wii-boot flex h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-wii text-6xl font-black text-[#c9c9c9]" aria-hidden="true">
        Wii
      </p>
      <h1 className="font-rodin mt-6 text-2xl font-bold text-[#3a3a3f] sm:text-3xl">This channel could not be found.</h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[#5a5a60]">
        The page you were looking for isn&apos;t on this Wii. It may have moved, or the link may be mistyped.
      </p>
      <Link
        href="/"
        className="wii-pill mt-10 flex items-center justify-center"
        style={{ flex: "none", width: "min(64vw, 15rem)", height: "3.4rem", fontSize: "1.1rem" }}
      >
        Wii Menu
      </Link>
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-[#6b6b72]">Error code: 404</p>
    </div>
  );
}
