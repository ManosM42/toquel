import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { coverFor } from "@/lib/covers";
import { Reveal } from "@/components/site/Reveal";
import { albumsQuery, songsQuery } from "@/lib/data";
import { spotifyTrackUrl } from "@/lib/music";

export const Route = createFileRoute("/music/")({
  head: () => ({
    meta: [
      { title: "TOQUEL — Δισκογραφία & Άλμπουμ" },
      {
        name: "description",
        content:
          "Όλα τα άλμπουμ και τα EP του TOQUEL: 10, Ilegal, 1111, Beverly Hills, 777, Λίγο Παραπάνω, μαζί με τα singles.",
      },
      { property: "og:title", content: "TOQUEL — Δισκογραφία & Άλμπουμ" },
      { property: "og:description", content: "Η πλήρης δισκογραφία του TOQUEL, από το 2015 ως το 2026." },
    ],
  }),
  component: MusicPage,
});

function MusicPage() {
  const { data: albums } = useQuery(albumsQuery());
  const { data: songs } = useQuery(songsQuery());
  const singles = (songs ?? []).filter((s) => !s.album_id);

  return (
    <>
      <section className="px-5 pt-32 pb-16 md:px-10 md:pt-48 md:pb-24">
        <Reveal>
          <p className="kicker">Δισκογραφία 2015 — 2026</p>
          <h1 className="display mt-5 text-[22vw] leading-[0.8] md:text-[13vw]">Music</h1>
        </Reveal>
      </section>

      <section className="px-5 pb-24 md:px-10 md:pb-40">
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-12">
          {(albums ?? []).map((a, i) => (
            <Reveal
              key={a.id}
              delay={(i % 3) * 100}
              className={
                i % 3 === 0
                  ? "md:col-span-7"
                  : i % 3 === 1
                    ? "md:col-span-5 md:pt-24"
                    : "md:col-span-6 md:col-start-4"
              }
            >
              <Link to="/music/$slug" params={{ slug: a.slug }} className="media-zoom group block">
                <div className="overflow-hidden">
                  <img
                    src={coverFor(a.slug, a.cover_url)}
                    alt={`Εξώφυλλο ${a.title}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover grayscale"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between border-t border-border pt-4">
                  <h2 className="display text-3xl transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                    {a.title}
                  </h2>
                  <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
                    {a.type} · {a.release_year}
                  </p>
                </div>
                {a.notes ? (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {a.notes}
                  </p>
                ) : null}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="kicker">Singles & συνεργασίες</p>
          <h2 className="display mt-5 text-[13vw] leading-[0.85] md:text-[6vw]">Singles</h2>
        </Reveal>
        <ul className="mt-10 border-t border-border">
          {singles.map((s, i) => (
            <Reveal as="li" key={s.id} delay={(i % 6) * 50} className="border-b border-border">
              <a
                href={spotifyTrackUrl(s.title, s.spotify_url)}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-baseline justify-between gap-6 py-5"
              >
                <span className="text-lg transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">
                  {s.title}
                </span>
                <span className="shrink-0 text-[11px] tracking-[0.22em] text-muted-foreground uppercase group-hover:text-foreground">
                  {s.release_year ?? ""} · Spotify
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
