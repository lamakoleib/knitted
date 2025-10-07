"use client";

import { useEffect, useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleSavePost } from "@/lib/db-actions";

type Props = {
  projectId: number;
  initialSaved?: boolean;
  /** kept for backward compatibility with existing usages; no navigation happens */
  profileIdForRoute?: string;
};

export default function PostSaveAction({
  projectId,
  initialSaved = false,
}: Props) {
  // Seed from server, and keep in sync if parent changes it (e.g., route change)
  const [saved, setSaved] = useState<boolean>(!!initialSaved);
  useEffect(() => {
    setSaved(!!initialSaved);
  }, [initialSaved, projectId]);

  const [isPending, startTransition] = useTransition();

  const onToggle = () => {
    // Optimistic UI update
    setSaved((s) => !s);

    startTransition(async () => {
      try {
        await toggleSavePost(projectId);
        // If you ever need to revalidate server components on this page without navigating:
        // const router = useRouter(); router.refresh();
      } catch (err) {
        console.error("toggleSavePost failed:", err);
        // Roll back if the server action fails
        setSaved((s) => !s);
      }
    });
  };

  return (
    <button
      type="button"
      aria-label={saved ? "Unsave project" : "Save project"}
      aria-pressed={saved}
      onClick={onToggle}
      disabled={isPending}
      className="focus:outline-none disabled:opacity-60"
      title={saved ? "Saved" : "Save"}
    >
      <Bookmark
        size={20}
        className={saved ? "text-primary" : "text-muted-foreground"}
        // Lucide fills when fill="currentColor"
        fill={saved ? "currentColor" : "none"}
      />
    </button>
  );
}
