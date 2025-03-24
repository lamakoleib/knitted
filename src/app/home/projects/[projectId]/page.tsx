import Link from "next/link"
import { getCurrentUserProfile, getPostDataByID } from "@/lib/db-actions"
import { PostCard } from "../../feed/components/post-card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Bookmark, Ban, Pencil } from "lucide-react"
/**
 * Renders the project details page.
 *
 * Displays a single project's post content along with metadata such as yarn type,
 * difficulty, needle size, status, tags, and more. If the user is the owner of the project,
 * edit, archive, and delete options are shown via a dropdown menu.
 *
 * @param params - URL parameters containing the `projectId`.
 * @returns The project detail view.
 */
export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const project = await getPostDataByID(projectId)
  const profile = await getCurrentUserProfile()

  const isOwner = project.user_id === profile.id

  return (
    <div className="bg-muted p-4 md:p-12 min-h-screen w-full">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_2fr] gap-6 md:gap-10">

        <div className="relative">
          <PostCard post={project} profile={profile} />

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
              <strong>Pattern:</strong> {project.pattern}
            </li>
            <li>
              <strong>Needle Size:</strong> {project.needle_size}
            </li>
            <li>
              <strong>Difficulty Level:</strong> {project.difficulty}
            </li>
            {project.time_spent !== null && (
              <li>
                <strong>Time Spent:</strong> {project.time_spent} hours
              </li>
            )}
          </ul>

          <hr className="my-4 border-gray-300" />
          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Tags</h2>
              <div className="flex flex-wrap mt-2 gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-300 text-red-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
