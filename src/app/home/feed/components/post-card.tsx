"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { FeedPost } from "@/types/feed";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Plus } from "lucide-react";
import { formatPostTime } from "@/utils/format-date";
import { isLiked, likePost, unlikePost, addComment, getComments } from "@/lib/db-actions";
import { Tables } from "@/types/database.types";
import PostSaveAction from "@/components/posts/PostSaveAction";

type Comment = {
  id: number;
  comment: string;
  created_at: string;
  user_id: string;
  username: string;
  avatar_url?: string;
};

export function PostCard({
  post,
  profile,
  initialSaved = false, // ✅ new prop from server
}: {
  post: FeedPost;
  profile: Tables<"Profiles">;
  initialSaved?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(initialSaved); // ✅ seed from server
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const creatorId = post.Profiles?.id ?? ""; // author's UUID

  useEffect(() => {
    const fetchStatus = async () => {
      setLiked(await isLiked(post.project_id)); // only fetch likes
      fetchComments();
    };
    fetchStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.project_id]);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const fetchedComments = await getComments(post.project_id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const toggleLike = async () => {
    try {
      if (liked) {
        await unlikePost(post.project_id);
        setLikeCount((c) => c - 1);
      } else {
        setLikeCount((c) => c + 1);
        await likePost(post.project_id);
      }
      setLiked((v) => !v);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await addComment(post.project_id, commentText);
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);
  const { display: displayTime } = formatPostTime(post.created_at);

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage
                src={post.Profiles?.avatar_url ?? ""}
                alt={post.Profiles?.username ?? ""}
              />
              <AvatarFallback>
                {(post.Profiles?.full_name ?? "").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">
              {post.Profiles?.username} <span className="text-md">&#183;</span>{" "}
              {displayTime}
            </span>
          </span>

          {/* Actions */}
          <span className="flex gap-3">
            <button onClick={() => {}} className="focus:outline-none">
              <MessageCircle size={20} />
            </button>
            <button onClick={toggleLike} className="focus:outline-none">
              <Heart size={20} className={liked ? "fill-red-500 text-red-500" : ""} />
            </button>
            <PostSaveAction
              projectId={post.project_id} // ✅ use project ID (BIGINT)
              initialSaved={saved}         // ✅ from server
              profileIdForRoute={profile?.id ?? ""}
            />
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2 pt-3 pl-1">
          <p className="text-sm">
            <span className="font-medium">{likeCount} likes</span>
          </p>
          <p className="text-sm">
            <span className="font-medium">
              <Link href={`/home/profile/${post.Profiles?.id}`}>
                {post.Profiles?.username}
              </Link>
            </span>{" "}
            <span>{post.description}</span>
          </p>

          {/* Comments */}
          {comments.length > 0 && (
            <div className="space-y-1">
              {comments.length > 2 && !showAllComments && (
                <button
                  className="text-muted-foreground text-xs"
                  onClick={() => setShowAllComments(true)}
                >
                  View all {comments.length} comments
                </button>
              )}
              {displayedComments.map((comment) => (
                <p key={comment.id} className="text-sm">
                  <span className="font-medium">
                    <Link href={`/home/profile/${comment.user_id}`}>
                      {comment.username}
                    </Link>
                  </span>{" "}
                  <span>{comment.comment}</span>
                </p>
              ))}
              {showAllComments && comments.length > 2 && (
                <button
                  className="text-muted-foreground text-xs"
                  onClick={() => setShowAllComments(false)}
                >
                  Hide comments
                </button>
              )}
            </div>
          )}

          {/* Add comment */}
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={profile.avatar_url ?? ""}
                alt={profile.username ?? profile.full_name}
              />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Add a comment..."
              className="h-8 text-xs border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentText.trim()) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            {commentText.trim() && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-primary font-medium"
                onClick={handleAddComment}
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
  );
}
