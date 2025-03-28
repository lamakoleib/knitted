"use client"
import { Button } from "@/components/ui/button"
import { insertFollower } from "@/lib/db-actions"
/**
 * Renders a "Follow" button for a given profile.
 *
 * When clicked, triggers the `insertFollower` action for the specified user.
 *
 * @param profileId - The ID of the profile to follow.
 * @returns The follow button component.
 */
export default function Follow({ profileId }: { profileId: string }) {
	return (
		<Button
			onClick={() => insertFollower(profileId)}
			className="bg-red-300 text-primary-foreground hover:bg-red-300/90"
		>
			Follow
		</Button>
	)
}
