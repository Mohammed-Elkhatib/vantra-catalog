"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  defaultValue?: string;
}

export default function SearchInput({ defaultValue = "" }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  // Sync state with URL parameter (e.g. on clear all)
  useEffect(() => {
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      // Reset page number on search
      params.delete("page");
      router.push(`/products?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(handler);
  }, [value, router, searchParams]);

  const handleClear = () => {
    setValue("");
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-steel" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products, specifications..."
        aria-label="Search products"
        className="block w-full border border-rule bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder-steel transition-colors focus:border-ink focus:outline-none"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-steel hover:text-ink"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      )}
    </div>
  );
}
