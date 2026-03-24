import type { Candidate, FilterState, Seniority } from "@/types/candidate";

// Returns the filtered candidates based on the filters
export function filterCandidates(candidates: Candidate[], filters: FilterState, savedIds: ReadonlySet<string>) {
    return candidates.filter((candidate) => {
        const matchesSearch = filters.search === "" || candidate.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesSeniority = filters.seniority.length === 0 || filters.seniority.includes(candidate.seniority as Seniority);
        // uses an OR logic to check if any of the skills match
        const matchesSkills = filters.skills.length === 0 || filters.skills.some((skill) => candidate.skills.includes(skill));
        const matchesDegree = filters.degree.length === 0 || filters.degree.includes(candidate.degree);
        const matchesCountry = filters.countries.length === 0 || filters.countries.includes(candidate.country);
        const matchesSaved = !filters.saved || savedIds.has(candidate.id);

        return matchesSearch && matchesSeniority && matchesSkills && matchesDegree && matchesCountry && matchesSaved;
    });
}