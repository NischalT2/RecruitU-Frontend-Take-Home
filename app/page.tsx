import { fetchCandidates } from "@/lib/api";
import PageClient from "@/components/PageClient";

export default async function Home() {
  // fetch candidates from the API
  const candidates = await fetchCandidates();

  return (
    <PageClient initialCandidates={candidates} />
  );
}
