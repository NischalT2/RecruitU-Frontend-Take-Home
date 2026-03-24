"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { Bookmark, ChevronLeft, ChevronRight, Copy, GraduationCap, Mail, Phone, X } from "lucide-react";
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
                "h-full w-full border-l border-border bg-card shadow-lg transition-transform duration-300 ease-out md:w-[420px]",
                isSlidIn ? "translate-x-0" : "translate-x-full"
            )}
        >
            <div className="flex h-full flex-col">
                <div className="sticky top-0 z-10 border-b border-border bg-card p-4">
                    <div className="flex flex-col gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex w-fit items-center gap-2 py-2 pr-2 touch-manipulation -ml-2 md:hidden"
                            aria-label="Back to candidates"
                            onClick={onClose}
                        >
                            <ChevronLeft className="size-5" />
                            <span className="text-sm font-medium">Back</span>
                        </Button>
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                    <Image src={candidate.avatarUrl} alt={candidate.name} fill sizes="48px" className="object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="truncate text-base font-semibold text-text-primary">{candidate.name}</h2>
                                    <p className="truncate text-xs text-text-tertiary">
                                        {candidate.city}, {candidate.country}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={`mailto:${candidate.email}`}
                                    className="inline-flex size-10 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-muted hover:text-text-secondary md:size-8"
                                    aria-label={`Email ${candidate.name}`}
                                    title="Email candidate"
                                >
                                    <Mail className="size-4" />
                                </a>
                                <a
                                    href={`tel:${candidate.phone}`}
                                    className="inline-flex size-10 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-muted hover:text-text-secondary md:size-8"
                                    aria-label={`Call ${candidate.name}`}
                                    title="Call candidate"
                                >
                                    <Phone className="size-4" />
                                </a>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="hidden md:inline-flex"
                                    aria-label="Close profile"
                                    onClick={onClose}
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                            <span className={cn("inline-flex px-2 py-1 text-xs font-medium", getSeniorityClasses(candidate.seniority))}>
                                {candidate.seniority}
                            </span>
                            <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-1 text-xs font-medium text-text-secondary">
                                {candidate.experience} years
                            </span>
                        </div>
                        {(onPrev || onNext) && (
                            <div className="flex items-center gap-0.5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Previous candidate"
                                    onClick={onPrev}
                                    disabled={!hasPrev}
                                    className="size-8">
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Next candidate"
                                    onClick={onNext}
                                    disabled={!hasNext}
                                    className="size-8">
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    <section className="rounded-xl border border-border p-4 bg-card">
                        <div className="text-sm font-semibold text-text-primary">Education</div>
                        <div className="mt-2 inline-flex items-center gap-2 text-sm text-text-secondary">
                            <GraduationCap className="size-4 text-text-tertiary" />
                            <span className="font-medium">{candidate.degree}</span>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary">{candidate.education}</p>
                    </section>

                    <section className="rounded-xl border border-border p-4 bg-card">
                        <div className="text-sm font-semibold text-text-primary">Skills</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {candidate.skills.map((skill) => (
                                <span key={skill} className="rounded-full bg-muted px-2 py-1 text-xs text-text-secondary">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-xl border border-border p-4 bg-card">
                        <div className="text-sm font-semibold text-text-primary">Previous Companies</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {candidate.previousCompanies.map((company) => (
                                <span key={company} className="rounded-full bg-muted px-2 py-1 text-xs text-text-secondary">
                                    {company}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-xl border border-border p-4 bg-card">
                        <div className="text-sm font-semibold text-text-primary">Contact</div>
                        <div className="mt-2 flex flex-col space-y-2 text-sm text-text-secondary">
                            <div className="flex items-center justify-between gap-2">
                                <a
                                    href={`mailto:${candidate.email}`}
                                    className="inline-flex flex-1 items-center gap-2 truncate rounded-md py-1 pr-2 transition-colors hover:bg-muted hover:text-primary"
                                >
                                    <Mail className="size-4 text-text-tertiary" />
                                    <span className="truncate underline-offset-2 hover:underline">{candidate.email}</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(candidate.email)}
                                    aria-label="Copy email"
                                    className="cursor-pointer rounded-md p-2 text-text-tertiary transition-colors hover:bg-muted hover:text-text-secondary"
                                >
                                    <Copy className="size-4" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <a
                                    href={`tel:${candidate.phone}`}
                                    className="inline-flex flex-1 items-center gap-2 truncate rounded-md pr-2 transition-colors hover:bg-muted hover:text-primary"
                                >
                                    <Phone className="size-4 text-text-tertiary" />
                                    <span className="truncate underline-offset-2 hover:underline">{candidate.phone}</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(candidate.phone)}
                                    aria-label="Copy phone"
                                    className="cursor-pointer rounded-md text-text-tertiary transition-colors hover:bg-muted hover:text-text-secondary"
                                >
                                    <Copy className="size-4" />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

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
