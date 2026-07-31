import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { coverFor } from "@/lib/covers";
import { Reveal } from "@/components/site/Reveal";
import { albumsQuery, songsQuery } from "@/lib/data";
import { spotifyAlbumUrl, spotifyTrackUrl } from "@/lib/music";

export const Route = createFileRoute("/music/$slug")({
  head: ({ params }) => {
    const title = `TOQUEL — ${params.slug.toUpperCase()} · Tracklist`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Πλήρες tracklist του άλμπουμ «${params.slug}» του TOQUEL, με σύνδεση κάθε τραγουδιού στο Spotify.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Tracklist και λεπτομέρειες για το «${params.slug}».`,
        },
      ],
    };
  },
  component: AlbumPage,
  notFoundComponent: () => (
    <div className="px-5 pt-40 pb-32 md:px-10">
      <h1 className="display text-[14vw] leading-[0.85] md:text-[7vw]">Δεν βρέθηκε</h1>
      <Link to="/music" className="link-draw mt-8 inline-block text-xs tracking-[0.22em] uppercase">
        Πίσω στη δισκογραφία
      </Link>
    </div>
  ),
});

function AlbumPage() {
  const { slug } = Route.useParams();
  const { data: albums, isLoading } = useQuery(albumsQuery());
  const { data: songs } = useQuery(songsQuery());

  const album = albums?.find((a) => a.slug === slug);
  if (!isLoading && albums && !album) throw notFound();

  const tracks = (songs ?? [])
    .filter((s) => s.album_id === album?.id)
    .sort((a, b) => (a.track_number ?? 0) - (b.track_number ?? 0));

  return (
    <article className="px-5 pt-32 pb-24 md:px-10 md:pt-48 md:pb-40">
      <Link
        to="/music"
        className="link-draw text-[11px] tracking-[0.22em] text-muted-foreground uppercase hover:text-foreground"
      >
        ← Δισκογραφία
      </Link>

      <header className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-5">
          <img
            src={coverFor(slug, album?.cover_url)}
            alt={`Εξώφυλλο ${album?.title ?? slug}`}
            loading="eager"
            className="aspect-square w-full object-cover grayscale"
          />
        </Reveal>
        <Reveal delay={100} className="md:col-span-7">
          <p className="kicker">
            {album?.type ?? "album"} · {album?.release_year ?? ""}
          </p>
          <h1 className="display mt-4 text-[18vw] leading-[0.8] md:text-[9vw]">
            {album?.title ?? slug}
          </h1>
          {album?.notes ? (
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              {album.notes}
            </p>
          ) : null}
          <a
            href={spotifyAlbumUrl(album?.title ?? slug)}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-8 inline-block border border-foreground px-7 py-3 text-xs tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-foreground hover:text-background"
          >
            Άκουσέ το στο Spotify
          </a>
        </Reveal>
      </header>

      <section className="mt-24">
        <p className="kicker">Tracklist</p>
        <ol className="mt-8 border-t border-border">
          {tracks.map((t, i) => (
            <Reveal as="li" key={t.id} delay={i * 45} className="border-b border-border">
              <a
                href={spotifyTrackUrl(t.title, t.spotify_url)}
                target="_blank"
                rel="noreferrer noopener"
                className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5"
              >
                <span className="display text-xl text-muted-foreground group-hover:text-foreground">
                  {String(t.track_number ?? i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">
                  {t.title}
                </span>
                <span className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase group-hover:text-foreground">
                  {t.duration ?? "Spotify"}
                </span>
              </a>
            </Reveal>
          ))}
          {tracks.length === 0 ? (
            <li className="py-10 text-sm text-muted-foreground">
              {isLoading ? "Φόρτωση…" : "Το tracklist θα προστεθεί σύντομα."}
            </li>
          ) : null}
        </ol>
      </section>
    </article>
  );
}
