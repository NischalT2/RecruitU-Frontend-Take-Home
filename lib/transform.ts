import { Candidate, RandomUserResult, Seniority } from "@/types/candidate";
import { SKILLS } from "./constants/skills";
import { DEGREES } from "./constants/degree";

const COMPANIES = [
    "Google",
    "Facebook",
    "Amazon",
    "Microsoft",
    "Apple",
    "IBM",
    "Netflix",
    "Airbnb",
    "Uber",
    "Lyft",
    "DoorDash",
    "Spotify",
];

const EDUCATION = [
    "Harvard University",
    "Stanford University",
    "MIT",
    "UC Berkeley",
    "Carnegie Mellon University",
    "New York University",
    "UNC Chapel Hill",
    "Princeton University",
    "Cornell University",
    "UC Los Angeles",
    "UMass Amherst",
    "University of Virginia"
];

/** Shuffles and returns a random subset of the array of length count */
function getRandom(array: string[], count: number) {
    return array.sort(() => Math.random() - 0.5).slice(0, count);
}

/** Returns a random subset of skills based on the seniority */
function getSkills(seniority: Seniority) {
    if (seniority === "Junior") return getRandom(SKILLS, 2);
    if (seniority === "Mid") return getRandom(SKILLS, 3);
    if (seniority === "Senior") return getRandom(SKILLS, 4);
    return getRandom(SKILLS, 5);
}

/** Returns a random subset of companies based on the seniority */
function getPreviousCompanies(seniority: Seniority) {
    if (seniority === "Junior") return getRandom(COMPANIES, 1);
    if (seniority === "Mid") return getRandom(COMPANIES, 2);
    if (seniority === "Senior") return getRandom(COMPANIES, 3);
    return getRandom(COMPANIES, 4);
}

/** Returns a random seniority based on the number of years of experience */
function getSeniority(years: number): Seniority {
    if (years <= 1) return "Junior";
    if (years > 1 && years <= 3) return "Mid";
    if (years > 3 &&years <= 5) return "Senior";
    return "Staff";
}

/** Transforms a RandomUserResult into a Candidate */
export function transformCandidate(candidate: RandomUserResult): Candidate {
    /** Randomly generate the number of years of experience */
    const experience = Math.floor(Math.random() * 7);
    const seniority = getSeniority(experience);

    return {
        id: candidate.login.uuid,
        name: `${candidate.name.first} ${candidate.name.last}`,
        email: candidate.email,
        phone: candidate.phone,
        avatarUrl: candidate.picture.large,
        city: candidate.location.city,
        region: candidate.location.state,
        country: candidate.location.country,
        experience: experience,
        seniority: seniority,
        skills: getSkills(seniority),
        previousCompanies: getPreviousCompanies(seniority),
        education: getRandom(EDUCATION, 1)[0],
        degree: getRandom(DEGREES, 1)[0]
    };
}