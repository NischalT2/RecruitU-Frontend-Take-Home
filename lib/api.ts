import { transformCandidate } from "./transform";

export async function fetchCandidates(){
    // Fetch the candidates from the randomuser.me API
    const res = await fetch("https://randomuser.me/api/?seed=recruitu-takehome&results=50");
    if (!res.ok) {
        throw new Error("Failed to fetch candidates");
    }

    // Transform the data into candidates
    const data = await res.json();
    return data.results.map(transformCandidate);
}