import { useEffect, useState } from "react";

// Debounce for search input
export default function useDebounce<T>(value: T, delay: number = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    // Set the debounced value after the delay
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}