"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/ui/search-bar";
import { searchProfiles } from "@/lib/db-actions";
import { type Tables } from "@/types/database.types";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<Partial<Tables<"Profiles">>[]>([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    console.log("Searching for:", searchTerm.trim());

    const results = await searchProfiles(searchTerm.trim());
    setProfiles(results);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 bg-muted">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />

      {!searchTerm && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-200 rounded-lg p-6 flex flex-col items-center">
              <Image
                src="/placeholder.svg"
                alt="Placeholder profile"
                width={100}
                height={100}
                className="rounded-full"
              />
              <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
              <div className="w-2/3 h-3 bg-gray-300 rounded mt-1"></div>
            </div>
          ))}
        </div>
      )}

      {/* Search Results */}
      <div className="mt-6">
        {profiles.length > 0 ? (
          <ul className="bg-white rounded-lg shadow-md p-4">
            {profiles.map((profile, index) => (
              <li key={profile.id ?? index} className="py-2 border-b last:border-none">
                <Link href={`/home/profile/${profile.id}`} className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-lg">
                  {/* Profile Pic */}
                  <Image
                    src={profile.avatar_url || "/placeholder.svg"}
                    alt={`${profile.full_name || "User"}'s profile picture`}
                    width={50}
                    height={50}
                    className="rounded-full object-cover border"
                  />        
                  <div>
                    <div className="text-lg font-semibold">{profile.full_name ?? "Unknown"}</div>
                    <div className="text-sm text-gray-600">@{profile.username ?? "No Username"}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : searchTerm ? (
          <p className="text-gray-500 mt-4">No profiles found.</p>
        ) : null}
      </div>
    </div>
  );
}

