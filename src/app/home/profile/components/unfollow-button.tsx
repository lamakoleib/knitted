"use client"
import { Button } from "@/components/ui/button"
import { unfollow, isFollowing } from "@/lib/db-actions"
/**
 * Renders an "Unfollow" button for a given profile.
 *
 * When clicked, triggers the `unfollow` action for the specified user.
 *
 * @param profileId - The ID of the profile to unfollow.
 * @returns The unfollow button component.
 */
export default function Unfollow({ profileId }: { profileId: string }) {
	return (
		<Button
			onClick={() => unfollow(profileId)}
			variant="outline"
			className="text-red-300 hover:bg-red-300/90"
		>
			Unfollow
		</Button>
	)
}
