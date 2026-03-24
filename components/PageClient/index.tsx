"use client";

import { useState, useMemo } from "react";
import type { Candidate, FilterState } from "@/types/candidate";
import { filterCandidates } from "@/lib/filter";
import { useSavedCandidateIds } from "@/hooks/useSavedCandidateIds";
import Sidebar from "../Sidebar";
import CandidateCard from "../CandidateCard";
import Navbar from "../Navbar";
import ProfilePanel from "../ProfilePanel.tsx";

interface PageClientProps {
    initialCandidates: Candidate[];
}

export default function PageClient({initialCandidates}: PageClientProps) {
    const { savedIds, isSaved, toggleSaved } = useSavedCandidateIds();
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        seniority: [],
        skills: [],
        degree: [],
        countries: [],
        saved: false,
    });
    const countryOptions = useMemo(
        () => [...new Set(initialCandidates.map((c) => c.country))].sort(),
        [initialCandidates]
    );
    const filteredCandidates = useMemo(() => filterCandidates(initialCandidates, filters, savedIds), [initialCandidates, filters, savedIds]);
    const selectedCandidate = useMemo(() => filteredCandidates.find((candidate) => candidate.id === selectedCandidateId) 
                                            ?? null, [filteredCandidates, selectedCandidateId]);
    const selectedIndex = useMemo(
        () => (selectedCandidateId ? filteredCandidates.findIndex((c) => c.id === selectedCandidateId) : -1),
        [filteredCandidates, selectedCandidateId]
    );
    const hasPrev = selectedIndex > 0;
    const hasNext = selectedIndex >= 0 && selectedIndex < filteredCandidates.length - 1;

    return (
        <div className="flex flex-col h-screen">
            <Navbar filters={filters} setFilters={setFilters} />
            <div className="flex flex-1 min-h-0">
                <Sidebar filters={filters} setFilters={setFilters} countryOptions={countryOptions} />
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="text-sm text-text-tertiary px-6 py-4 border-b border-border">
                        Showing {filteredCandidates.length} candidates
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4 p-6">
                            {filteredCandidates.map((candidate) => (
                                <div key={candidate.id} onClick={() => setSelectedCandidateId(candidate.id)}>
                                <CandidateCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    isSaved={isSaved(candidate.id)}
                                    toggleSaved={() => toggleSaved(candidate.id)}
                                    onOpenProfile={() => setSelectedCandidateId(candidate.id)}
                                />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    className={`overflow-hidden transition-[width] duration-300 ease-out ${selectedCandidate ? "w-full md:w-[420px]" : "w-0"}`}
                >
                    {selectedCandidate && (
                        <ProfilePanel
                            candidate={selectedCandidate}
                            open={true}
                            isSaved={isSaved(selectedCandidate.id)}
                            onClose={() => setSelectedCandidateId(null)}
                            onToggleSaved={() => toggleSaved(selectedCandidate.id)}
                            onPrev={hasPrev ? () => setSelectedCandidateId(filteredCandidates[selectedIndex - 1]?.id ?? null) : undefined}
                            onNext={hasNext ? () => setSelectedCandidateId(filteredCandidates[selectedIndex + 1]?.id ?? null) : undefined}
                            hasPrev={hasPrev}
                            hasNext={hasNext}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}