"use client";

import type { FilterControlProps as SearchbarProps} from "@/types/candidate";
import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";


export default function Searchbar({filters, setFilters}: SearchbarProps) {
    const [search, setSearch] = useState(filters.search);
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        setFilters((prevFilters) => ({...prevFilters, search: debouncedSearch}));
    }, [debouncedSearch, setFilters]);

    return (
        <input placeholder="Search..." 
            className="border rounded-lg px-3 py-2" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setFilters({...filters, search: debouncedSearch});
                }
            }}
        />
    );
}