"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bookmark, Heart, MessageCircle, Plus } from "lucide-react";
import { getProjectByID, likePost, unlikePost, isLiked, addComment, getComments, isSaved, savePost, unsavePost } from "@/lib/db-actions";
 
 //Fetches project ID
interface Comment {
  id: number;
  user: string;
  text: string;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  yarn: string[] | null;
  pattern: string | null;
  needle_size: string | null;
  status: string | null;
  difficulty: string | null;
  tags: string[] | null;
  images: string[];
  timeSpent: number | null;
  likeCount: number;
  comments: Comment[];
  user: {
    name: string;
    avatar: string;
  };
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    async function fetchParams() {
      const { projectId } = await params;
      setProjectId(projectId);
    }
    fetchParams();
  }, [params]);

  //Fetches project details
  useEffect(() => {
    if (!projectId) return;

    async function fetchProject() {
      const data = await getProjectByID(String(projectId));
      if (!data) return;

      setProjectData({
        id: String(data.project_id),
        title: data.title ?? "Untitled Project",
        description: data.description ?? "",
        yarn: data.yarn ?? [],
        pattern: data.pattern ?? "No pattern provided",
        needle_size: data.needle_size ?? "N/A",
        status: data.status ?? "Unknown",
        difficulty: data.difficulty ?? "Not specified",
        tags: data.tags ?? [],
        images: data.images?.length > 0 ? data.images : ["/placeholder.svg"],
        timeSpent: data.time_spent ?? null,
        likeCount: data.like_count ?? 0,
        comments: [],
        user: {
          name: data.Profiles?.username ?? "Anonymous",
          avatar: data.Profiles?.avatar_url ?? "/default-avatar.png",
        },
      });

      setLikeCount(data.like_count ?? 0);
      setLiked(await isLiked(Number(projectId)));
      setSaved(await isSaved(Number(projectId)));
      
      //Fetches project comments
      const fetchedComments = await getComments(Number(projectId));
      setComments(
        fetchedComments.map((c: any) => ({
          id: c.comment_id ?? Math.random(),
          user: c.username || "Anonymous",
          text: c.comment,
        }))
      );
    }

    fetchProject();
  }, [projectId]);

  //Handles liking/unliking a post
  async function handleLike() {
    if (!projectId) return;

    if (liked) {
      await unlikePost(Number(projectId));
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      await likePost(Number(projectId));
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  }

  //Handles saving/unsaving a post
  async function toggleSave() {
    if (!projectId) return;

    if (saved) {
      await unsavePost(Number(projectId));
    } else {
      await savePost(Number(projectId));
    }
    setSaved(!saved);
  }

  //Handles adding a comment
  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || newComment.trim().length === 0) return;

    await addComment(Number(projectId), newComment);
    setComments([...comments, { id: Math.random(), user: "You", text: newComment }]);
    setNewComment("");
  }

  if (!projectData) return <p>Loading...</p>;

  {/* Project Image Card */}
  return (
    <div className="bg-muted p-4 md:p-12 min-h-screen w-full">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-6 md:gap-10">
        
        <Card className="w-full">
          <CardHeader className="p-0">
            <div className="relative w-full rounded-t-xl aspect-[4/3] overflow-hidden">
              <Image src={projectData.images[0]} alt={projectData.title} fill className="object-cover" />
            </div>
          </CardHeader>
          <CardContent className="pb-0 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={projectData.user.avatar} alt={projectData.user.name} />
                  <AvatarFallback>{projectData.user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-600">{projectData.user.name}</span>
              </div>
              <span className="flex gap-3">
              <button className="focus:outline-none">
                <MessageCircle size={20} />
              </button>
              <button onClick={handleLike} className="focus:outline-none">
                <Heart size={20} className={liked ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button onClick={toggleSave} className="focus:outline-none">
                <Bookmark size={20} className={saved ? "fill-foreground" : ""} />
              </button>
            </span>
            </div>
             {/* Likes and comments */}
             <div className="flex flex-col gap-2 pt-3 pl-1">
              <p className="text-sm"><span className="font-medium">{likeCount} likes</span></p>

              {comments.length > 0 && (
                <div className="space-y-1">
                  {comments.length > 2 && !showAllComments && (
                    <button className="text-muted-foreground text-xs" onClick={() => setShowAllComments(true)}>
                      View all {comments.length} comments
                    </button>
                  )}
                  {comments.slice(0, showAllComments ? comments.length : 2).map((comment) => (
                    <p key={comment.id} className="text-sm">
                      <span className="font-medium">{comment.user}</span> {comment.text}
                    </p>
                  ))}
                </div>
              )}

              {/* Comment input */}
              <div className="flex items-center gap-2 pt-2">
                <Input placeholder="Add a comment..." className="h-8 text-xs border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0" 
                  value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <Button variant="ghost" size="sm" onClick={handleComment}>Post</Button>
              </div>
            </div>
          </CardContent>
        </Card>

       {/* Project info */}
       <div>
          <h1 className="text-3xl font-bold text-gray-800">{projectData.title}</h1>
          <p className="text-gray-600">{projectData.description}</p>

          <hr className="my-4 border-gray-300" />

          <h2 className="text-lg font-semibold">Project Information</h2>
          <ul className="mt-2 space-y-2 text-gray-700">
            <li><strong>Project Status:</strong> {projectData.status}</li>
            <li><strong>Yarn Types:</strong> {projectData.yarn?.join(", ") || "Not specified"}</li>
            <li><strong>Pattern:</strong> {projectData.pattern}</li>
            <li><strong>Needle Size:</strong> {projectData.needle_size}</li>
            <li><strong>Difficulty Level:</strong> {projectData.difficulty}</li>
            {projectData.timeSpent !== null && <li><strong>Time Spent:</strong> {projectData.timeSpent} hours</li>}
          </ul>

          <hr className="my-4 border-gray-300" />

          {/* Tags */}
          {projectData.tags && projectData.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
              <div className="flex flex-wrap mt-2 gap-2">
                {projectData.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-red-300 text-red-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
