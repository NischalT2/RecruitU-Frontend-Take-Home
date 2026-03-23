"use client";

import { FilterControlProps as SidebarProps, Seniority } from "@/types/candidate";
import { SKILLS } from "@/lib/constants/skills";
import { DEGREES } from "@/lib/constants/degree";

const SENIORITY_OPTIONS: Seniority[] = ["Junior", "Mid", "Senior", "Staff"];

export default function Sidebar({filters, setFilters}: SidebarProps) {

    function toggleFilter<T>(array: T[], value: T){
        return array.includes(value) ? array.filter((item) => item !== value) : [...array, value];
    }
    
    return (
        <div className="w-64 bg-white border-r p-5 space-y-6 overflow-y-auto">
            <h2 className="text-lg font-medium mb-4 text-gray-700"> Filters </h2>
            {/* Seniority */}
            <div className="gap-y-4 flex flex-col">
                <div>
                    <p className="text-sm font-medium text-gray-700">Seniority</p>
                    <div className="flex flex-wrap gap-2">
                        {SENIORITY_OPTIONS.map((seniority) => (
                            <button
                                key={seniority}
                                className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors ${filters.seniority.includes(seniority) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                onClick={() => setFilters({...filters, seniority: toggleFilter(filters.seniority, seniority)})}>
                                {seniority}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Skills */}
                <div>
                    <p className="text-sm font-medium text-gray-700">Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {SKILLS.map((skill) => (
                            <button
                                key={skill}
                                className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors ${filters.skills.includes(skill) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                onClick={() => setFilters({...filters, skills: toggleFilter(filters.skills, skill)})}>
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Degree */}
                <div>
                    <p className="text-sm font-medium text-gray-700">Degree</p>
                    <div className="flex flex-wrap gap-2">
                        {DEGREES.map((degree) => (
                            <button
                                key={degree}
                                className={`px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors ${filters.degree.includes(degree) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                                onClick={() => setFilters({...filters, degree: toggleFilter(filters.degree, degree)})}>
                                {degree}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Clear Filters */}
                <div className="flex justify-center">
                    <button 
                        className="px-4 py-2 rounded-md text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors bg-gray-200 text-gray-700" 
                        onClick={() => setFilters({...filters, seniority: [], skills: [], degree: []})}>
                        Clear Filters
                    </button>
                </div>

            </div>
            
        </div>
    );
}