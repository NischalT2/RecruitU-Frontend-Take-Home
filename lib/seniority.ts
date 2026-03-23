import type { Seniority } from "@/types/candidate";

// Seniority badge classes
export const SENIORITY_BADGE_CLASS: Record<Seniority, string> = {
    Junior: "bg-emerald-100 text-emerald-500 border border-emerald-200 rounded-full",
    Mid: "bg-sky-100 text-sky-500 border border-sky-200 rounded-full",
    Senior: "bg-amber-100 text-amber-500 border border-amber-200 rounded-full",
    Staff: "bg-violet-100 text-violet-500 border border-violet-200 rounded-full",
};

// Returns the seniority badge class for the given seniority
export function getSeniorityClasses(seniority: string): string {
    if (seniority in SENIORITY_BADGE_CLASS) {
        return SENIORITY_BADGE_CLASS[seniority as Seniority];
    }
    return "bg-gray-100 text-gray-800 border border-gray-200 rounded-full";
}
