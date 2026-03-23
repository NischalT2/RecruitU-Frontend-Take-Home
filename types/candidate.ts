export type Seniority = "Junior" | "Mid" | "Senior" | "Staff";

/** Interface for the RandomUser API response */
export interface RandomUserResult {
    login: { uuid: string };
    name: { first: string; last: string };
    email: string;
    phone: string;
    picture: { large: string };
    location: { city: string; state: string; country: string };
}

/** Interface for a candidate */
export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    city: string;
    region: string;
    country: string;
    experience: number;
    seniority: string;
    skills: string[];
    previousCompanies: string[];
    education: string;
    degree: string;
}

/** Interface for the filter state */
export interface FilterState {
    search: string;
    seniority: Seniority[];
    countries: string[];
    skills: string[];
    degree: string[];
}

export interface FilterControlProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export interface CandidateCardProps {
    candidate: Candidate;
}

