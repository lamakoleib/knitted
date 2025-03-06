"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect } from "react";

export default function SearchBar({ searchTerm, setSearchTerm, handleSearch }: { 
  searchTerm: string; 
  setSearchTerm: (term: string) => void; 
  handleSearch: () => void;
}) {
  useEffect(() => {
    if (!searchTerm.trim()) {
      handleSearch();
      return;
    }
  
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  
  
  return (
    <div className="flex items-center gap-2 w-full max-w-lg mx-auto bg-red-300/60 p-3 rounded-full shadow">
      <Input
        type="text"
        placeholder="Search profiles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 border-none outline-none focus:ring-0 bg-transparent text-black"
      />
      <Button 
        variant="outline" 
        size="icon" 
        className="bg-white/50 hover:bg-white/70" 
        onClick={handleSearch}
      >
        <Search className="w-5 h-5 text-gray-700" />
      </Button>
    </div>
  );
}
