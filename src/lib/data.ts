import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Show = {
  id: string;
  date: string;
  time: string | null;
  venue: string;
  city: string;
  map_link: string | null;
  tickets_link: string | null;
};

export type Album = {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  release_year: number;
  type: string;
  notes: string | null;
};

export type Song = {
  id: string;
  album_id: string | null;
  title: string;
  track_number: number | null;
  duration: string | null;
  spotify_url: string | null;
  release_year: number | null;
};

export type Post = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export type Poll = {
  id: string;
  question: string;
  is_active: boolean;
  created_at: string;
};

export type PollOption = {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
  position: number;
};

export type QnaEntry = {
  id: string;
  question: string;
  answer: string | null;
  status: string;
  created_at: string;
};

const today = () => new Date().toISOString().slice(0, 10);

export const showsQuery = (scope: "upcoming" | "past" | "all" = "all") =>
  queryOptions({
    queryKey: ["shows", scope],
    queryFn: async (): Promise<Show[]> => {
      let q = supabase.from("shows").select("*");
      if (scope === "upcoming") q = q.gte("date", today()).order("date", { ascending: true });
      else if (scope === "past") q = q.lt("date", today()).order("date", { ascending: false });
      else q = q.order("date", { ascending: true });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Show[];
    },
  });

export const albumsQuery = () =>
  queryOptions({
    queryKey: ["albums"],
    queryFn: async (): Promise<Album[]> => {
      const { data, error } = await supabase
        .from("albums")
        .select("*")
        .order("release_year", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Album[];
    },
  });

export const songsQuery = () =>
  queryOptions({
    queryKey: ["songs"],
    queryFn: async (): Promise<Song[]> => {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("track_number", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Song[];
    },
  });

export const postsQuery = () =>
  queryOptions({
    queryKey: ["community_posts"],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

export const pollsQuery = (onlyActive = true) =>
  queryOptions({
    queryKey: ["polls", onlyActive],
    queryFn: async (): Promise<{ polls: Poll[]; options: PollOption[] }> => {
      let pq = supabase.from("polls").select("*").order("created_at", { ascending: false });
      if (onlyActive) pq = pq.eq("is_active", true);
      const [{ data: polls, error: e1 }, { data: options, error: e2 }] = await Promise.all([
        pq,
        supabase.from("poll_options").select("*").order("position", { ascending: true }),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return { polls: (polls ?? []) as Poll[], options: (options ?? []) as PollOption[] };
    },
  });

export const qnaQuery = () =>
  queryOptions({
    queryKey: ["qna"],
    queryFn: async (): Promise<QnaEntry[]> => {
      const { data, error } = await supabase
        .from("qna")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as QnaEntry[];
    },
  });

const VOTER_KEY = "toquel_voter_id";

export function getVoterId() {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VOTER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VOTER_KEY, id);
  }
  return id;
}

export function getVotedOption(pollId: string) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(`toquel_vote_${pollId}`);
}

export function rememberVote(pollId: string, optionId: string) {
  window.localStorage.setItem(`toquel_vote_${pollId}`, optionId);
}
