"use client"
import { Button } from "@/components/ui/button"
import { unfollow, isFollowing } from "@/lib/db-actions"
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
