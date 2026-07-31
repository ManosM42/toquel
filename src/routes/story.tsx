import { createFileRoute } from "@tanstack/react-router";

import heroImg from "@/assets/hero-toquel.jpg";
import origins from "@/assets/story-origins.jpg";
import studio from "@/assets/story-studio.jpg";
import awards from "@/assets/story-awards.jpg";
import liveCrowd from "@/assets/live-crowd.jpg";

import { ParallaxImage } from "@/components/site/Parallax";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "TOQUEL — Η Ιστορία: από την Τεπελένη στα diamond" },
      {
        name: "description",
        content:
          "Η αναλυτική ιστορία του TOQUEL: γέννηση στην Αλβανία, Ηράκλειο Κρήτης, Minos EMI, 777, Beverly Hills, 1111 και το «10».",
      },
      { property: "og:title", content: "TOQUEL — Η Ιστορία" },
      {
        property: "og:description",
        content: "Δώδεκα κεφάλαια για τη διαδρομή του TOQUEL, 1994 — 2026.",
      },
    ],
  }),
  component: StoryPage,
});

type Chapter = {
  n: string;
  title: string;
  years?: string;
  body: string;
  image?: string;
  alt?: string;
};

const CHAPTERS: Chapter[] = [
  {
    n: "01",
    title: "Η καταγωγή",
    years: "1994",
    body: "Γεννήθηκε στις 6 Δεκεμβρίου 1994 στην Τεπελένη της Αλβανίας, σε αλβανική οικογένεια. Ένα μικρό ορεινό μέρος, μια οικογένεια που ετοιμαζόταν ήδη για κάτι άλλο.",
    image: origins,
    alt: "Δρόμος παλιάς μεσογειακής πόλης στο σούρουπο",
  },
  {
    n: "02",
    title: "Η μετακόμιση στην Ελλάδα",
    years: "1995",
    body: "Σε ηλικία μόλις έντεκα μηνών η οικογένεια μετακόμισε στο Ηράκλειο Κρήτης. Ο πατέρας είχε πάει πρώτος, για να ετοιμάσει το έδαφος. Η Κρήτη έγινε το σπίτι.",
  },
  {
    n: "03",
    title: "Το καλλιτεχνικό όνομα",
    body: "Το «Toquel» εμπνεύστηκε από έναν θεραπευτή/ψυχίατρο από τα Χανιά, ο οποίος τον βοήθησε να διαχειριστεί κρίσεις πανικού. Ένα όνομα που κουβαλάει ευγνωμοσύνη.",
  },
  {
    n: "04",
    title: "Οι μουσικές επιρροές",
    body: "50 Cent, Dr. Dre, Eminem, Notorious B.I.G., Tupac, Snoop Dogg, Mobb Deep, Rakim, Bone Thugs-n-Harmony. Αμερικανικό hip-hop της χρυσής εποχής, μεταφρασμένο σε ελληνικό δρόμο.",
    image: studio,
    alt: "Σκοτεινό στούντιο ηχογράφησης με μικρόφωνο και κονσόλα",
  },
  {
    n: "05",
    title: "Η αρχή",
    years: "2011 — 2015",
    body: "Ξεκίνησε την καριέρα του το 2011. Τέσσερα χρόνια αργότερα, το 2015, κυκλοφόρησε το πρώτο του άλμπουμ, «Λίγο Παραπάνω».",
  },
  {
    n: "06",
    title: "Η επιστροφή & η Minos EMI",
    years: "2018 — 2019",
    body: "Επέστρεψε στην Ελλάδα το 2018 και υπέγραψε συμβόλαιο με τη Minos EMI/Universal. Το 2019 κυκλοφόρησε το EP «777», που έγινε diamond.",
  },
  {
    n: "07",
    title: "Η άνοδος",
    years: "2021 — 2022",
    body: "Τα singles «Kokaina» και «Rollie» τον εκτόξευσαν. Το 2022 ήρθε το «Beverly Hills», πολυπλατινένιο άλμπουμ με τα «Aftoktonia» και «Forema».",
    image: awards,
    alt: "Πλατινένιοι και diamond δίσκοι σε κορνίζες σε σκοτεινό τοίχο",
  },
  {
    n: "08",
    title: "Αφιέρωση στη μητέρα — «1111»",
    years: "2023",
    body: "Το άλμπουμ πήρε τον τίτλο του από τα γενέθλια της μητέρας του, 11 Νοεμβρίου. Το εξώφυλλο τον δείχνει παιδί στην αγκαλιά της. Έμεινε #1 για πάνω από 50 εβδομάδες. Παραγωγή: Beyond, Ioannis, Toquel, Ortiz.",
  },
  {
    n: "09",
    title: "«Ilegal»",
    years: "2024",
    body: "EP σε συνεργασία με τους Fly Lo και Beyond. Τρεις κόσμοι σε ένα project.",
  },
  {
    n: "10",
    title: "Κορυφαίος καλλιτέχνης",
    years: "2025",
    body: "Το Spotify τον ανέδειξε κορυφαίο Έλληνα καλλιτέχνη της χρονιάς. Το single «Stars» παρέμεινε κορυφαίο trending στο YouTube Ελλάδας για πάνω από 10 μέρες.",
  },
  {
    n: "11",
    title: "«10» και το σήμερα",
    years: "2026",
    body: "Στις 12 Μαρτίου 2026 κυκλοφόρησε το «10», γιορτάζοντας τη δεκαετή πορεία. Σε ειδικό event με τη Minos EMI του απονεμήθηκαν diamond πλακέτες για «Beverly Hills», «1111», «ILLEGAL» και «777» — το τελευταίο αναδείχθηκε το πρώτο diamond EP στην ιστορία των ελληνικών charts.",
  },
  {
    n: "12",
    title: "Το live",
    body: "Sold-out εμφάνιση στο Piraeus 117 Academy, γιορτάζοντας τη δεκαετία καριέρας μπροστά σε ένα κοινό που ήξερε κάθε στίχο.",
    image: liveCrowd,
    alt: "Sold out συναυλία με το κοινό με τα χέρια ψηλά",
  },
];

function StoryPage() {
  return (
    <>
      <section className="relative h-[80svh] md:h-[92svh]">
        <ParallaxImage
          src={heroImg}
          alt="Πορτραίτο του Toquel"
          className="absolute inset-0 h-full w-full"
          strength={0.35}
          priority
        />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-14 md:px-10 md:pb-20">
          <p className="kicker mb-4">1994 — 2026</p>
          <h1 className="display text-[21vw] leading-[0.8] md:text-[13vw]">The Story</h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Δώδεκα κεφάλαια: από την Τεπελένη και το Ηράκλειο, μέχρι τα diamond και το «10».
          </p>
        </div>
      </section>

      {CHAPTERS.map((c) => (
        <section key={c.n} className="border-t border-border">
          <div className="grid gap-6 px-5 py-20 md:grid-cols-12 md:gap-10 md:px-10 md:py-32">
            <Reveal className="md:col-span-4">
              <p className="display text-[22vw] leading-[0.78] text-surface-2 md:text-[9vw]">{c.n}</p>
            </Reveal>
            <Reveal delay={120} className="md:col-span-7 md:col-start-6 md:pt-6">
              {c.years ? <p className="kicker">{c.years}</p> : null}
              <h2 className="display mt-3 text-3xl leading-[0.95] md:text-5xl">{c.title}</h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {c.body}
              </p>
            </Reveal>
          </div>

          {c.image ? (
            <ParallaxImage
              src={c.image}
              alt={c.alt ?? c.title}
              className="h-[48svh] w-full md:h-[72svh]"
              strength={0.18}
              overlay={false}
            />
          ) : null}
        </section>
      ))}
    </>
  );
}
