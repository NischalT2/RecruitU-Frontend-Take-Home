import type { Candidate, CandidateCardProps, Seniority } from "@/types/candidate";
import Image from "next/image";

const seniorityBadgeClass: Record<Seniority, string> = {
    Junior: "bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full",
    Mid: "bg-sky-100 text-sky-800 border border-sky-200 rounded-full",
    Senior: "bg-amber-100 text-amber-800 border border-amber-200 rounded-full",
    Staff: "bg-violet-100 text-violet-800 border border-violet-200 rounded-full",
}

const MAX_SKILLS = 3;
const MAX_COMPANIES = 2;

function seniorityClasses(s: string): string {
    if (s === "Junior" || s === "Mid" || s === "Senior" || s === "Staff") {
      return seniorityBadgeClass[s];
    }
    return "bg-gray-100 text-gray-800 border border-gray-200";
}


export default function CandidateCard({ candidate }: CandidateCardProps) {
    const visibleSkills = candidate.skills.slice(0, MAX_SKILLS);
    const extraSkills = Math.max(0, candidate.skills.length - MAX_SKILLS);
    const visibleCompanies = candidate.previousCompanies.slice(0, MAX_COMPANIES);
    const extraCompanies = Math.max(0, candidate.previousCompanies.length - MAX_COMPANIES);

    return (
        <div className="border rounded-2xl flex flex-col cursor-pointer p-4 h-full hover:shadow-md transition-all duration-300 gap-y-4">
            <div className="flex justify-between items-start gap-4">
                <Image src={candidate.avatarUrl} alt={candidate.name} width={100} height={100} className="rounded-full object-cover" />
                <div>
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                    <p className="text-sm text-gray-500">{candidate.city}, {candidate.country}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-2">
                    {visibleCompanies.map((company) => (
                        <span key={company} className="text-sm bg-gray-200 rounded-full p-2">
                            {company}
                        </span>
                    ))}
                </div>
                {extraCompanies > 0 && (
                    <span className="text-sm bg-gray-200 rounded-full p-2">
                        + {extraCompanies} more
                    </span>
                )}
            </div>
            <div className={"flex items-center"}>
                <div className={seniorityClasses(candidate.seniority)}>
                    <span className={"text-sm text-gray-500 p-2"}>
                        {candidate.seniority} • {candidate.experience} years of experience
                    </span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 items-start min-h-24">
                <div className="flex flex-wrap gap-2">
                {visibleSkills.map((skill) => (
                    <span key={skill} className="text-sm bg-gray-200 rounded-full p-2">
                        {skill}
                    </span>
                ))}
                </div>
                {extraSkills > 0 && (
                    <span className="text-sm bg-gray-200 rounded-full p-2">
                        + {extraSkills} more
                    </span>
                )}
            </div>
            <div className="flex justify-between">
                <button className="text-sm bg-gray-200 rounded-full p-2 cursor-pointer">
                    View Profile
                </button>
                <button className="text-sm bg-gray-200 rounded-full p-2 cursor-pointer">
                    Save
                </button>
            </div>

        </div>
    );
}