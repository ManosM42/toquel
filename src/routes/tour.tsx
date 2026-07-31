import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import liveCrowd from "@/assets/live-crowd.jpg";
import { ParallaxImage } from "@/components/site/Parallax";
import { Reveal } from "@/components/site/Reveal";
import { showsQuery, type Show } from "@/lib/data";
import { formatShowDate } from "@/lib/music";

export const Route = createFileRoute("/tour")({
  head: () => ({
    meta: [
      { title: "TOQUEL — Tour & Live Ημερομηνίες" },
      {
        name: "description",
        content: "Όλες οι επερχόμενες εμφανίσεις του TOQUEL: ημερομηνία, venue, χάρτης, εισιτήρια.",
      },
      { property: "og:title", content: "TOQUEL — Tour & Live Ημερομηνίες" },
      { property: "og:description", content: "Δες πού παίζει ο TOQUEL και κλείσε εισιτήρια." },
    ],
  }),
  component: TourPage,
});

function ShowRow({ show, past = false }: { show: Show; past?: boolean }) {
  const d = formatShowDate(show.date);
  return (
    <div
      className={`grid gap-4 border-b border-border py-7 md:grid-cols-12 md:items-center ${
        past ? "opacity-55" : ""
      }`}
    >
      <div className="flex items-baseline gap-3 md:col-span-3">
        <span className="display text-5xl md:text-6xl">{d.day}</span>
        <span className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
          {d.month} {d.year}
        </span>
      </div>
      <div className="md:col-span-5">
        <p className="text-xl leading-tight md:text-2xl">{show.venue}</p>
        <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
          {show.city}
          {show.time ? ` · ${show.time}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
        {show.map_link ? (
          <a
            href={show.map_link}
            target="_blank"
            rel="noreferrer noopener"
            className="border border-border px-5 py-2.5 text-[11px] tracking-[0.22em] text-muted-foreground uppercase transition-colors duration-500 hover:border-foreground hover:text-foreground"
          >
            Χάρτης
          </a>
        ) : null}
        {show.tickets_link && !past ? (
          <a
            href={show.tickets_link}
            target="_blank"
            rel="noreferrer noopener"
            className="border border-foreground px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase transition-colors duration-500 hover:bg-foreground hover:text-background"
          >
            Εισιτήρια
          </a>
        ) : null}
      </div>
    </div>
  );
}

function TourPage() {
  const { data: upcoming, isLoading } = useQuery(showsQuery("upcoming"));
  const { data: past } = useQuery(showsQuery("past"));

  return (
    <>
      <section className="relative h-[62svh] md:h-[75svh]">
        <ParallaxImage
          src={liveCrowd}
          alt="Πλήθος σε live του Toquel"
          className="absolute inset-0 h-full w-full"
          strength={0.3}
          priority
        />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-12 md:px-10 md:pb-16">
          <p className="kicker mb-4">Live</p>
          <h1 className="display text-[22vw] leading-[0.8] md:text-[13vw]">Tour</h1>
        </div>
      </section>

      <section className="px-5 py-20 md:px-10 md:py-32">
        <Reveal>
          <p className="kicker">Επερχόμενες ημερομηνίες</p>
        </Reveal>

        <div className="mt-10 border-t border-border">
          {isLoading ? (
            <p className="py-10 text-sm text-muted-foreground">Φόρτωση…</p>
          ) : upcoming && upcoming.length > 0 ? (
            upcoming.map((s, i) => (
              <Reveal key={s.id} delay={i * 70}>
                <ShowRow show={s} />
              </Reveal>
            ))
          ) : (
            <Reveal>
              <div className="py-24 text-center">
                <p className="display text-[13vw] leading-[0.85] md:text-[6vw]">
                  Σύντομα νέες
                  <br />
                  ημερομηνίες
                </p>
                <p className="mx-auto mt-6 max-w-sm text-sm text-muted-foreground">
                  Δεν υπάρχουν ανακοινωμένες εμφανίσεις αυτή τη στιγμή. Μείνε συντονισμένος.
                </p>
              </div>
            </Reveal>
          )}
        </div>

        {past && past.length > 0 ? (
          <div className="mt-24">
            <Reveal>
              <p className="kicker">Αρχείο · Περασμένες εμφανίσεις</p>
            </Reveal>
            <div className="mt-8 border-t border-border">
              {past.map((s, i) => (
                <Reveal key={s.id} delay={i * 50}>
                  <ShowRow show={s} past />
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
