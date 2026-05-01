"use server"

/**
 * DEMO BUILD: every read in this module is served from src/lib/demo-data.ts.
 * Writes are intentional no-ops so the static demo can't be mutated by visitors.
 *
 * The function shapes match what the original Supabase-backed module returned,
 * so all callers (server components, client components) keep working.
 */

import { type Tables } from "@/types/database.types"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { FeedPost } from "@/types/feed"
import { demoData, attachProfile, type NotificationType } from "@/lib/demo-data"

type ActionResponse = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: any
}

type Profile = Tables<"Profiles">

const VIEWER_ID = demoData.viewerId

export async function searchProfiles(searchTerm: string) {
  if (searchTerm.trim().length < 2) return []
  const q = searchTerm.trim().toLowerCase()
  return demoData.profiles
    .filter((p) =>
      [p.full_name, p.username]
        .filter(Boolean)
        .some((f) => f!.toLowerCase().includes(q))
    )
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      full_name: p.full_name,
      username: p.username,
      email: p.email,
      avatar_url: p.avatar_url,
      follower_count: p.follower_count,
    }))
}

export async function getProfileByID(id: string): Promise<Profile> {
  const profile = demoData.profilesById.get(id)
  if (!profile) throw new Error(`Profile ${id} not found`)
  return profile
}

export async function getProjectByID(
  id: string
): Promise<(Tables<"Project"> & { Profiles?: Tables<"Profiles"> }) | null> {
  const project = demoData.projects.find(
    (p) => String(p.project_id) === String(id)
  )
  if (!project) throw new Error("Project not found")
  const author = demoData.profilesById.get(project.user_id)
  return author ? { ...project, Profiles: author } : project
}

export async function getPatternByID(_id: string): Promise<Tables<"Patterns">> {
  return {
    pattern_id: 0,
    pattern_name: null,
    author_name: null,
    project_id: null,
    yarn_id: null,
  }
}

export async function getCommentsByProjectID(
  id: string
): Promise<Tables<"Comments">[]> {
  return demoData.comments
    .filter((c) => String(c.project_id) === String(id))
    .map((c) => ({
      comment_id: c.comment_id,
      created_at: c.created_at,
      project_id: c.project_id,
      user_id: c.user_id,
    })) as Tables<"Comments">[]
}

export async function getCurrentUserProfile(): Promise<Profile> {
  return getProfileByID(VIEWER_ID)
}

export async function updateProfile(_formData: FormData) {
  return { success: false, message: "Profile editing is disabled in the demo." }
}

export async function getFollowersByUserID(
  id: string
): Promise<Tables<"Followers">[]> {
  return demoData.follows
    .filter((f) => f.user_id === id)
    .map((f) => ({ user_id: f.user_id, followers_id: f.followers_id }))
}

export async function getFollowingByUserID(
  id: string
): Promise<Tables<"Followers">[]> {
  return demoData.follows
    .filter((f) => f.followers_id === id)
    .map((f) => ({ user_id: f.user_id, followers_id: f.followers_id }))
}

export async function getPatternsByUserID(
  _id: string
): Promise<Tables<"Patterns">[]> {
  return []
}

export async function getProjectsByUserID(userId: string) {
  return demoData.projects
    .filter((p) => p.user_id === userId && !p.archived_at)
    .map((p) => ({
      project_id: p.project_id,
      title: p.title,
      images: p.images,
      comment_count: demoData.comments.filter(
        (c) => c.project_id === p.project_id
      ).length,
    }))
}

export async function getCommentsByUserID(
  id: string
): Promise<Tables<"Comments">[]> {
  return demoData.comments
    .filter((c) => c.user_id === id)
    .map((c) => ({
      comment_id: c.comment_id,
      created_at: c.created_at,
      project_id: c.project_id,
      user_id: c.user_id,
    })) as Tables<"Comments">[]
}

export async function getCommentsByPatternID(
  _id: string
): Promise<Tables<"Comments">[]> {
  return []
}

export async function getPatternsByProjectID(
  _id: string
): Promise<Tables<"Patterns">[]> {
  return []
}

export async function insertFollower(_profileId: string) {
  // demo: no-op
}

export async function isFollowing(profileId: string): Promise<boolean> {
  return demoData.follows.some(
    (f) => f.user_id === VIEWER_ID && f.followers_id === profileId
  )
}

export async function unfollow(_profileId: string) {
  // demo: no-op
}

export async function uploadProject(
  _prevState: ActionResponse | null,
  _formData: FormData
): Promise<ActionResponse> {
  return {
    success: false,
    message: "Uploading is disabled in this demo build.",
  }
}

export async function getFeedPosts(): Promise<FeedPost[]> {
  const followingIds = demoData.follows
    .filter((f) => f.user_id === VIEWER_ID)
    .map((f) => f.followers_id)

  // Include the viewer's own posts so the feed is populated even before
  // following anyone.
  const ids = new Set([VIEWER_ID, ...followingIds])

  return demoData.projects
    .filter((p) => ids.has(p.user_id) && !p.archived_at)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .map(attachProfile)
}

export async function getPostDataByID(projectId: string): Promise<FeedPost> {
  const project = demoData.projects.find(
    (p) => String(p.project_id) === String(projectId)
  )
  if (!project) {
    return null as unknown as FeedPost
  }
  return attachProfile(project)
}

export async function likePost(_projectId: number) {
  // demo: no-op
}

export async function unlikePost(_projectId: number) {
  // demo: no-op
}

export async function isLiked(projectId: number) {
  return demoData.likes.some(
    (l) => l.user_id === VIEWER_ID && l.project_id === projectId
  )
}

export async function addComment(_projectId: number, comment: string) {
  // demo: return a synthetic comment so the UI updates locally,
  // but nothing is persisted.
  const me = await getCurrentUserProfile()
  return {
    id: Math.floor(Math.random() * 1_000_000) + 100_000,
    comment,
    created_at: new Date().toISOString(),
    user_id: me.id,
    username: me.username ?? me.full_name,
    avatar_url: me.avatar_url,
  }
}

export async function getCommentCountByPostID(projectId: number) {
  return demoData.comments.filter((c) => c.project_id === projectId).length
}

export async function updateProjectByID(_projectId: string, _updatedData: any) {
  return null
}

export async function getComments(projectId: number) {
  return demoData.comments
    .filter((c) => c.project_id === projectId)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .map((c) => {
      const author = demoData.profilesById.get(c.user_id)
      return {
        id: c.comment_id,
        comment: c.comment,
        created_at: c.created_at,
        user_id: c.user_id,
        username: author?.username ?? "user",
        avatar_url: author?.avatar_url ?? null,
      }
    })
}

export type { NotificationType }

export type NotificationRow = {
  notification_id: number
  user_id: string
  actor_id: string
  project_id: number | null
  type: NotificationType
  is_read: boolean | null
  created_at: string
}

export type NotificationWithActor = NotificationRow & {
  actor_profile: {
    id: string
    username: string | null
    avatar_url: string | null
    full_name: string | null
  } | null
}

export async function unreadNotificationsCount(): Promise<number> {
  return demoData.notifications.filter(
    (n) => n.user_id === VIEWER_ID && n.is_read !== true
  ).length
}

export async function markAllNotificationsRead(): Promise<void> {
  // demo: no-op
}

export async function fetchNotifications(
  limit = 50
): Promise<NotificationWithActor[]> {
  return demoData.notifications
    .filter((n) => n.user_id === VIEWER_ID)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, limit)
    .map((n) => {
      const actor = demoData.profilesById.get(n.actor_id)
      return {
        ...n,
        actor_profile: actor
          ? {
              id: actor.id,
              username: actor.username,
              avatar_url: actor.avatar_url,
              full_name: actor.full_name,
            }
          : null,
      }
    })
}

export async function getMySavedProjectIds(): Promise<number[]> {
  const profile = demoData.profilesById.get(VIEWER_ID)
  return (profile?.saved_projects ?? [])
    .map((id) => Number(id))
    .filter((n) => Number.isFinite(n))
}

export async function isSaved(projectId: number) {
  const ids = await getMySavedProjectIds()
  return ids.includes(projectId)
}

export async function savePost(
  _projectId: number
): Promise<{ success: boolean; error: any }> {
  return { success: true, error: null }
}

export async function unsavePost(
  _projectId: number
): Promise<{ success: boolean; error: any }> {
  return { success: true, error: null }
}

export async function toggleSavePost(projectId: number) {
  const saved = await isSaved(projectId)
  return { saved: !saved }
}

export async function getMySavedProjects(): Promise<Tables<"Project">[]> {
  const ids = new Set(await getMySavedProjectIds())
  return demoData.projects.filter(
    (p) => ids.has(p.project_id) && !p.archived_at
  ) as Tables<"Project">[]
}

export async function tagUsersOnProject(
  _projectId: number,
  _taggedUserIds: string[]
): Promise<{ success: boolean; error?: any }> {
  return { success: true, error: null }
}

export async function getTaggedProjectsByUserID(userId: string) {
  const taggedIds = demoData.projectTags
    .filter((t) => t.tagged_user === userId)
    .map((t) => t.project_id)
  return demoData.projects
    .filter((p) => taggedIds.includes(p.project_id))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .map((p) => ({
      project_id: p.project_id,
      title: p.title,
      images: p.images,
      user_id: p.user_id,
      created_at: p.created_at,
      project_tags: [{ tagged_user: userId }],
      comment_count: demoData.comments.filter(
        (c) => c.project_id === p.project_id
      ).length,
    }))
}

export async function updateProjectTagsByUsernames(
  _projectId: string | number,
  _taggedUsernamesCsv: string
) {
  // demo: no-op
}

export async function getTaggedUsersForProject(projectId: number | string) {
  const ids = demoData.projectTags
    .filter((t) => String(t.project_id) === String(projectId))
    .map((t) => t.tagged_user)
  return ids
    .map((id) => demoData.profilesById.get(id))
    .filter(Boolean)
    .map((p) => ({
      id: p!.id,
      username: p!.username,
      full_name: p!.full_name,
      avatar_url: p!.avatar_url,
    }))
}

export async function deleteProjectByID(_projectId: number) {
  // demo: no-op, but redirect away to the profile so the UI feels responsive
  redirect(`/home/profile/${VIEWER_ID}`)
}

export async function deleteComment(_commentId: number) {
  // demo: no-op
}

type UpdateAccountInput = {
  name?: string
  birthday?: string
}

export async function updateAccountSettings(
  _input: UpdateAccountInput
): Promise<{ success: boolean; message?: string }> {
  return {
    success: false,
    message: "Account settings are read-only in this demo build.",
  }
}

export async function updateAppearanceSettings(_input: {
  theme: "light" | "dark"
  font: "inter" | "manrope" | "system"
}): Promise<{ success: boolean; message?: string }> {
  return { success: true }
}

export async function archiveProject(_projectId: number) {
  // demo: no-op
  revalidatePath("/home")
}

export async function unarchiveProject(_projectId: number) {
  // demo: no-op
  revalidatePath("/home")
}

export async function getArchivedProjectsByUser(
  _userId: string,
  _opts: { limit?: number; page?: number } = {}
) {
  return []
}
