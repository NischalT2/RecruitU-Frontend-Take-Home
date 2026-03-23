"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { FilterControlProps as SidebarProps, Seniority } from "@/types/candidate";
import { SKILLS } from "@/lib/constants/skills";
import { DEGREES } from "@/lib/constants/degree";
import useDebounce from "@/hooks/useDebounce";

const SENIORITY_OPTIONS: Seniority[] = ["Junior", "Mid", "Senior", "Staff"];

interface MultiSelectSectionProps<T extends string> {
    title: string;
    options: readonly T[];
    selected: readonly T[];
    isOpen: boolean;
    onToggleOpen: () => void;
    onToggleOption: (value: T) => void;
}
function MultiSelectSection<T extends string>({title, options, selected, isOpen, onToggleOpen, onToggleOption}: MultiSelectSectionProps<T>) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 200);
    const shouldShowSearch = options.length >= 8;
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    const filteredOptions = useMemo(
        () => options.filter((opt) => opt.toLowerCase().includes(normalizedQuery)),
        [options, normalizedQuery],
    );
    const orderedOptions = useMemo(
        () => [...filteredOptions].sort((a, b) => Number(selected.includes(b)) - Number(selected.includes(a))),
        [filteredOptions, selected],
    );

    return (
        <div className="border border-border rounded-xl p-2 bg-card hover:border-border/80 transition-colors">
            <button type="button"
                className="w-full flex items-center justify-between gap-4 text-left cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                onClick={onToggleOpen}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary truncate">{title}</span>
                    {selected.length > 0 ? (
                        <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-text-secondary">
                            {selected.length}
                        </span>
                    ) : null}
                </div>
                <div className="flex items-center justify-center">
                    <span className="text-text-secondary">
                        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                </div>
            </button>
            <div
                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="space-y-4 pt-2">
                    {shouldShowSearch ? (
                        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}`}
                            className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    ) : null}

                    <div className="max-h-52 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                            {orderedOptions.map((opt) => {
                        const isSelected = selected.includes(opt);
                        return (
                            <button key={opt} type="button" aria-pressed={isSelected} onClick={() => onToggleOption(opt)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${isSelected ? "bg-primary border-primary text-primary-foreground hover:bg-primary/80 hover:border-primary/80" : "bg-muted border-border text-text-primary hover:bg-card hover:border-border"}`}>
                                {isSelected ? <Check size={16} /> : null}
                                {opt}
                            </button>
                        );
                            })}
                        </div>
                    </div>

                    {orderedOptions.length === 0 ? (
                        <p className="text-xs text-text-tertiary px-2">
                            No matches found.
                        </p>
                    ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface SidebarWithCountriesProps extends SidebarProps {
    countryOptions?: string[];
}

export default function Sidebar({ filters, setFilters, countryOptions = [] }: SidebarWithCountriesProps) {
    const [panelOpen, setPanelOpen] = useState(true);
    const [sectionsOpen, setSectionsOpen] = useState({
        seniority: true,
        skills: false,
        degree: false,
        countries: false,
        saved: false,
    });

    function toggleFilter<T>(array: T[], value: T) {
        return array.includes(value) ? array.filter((item) => item !== value) : [...array, value];
    }

    const activeFiltersCount = useMemo(() => {
        return (
            filters.seniority.length +
            filters.skills.length +
            filters.degree.length +
            filters.countries.length +
            (filters.saved ? 1 : 0)
        );
    }, [filters]);

    const clearFilters = () => {
        setFilters((prev) => ({
            ...prev,
            seniority: [],
            skills: [],
            degree: [],
            countries: [],
            saved: false,
        }));
    };

    return (
        <div className="h-full border-r border-border bg-card">
            <div className={`h-full transition-[width] duration-200 ease-in-out overflow-hidden flex flex-col ${panelOpen ? "w-72 p-4" : "w-14 p-2"}`}>
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        aria-expanded={panelOpen}
                        onClick={() => setPanelOpen((prev) => !prev)}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted transition-all duration-150 hover:shadow-sm cursor-pointer">
                        <span className="relative inline-flex items-center justify-center h-8 w-8 rounded-xl bg-muted text-text-primary">
                            <SlidersHorizontal size={16} />
                            {!panelOpen && activeFiltersCount > 0 ? (
                                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-2 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold inline-flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            ) : null}
                        </span>
                        {panelOpen ? (
                            <div>
                                <h2 className="text-lg font-bold text-text-primary truncate">Filters</h2>
                                <p className="text-xs text-text-tertiary tabular-nums">Active filters: {activeFiltersCount}</p>
                            </div>
                        ) : null}
                    </button>
                    <button type="button"
                        aria-expanded={panelOpen}
                        onClick={() => setPanelOpen((prev) => !prev)}
                        className="inline-flex items-center cursor-pointer justify-center h-8 w-8 rounded-lg hover:bg-muted transition-all duration-150 hover:shadow-sm text-text-secondary">
                        {panelOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>

                {panelOpen ? (
                    <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2">
                        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-2">
                            <MultiSelectSection
                                title="Seniority"
                                options={SENIORITY_OPTIONS}
                                selected={filters.seniority}
                                isOpen={sectionsOpen.seniority}
                                onToggleOpen={() => setSectionsOpen((prev) => ({ ...prev, seniority: !prev.seniority }))}
                                onToggleOption={(seniority) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        seniority: toggleFilter(prev.seniority, seniority),
                                    }))
                                }
                            />

                            <MultiSelectSection
                                title="Skills"
                                options={SKILLS}
                                selected={filters.skills}
                                isOpen={sectionsOpen.skills}
                                onToggleOpen={() => setSectionsOpen((prev) => ({ ...prev, skills: !prev.skills }))}
                                onToggleOption={(skill) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        skills: toggleFilter(prev.skills, skill),
                                    }))
                                }
                            />

                            <MultiSelectSection
                                title="Degree"
                                options={DEGREES}
                                selected={filters.degree}
                                isOpen={sectionsOpen.degree}
                                onToggleOpen={() => setSectionsOpen((prev) => ({ ...prev, degree: !prev.degree }))}
                                onToggleOption={(degree) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        degree: toggleFilter(prev.degree, degree),
                                    }))
                                }
                            />

                            {countryOptions.length > 0 ? (
                                <MultiSelectSection
                                    title="Country"
                                    options={countryOptions}
                                    selected={filters.countries}
                                    isOpen={sectionsOpen.countries}
                                    onToggleOpen={() => setSectionsOpen((prev) => ({ ...prev, countries: !prev.countries }))}
                                    onToggleOption={(country) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            countries: toggleFilter(prev.countries, country),
                                        }))
                                    }
                                />
                            ) : null}

                            <div className="border border-border rounded-xl p-2 bg-card hover:border-border/80 transition-colors">
                                <button type="button"
                                    className="w-full flex items-center justify-between gap-2 text-left cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                                    onClick={() => setSectionsOpen((prev) => ({ ...prev, saved: !prev.saved }))}
                                    aria-expanded={sectionsOpen.saved}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-text-primary truncate">Saved</span>
                                        {filters.saved ? (
                                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-text-secondary">
                                                1
                                            </span>
                                        ) : null}
                                    </div>
                                    <span className="inline-flex items-center justify-center text-text-secondary">
                                        {sectionsOpen.saved ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </span>
                                </button>

                                <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${sectionsOpen.saved ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}>
                                    <div className="min-h-0 overflow-hidden pt-2">
                                        <button
                                            type="button"
                                            aria-pressed={filters.saved}
                                            onClick={() => setFilters((prev) => ({ ...prev, saved: !prev.saved }))}
                                            className={`w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 ${filters.saved ? "bg-primary border-primary text-primary-foreground hover:bg-primary/80 hover:border-primary/80" : "bg-muted border-border text-text-primary hover:bg-card hover:border-border"}`}>
                                            {filters.saved ? <Check size={18} /> : null}
                                            Saved Only
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <button
                                type="button"
                                className={`w-full px-4 py-2 cursor-pointer rounded-lg text-sm font-semibold border transition-colors ${activeFiltersCount > 0 ? "bg-muted border-border text-text-primary hover:bg-muted/80 hover:shadow-sm" : "bg-muted border-border text-text-tertiary cursor-not-allowed"}`}
                                onClick={clearFilters}
                                disabled={activeFiltersCount === 0}>
                                Clear all filters
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}