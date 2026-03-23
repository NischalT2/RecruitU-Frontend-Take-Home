"use client";

import type { FilterControlProps as SearchbarProps} from "@/types/candidate";
import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";


export default function Searchbar({filters, setFilters}: SearchbarProps) {
    const [search, setSearch] = useState(filters.search);
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        setFilters((prevFilters) => ({...prevFilters, search: debouncedSearch}));
    }, [debouncedSearch, setFilters]);

    return (
        <div className="w-full max-w-xl">
            <div className="group relative">
                <Search size={16} className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors group-focus-within:text-primary"/>
                <input placeholder="Search candidates by name" 
                    className="w-full rounded-xl border border-border bg-card pl-8 pr-10 py-2 text-sm text-text-primary shadow-sm transition-all placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setFilters({...filters, search: debouncedSearch});
                        }
                    }}
                />
                {search ? (
                    <button type="button"
                        className="absolute right-10 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-6 w-6 rounded-md text-text-tertiary hover:bg-muted hover:text-text-secondary cursor-pointer"
                        aria-label="Clear search"
                        onClick={() => {setSearch(""); setFilters((prev) => ({ ...prev, search: "" }));}}>
                            <X size={14} />
                    </button>) : null}
            </div>
        </div>
    );
}