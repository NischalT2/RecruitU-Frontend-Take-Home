import { fetchCandidates } from "@/lib/api";
import PageClient from "@/components/PageClient";

export default async function Home() {
  const candidates = await fetchCandidates();

  return (
    <PageClient initialCandidates={candidates} />
  );
}
