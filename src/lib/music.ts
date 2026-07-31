/** Link for any track: uses the stored Spotify URL, else a Spotify search. */
export function spotifyTrackUrl(title: string, spotifyUrl?: string | null) {
  if (spotifyUrl) return spotifyUrl;
  return `https://open.spotify.com/search/${encodeURIComponent(`Toquel ${title}`)}`;
}

export function spotifyAlbumUrl(title: string) {
  return `https://open.spotify.com/search/${encodeURIComponent(`Toquel ${title}`)}`;
}

export const GREEK_MONTHS = [
  "Ιαν",
  "Φεβ",
  "Μαρ",
  "Απρ",
  "Μαΐ",
  "Ιουν",
  "Ιουλ",
  "Αυγ",
  "Σεπ",
  "Οκτ",
  "Νοε",
  "Δεκ",
];

export function formatShowDate(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: GREEK_MONTHS[d.getMonth()] ?? "",
    year: d.getFullYear(),
  };
}
