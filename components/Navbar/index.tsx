"use client";

import Searchbar from "../Searchbar";
import type { FilterControlProps as NavbarProps } from "@/types/candidate";
import { BriefcaseBusiness } from "lucide-react";


export default function Navbar({filters, setFilters}: NavbarProps) {
    const activeFiltersCount =
        filters.seniority.length +
        filters.skills.length +
        filters.degree.length +
        filters.countries.length +
        (filters.saved ? 1 : 0);

    return (
        <header className="sticky top-0 z-60 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex flex-col gap-2 px-4 py-4 md:flex-row md:h-16 md:items-center md:justify-between md:gap-4 md:px-6">
                {/* Brand */}
                <div className="flex items-center gap-2">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-text-secondary">
                        <BriefcaseBusiness size={15} />
                    </div>
                    <div className="leading-tight">
                        <h1 className="text-[15px] font-semibold text-text-primary">RecruitU</h1>
                        <p className="text-[11px] text-text-tertiary hidden sm:block">Candidate Workspace</p>
                    </div>
                </div>

                {/* Search — centred between brand and filter pill */}
                <div className="flex-1 min-w-0 w-full md:flex md:justify-center">
                    <div className="w-full md:max-w-sm">
                        <Searchbar filters={filters} setFilters={setFilters} />
                    </div>
                </div>

                {/* Active filter count — only surfaces when relevant */}
                <div className="hidden md:flex items-center shrink-0">
                    {activeFiltersCount > 0 && (
                        <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-2 py-2 text-xs font-medium text-text-secondary">
                            <span className="h-2 w-2 rounded-full bg-text-primary" />
                            {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
}