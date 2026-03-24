"use client";
import type { Candidate } from "@/types/candidate";
import Image from "next/image";
import { Bookmark, BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { getSeniorityClasses } from "@/lib/seniority";

const MAX_SKILLS = 3;
const MAX_COMPANIES = 2;

interface CandidateCardProps {
    candidate: Candidate;
    isSaved: boolean;
    toggleSaved: () => void;
    onOpenProfile: () => void;
}

export default function CandidateCard({ candidate, isSaved, toggleSaved, onOpenProfile }: CandidateCardProps) {
    const visibleSkills = candidate.skills.slice(0, MAX_SKILLS);
    const extraSkills = Math.max(0, candidate.skills.length - MAX_SKILLS);
    const visibleCompanies = candidate.previousCompanies.slice(0, MAX_COMPANIES);
    const extraCompanies = Math.max(0, candidate.previousCompanies.length - MAX_COMPANIES);

    return (
        <article
            onClick={onOpenProfile}
            className="group relative flex h-[240px] flex-col cursor-pointer rounded-xl border border-border bg-card shadow-[0_1px_3px_rgba(55,53,47,0.06)] hover:shadow-[0_8px_24px_rgba(55,53,47,0.12)] hover:-translate-y-0.5 hover:border-border/70 transition-all duration-200 overflow-hidden"
        >
            {/* Identity */}
            <div className="flex items-start gap-4 p-4 pb-2">
                <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full ring-1 ring-black/10">
                    <Image
                        src={candidate.avatarUrl}
                        alt={candidate.name}
                        fill
                        sizes="50px"
                        className="object-cover"
                    />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="truncate text-base font-bold leading-tight text-text-primary">
                        {candidate.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={cn("inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md leading-none", getSeniorityClasses(candidate.seniority))}>
                            {candidate.seniority} · {candidate.experience} yrs
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-text-tertiary">
                        <MapPin className="size-3" />
                        <span className="truncate">{candidate.city}, {candidate.country}</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={isSaved ? "Remove from saved" : "Save"}
                    className="mt-0.5 cursor-pointer rounded-full border border-border bg-background hover:bg-muted"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleSaved();
                    }}
                >
                    <Bookmark className={cn("size-4", isSaved ? "fill-text-primary text-text-primary" : "text-text-tertiary")} />
                </Button>
            </div>

            {/*Career & Education */}
            <div className="mx-4 border-t border-border" />
            <div className="flex flex-col gap-2 px-4 py-2">
                {visibleCompanies.length > 0 && (
                    <div className="flex items-center gap-2">
                        <BriefcaseBusiness className="size-3 text-text-secondary" />
                        <span className="truncate text-sm font-semibold text-text-primary">
                            {visibleCompanies[0]}
                        </span>
                        {visibleCompanies[1] && (
                            <>
                                <span className="text-[11px] text-text-tertiary">·</span>
                                <span className="truncate text-sm font-semibold text-text-primary">
                                    {visibleCompanies[1]}
                                </span>
                            </>
                        )}
                        {extraCompanies > 0 && (
                            <span className="text-[11px] text-text-tertiary">+{extraCompanies}</span>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <GraduationCap className="size-3 text-text-tertiary" />
                    <span className="truncate text-xs text-text-secondary">
                        {candidate.degree}
                        <span className="text-text-tertiary"> · {candidate.education}</span>
                    </span>
                </div>
            </div>

            {/* Skills  */}
            {visibleSkills.length > 0 && (
                <>
                    <div className="mx-4 border-t border-border" />
                    <div className="flex items-center gap-2 overflow-hidden px-4 py-4">
                        {visibleSkills.map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex min-w-0 shrink items-center rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-text-secondary"
                            >
                                <span className="truncate max-w-[90px]">{skill}</span>
                            </span>
                        ))}
                        {extraSkills > 0 && (
                            <span className="shrink-0 inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] text-text-tertiary">
                                +{extraSkills}
                            </span>
                        )}
                    </div>
                </>
            )}

            {/* ── Footer ───────────────────────────────────────────── */}
            <div className="mt-auto flex items-center justify-end border-t border-border bg-muted/40 px-4 py-2">
                <span className="text-[11px] font-medium">
                    View profile →
                </span>
            </div>
        </article>
    );
}
