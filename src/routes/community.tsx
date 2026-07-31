import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import {
  getVotedOption,
  getVoterId,
  pollsQuery,
  postsQuery,
  qnaQuery,
  rememberVote,
  type PollOption,
} from "@/lib/data";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "TOQUEL — Community: Feed, Polls & Q&A" },
      {
        name: "description",
        content:
          "Ανακοινώσεις από την ομάδα του TOQUEL, ψηφοφορίες για τους fans και απαντήσεις σε ερωτήσεις.",
      },
      { property: "og:title", content: "TOQUEL — Community" },
      { property: "og:description", content: "Μπες στην κοινότητα: posts, polls και Q&A." },
    ],
  }),
  component: CommunityPage,
});

function PollCard({ pollId, question, options }: { pollId: string; question: string; options: PollOption[] }) {
  const qc = useQueryClient();
  const [voted, setVoted] = useState<string | null>(null);

  useEffect(() => {
    setVoted(getVotedOption(pollId));
  }, [pollId]);

  const vote = useMutation({
    mutationFn: async (optionId: string) => {
      const { error } = await supabase.from("poll_votes").insert({
        poll_id: pollId,
        option_id: optionId,
        voter_session_id: getVoterId(),
      });
      if (error) throw error;
      return optionId;
    },
    onSuccess: (optionId) => {
      rememberVote(pollId, optionId);
      setVoted(optionId);
      qc.invalidateQueries({ queryKey: ["polls"] });
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("duplicate") || msg.includes("unique")) {
        toast("Έχεις ήδη ψηφίσει σε αυτή την ψηφοφορία.");
        setVoted("done");
      } else {
        toast("Κάτι πήγε στραβά. Δοκίμασε ξανά.");
      }
    },
  });

  const total = options.reduce((s, o) => s + o.vote_count, 0) || 1;

  return (
    <div className="border-b border-border py-8">
      <p className="kicker">Ψηφοφορία</p>
      <h3 className="mt-3 text-xl leading-snug md:text-2xl">{question}</h3>
      <ul className="mt-6 space-y-3">
        {options.map((o) => {
          const pct = Math.round((o.vote_count / total) * 100);
          const isChoice = voted === o.id;
          return (
            <li key={o.id}>
              {voted ? (
                <div className="relative border border-border px-4 py-3">
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-surface-2 transition-[width] duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                  <div className="relative flex items-center justify-between text-sm">
                    <span className={isChoice ? "font-medium" : ""}>
                      {o.option_text}
                      {isChoice ? " ·" : ""}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{pct}%</span>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={vote.isPending}
                  onClick={() => vote.mutate(o.id)}
                  className="w-full border border-border px-4 py-3 text-left text-sm transition-colors duration-500 hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  {o.option_text}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {voted ? (
        <p className="mt-4 text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          {total} ψήφοι
        </p>
      ) : null}
    </div>
  );
}

function CommunityPage() {
  const { data: posts, isLoading } = useQuery(postsQuery());
  const { data: pollData } = useQuery(pollsQuery(true));
  const { data: qna } = useQuery(qnaQuery());

  const answered = (qna ?? []).filter((q) => q.status === "answered" && q.answer);

  return (
    <>
      <section className="px-5 pt-32 pb-12 md:px-10 md:pt-48 md:pb-20">
        <Reveal>
          <p className="kicker">Fan feed</p>
          <h1 className="display mt-5 text-[20vw] leading-[0.8] md:text-[11vw]">Community</h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Ανακοινώσεις από την ομάδα, ψηφοφορίες και απαντήσεις. Διαβάζεις και ψηφίζεις — τίποτα
            παραπάνω, τίποτα λιγότερο.
          </p>
        </Reveal>
      </section>

      <section className="grid gap-x-12 px-5 pb-24 md:grid-cols-12 md:px-10 md:pb-40">
        <div className="md:col-span-7">
          <p className="kicker">Feed</p>
          <ul className="mt-6 border-t border-border">
            {isLoading ? <li className="py-8 text-sm text-muted-foreground">Φόρτωση…</li> : null}
            {(posts ?? []).map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 70} className="border-b border-border py-8">
                <p className="kicker">
                  {new Date(p.created_at).toLocaleDateString("el-GR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-3 text-lg leading-relaxed whitespace-pre-line md:text-xl">
                  {p.content}
                </p>
                {p.image_url ? (
                  <div className="media-zoom mt-6 overflow-hidden">
                    <img
                      src={p.image_url}
                      alt=""
                      loading="lazy"
                      className="w-full object-cover grayscale"
                    />
                  </div>
                ) : null}
              </Reveal>
            ))}
            {!isLoading && (posts ?? []).length === 0 ? (
              <li className="py-12 text-sm text-muted-foreground">Δεν υπάρχουν posts ακόμα.</li>
            ) : null}
          </ul>
        </div>

        <aside className="mt-16 md:col-span-5 md:mt-0">
          <p className="kicker">Πες τη γνώμη σου</p>
          <div className="mt-6 border-t border-border">
            {(pollData?.polls ?? []).map((p) => (
              <PollCard
                key={p.id}
                pollId={p.id}
                question={p.question}
                options={(pollData?.options ?? []).filter((o) => o.poll_id === p.id)}
              />
            ))}
            {(pollData?.polls ?? []).length === 0 ? (
              <p className="py-8 text-sm text-muted-foreground">Καμία ενεργή ψηφοφορία.</p>
            ) : null}
          </div>

          {answered.length > 0 ? (
            <div className="mt-16">
              <p className="kicker">Q&amp;A</p>
              <dl className="mt-6 border-t border-border">
                {answered.map((q) => (
                  <div key={q.id} className="border-b border-border py-6">
                    <dt className="text-base leading-snug">{q.question}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{q.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </aside>
      </section>
    </>
  );
}
