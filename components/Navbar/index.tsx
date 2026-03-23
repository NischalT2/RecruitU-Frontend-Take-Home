"use client";

import Searchbar from "../Searchbar";
import type { FilterControlProps as NavbarProps } from "@/types/candidate";


export default function Navbar({filters, setFilters}: NavbarProps) {
    return (
        <div className="flex justify-between items-center border-b p-6 h-16">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">RecruitU</h1>
                <Searchbar filters={filters} setFilters={setFilters} />
            </div>

            <div className="flex items-center text-md font-medium">
                <span>Recruiter Dashboard</span>
            </div>

        </div>
    );
}