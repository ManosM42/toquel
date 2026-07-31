import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { showsQuery, postsQuery, pollsQuery, qnaQuery, type Show } from "@/lib/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Διαχείριση — TOQUEL" },
      { name: "description", content: "Ιδιωτικό περιβάλλον διαχείρισης περιεχομένου." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Διαχείριση — TOQUEL" },
      { property: "og:description", content: "Ιδιωτικό περιβάλλον διαχείρισης." },
    ],
  }),
  component: AdminPage,
});

const inputCls =
  "w-full border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-foreground";
const btnCls =
  "border border-foreground px-4 py-2 text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 hover:bg-foreground hover:text-background disabled:opacity-40";
const ghostBtn =
  "border border-border px-3 py-1.5 text-[11px] tracking-[0.18em] uppercase text-muted-foreground transition-colors hover:border-foreground hover:text-foreground";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border p-5 md:p-7">
      <h2 className="text-sm tracking-[0.22em] uppercase">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return <Shell><p className="text-sm text-muted-foreground">Έλεγχος σύνδεσης…</p></Shell>;
  if (!session) return <LoginView />;
  return <Dashboard session={session} />;
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen px-5 py-16 md:px-10">{children}</div>;
}

function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast("Λάθος στοιχεία σύνδεσης.");
  };

  return (
    <Shell>
      <div className="mx-auto max-w-sm pt-16">
        <p className="kicker">Ιδιωτική περιοχή</p>
        <h1 className="display mt-3 text-4xl">Σύνδεση</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="kicker">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputCls} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="password" className="kicker">
              Κωδικός
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} mt-2`}
            />
          </div>
          <button type="submit" disabled={busy} className={btnCls}>
            {busy ? "Σύνδεση…" : "Σύνδεση"}
          </button>
        </form>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Οι λογαριασμοί διαχειριστών δημιουργούνται χειροκίνητα. Δεν υπάρχει δημόσια εγγραφή.
        </p>
      </div>
    </Shell>
  );
}

const TABS = ["shows", "posts", "polls", "qna", "music"] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, string> = {
  shows: "Εμφανίσεις",
  posts: "Posts",
  polls: "Ψηφοφορίες",
  qna: "Q&A",
  music: "Μουσική",
};

function Dashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<Tab>("shows");
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", session.user.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();
      return Boolean(data);
    },
  });

  if (isLoading) return <Shell><p className="text-sm text-muted-foreground">Φόρτωση…</p></Shell>;

  return (
    <Shell>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="kicker">TOQUEL · Διαχείριση</p>
          <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <button type="button" className={ghostBtn} onClick={() => supabase.auth.signOut()}>
          Αποσύνδεση
        </button>
      </header>

      {!isAdmin ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Ο λογαριασμός σου δεν έχει δικαιώματα διαχειριστή.
        </p>
      ) : (
        <>
          <nav className="mt-6 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  tab === t
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {TAB_LABEL[t]}
              </button>
            ))}
          </nav>

          <div className="mt-8 space-y-8">
            {tab === "shows" ? <ShowsAdmin /> : null}
            {tab === "posts" ? <PostsAdmin /> : null}
            {tab === "polls" ? <PollsAdmin /> : null}
            {tab === "qna" ? <QnaAdmin /> : null}
            {tab === "music" ? (
              <Panel title="Μουσική">
                <p className="text-sm text-muted-foreground">
                  Η διαχείριση άλμπουμ και τραγουδιών θα προστεθεί εδώ. Τα δεδομένα υπάρχουν ήδη
                  στη βάση (albums, songs) και ενημερώνονται χωρίς αλλαγή κώδικα.
                </p>
              </Panel>
            ) : null}
          </div>
        </>
      )}
    </Shell>
  );
}

/* ---------------- SHOWS ---------------- */

const emptyShow = {
  date: "",
  time: "",
  venue: "",
  city: "",
  map_link: "",
  tickets_link: "",
};

function ShowsAdmin() {
  const qc = useQueryClient();
  const { data: shows } = useQuery(showsQuery("all"));
  const [form, setForm] = useState({ ...emptyShow });
  const [editId, setEditId] = useState<string | null>(null);

  const reset = () => {
    setForm({ ...emptyShow });
    setEditId(null);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        date: form.date,
        time: form.time || null,
        venue: form.venue,
        city: form.city,
        map_link: form.map_link || null,
        tickets_link: form.tickets_link || null,
      };
      const { error } = editId
        ? await supabase.from("shows").update(payload).eq("id", editId)
        : await supabase.from("shows").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast(editId ? "Η εμφάνιση ενημερώθηκε." : "Η εμφάνιση προστέθηκε.");
      reset();
      qc.invalidateQueries({ queryKey: ["shows"] });
    },
    onError: () => toast("Η αποθήκευση απέτυχε."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shows").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast("Διαγράφηκε.");
      qc.invalidateQueries({ queryKey: ["shows"] });
    },
  });

  const edit = (s: Show) => {
    setEditId(s.id);
    setForm({
      date: s.date,
      time: s.time ?? "",
      venue: s.venue,
      city: s.city,
      map_link: s.map_link ?? "",
      tickets_link: s.tickets_link ?? "",
    });
  };

  return (
    <>
      <Panel title={editId ? "Επεξεργασία εμφάνισης" : "Νέα εμφάνιση"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          {[
            { k: "date", l: "Ημερομηνία", type: "date", required: true },
            { k: "time", l: "Ώρα", type: "text", required: false },
            { k: "venue", l: "Venue", type: "text", required: true },
            { k: "city", l: "Πόλη", type: "text", required: true },
            { k: "map_link", l: "Link χάρτη", type: "url", required: false },
            { k: "tickets_link", l: "Link εισιτηρίων", type: "url", required: false },
          ].map((f) => (
            <div key={f.k}>
              <label className="kicker" htmlFor={`show-${f.k}`}>
                {f.l}
              </label>
              <input
                id={`show-${f.k}`}
                type={f.type}
                required={f.required}
                value={form[f.k as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                className={`${inputCls} mt-2`}
              />
            </div>
          ))}
          <div className="flex items-end gap-3">
            <button type="submit" disabled={save.isPending} className={btnCls}>
              {editId ? "Ενημέρωση" : "Προσθήκη"}
            </button>
            {editId ? (
              <button type="button" className={ghostBtn} onClick={reset}>
                Άκυρο
              </button>
            ) : null}
          </div>
        </form>
      </Panel>

      <Panel title="Όλες οι εμφανίσεις">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              <tr className="border-b border-border">
                <th className="py-2 pr-4">Ημ/νία</th>
                <th className="py-2 pr-4">Venue</th>
                <th className="py-2 pr-4">Πόλη</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {(shows ?? []).map((s) => (
                <tr key={s.id} className="border-b border-border">
                  <td className="py-3 pr-4 tabular-nums">
                    {s.date} {s.time ?? ""}
                  </td>
                  <td className="py-3 pr-4">{s.venue}</td>
                  <td className="py-3 pr-4">{s.city}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <button type="button" className={ghostBtn} onClick={() => edit(s)}>
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className={ghostBtn}
                      onClick={() => remove.mutate(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(shows ?? []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-muted-foreground">
                    Καμία εμφάνιση.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

/* ---------------- POSTS ---------------- */

function PostsAdmin() {
  const qc = useQueryClient();
  const { data: posts } = useQuery(postsQuery());
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { content, image_url: imageUrl || null };
      const { error } = editId
        ? await supabase.from("community_posts").update(payload).eq("id", editId)
        : await supabase.from("community_posts").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast("Αποθηκεύτηκε.");
      setContent("");
      setImageUrl("");
      setEditId(null);
      qc.invalidateQueries({ queryKey: ["community_posts"] });
    },
    onError: () => toast("Η αποθήκευση απέτυχε."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("community_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["community_posts"] }),
  });

  return (
    <>
      <Panel title={editId ? "Επεξεργασία post" : "Νέο post"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="kicker" htmlFor="post-content">
              Κείμενο
            </label>
            <textarea
              id="post-content"
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`${inputCls} mt-2`}
            />
          </div>
          <div>
            <label className="kicker" htmlFor="post-image">
              URL εικόνας (προαιρετικό)
            </label>
            <input
              id="post-image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={`${inputCls} mt-2`}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className={btnCls} disabled={save.isPending}>
              {editId ? "Ενημέρωση" : "Δημοσίευση"}
            </button>
            {editId ? (
              <button
                type="button"
                className={ghostBtn}
                onClick={() => {
                  setEditId(null);
                  setContent("");
                  setImageUrl("");
                }}
              >
                Άκυρο
              </button>
            ) : null}
          </div>
        </form>
      </Panel>

      <Panel title="Posts">
        <ul className="divide-y divide-border">
          {(posts ?? []).map((p) => (
            <li key={p.id} className="flex items-start justify-between gap-6 py-4">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {new Date(p.created_at).toLocaleString("el-GR")}
                </p>
                <p className="mt-1 text-sm">{p.content}</p>
              </div>
              <div className="shrink-0 space-x-2">
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={() => {
                    setEditId(p.id);
                    setContent(p.content);
                    setImageUrl(p.image_url ?? "");
                  }}
                >
                  Edit
                </button>
                <button type="button" className={ghostBtn} onClick={() => remove.mutate(p.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/* ---------------- POLLS ---------------- */

function PollsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery(pollsQuery(false));
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const create = useMutation({
    mutationFn: async () => {
      const clean = options.map((o) => o.trim()).filter(Boolean);
      if (clean.length < 2) throw new Error("min");
      const { data: poll, error } = await supabase
        .from("polls")
        .insert({ question })
        .select("id")
        .single();
      if (error) throw error;
      const { error: e2 } = await supabase.from("poll_options").insert(
        clean.map((option_text, i) => ({ poll_id: poll.id, option_text, position: i })),
      );
      if (e2) throw e2;
    },
    onSuccess: () => {
      toast("Η ψηφοφορία δημιουργήθηκε.");
      setQuestion("");
      setOptions(["", ""]);
      qc.invalidateQueries({ queryKey: ["polls"] });
    },
    onError: () => toast("Χρειάζονται τουλάχιστον 2 επιλογές."),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("polls").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["polls"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("polls").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["polls"] }),
  });

  return (
    <>
      <Panel title="Νέα ψηφοφορία">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <label className="kicker" htmlFor="poll-q">
              Ερώτηση
            </label>
            <input
              id="poll-q"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`${inputCls} mt-2`}
            />
          </div>
          <div className="space-y-2">
            <p className="kicker">Επιλογές (2–6)</p>
            {options.map((o, i) => (
              <input
                key={i}
                value={o}
                placeholder={`Επιλογή ${i + 1}`}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                className={inputCls}
              />
            ))}
            {options.length < 6 ? (
              <button
                type="button"
                className={ghostBtn}
                onClick={() => setOptions([...options, ""])}
              >
                + Επιλογή
              </button>
            ) : null}
          </div>
          <button type="submit" className={btnCls} disabled={create.isPending}>
            Δημιουργία
          </button>
        </form>
      </Panel>

      <Panel title="Ψηφοφορίες & αποτελέσματα">
        <div className="space-y-8">
          {(data?.polls ?? []).map((p) => {
            const opts = (data?.options ?? []).filter((o) => o.poll_id === p.id);
            const total = opts.reduce((s, o) => s + o.vote_count, 0) || 1;
            return (
              <div key={p.id} className="border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm">{p.question}</p>
                  <div className="space-x-2">
                    <button
                      type="button"
                      className={ghostBtn}
                      onClick={() => toggle.mutate({ id: p.id, active: !p.is_active })}
                    >
                      {p.is_active ? "Απενεργοποίηση" : "Ενεργοποίηση"}
                    </button>
                    <button type="button" className={ghostBtn} onClick={() => remove.mutate(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <table className="mt-4 w-full text-left text-sm">
                  <tbody>
                    {opts.map((o) => (
                      <tr key={o.id} className="border-t border-border">
                        <td className="py-2">{o.option_text}</td>
                        <td className="w-1/2 py-2">
                          <div className="h-1 w-full bg-surface-2">
                            <div
                              className="h-1 bg-foreground"
                              style={{ width: `${Math.round((o.vote_count / total) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2 text-right tabular-nums text-muted-foreground">
                          {o.vote_count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

/* ---------------- QNA ---------------- */

function QnaAdmin() {
  const qc = useQueryClient();
  const { data: entries } = useQuery(qnaQuery());
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("qna").insert({ question });
      if (error) throw error;
    },
    onSuccess: () => {
      setQuestion("");
      qc.invalidateQueries({ queryKey: ["qna"] });
    },
    onError: () => toast("Αποτυχία."),
  });

  const answer = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const { error } = await supabase
        .from("qna")
        .update({ answer: text, status: text ? "answered" : "pending" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast("Αποθηκεύτηκε.");
      qc.invalidateQueries({ queryKey: ["qna"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("qna").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["qna"] }),
  });

  return (
    <>
      <Panel title="Νέα ερώτηση">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate();
          }}
          className="flex flex-col gap-3 md:flex-row"
        >
          <input
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ερώτηση fan"
            className={inputCls}
          />
          <button type="submit" className={btnCls}>
            Προσθήκη
          </button>
        </form>
      </Panel>

      <Panel title="Q&A">
        <ul className="space-y-5">
          {(entries ?? []).map((q) => (
            <li key={q.id} className="border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm">{q.question}</p>
                <span className="text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {q.status}
                </span>
              </div>
              <textarea
                rows={2}
                defaultValue={q.answer ?? ""}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                placeholder="Απάντηση"
                className={`${inputCls} mt-3`}
              />
              <div className="mt-3 space-x-2">
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={() => answer.mutate({ id: q.id, text: answers[q.id] ?? q.answer ?? "" })}
                >
                  Αποθήκευση
                </button>
                <button type="button" className={ghostBtn} onClick={() => remove.mutate(q.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
          {(entries ?? []).length === 0 ? (
            <li className="text-sm text-muted-foreground">Καμία εγγραφή.</li>
          ) : null}
        </ul>
      </Panel>
    </>
  );
}
