import type { Candidate, FilterState, Seniority } from "@/types/candidate";

export function filterCandidates(candidates: Candidate[], filters: FilterState) {
    return candidates.filter((candidate) => {
        const matchesSearch = filters.search === "" || candidate.name.toLowerCase().includes(filters.search.toLowerCase());
        const matchesSeniority = filters.seniority.length === 0 || filters.seniority.includes(candidate.seniority as Seniority);
        const matchesCountries = filters.countries.length === 0 || filters.countries.includes(candidate.country);
        const matchesSkills = filters.skills.length === 0 || filters.skills.every((skill) => candidate.skills.includes(skill));
        const matchesDegree = filters.degree.length === 0 || filters.degree.includes(candidate.degree);

        return matchesSearch && matchesSeniority && matchesSkills && matchesCountries && matchesDegree;
    });
}