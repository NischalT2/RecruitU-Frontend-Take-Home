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
        <div className="w-full">
            <div className="group relative">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors group-focus-within:text-text-secondary pointer-events-none"
                />
                <input
                    placeholder="Search candidates..."
                    className="w-full rounded-lg border border-border bg-card pl-8 pr-8 py-2 text-sm text-text-primary placeholder:text-text-tertiary transition-colors focus:outline-none focus:border-text-tertiary/60"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    // trigger immediate debounced search on Enter keypress
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setFilters({ ...filters, search: debouncedSearch });
                        }
                    }}
                />
                {search && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-6 w-6 rounded-md text-text-tertiary hover:text-text-secondary cursor-pointer"
                        aria-label="Clear search"
                        onClick={() => { setSearch(""); setFilters((prev) => ({ ...prev, search: "" })); }}
                    >
                        <X size={13} />
                    </button>
                )}
            </div>
        </div>
    );
}