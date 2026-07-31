import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import heroImg from "@/assets/hero-toquel.jpg";
import coverTen from "@/assets/cover-10.jpg";
import liveCrowd from "@/assets/live-crowd.jpg";

import { ParallaxImage } from "@/components/site/Parallax";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import { postsQuery, pollsQuery, showsQuery } from "@/lib/data";
import { formatShowDate, spotifyAlbumUrl } from "@/lib/music";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TOQUEL — Δισκογραφία, Live & Κοινότητα" },
      {
        name: "description",
        content:
          "Το «10» είναι έξω. Δες τις επόμενες εμφανίσεις, όλη τη δισκογραφία και την ιστορία του TOQUEL.",
      },
      { property: "og:title", content: "TOQUEL — Δισκογραφία, Live & Κοινότητα" },
      {
        property: "og:description",
        content: "Το νέο άλμπουμ «10», live ημερομηνίες και η κοινότητα των fans.",
      },
    ],
  }),
  component: Home,
});

function Countdown({ date }: { date: string }) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const diff = new Date(`${date}T20:00:00`).getTime() - Date.now();
      if (diff <= 0) return setLeft(null);
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
      });
    };
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, [date]);

  if (!left) return null;
  return (
    <div className="flex gap-8">
      {[
        { v: left.d, l: "Ημέρες" },
        { v: left.h, l: "Ώρες" },
        { v: left.m, l: "Λεπτά" },
      ].map((x) => (
        <div key={x.l}>
          <p className="display text-4xl md:text-6xl">{String(x.v).padStart(2, "0")}</p>
          <p className="kicker mt-2">{x.l}</p>
        </div>
      ))}
    </div>
  );
}

function Home() {
  const { data: shows } = useQuery(showsQuery("upcoming"));
  const { data: posts } = useQuery(postsQuery());
  const { data: pollData } = useQuery(pollsQuery(true));

  const next = shows?.[0];
  const poll = pollData?.polls?.[0];

  return (
    <>
      {/* HERO */}
      <section className="relative h-[100svh] w-full">
        <ParallaxImage
          src={heroImg}
          alt="Ο Toquel σε ασπρόμαυρο πορτραίτο"
          className="absolute inset-0 h-full w-full"
          strength={0.35}
          priority
        />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-16 md:px-10 md:pb-20">
          <p className="kicker mb-4 md:mb-6">Klaudjo Dhespo · Ηράκλειο Κρήτης</p>
          <h1 className="display text-[24vw] leading-[0.78] md:text-[17vw]">Toquel</h1>
          <div className="mt-6 grid gap-6 border-t border-border pt-6 md:grid-cols-12">
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:col-span-5">
              Δέκα χρόνια, τέσσερα diamond, ένα άλμπουμ που λέγεται «10». Ο κορυφαίος Έλληνας
              καλλιτέχνης του 2025 κατά το Spotify.
            </p>
            <div className="flex flex-wrap items-start gap-4 md:col-span-7 md:justify-end">
              <a
                href={spotifyAlbumUrl("10")}
                target="_blank"
                rel="noreferrer noopener"
                className="border border-foreground px-7 py-3 text-xs tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-foreground hover:text-background"
              >
                Άκου το «10»
              </a>
              <Link
                to="/tour"
                className="border border-border px-7 py-3 text-xs tracking-[0.22em] text-muted-foreground uppercase transition-colors duration-500 hover:border-foreground hover:text-foreground"
              >
                Ημερομηνίες
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST RELEASE */}
      <section className="px-5 py-24 md:px-10 md:py-40">
        <Reveal>
          <p className="kicker">Νέα κυκλοφορία · Μάρτιος 2026</p>
        </Reveal>
        <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-5">
            <a
              href={spotifyAlbumUrl("10")}
              target="_blank"
              rel="noreferrer noopener"
              className="media-zoom block overflow-hidden"
            >
              <img
                src={coverTen}
                alt="Εξώφυλλο του άλμπουμ «10»"
                loading="lazy"
                width={1024}
                height={1024}
                className="aspect-square w-full object-cover"
              />
            </a>
          </Reveal>
          <Reveal delay={120} className="md:col-span-7 md:pl-6">
            <h2 className="display text-[22vw] leading-[0.8] md:text-[12vw]">10</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Κυκλοφόρησε στις 12 Μαρτίου 2026 και γιορτάζει τη δεκαετία της καριέρας του. Έκανε
              ντεμπούτο στα Global Spotify Top Albums.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={spotifyAlbumUrl("10")}
                target="_blank"
                rel="noreferrer noopener"
                className="border border-foreground px-7 py-3 text-xs tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-foreground hover:text-background"
              >
                Spotify
              </a>
              <Link
                to="/music/$slug"
                params={{ slug: "10" }}
                className="link-draw self-center text-xs tracking-[0.22em] text-muted-foreground uppercase hover:text-foreground"
              >
                Tracklist
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* NEXT SHOW */}
      <section className="relative">
        <ParallaxImage
          src={liveCrowd}
          alt="Κοινό σε συναυλία"
          className="h-[70svh] w-full md:h-[85svh]"
          strength={0.2}
        />
        <div className="absolute inset-0 flex items-center px-5 md:px-10">
          <Reveal className="w-full">
            <p className="kicker">Επόμενη εμφάνιση</p>
            {next ? (
              <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-end">
                <div className="md:col-span-7">
                  <p className="display text-[13vw] leading-[0.82] md:text-[7vw]">{next.city}</p>
                  <p className="mt-4 text-sm tracking-[0.16em] text-muted-foreground uppercase">
                    {formatShowDate(next.date).day} {formatShowDate(next.date).month}{" "}
                    {formatShowDate(next.date).year}
                    {next.time ? ` · ${next.time}` : ""} · {next.venue}
                  </p>
                </div>
                <div className="md:col-span-5 md:text-right">
                  <div className="md:flex md:justify-end">
                    <Countdown date={next.date} />
                  </div>
                  <Link
                    to="/tour"
                    className="mt-8 inline-block border border-foreground px-7 py-3 text-xs tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-foreground hover:text-background"
                  >
                    Δες όλες τις ημερομηνίες
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <p className="display text-[12vw] leading-[0.82] md:text-[6vw]">Σύντομα</p>
                <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                  Δεν υπάρχουν ανακοινωμένες ημερομηνίες αυτή τη στιγμή. Νέες εμφανίσεις
                  ανακοινώνονται σύντομα.
                </p>
                <Link
                  to="/tour"
                  className="mt-8 inline-block border border-foreground px-7 py-3 text-xs tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-foreground hover:text-background"
                >
                  Tour
                </Link>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* NUMBERS */}
      <section className="px-5 py-24 md:px-10 md:py-40">
        <Reveal>
          <p className="kicker">Η δεκαετία σε αριθμούς</p>
        </Reveal>
        <ul className="mt-10 border-t border-border">
          {[
            { n: 4, suffix: "×", label: "Diamond πιστοποιήσεις", note: "777 · Beverly Hills · 1111 · ILLEGAL" },
            { n: 1, suffix: "", label: "Κορυφαίος Έλληνας καλλιτέχνης 2025", note: "Spotify Wrapped" },
            { n: 50, suffix: "+", label: "Εβδομάδες στο #1", note: "Το άλμπουμ «1111»" },
            { n: 10, suffix: "", label: "Χρόνια καριέρας", note: "2016 — 2026" },
          ].map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 90} className="border-b border-border">
              <div className="grid items-baseline gap-2 py-8 md:grid-cols-12">
                <p className="display text-6xl md:col-span-4 md:text-8xl">
                  <Counter to={s.n} suffix={s.suffix} />
                </p>
                <p className="text-sm tracking-[0.16em] uppercase md:col-span-5">{s.label}</p>
                <p className="text-xs text-muted-foreground md:col-span-3 md:text-right">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* COMMUNITY TEASER */}
      <section className="border-t border-border px-5 py-24 md:px-10 md:py-40">
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="kicker">Community</p>
            <h2 className="display mt-5 text-[14vw] leading-[0.82] md:text-[6vw]">
              Μπες στην
              <br />
              κοινότητα
            </h2>
            <Link
              to="/community"
              className="mt-8 inline-block border border-foreground px-7 py-3 text-xs tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-foreground hover:text-background"
            >
              Δες το feed
            </Link>
          </Reveal>

          <div className="md:col-span-7">
            <ul className="border-t border-border">
              {(posts ?? []).slice(0, 2).map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 100} className="border-b border-border py-6">
                  <p className="kicker">
                    {new Date(p.created_at).toLocaleDateString("el-GR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-3 text-lg leading-snug">{p.content}</p>
                </Reveal>
              ))}
              {poll ? (
                <Reveal as="li" delay={220} className="border-b border-border py-6">
                  <p className="kicker">Ψηφοφορία</p>
                  <p className="mt-3 text-lg leading-snug">{poll.question}</p>
                  <Link
                    to="/community"
                    className="link-draw mt-3 inline-block text-xs tracking-[0.22em] text-muted-foreground uppercase hover:text-foreground"
                  >
                    Ψήφισε
                  </Link>
                </Reveal>
              ) : null}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
