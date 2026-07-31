import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const LINKS = [
  { to: "/", label: "Home", index: "01" },
  { to: "/tour", label: "Tour", index: "02" },
  { to: "/music", label: "Music", index: "03" },
  { to: "/story", label: "Story", index: "04" },
  { to: "/community", label: "Community", index: "05" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
          <Link
            to="/"
            className="display text-lg tracking-[0.18em] text-foreground md:text-xl"
            aria-label="TOQUEL — αρχική"
          >
            TOQUEL
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
            className="group -mr-1 flex h-10 w-10 flex-col items-end justify-center gap-[7px] p-1"
          >
            <span
              className={`block h-px bg-foreground transition-all duration-500 ${
                open ? "w-6 translate-y-[4px] rotate-45" : "w-6 group-hover:w-4"
              }`}
            />
            <span
              className={`block h-px bg-foreground transition-all duration-500 ${
                open ? "w-6 -translate-y-[4px] -rotate-45" : "w-4 group-hover:w-6"
              }`}
            />
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-background transition-[opacity,visibility] duration-500 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-center px-5 pt-24 pb-16 md:px-10">
          <ul className="border-t border-border">
            {LINKS.map((l, i) => (
              <li key={l.to} className="border-b border-border">
                <Link
                  to={l.to}
                  tabIndex={open ? 0 : -1}
                  className="group flex items-baseline gap-4 py-4 md:gap-8 md:py-6"
                  style={
                    open
                      ? { animation: `menu-item-in 0.7s cubic-bezier(.16,1,.3,1) ${i * 70 + 90}ms both` }
                      : undefined
                  }
                >
                  <span className="kicker w-8 shrink-0">{l.index}</span>
                  <span
                    className={`display text-[13vw] leading-[0.85] transition-transform duration-500 group-hover:translate-x-3 md:text-[6.5vw] ${
                      pathname === l.to ? "text-foreground" : "text-foreground/70 group-hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
            <a
              className="link-draw hover:text-foreground"
              href="https://open.spotify.com/search/Toquel"
              target="_blank"
              rel="noreferrer noopener"
            >
              Spotify
            </a>
            <a
              className="link-draw hover:text-foreground"
              href="https://www.instagram.com/toquel/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Instagram
            </a>
            <a
              className="link-draw hover:text-foreground"
              href="https://www.youtube.com/results?search_query=Toquel"
              target="_blank"
              rel="noreferrer noopener"
            >
              YouTube
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
