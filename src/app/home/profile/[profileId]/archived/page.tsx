import { getCurrentUserProfile, getArchivedProjectsByUser, unarchiveProject } from "@/lib/db-actions"
import { PostCard } from "../../../feed/components/post-card"
import { revalidatePath } from "next/cache"
import { Button } from "@/components/ui/button"
import { ArchiveRestore } from "lucide-react"

export default async function ProfileArchivedPage() {
  const profile = await getCurrentUserProfile()
  if (!profile?.id) {
    return <div className="p-6">Please sign in to view archived posts.</div>
  }

  const projects = await getArchivedProjectsByUser(profile.id)

  return (
    <div className="mx-auto max-w-3xl md:max-w-5xl p-4 md:p-6 space-y-6">
      <h1 className="text-lg font-semibold">Archived Projects</h1>

      {!projects || projects.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-sm text-muted-foreground">
          You haven’t archived any posts yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((post: any) => (
            <div key={post.project_id} className="relative rounded-xl">
              <PostCard post={post} profile={profile} />

              <form
                action={async () => {
                  "use server"
                  await unarchiveProject(Number(post.project_id))
                  revalidatePath(`/home/profile/${profile.id}/archived`)
                  revalidatePath(`/home/profile/${profile.id}`)
                }}
                className="absolute bottom-1 left-3"
              >
                <Button
                  type="submit"
                  variant="outline"
                  className="h-8 rounded-full px-3 text-xs font-medium gap-2 shadow-none ring-1 ring-black/5 hover:ring-black/10 hover:bg-transparent"
                  aria-label="Unarchive"
                >
                  <ArchiveRestore className="h-3.5 w-3.5" />
                  Unarchive
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}