"use client"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { type FeedPost } from "@/types/feed"
import { Input } from "@/components/ui/input"
import { Bookmark, Heart, MessageCircle, Plus } from "lucide-react"
import Link from "next/link"
import { formatPostTime } from "@/utils/format-date"

export function PostCard({ post }: { post: FeedPost }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [commentText, setCommentText] = useState("")

  const toggleLike = () => {
    setLiked(!liked)
  }

  const toggleSave = () => {
    setSaved(!saved)
  }

  const { display: displayTime, title } = formatPostTime(post.created_at)

  return (
    <Card className="w-full">
      <CardHeader className="p-0">
        <div className="relative w-full rounded-t-xl aspect-[4/3] overflow-hidden">
          <Image
            src={post.images[0] || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="pb-0 pt-4">
        <div className="flex items-center justify-between">
          <span className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={post.Profiles?.avatar_url ?? ""}
                alt={post.Profiles?.username ?? ""}
              />
              <AvatarFallback>
                {post.Profiles?.full_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">
              {post.Profiles?.username} <span className="text-md">&#183;</span>{" "}
              {displayTime}
            </span>
          </span>
          <span className="flex gap-3">
            <button onClick={() => {}} className="focus:outline-none">
              <MessageCircle size={20} />
            </button>
            <button onClick={toggleLike} className="focus:outline-none">
              <Heart
                size={20}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />
            </button>
            <button onClick={toggleSave} className="focus:outline-none">
              <Bookmark size={20} className={saved ? "fill-foreground" : ""} />
            </button>
          </span>
        </div>

        {/* Caption and Comments */}
        <div className="flex flex-col gap-2 pt-3 pl-1">
          <p className="text-sm">
            <span className="font-medium">
              {post.like_count + (liked ? 1 : 0)} likes
            </span>
          </p>
          <p className="text-sm">
            <span className="font-medium">
              <Link href={`/home/profile/${post.Profiles?.id}`}>
                {post.Profiles?.username}
              </Link>
            </span>{" "}
            <span>{post.description}</span>
          </p>

          {/* {post.comments.length > 0 && (
            <div className="space-y-1">
              {post.comments.length > 1 && !showAllComments && (
                <button
                  className="text-muted-foreground text-xs"
                  onClick={() => setShowAllComments(true)}
                >
                  View all {post.comments.length} comments
                </button>
              )}

              {displayedComments.map((comment: any, index: any) => (
                <p key={index} className="text-sm">
                  <span className="font-medium">{comment.username}</span>{" "}
                  <span>{comment.text}</span>
                </p>
              ))}

              {showAllComments && post.comments.length > 1 && (
                <button
                  className="text-muted-foreground text-xs"
                  onClick={() => setShowAllComments(false)}
                >
                  Hide comments
                </button>
              )}
            </div>
          )} */}

          {/* Comment Input */}
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src="/placeholder.svg?height=24&width=24&text=Me"
                alt="Me"
              />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Add a comment..."
              className="h-8 text-xs border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            {commentText.trim() && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-primary font-medium"
              >
                Post
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end pt-2 pb-3">
        <Plus size={18} />
      </CardFooter>
    </Card>
  )
}
