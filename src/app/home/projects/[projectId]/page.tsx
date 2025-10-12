import Link from "next/link";
import {
  getCurrentUserProfile,
  getPostDataByID,
  isSaved,
  getTaggedUsersForProject,
} from "@/lib/db-actions";
import { PostCard } from "../../feed/components/post-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Bookmark, Ban, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
/**
 * Project details page.
 * Always checks DB to see if THIS user saved the project, and seeds PostCard with that.
 */
export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  const [project, profile, initialSaved, taggedUsers] = await Promise.all([
    getPostDataByID(projectId),
    getCurrentUserProfile(),
    isSaved(Number(projectId)),
    getTaggedUsersForProject(Number(projectId)),
  ]);

  if (!project) {
    return <div className="p-6">Project not found.</div>;
  }

  const isOwner = project.user_id === profile.id;

  return (
    <div className="bg-muted p-4 md:p-12 min-h-screen w-full">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-6 md:gap-10">
        <div className="relative">
          {/* Seed bookmark with DB-verified saved state */}
          <PostCard post={project} profile={profile} initialSaved={initialSaved} />

          {isOwner && (
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/home/projects/${project.project_id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Edit Post</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/home/projects/${project.project_id}/archive`}>
                      <div className="flex items-center">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Archive Post
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/home/projects/${project.project_id}/delete`}>
                      <div className="flex items-center text-red-600">
                        <Ban className="mr-2 h-4 w-4" />
                        Delete Post
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Project info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
          <p className="text-gray-600">{project.description}</p>

          <hr className="my-4 border-gray-300" />

          <h2 className="text-lg font-semibold">Project Information</h2>
          <ul className="mt-2 space-y-2 text-gray-700">
            <li>
              <strong>Project Status:</strong> {project.status}
            </li>
            <li>
              <strong>Yarn Types:</strong>{" "}
              {project.yarn?.join(", ") || "Not specified"}
            </li>
            <li>
              <strong>Pattern:</strong> {project.pattern || "—"}
            </li>
            <li>
              <strong>Needle Size:</strong> {project.needle_size || "—"}
            </li>
            <li>
              <strong>Difficulty Level:</strong> {project.difficulty || "—"}
            </li>
            {project.time_spent !== null && (
              <li>
                <strong>Time Spent:</strong> {project.time_spent} hours
              </li>
            )}
          </ul>

          {/* Tagged users */}
          {taggedUsers && taggedUsers.length > 0 && (
            <>
              <hr className="my-4 border-gray-300" />
              <h2 className="text-lg font-semibold text-gray-800">Tagged</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {taggedUsers.map((u) => (
                  <Link
                    key={u.id}
                    href={`/home/profile/${u.id}`}
                    className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow hover:shadow-md transition"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={u.avatar_url ?? ""} alt={u.username ?? ""} />
                      <AvatarFallback>
                        {(u.full_name || u.username || "?")
                          .split(" ")
                          .map((s) => s[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-800">
                      @{u.username ?? u.full_name ?? "user"}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
