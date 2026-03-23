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
        <header className="border-b border-border bg-card/90">
            <div className="flex h-20 items-center justify-between px-6 gap-4">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary cursor-pointer">
                        <BriefcaseBusiness size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-text-primary">RecruitU</h1>
                        <p className="text-xs text-text-secondary">Recruiter Dashboard</p>
                    </div>
                </div>

                <div className="flex-1 flex justify-center">
                    <Searchbar filters={filters} setFilters={setFilters} />
                </div>

                <div className="flex items-center gap-2 text-sm">
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