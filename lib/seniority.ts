import type { Seniority } from "@/types/candidate";

export const SENIORITY_BADGE_CLASS: Record<Seniority, string> = {
    Junior: "bg-[#ceeedd] text-[#1a6b3c] border border-[#9dd4b4]",
    Mid:    "bg-[#c8dff5] text-[#1a5899] border border-[#90bfe8]",
    Senior: "bg-[#fde0b8] text-[#88400e] border border-[#f5be82]",
    Staff:  "bg-[#e2d0f5] text-[#5a2490] border border-[#c49fe0]",
};

export function getSeniorityClasses(seniority: string): string {
    if (seniority in SENIORITY_BADGE_CLASS) {
        return SENIORITY_BADGE_CLASS[seniority as Seniority];
    }
    return "bg-[#f0ece6] text-text-secondary border border-border";
}