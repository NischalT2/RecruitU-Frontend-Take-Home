"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { Bookmark, BriefcaseBusiness, ChevronLeft, ChevronRight, Copy, GraduationCap, Mail, MapPin, Phone, X } from "lucide-react";
import type { Candidate } from "@/types/candidate";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { getSeniorityClasses } from "@/lib/seniority";

interface ProfilePanelProps {
    candidate: Candidate | null;
    open: boolean;
    isSaved: boolean;
    onClose: () => void;
    onToggleSaved: () => void;
    onPrev?: () => void;
    onNext?: () => void;
    hasPrev?: boolean;
    hasNext?: boolean;
}

export default function ProfilePanel({
    candidate,
    open,
    isSaved,
    onClose,
    onToggleSaved,
    onPrev,
    onNext,
    hasPrev = false,
    hasNext = false,
}: ProfilePanelProps) {
    const handleCopy = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
    }, []);

    const [isSlidIn, setIsSlidIn] = useState(false);
    useEffect(() => {
        if (open) {
            const id = requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsSlidIn(true));
            });
            return () => cancelAnimationFrame(id);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
            if (e.key === "ArrowRight" && hasNext && onNext) onNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose, hasPrev, hasNext, onPrev, onNext]);

    if (!open || !candidate) {
        return null;
    }

    return (
        <div
            aria-label="Candidate preview panel"
            className={cn(
                "h-full w-full border-l border-border bg-card shadow-[-8px_0_32px_rgba(55,53,47,0.1)] transition-transform duration-300 ease-out md:w-[420px]",
                isSlidIn ? "translate-x-0" : "translate-x-full"
            )}
        >
            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-card/95 backdrop-blur">
                    <div className="px-4 pt-3 pb-0">
                        {/* Mobile back */}
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex w-fit items-center gap-2 -ml-2 mb-2 md:hidden"
                            aria-label="Back to candidates"
                            onClick={onClose}
                        >
                            <ChevronLeft className="size-4" />
                            <span className="text-sm font-medium">Back</span>
                        </Button>
                        {/* Identity row */}
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                                <div className="relative h-[52px] w-[52px] overflow-hidden rounded-full ring-2 ring-border">
                                    <Image src={candidate.avatarUrl} alt={candidate.name} fill sizes="52px" className="object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="truncate text-base font-bold text-text-primary ">{candidate.name}</h2>
                                    <div className="flex items-center gap-1 text-[11px] text-text-tertiary">
                                        <MapPin className="size-3" />
                                        <span className="truncate">{candidate.city}, {candidate.country}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Action buttons */}
                            <div className="flex items-center gap-2">
                                <a
                                    href={`mailto:${candidate.email}`}
                                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-text-tertiary transition-colors hover:bg-muted hover:text-text-secondary"
                                    aria-label={`Email ${candidate.name}`}
                                    title="Send email"
                                >
                                    <Mail className="size-4" />
                                </a>
                                <a
                                    href={`tel:${candidate.phone}`}
                                    className="inline-flex size-8 items-center justify-center rounded-md border border-border text-text-tertiary transition-colors hover:bg-muted hover:text-text-secondary"
                                    aria-label={`Call ${candidate.name}`}
                                    title="Call candidate"
                                >
                                    <Phone className="size-4" />
                                </a>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="hidden md:inline-flex size-8 border border-transparent hover:border-border"
                                    aria-label="Close profile"
                                    onClick={onClose}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        </div>
                        {/* Badge row and nav */}
                        <div className="mt-2 flex items-center justify-between gap-2 border-b border-border">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium", getSeniorityClasses(candidate.seniority))}>
                                    {candidate.seniority}
                                </span>
                                <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-text-secondary">
                                    {candidate.experience} yrs exp
                                </span>
                            </div>
                            {(onPrev || onNext) && (
                                // Nav button disabled if no previous or next candidate
                                <div className="flex items-center">
                                    <Button type="button" variant="ghost" size="icon" aria-label="Previous candidate"
                                        onClick={onPrev} disabled={!hasPrev} className="size-8">
                                        <ChevronLeft className="size-4" />
                                    </Button>
                                    <Button type="button" variant="ghost" size="icon" aria-label="Next candidate"
                                        onClick={onNext} disabled={!hasNext} className="size-8">
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {/* Experience */}
                    <section className="rounded-xl border border-border bg-background p-4">
                        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">Experience</p>
                        <div className="mt-2 flex flex-col gap-2">
                            {candidate.previousCompanies.map((company) => (
                                <div key={company} className="flex items-center gap-2">
                                    <BriefcaseBusiness className="size-3 text-text-tertiary" />
                                    <span className="text-sm font-medium text-text-primary">{company}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Education */}
                    <section className="rounded-xl border border-border bg-background p-4">
                        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">Education</p>
                        <div className="mt-2 flex items-start gap-2">
                            <GraduationCap className="mt-0.5 size-3 text-text-tertiary" />
                            <div>
                                <p className="text-sm font-semibold text-text-primary">{candidate.degree}</p>
                                <p className="mt-0.5 text-xs text-text-secondary">{candidate.education}</p>
                            </div>
                        </div>
                    </section>
                    {/* Skills */}
                    <section className="rounded-xl border border-border bg-background p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">Skills</p>
                            <span className="text-[11px] text-text-tertiary">{candidate.skills.length} total</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {candidate.skills.map((skill) => (
                                <span key={skill} className="inline-flex items-center rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-text-secondary hover:bg-muted transition-colors">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                    {/* Contact */}
                    <section className="rounded-xl border border-border bg-background p-4">
                        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">Contact</p>
                        <div className="mt-2">
                            <div className="flex items-center justify-between gap-2">
                                <a
                                    href={`mailto:${candidate.email}`}
                                    className="flex flex-1 items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                                >
                                    <Mail className="size-3 text-text-tertiary" />
                                    <span className="truncate">{candidate.email}</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(candidate.email)}
                                    aria-label="Copy email"
                                    className="cursor-pointer rounded-md p-2 text-text-tertiary transition-colors hover:bg-muted hover:text-text-secondary"
                                >
                                    <Copy className="size-3" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <a
                                    href={`tel:${candidate.phone}`}
                                    className="flex flex-1 items-center gap-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                                >
                                    <Phone className="size-3 text-text-tertiary" />
                                    <span className="truncate">{candidate.phone}</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(candidate.phone)}
                                    aria-label="Copy phone"
                                    className="cursor-pointer rounded-md p-2 text-text-tertiary transition-colors hover:bg-muted hover:text-text-secondary"
                                >
                                    <Copy className="size-3" />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
                {/* Footer CTA */}
                <div className="border-t border-border p-4 bg-card">
                    <Button type="button" className="w-full cursor-pointer" variant={isSaved ? "outline" : "default"} onClick={onToggleSaved}>
                        <Bookmark className={cn("size-4", isSaved && "fill-primary")} />
                        {isSaved ? "Saved" : "Save Candidate"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
