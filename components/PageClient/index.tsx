"use client";

import { useState, useMemo } from "react";
import type { Candidate, FilterState } from "@/types/candidate";
import { filterCandidates } from "@/lib/filter";

import Sidebar from "../Sidebar";
import CandidateCard from "../CandidateCard";
import Navbar from "../Navbar";

interface PageClientProps {
    initialCandidates: Candidate[];
}

export default function PageClient({initialCandidates}: PageClientProps) {

    const [filters, setFilters] = useState<FilterState>({
        search: "",
        seniority: [],
        countries: [],
        skills: [],
        degree: [],
    });

    const filteredCandidates = useMemo(() => filterCandidates(initialCandidates, filters), [initialCandidates, filters]);

    return (
        <div className="flex flex-col h-screen">
            <Navbar filters={filters} setFilters={setFilters} />
            <div className="flex flex-1 min-h-0">
                <Sidebar filters={filters} setFilters={setFilters} />
                
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="text-sm text-gray-500 px-6 py-4 border-b">
                        Showing {filteredCandidates.length} candidates
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                            {filteredCandidates.map((candidate) => (
                                <CandidateCard key={candidate.id} candidate={candidate} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}