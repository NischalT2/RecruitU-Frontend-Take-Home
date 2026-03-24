"use client";

import { useEffect, useMemo, useState } from "react";
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
    compact?: boolean;
}
function MultiSelectSection<T extends string>({title, options, selected, isOpen, onToggleOpen, onToggleOption, compact}: MultiSelectSectionProps<T>) {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 200);
    // shows search if there are more than 8 options
    const shouldShowSearch = options.length >= 8;
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    const filteredOptions = useMemo(
        () => options.filter((opt) => opt.toLowerCase().includes(normalizedQuery)),
        [options, normalizedQuery],
    );
    // floats selected filters to the top
    const orderedOptions = useMemo(
        () => [...filteredOptions].sort((a, b) => Number(selected.includes(b)) - Number(selected.includes(a))),
        [filteredOptions, selected],
    );

    return (
        <div className={compact ? "border-b border-border px-2 py-2 last:border-b-0" : "border border-border rounded-xl p-2 bg-card transition-colors"}>
            <button type="button"
                className="w-full flex items-center justify-between gap-4 text-left cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                onClick={onToggleOpen}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary truncate">{title}</span>
                    {selected.length > 0 ? (
                        <span className="ml-2 inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-text-secondary">
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
            {/* Animates height from 0 to auto using grid-rows trick since CSS can't transition to height:auto directly  */}
            <div
                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="space-y-4 pt-2">
                    {shouldShowSearch ? (
                        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${title.toLowerCase()}`}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-text-tertiary/50"
                        />
                    ) : null}
                    <div className="max-h-52 overflow-y-auto">
                        <div className="flex flex-wrap gap-2">
                            {orderedOptions.map((opt) => {
                        const isSelected = selected.includes(opt);
                        return (
                            <button key={opt} type="button" aria-pressed={isSelected} onClick={() => onToggleOption(opt)}
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors ${isSelected ? "bg-muted border-border text-text-primary" : "bg-background border-border text-text-primary hover:bg-muted"}`}>
                                {isSelected ? <Check size={14} /> : null}
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
    const [panelOpen, setPanelOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sectionsOpen, setSectionsOpen] = useState({
        seniority: false,
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

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const handler = () => setIsMobile(mq.matches);
        // queueMicrotask to ensure the handler is called after the current event loop
        queueMicrotask(() => handler());
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    // prevent scrolling when the panel is open on mobile
    useEffect(() => {
        if (panelOpen && isMobile) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
            };
        }
    }, [panelOpen, isMobile]);

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
        <div
            className={`h-full border-r border-border bg-background transition-[width] duration-200 ${panelOpen ? "max-md:w-0 max-md:border-r-0" : ""}`}
        >
            {panelOpen && (
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Close filters"
                    onClick={() => setPanelOpen(false)}
                    onKeyDown={(e) => e.key === "Enter" && setPanelOpen(false)}
                    className="fixed top-30 left-0 right-0 bottom-0 z-40 bg-black/25 md:hidden touch-none"
                />
            )}
            <div
                className={`h-full transition-[width] duration-200 ease-in-out overflow-hidden flex flex-col ${panelOpen ? "w-72 p-4 max-md:fixed max-md:top-30 max-md:left-0 max-md:right-0 max-md:bottom-0 max-md:z-50 max-md:h-[calc(100dvh-7.5rem)] max-md:w-full max-md:rounded-none max-md:flex max-md:flex-col max-md:bg-background max-md:shadow-xl" : "w-14 p-2"}`}
            >
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        aria-expanded={panelOpen}
                        onClick={() => setPanelOpen((prev) => !prev)}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-muted transition-colors duration-150 cursor-pointer">
                        <span className="relative inline-flex items-center justify-center h-8 w-8 rounded-xl border border-border bg-card text-text-primary">
                            <SlidersHorizontal size={16} />
                            {!panelOpen && activeFiltersCount > 0 ? (
                                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-2 rounded-md bg-primary text-primary-foreground text-[10px] font-semibold inline-flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            ) : null}
                        </span>
                        {panelOpen ? (
                            <div>
                                <h2 className="text-base font-semibold text-text-primary truncate">Filters</h2>
                                <p className="text-xs text-text-tertiary tabular-nums">Active: {activeFiltersCount}</p>
                            </div>
                        ) : null}
                    </button>
                    <button
                        type="button"
                        aria-expanded={panelOpen}
                        aria-label={panelOpen ? "Close filters" : "Open filters"}
                        onClick={() => setPanelOpen((prev) => !prev)}
                        className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-muted text-text-secondary"
                    >
                        {panelOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>
                {panelOpen ? (
                    <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden pr-2 overscroll-contain">
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
                                compact={isMobile && panelOpen}
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
                                compact={isMobile && panelOpen}
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
                                compact={isMobile && panelOpen}
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
                                    compact={isMobile && panelOpen}
                                />
                            ) : null}
                            <div className={isMobile && panelOpen ? "border-b border-border px-2 py-2 last:border-b-0" : "border border-border rounded-xl p-2 bg-card transition-colors"}>
                                <button type="button"
                                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                                    onClick={() => setSectionsOpen((prev) => ({ ...prev, saved: !prev.saved }))}
                                    aria-expanded={sectionsOpen.saved}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-text-primary truncate">Saved</span>
                                        {filters.saved ? (
                                            <span className="inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-text-secondary">
                                                1
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <span className="text-text-secondary">
                                            {sectionsOpen.saved ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </span>
                                    </div>
                                </button>
                                <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${sectionsOpen.saved ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"}`}>
                                    <div className="min-h-0 overflow-hidden">
                                        <div className="pt-2">
                                            <button
                                                type="button"
                                                aria-pressed={filters.saved}
                                                onClick={() => setFilters((prev) => ({ ...prev, saved: !prev.saved }))}
                                                className={`w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors duration-150 ${filters.saved ? "bg-muted border-border text-text-primary" : "bg-background border-border text-text-primary hover:bg-muted"}`}>
                                                {filters.saved ? <Check size={18} /> : null}
                                                Saved Only
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-border bg-background py-2 max-md:pb-6">
                            <button
                                type="button"
                                className={`w-full px-4 py-4 cursor-pointer rounded-lg text-sm font-semibold border transition-colors ${activeFiltersCount > 0 ? "bg-card border-border text-text-primary hover:bg-muted" : "bg-muted border-border text-text-tertiary cursor-not-allowed"}`}
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