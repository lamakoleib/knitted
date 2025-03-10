"use client"

import { useOptimistic, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { enqueue, follow, unfollow } from "@/lib/db-actions"

interface FollowButtonProps {
  profileId: string
  initialIsFollowing: boolean
  currentUserId: string
  followerCount: number
}

export default function FollowButton({
  profileId,
  initialIsFollowing,
  currentUserId,
  followerCount,
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  type FollowState = {
    isFollowing: boolean
    count: number
  }

  const initialState: FollowState = {
    isFollowing: initialIsFollowing,
    count: followerCount,
  }

  const [optimisticState, updateOptimisticState] = useOptimistic(
    initialState,
    (state: FollowState, newFollowingStatus: boolean) => ({
      isFollowing: newFollowingStatus,
      count: newFollowingStatus ? state.count + 1 : state.count - 1,
    })
  )

  const handleFollowAction = async () => {
    if (isLoading) return

    setIsLoading(true)

    const newFollowingStatus = !optimisticState.isFollowing

    startTransition(() => {
      updateOptimisticState(newFollowingStatus)
    })

    try {
      const action = optimisticState.isFollowing ? "unfollow" : "follow"

      if (optimisticState.isFollowing) {
        await unfollow(profileId)
      } else {
        await follow(profileId)
      }

      router.refresh()
    } catch (error) {
      console.error("Follow action failed:", error)

      startTransition(() => {
        updateOptimisticState(!newFollowingStatus)
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isProcessing = isLoading || isPending

  return (
    <Button
      onClick={handleFollowAction}
      disabled={isProcessing}
      variant={optimisticState.isFollowing ? "outline" : "default"}
      className={
        optimisticState.isFollowing
          ? ""
          : "bg-red-300 text-primary-foreground hover:bg-red-300/90"
      }
    >
      {isProcessing
        ? "Processing..."
        : optimisticState.isFollowing
        ? "Unfollow"
        : "Follow"}
    </Button>
  )
}
