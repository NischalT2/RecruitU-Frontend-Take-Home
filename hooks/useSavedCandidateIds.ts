"use client";

import {startTransition, useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "saved-candidate-ids";

function readIds(){
    // Check if window is defined (no local storage on server)
    if (typeof window === "undefined") {
        return new Set();
    }
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return new Set();
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return new Set();
        }
        // Filter out any non-string values and return a set of unique strings
        return new Set(parsed.filter((id: string) => typeof id === "string"));
    } catch (error) {
        console.error(error);
        return new Set();
    }
}

function writeIds(ids: Set<string>) {
    if (typeof window === "undefined") {
        return;
    }
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    } catch (error) {
        console.error(error);
    }
}

export function useSavedCandidateIds() {
    // localStorage not available in SSR, so we use useState to initialize empty set and hydrate in the effect
    const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

    useEffect(() => {
        // Marks state update as non-urgent, allowing UI to update and re-render
        startTransition(() => {
            setSavedIds(readIds());
        });
    }, []);

    // Toggle the saved status of a candidate
    const toggleSaved = useCallback((id: string) => {
        setSavedIds(prev => {
            const newIds = new Set(prev);
            if (newIds.has(id)) {
                newIds.delete(id);
            } else {
                newIds.add(id);
            }
            writeIds(newIds);
            return newIds;
        });
    }, []);

    // Check if a candidate is saved
    const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

    return { savedIds, isSaved, toggleSaved };
}