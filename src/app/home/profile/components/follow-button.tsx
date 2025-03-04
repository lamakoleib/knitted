"use client"
import { Button } from "@/components/ui/button"
import { insertFollower } from "@/lib/db-actions"
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
