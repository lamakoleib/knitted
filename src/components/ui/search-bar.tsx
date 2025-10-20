"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect } from "react";

/**
 * SearchBar component with input and button.
 * Debounces input changes and triggers `handleSearch` after 500ms.
 *
 * @param searchTerm - Current search query value.
 * @param setSearchTerm - Setter function for updating the search term.
 * @param handleSearch - Function to execute the search logic.
 */
export default function SearchBar({
  searchTerm,
  setSearchTerm,
  handleSearch,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}) {
  useEffect(() => {
    if (!searchTerm.trim()) {
      handleSearch();
      return;
    }

    const t = setTimeout(() => handleSearch(), 500);
    return () => clearTimeout(t);
  }, [searchTerm, handleSearch]);

  return (
    <div className="flex items-center gap-2 w-full max-w-lg mx-auto bg-white p-3 rounded-full shadow ring-1 ring-red-300 focus-within:ring-2">
      <Input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 text-black"
      />
      <Button
        variant="outline"
        size="icon"
        className="border-red-300 text-red-400 hover:bg-red-50"
        onClick={handleSearch}
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </Button>
    </div>
  );
}
