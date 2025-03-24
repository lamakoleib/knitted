"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/ui/search-bar";
import { searchProfiles } from "@/lib/db-actions";
import { type Tables } from "@/types/database.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
/**
 * Renders the search page for finding user profiles.
 *
 * Features:
 * - A search bar to input search terms
 * - Placeholder UI when no search term is entered
 * - Displays matching user profiles using `searchProfiles`
 * - Shows loading state and fallback message if no results are found
 *
 * @returns The user search page
 */
export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<Partial<Tables<"Profiles">>[]>([]);
  const [loading, setLoading] = useState(false);

  //Clears the profile list when the search term's empty
  useEffect(() => {
    if (!searchTerm.trim()) {
      setProfiles([]);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    const results = await searchProfiles(searchTerm.trim());
    setProfiles(results);
    setLoading(false);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 bg-muted">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

      {/* Placeholder UI when no search term is entered */}
      {!searchTerm && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg p-6 flex flex-col items-center">
              <Image src="/placeholder.svg" alt="Placeholder profile" width={100} height={100} className="rounded-full" />
              <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
              <div className="w-2/3 h-3 bg-gray-300 rounded mt-1"></div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        {loading && <p className="text-gray-500">Loading...</p>}

        {/* Displays search results if profiles exist */}
        {!loading && profiles.length > 0 ? (
          <ul className="bg-white rounded-lg shadow-md p-4">
            {profiles.map((profile, index) => (
              <li key={profile.id ?? index} className="py-2 border-b last:border-none">
                <Link href={`/home/profile/${profile.id}`} className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name || "User"} />
                    <AvatarFallback>{profile.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg font-semibold">{profile.full_name ?? "Unknown"}</div>
                    <div className="text-sm text-gray-600">@{profile.username ?? "No Username"}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : searchTerm && !loading ? (
          //Message displayed when no profiles are found after a search
          <p className="text-gray-500 mt-4">No profiles found.</p>
        ) : null}
      </div>
    </div>
  );
}
