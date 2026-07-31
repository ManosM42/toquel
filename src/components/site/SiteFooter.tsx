import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-5 pt-16 pb-10 md:px-10">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="display text-[16vw] leading-[0.8] md:text-[9vw]">TOQUEL</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Klaudjo Dhespo. Από την Τεπελένη στο Ηράκλειο, από το Ηράκλειο στην κορυφή των
            ελληνικών charts.
          </p>
        </div>

        <nav className="md:col-span-3">
          <p className="kicker">Πλοήγηση</p>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/tour", label: "Tour" },
              { to: "/music", label: "Music" },
              { to: "/story", label: "Story" },
              { to: "/community", label: "Community" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="link-draw text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="kicker">Social</p>
          <ul className="mt-5 space-y-2 text-sm">
            {[
              { href: "https://open.spotify.com/search/Toquel", label: "Spotify" },
              { href: "https://www.instagram.com/toquel/", label: "Instagram" },
              { href: "https://www.youtube.com/results?search_query=Toquel", label: "YouTube" },
              { href: "https://www.tiktok.com/search?q=toquel", label: "TikTok" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-draw text-muted-foreground hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-border pt-6 text-[11px] tracking-[0.18em] text-muted-foreground uppercase md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Toquel — Fan site</p>
        <p>Μη επίσημο fan project · Όλα τα δικαιώματα στους δικαιούχους</p>
      </div>
    </footer>
  );
}
