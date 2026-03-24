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

    const hasSearch = filters.search.trim().length > 0;

    return (
        <header className="sticky top-0 z-60 border-b border-border bg-card">
            <div className="flex flex-col gap-2 px-4 py-4 md:flex-row md:h-20 md:items-center md:justify-between md:gap-4 md:px-6">
                <div className="flex items-center justify-between gap-2 md:justify-start">
                    <div className="flex items-center gap-2">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary cursor-pointer">
                            <BriefcaseBusiness size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-text-primary truncate md:text-xl">RecruitU</h1>
                            <p className="text-xs text-text-secondary hidden sm:block">Recruiter Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:hidden">
                        <span className="rounded-md border border-border bg-muted px-2 py-2 text-text-secondary">
                            Filters: {activeFiltersCount}
                        </span>
                        <span className="rounded-md border border-border bg-muted px-2 py-2 text-text-secondary">
                            {hasSearch ? "Search: On" : "Search"}
                        </span>
                    </div>
                </div>

                <div className="flex-1 min-w-0 w-full md:flex md:justify-center md:max-w-xl">
                    <Searchbar filters={filters} setFilters={setFilters} />
                </div>

                <div className="hidden md:flex items-center gap-2 text-sm">
                    <span className="rounded-lg border border-border bg-muted px-2 py-2 text-text-secondary">
                        Filters: {activeFiltersCount}
                    </span>
                    <span className="rounded-lg border border-border bg-muted px-2 py-2 text-text-secondary">
                        Search: {hasSearch ? "On" : "Off"}
                    </span>
                </div>
            </div>
        </header>
    );
}