import coverTen from "@/assets/cover-10.jpg";
import cover1111 from "@/assets/cover-1111.jpg";
import coverBeverly from "@/assets/cover-beverly.jpg";
import cover777 from "@/assets/cover-777.jpg";
import coverIlegal from "@/assets/cover-ilegal.jpg";
import coverOrigins from "@/assets/story-origins.jpg";

const covers: Record<string, string> = {
  "10": coverTen,
  ilegal: coverIlegal,
  "1111": cover1111,
  "beverly-hills": coverBeverly,
  "777": cover777,
  "ligo-parapano": coverOrigins,
};

export function coverFor(slug: string | undefined, fallbackUrl?: string | null) {
  return (slug ? covers[slug] : undefined) ?? fallbackUrl ?? coverTen;
}
