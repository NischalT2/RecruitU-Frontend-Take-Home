"use client";
import type { Candidate } from "@/types/candidate";
import Image from "next/image";
import { Bookmark } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { getSeniorityClasses } from "@/lib/seniority";

// number of skills and companies shown in the card
const MAX_SKILLS = 2;
const MAX_COMPANIES = 2;

interface CandidateCardProps {
    candidate: Candidate;
    isSaved: boolean;
    toggleSaved: () => void;
    onOpenProfile: () => void;
}

export default function CandidateCard({ candidate, isSaved, toggleSaved, onOpenProfile }: CandidateCardProps) {
    // get skills and companies to show in the card
    const visibleSkills = candidate.skills.slice(0, MAX_SKILLS);
    const extraSkills = Math.max(0, candidate.skills.length - MAX_SKILLS);
    const visibleCompanies = candidate.previousCompanies.slice(0, MAX_COMPANIES);
    const extraCompanies = Math.max(0, candidate.previousCompanies.length - MAX_COMPANIES);

    return (
        <div className="overflow-hidden border border-border rounded-2xl flex flex-col cursor-pointer p-4 h-full min-h-[240px] bg-card hover:shadow-2xl hover:border-border/50 transition-all duration-300 gap-y-4">
            <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full sm:h-24 sm:w-24">
                    <Image src={candidate.avatarUrl} alt={candidate.name} fill sizes="96px" className="object-cover"/>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="min-w-0 truncate text-lg font-semibold text-text-primary">{candidate.name}</h3>
                    <p className="min-w-0 truncate text-sm text-text-tertiary">{candidate.city}, {candidate.country}</p>
                    <div className={`${getSeniorityClasses(candidate.seniority)} inline-flex w-fit rounded-full`}>
                        <span className="truncate min-w-0 px-2 py-1 text-xs sm:text-sm">
                            {candidate.seniority} • {candidate.experience} yrs
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center text-text-tertiary text-sm">
                <div className="flex flex-wrap gap-1">
                    Previously at
                    {visibleCompanies.map((company, index) => (
                        <span key={company}>
                            {company}
                            {index < visibleCompanies.length - 1 && ","}
                        </span>
                    ))}
                    {extraCompanies > 0 && (
                    <span>
                        and {extraCompanies} more
                    </span>
                )}
                </div>
            </div>
            <div className="flex items-start min-h-12">
                <div className="flex flex-wrap gap-2 text-text-secondary">
                    {visibleSkills.map((skill) => (
                        <span key={skill} className="max-w-full truncate text-sm bg-muted rounded-full py-0.5 px-2 text-text-secondary">
                            {skill}
                        </span>
                    ))}
                    {extraSkills > 0 && (
                        <span className="max-w-full truncate text-sm bg-muted rounded-full py-1 px-2 text-text-secondary">
                            + {extraSkills}
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-auto flex items-center gap-2">
                <button
                    type="button"
                    onClick={onOpenProfile}
                    className="flex-1 truncate text-sm bg-primary text-white font-bold rounded p-2 cursor-pointer hover:bg-primary/90">
                    View Profile
                </button>
                <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    aria-label={isSaved ? "Remove from saved" : "Save"}
                    className="cursor-pointer"
                    onClick={toggleSaved}>
                    <Bookmark className={cn("size-8", isSaved && "fill-primary")} />
                </Button>
            </div>
        </div>
    );
}