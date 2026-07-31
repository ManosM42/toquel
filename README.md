# Toquel: The Legacy

Θέλω να φτιάξεις ένα multi-page, mobile-first fan website αφιερωμένο στον Έλληνα ράπερ TOQUEL (Klaudjo Dhespo, γενν. 1994, Αλβανία/Ηράκλειο Κρήτης). Η δουλειά πρέπει να μοιάζει με επαγγελματικό, editorial μουσικό site (τύπου record-label / artist site υψηλού επιπέδου) — ΟΧΙ generic AI-template look. Αποφυγή default rounded cards, default shadows, default gradients. Θέλω καθαρές γραμμές, δυνατή τυπογραφία, ασυμμετρία, κίνηση.

1. Design system

Χρωματική παλέτα: αυστηρά μαύρο (#0A0A0A) & άσπρο (#FAFAFA), με μία διακριτική γκάμα του γκρι (#1A1A1A, #2E2E2E, #E5E5E5) για επίπεδα βάθους. Καμία έγχρωμη προσθήκη εκτός αν χρησιμοποιηθεί ΜΟΝΟ ως λεπτή κόκκινη ή χρυσή λεπτομέρεια (accent) σε πολύ μικρή δόση (π.χ. σε hover state ή σε live badge) — προαιρετικό, σε πολύ φειδωλή χρήση.

Τυπογραφία: Bold, editorial display font για τίτλους (π.χ. στυλ Neue Montreal / Suisse Intl / Archivo Black) σε πολύ μεγάλο μέγεθος (hero headlines), με λεπτή sans-serif (π.χ. Inter / Neue Haas) για το σώμα του κειμένου. Έντονο contrast μεγέθους ανάμεσα σε τίτλους και επεξηγηματικό κείμενο.

Layout: asymmetric grids, full-bleed εικόνες, generous whitespace/negative space, editorial μεγάλα γράμματα πάνω σε φωτογραφίες, λεπτές διαχωριστικές γραμμές (1px) αντί για κάρτες με σκιά.

Κίνηση/Effects (ΓΕΜΙΣΕ την εμπειρία με αυτά):

Parallax scroll στις hero εικόνες κάθε σελίδας (background εικόνα να κινείται πιο αργά από το foreground κείμενο).

Smooth scroll-reveal animations (fade + slide up) σε κάθε section καθώς μπαίνει στο viewport.

Hover effects σε κάθε clickable στοιχείο: εικόνες albums να κάνουν subtle scale/zoom + brightness shift στο hover, links να έχουν underline-draw animation, κουμπιά να αλλάζουν από outline σε filled με smooth transition.

Cursor-follow micro-interactions σε desktop (προαιρετικό, discreet).

Sticky/fixed elements όπου βοηθούν (π.χ. mini player bar, sticky CTA για εισιτήρια).

Page transitions: subtle fade/slide όταν αλλάζει σελίδα.

Πλήρως mobile-first & responsive: όλα τα parallax/hover effects πρέπει να έχουν κατάλληλο mobile equivalent (π.χ. hover → tap-triggered reveal σε mobile, parallax πιο ήπιο σε mobile για performance).

2. Navigation

Hamburger menu ΚΑΙ σε desktop ΚΑΙ σε mobile (όχι παραδοσιακό horizontal navbar σε desktop). Το εικονίδιο hamburger μόνιμα πάνω δεξιά (ή αριστερά), full-screen overlay menu όταν ανοίγει, με μεγάλους τίτλους σελίδων (Home / Tour / Music / Story / Community) σε editorial στυλ, animated εμφάνιση ένα-ένα (staggered).

Λογότυπο/όνομα "TOQUEL" πάντα ορατό πάνω αριστερά.

Χωρίς ξεχωριστό ορατό link για το /admin πουθενά στο UI — πρόσβαση μόνο αν κάποιος πληκτρολογήσει το URL απευθείας.

3. Σελίδες

3.1 Home

Full-screen hero με μεγάλη φωτογραφία/artwork του Toquel, parallax effect, το όνομά του σε τεράστια τυπογραφία πάνω από αυτήν.

Section με το πιο πρόσφατο single/album ("10" — Μάρτιος 2026) με cover art και call-to-action link προς Spotify.

Section "Επόμενη εμφάνιση" — τραβάει δυναμικά το επόμενο upcoming show από τον πίνακα shows στο Supabase (ημερομηνία, venue, countdown ή "Δες όλες τις ημερομηνίες" button → Tour page).

Section με highlights/νούμερα (π.χ. Κορυφαίος Έλληνας καλλιτέχνης 2025 - Spotify, diamond/platinum πιστοποιήσεις) σε μεγάλα animated αριθμητικά στοιχεία.

Section teaser για το Community page (πρόσφατα posts/poll) με CTA "Μπες στην κοινότητα".

Footer με social links, νομικά, credits.

3.2 Tour

Λίστα με όλα τα upcoming shows (αντλημένα δυναμικά από το Supabase table shows), ταξινομημένα χρονολογικά.

Κάθε show-card δείχνει: ημερομηνία, ώρα, όνομα venue, πόλη, κουμπί "Χάρτης" (ανοίγει το map_link σε νέο tab) και κουμπί "Εισιτήρια" (ανοίγει το tickets_link σε νέο tab).

Αν δεν υπάρχουν επερχόμενες ημερομηνίες, εμφάνισε κομψό empty state ("Σύντομα νέες ημερομηνίες").

Διαχωρισμός ή αρχείο για past shows (προαιρετικό, secondary section πιο κάτω).

3.3 Music

Grid με όλα τα albums/EPs του Toquel σε χρονολογική σειρά (πιο πρόσφατο πρώτο), κάθε ένα με cover art, τίτλο, χρονιά. Κλικ πάνω σε ένα album ανοίγει ξεχωριστή album detail page (/music/[album-slug]) που δείχνει το πλήρες tracklist του συγκεκριμένου album σε όμορφο, αριθμημένο layout, με τη διάρκεια κάθε τραγουδιού αν είναι διαθέσιμη.

Κάθε τραγούδι (στο tracklist αλλά και οποιοδήποτε single αναφέρεται οπουδήποτε στο site) πρέπει να είναι clickable link που ανοίγει το αντίστοιχο τραγούδι στο Spotify σε νέο tab (μέσω Spotify search ή Spotify URI αν υπάρχει).

Ξεχωριστό section πιο κάτω στο Music page για standalone singles που δεν ανήκουν σε άλμπουμ.

Δομή δεδομένων σε Supabase (albums, songs) ώστε να μπορεί να ενημερώνεται μελλοντικά χωρίς αλλαγή κώδικα.

Discography seed data (χρησιμοποίησέ τα ως αρχικό περιεχόμενο — μπορείς να τα βάλεις hardcoded ή να τα σπείρεις (seed) στο Supabase):

ΈτοςΤίτλοςΤύποςΣημειώσεις2015Λίγο ΠαραπάνωΆλμπουμΠρώτο άλμπουμ2019777EP/ΆλμπουμDiamond, πρώτο diamond EP στα ελληνικά charts2022Beverly HillsΆλμπουμDiamond — περιλαμβάνει "Aftoktonia", "Forema"20231111Άλμπουμ (11 τραγούδια)Diamond, #1 για 50+ εβδομάδες. Τίτλος = γενέθλια μητέρας του (11 Νοεμβρίου). Παραγωγή: Beyond, Ioannis, Toquel, Ortiz. Περιλαμβάνει: "Prosopika Freestyle", "G63" (feat. Bloody Hawk), "Monroe", "3:15", συνεργασίες με Fly Lo, Rack, Lila, Roran2024IlegalEP (με Fly Lo & Beyond)202610ΆλμπουμΚυκλοφόρησε 12 Μαρτίου 2026, γιορτάζει τη 10ετία καριέρας. Global Spotify Top Albums Debut

Ενδεικτικά singles/συνεργασίες προς συμπερίληψη (πρόσθεσε ως standalone tracks ή σύνδεσε στο σωστό album αν ανήκουν): Kokaina, Rollie, Carvajal, Trap, OAED (& Remix feat. Ivan Greko, BeTaf Beats), MCMG, Kako, Prezi, Success Freestyle, Stars, Business, Κουράστηκα.

⚠️ Σημείωση για εσένα (τον developer/χρήστη): Πριν πάει live το site, επιβεβαίωσε τα ακριβή tracklists και πρόσθεσε τα πραγματικά Spotify track links (μέσω Spotify for Artists ή API) — τα παραπάνω δεδομένα είναι σωστά ως προς άλμπουμ/χρονολογίες αλλά ίσως χρειάζονται επικαιροποίηση σε πλήρη tracklist ανά album.

3.4 Story (The Story)

Πλήρες, αναλυτικό εικονογραφημένο editorial background story σε μορφή "long-form scroll narrative" με sections/chapters, parallax εικόνες ανάμεσα σε κάθε κεφάλαιο:

Η καταγωγή — Γέννηση στις 6 Δεκεμβρίου 1994 στην Τεπελένη της Αλβανίας, σε αλβανική οικογένεια.

Η μετακόμιση στην Ελλάδα — Σε ηλικία 11 μηνών η οικογένεια μετακομίζει στο Ηράκλειο Κρήτης· ο πατέρας πήγε πρώτος να ετοιμάσει το έδαφος.

Το καλλιτεχνικό όνομα — Το "Toquel" εμπνεύστηκε από θεραπευτή/ψυχίατρο από τα Χανιά που τον βοήθησε με κρίσεις πανικού.

Οι μουσικές επιρροές — 50 Cent, Dr. Dre, Eminem, Notorious B.I.G., Tupac, Snoop Dogg, Mobb Deep, Rakim, Bone Thugs-n-Harmony.

Η αρχή (2011-2015) — Ξεκίνημα καριέρας το 2011, πρώτο άλμπουμ "Λίγο Παραπάνω" (2015).

Η επιστροφή & η υπογραφή με Minos EMI (2018-2019) — Επιστροφή στην Ελλάδα το 2018, συμβόλαιο με Minos EMI/Universal, EP "777" (2019) που έγινε diamond.

Η άνοδος (2021-2022) — Singles "Kokaina", "Rollie"· άλμπουμ "Beverly Hills" (2022), πολυπλατινένιο.

Αφιέρωση στη μητέρα — "1111" (2023) — Το άλμπουμ πήρε τον τίτλο του από τα γενέθλια της μητέρας του (11 Νοεμβρίου), με το εξώφυλλο να τον δείχνει παιδί στην αγκαλιά της· #1 για πάνω από 50 εβδομάδες.

"Ilegal" (2024) — Συνεργασία με Fly Lo και Beyond.

Κορυφαίος καλλιτέχνης 2025 — Αναγνώριση από Spotify ως κορυφαίος Έλληνας καλλιτέχνης της χρονιάς, το single "Stars" κορυφαίο trending στο YouTube Ελλάδας για 10+ μέρες.

"10" και το σήμερα (2026) — Κυκλοφορία του άλμπουμ "10" στις 12 Μαρτίου 2026 γιορτάζοντας τη δεκαετή πορεία, ειδικό event με τη Minos EMI όπου του απονέμονται diamond πλακέτες για "Beverly Hills", "1111", "ILLEGAL" και "777" (το τελευταίο αναδείχθηκε το πρώτο diamond EP στην ιστορία των ελληνικών charts).

Το live — Αναφορά στη sold-out εμφάνιση στο Piraeus 117 Academy, γιορτάζοντας τη δεκαετία καριέρας.

Κάθε κεφάλαιο: μεγάλος αριθμός/τίτλος κεφαλαίου, σύντομο editorial κείμενο, υποστηρικτική εικόνα με parallax.

3.5 Community (Fan feed)

Feed-style σελίδα (σαν ελαφρύ social feed) με:

Posts από τον Toquel/την ομάδα (κείμενο + προαιρετική εικόνα, timestamp), read-only για τους fans, εμφανίζονται σε αντίστροφη χρονολογική σειρά.

Polls: κάρτα με ερώτηση + επιλογές, οι fans πατάνε για να ψηφίσουν (μία ψήφος ανά χρήστη/browser session — χρησιμοποίησε localStorage ή ανώνυμο Supabase auth session id για να αποτρέψεις πολλαπλή ψήφο), live progress bars με ποσοστά μετά την ψήφο.

Q&A section (θεμελίωσε τη δομή στη βάση δεδομένων ώστε να ενεργοποιηθεί εύκολα αργότερα από το admin, ακόμα κι αν αρχικά είναι κενή/hidden).

Καθαρό, minimal feed design σε ασπρόμαυρο στυλ (όχι σαν Instagram/Facebook clone — κράτα το editorial ύφος του υπόλοιπου site).

Χωρίς δυνατότητα στους fans να γράφουν δικά τους posts (μόνο consumption + ψήφος σε polls).

4. Admin Panel (/admin)

Route αόρατο από το UI — προσβάσιμο μόνο αν κάποιος πληκτρολογήσει /admin απευθείας.

Authentication: Supabase Auth (email + password), με λογαριασμό/administrator που ορίζεται εγώ χειροκίνητα μέσα από το Supabase dashboard (όχι δημόσια εγγραφή / sign-up φόρμα). Το /admin route πρέπει να προστατεύεται (protected route/redirect σε login αν δεν υπάρχει ενεργή authenticated session).

Μετά το login, dashboard με tabs/sections:

Shows management: CRUD (create/read/update/delete) για επερχόμενες εμφανίσεις — πεδία: ημερομηνία, ώρα, venue, πόλη, map_link (URL χάρτη), tickets_link (URL εισιτηρίων). Λίστα με δυνατότητα edit/delete, φόρμα προσθήκης νέας εμφάνισης.

Community management:

Δημιουργία/επεξεργασία/διαγραφή feed posts.

Δημιουργία polls (ερώτηση + 2-6 επιλογές), δυνατότητα ενεργοποίησης/απενεργοποίησης poll, προβολή live αποτελεσμάτων ψηφοφορίας σε πίνακα/γράφημα μέσα στο admin.

Βασική δομή για Q&A entries (ερώτηση fan/status/απάντηση) — έστω minimal CRUD, ώστε να είναι έτοιμο να επεκταθεί αργότερα.

(Προαιρετικό μελλοντικό tab, απλά ετοίμασε το layout ώστε να μπορεί να προστεθεί εύκολα): music/albums management.

Σχεδίαση admin panel σε καθαρό, λειτουργικό dashboard στυλ (πίνακες, φόρμες), ίδια ασπρόμαυρη αισθητική αλλά πιο "εργαλειακή" — λιγότερα εφέ, focus στη λειτουργικότητα.

5. Δεδομένα & Backend (Supabase)

Πρότεινε/δημιούργησε tables κάπως έτσι:

shows: id, date, time, venue, city, map_link, tickets_link, created_at

albums: id, title, slug, cover_url, release_year, type (album/EP/single)

songs: id, album_id (nullable για standalone singles), title, track_number, duration, spotify_url

community_posts: id, content, image_url, created_at

polls: id, question, is_active, created_at

poll_options: id, poll_id, option_text, vote_count

poll_votes: id, poll_id, voter_session_id, option_id, created_at (για αποφυγή διπλής ψήφου)

qna: id, question, answer, status (pending/answered), created_at

Row Level Security: public read σε shows/albums/songs/community_posts/polls/poll_options· write μόνο για authenticated admin· poll_votes: insert επιτρέπεται σε public αλλά με constraint που αποτρέπει duplicate vote ανά session/poll.

6. Τεχνικές απαιτήσεις

Πλήρως responsive/mobile-first, tested breakpoints: mobile, tablet, desktop.

Γρήγορο loading — lazy load εικόνων, optimized assets.

SEO-friendly βασικά meta tags ανά σελίδα (τίτλος, description, OG image).

Καθαρός, semantic κώδικας, χωρίς περιττά default UI-kit στοιχεία που "μυρίζουν" AI-generated template.

Προσβασιμότητα: επαρκές contrast (μαύρο/άσπρο βοηθάει), focus states σε interactive στοιχεία, alt text σε εικόνες.

Ξεκίνα φτιάχνοντας πρώτα το design system + Home page + hamburger navigation, μετά προχώρα στις υπόλοιπες σελίδες, και τελευταίο το admin panel με Supabase auth.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/847fc200-7db5-45dc-9186-9e6804036b25).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
