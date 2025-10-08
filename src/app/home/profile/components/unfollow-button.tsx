"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { unfollow } from "@/lib/db-actions"
/**
 * Renders an "Unfollow" button for a given profile.
 *
 * When clicked, triggers the `unfollow` action for the specified user.
 *
 * @param profileId - The ID of the profile to unfollow.
 * @returns The unfollow button component.
 */
export default function Unfollow({ profileId }: { profileId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          try {
            await unfollow(profileId)
          } finally {
            router.refresh()
          }
        })
      }
      className="text-red-300 hover:bg-red-300/90"
    >
      {isPending ? "Unfollowing..." : "Unfollow"}
    </Button>
  )
}
