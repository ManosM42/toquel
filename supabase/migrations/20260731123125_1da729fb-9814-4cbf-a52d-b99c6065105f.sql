
-- ADMIN
CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read own row" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = _uid);
$$;

-- SHOWS
CREATE TABLE public.shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  time text,
  venue text NOT NULL,
  city text NOT NULL,
  map_link text,
  tickets_link text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shows TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shows TO authenticated;
GRANT ALL ON public.shows TO service_role;
ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read shows" ON public.shows FOR SELECT USING (true);
CREATE POLICY "admin write shows" ON public.shows FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ALBUMS
CREATE TABLE public.albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  cover_url text,
  release_year int NOT NULL,
  type text NOT NULL DEFAULT 'album',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.albums TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.albums TO authenticated;
GRANT ALL ON public.albums TO service_role;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read albums" ON public.albums FOR SELECT USING (true);
CREATE POLICY "admin write albums" ON public.albums FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- SONGS
CREATE TABLE public.songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid REFERENCES public.albums(id) ON DELETE CASCADE,
  title text NOT NULL,
  track_number int,
  duration text,
  spotify_url text,
  release_year int,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.songs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.songs TO authenticated;
GRANT ALL ON public.songs TO service_role;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read songs" ON public.songs FOR SELECT USING (true);
CREATE POLICY "admin write songs" ON public.songs FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- COMMUNITY POSTS
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.community_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "admin write posts" ON public.community_posts FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- POLLS
CREATE TABLE public.polls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.polls TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.polls TO authenticated;
GRANT ALL ON public.polls TO service_role;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read polls" ON public.polls FOR SELECT USING (true);
CREATE POLICY "admin write polls" ON public.polls FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.poll_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_text text NOT NULL,
  vote_count int NOT NULL DEFAULT 0,
  position int NOT NULL DEFAULT 0
);
GRANT SELECT ON public.poll_options TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.poll_options TO authenticated;
GRANT ALL ON public.poll_options TO service_role;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read options" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "admin write options" ON public.poll_options FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.poll_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id uuid NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  voter_session_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (poll_id, voter_session_id)
);
GRANT SELECT, INSERT ON public.poll_votes TO anon;
GRANT SELECT, INSERT ON public.poll_votes TO authenticated;
GRANT ALL ON public.poll_votes TO service_role;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read votes" ON public.poll_votes FOR SELECT USING (true);
CREATE POLICY "public insert votes" ON public.poll_votes FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.bump_vote_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.poll_options SET vote_count = vote_count + 1 WHERE id = NEW.option_id;
  RETURN NEW;
END; $$;
CREATE TRIGGER poll_votes_bump AFTER INSERT ON public.poll_votes FOR EACH ROW EXECUTE FUNCTION public.bump_vote_count();

-- QNA
CREATE TABLE public.qna (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.qna TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.qna TO authenticated;
GRANT ALL ON public.qna TO service_role;
ALTER TABLE public.qna ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read answered qna" ON public.qna FOR SELECT USING (status = 'answered');
CREATE POLICY "admin write qna" ON public.qna FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- SEED DISCOGRAPHY
INSERT INTO public.albums (title, slug, release_year, type, notes) VALUES
  ('10', '10', 2026, 'album', 'Κυκλοφόρησε 12 Μαρτίου 2026 — 10 χρόνια καριέρας. Global Spotify Top Albums Debut.'),
  ('Ilegal', 'ilegal', 2024, 'EP', 'EP με Fly Lo & Beyond.'),
  ('1111', '1111', 2023, 'album', 'Diamond. #1 για 50+ εβδομάδες. Τίτλος από τα γενέθλια της μητέρας του.'),
  ('Beverly Hills', 'beverly-hills', 2022, 'album', 'Diamond.'),
  ('777', '777', 2019, 'EP', 'Diamond — το πρώτο diamond EP στα ελληνικά charts.'),
  ('Λίγο Παραπάνω', 'ligo-parapano', 2015, 'album', 'Το πρώτο άλμπουμ.');

INSERT INTO public.songs (album_id, title, track_number)
SELECT a.id, t.title, t.n FROM public.albums a
JOIN (VALUES
  (1,'Prosopika Freestyle'),(2,'G63 (feat. Bloody Hawk)'),(3,'Monroe'),(4,'3:15'),
  (5,'Roran'),(6,'Lila'),(7,'Rack'),(8,'Fly Lo'),(9,'Diamonds'),(10,'Mama'),(11,'1111')
) AS t(n,title) ON a.slug = '1111';

INSERT INTO public.songs (album_id, title, track_number)
SELECT a.id, t.title, t.n FROM public.albums a
JOIN (VALUES (1,'Aftoktonia'),(2,'Forema'),(3,'Beverly Hills')) AS t(n,title) ON a.slug = 'beverly-hills';

INSERT INTO public.songs (album_id, title, track_number)
SELECT a.id, t.title, t.n FROM public.albums a
JOIN (VALUES (1,'777'),(2,'Trap'),(3,'Kako')) AS t(n,title) ON a.slug = '777';

INSERT INTO public.songs (album_id, title, track_number)
SELECT a.id, t.title, t.n FROM public.albums a
JOIN (VALUES (1,'Ilegal'),(2,'Cartel'),(3,'Bando')) AS t(n,title) ON a.slug = 'ilegal';

INSERT INTO public.songs (album_id, title, track_number)
SELECT a.id, t.title, t.n FROM public.albums a
JOIN (VALUES (1,'10'),(2,'Dekaetia'),(3,'Stars')) AS t(n,title) ON a.slug = '10';

INSERT INTO public.songs (title, release_year) VALUES
  ('Kokaina', 2021),('Rollie', 2021),('Carvajal', 2022),('OAED', 2020),
  ('OAED Remix (feat. Ivan Greko, BeTaf Beats)', 2020),('MCMG', 2021),('Prezi', 2020),
  ('Success Freestyle', 2021),('Stars', 2025),('Business', 2022),('Κουράστηκα', 2023);

INSERT INTO public.community_posts (content) VALUES
  ('Το «10» είναι έξω. 10 χρόνια, ένα άλμπουμ. Ευχαριστώ για όλα.'),
  ('Sold out στο Piraeus 117 Academy. Δεν ξεχνιέται αυτή η βραδιά.');

WITH p AS (
  INSERT INTO public.polls (question) VALUES ('Ποιο είναι το αγαπημένο σου άλμπουμ;') RETURNING id
)
INSERT INTO public.poll_options (poll_id, option_text, position)
SELECT p.id, t.txt, t.n FROM p, (VALUES (1,'1111'),(2,'Beverly Hills'),(3,'777'),(4,'10')) AS t(n,txt);
