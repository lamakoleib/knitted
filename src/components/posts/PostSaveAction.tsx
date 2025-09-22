"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { toggleSaveByCreator } from "@/lib/db-actions";

export default function PostSaveAction({
  creatorUserId,        // author's UUID
  initialSaved,
  profileIdForRoute,    // current viewer's profile id (uuid)
}: {
  creatorUserId: string;
  initialSaved: boolean;
  profileIdForRoute: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onClick = () => {
    startTransition(async () => {
      await toggleSaveByCreator(creatorUserId, initialSaved);
      router.push(`/home/profile/${profileIdForRoute}/saved`);
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="inline-flex h-8 w-8 items-center justify-center focus:outline-none"
      title="Save creator and open Saved"
      aria-label="Save"
    >
      <Bookmark className={`h-5 w-5 ${initialSaved ? "fill-current" : ""}`} />
    </button>
  );
}
