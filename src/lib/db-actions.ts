"use server"
import { createClient } from "@/utils/supabase/server"
import { type Tables } from "@/types/database.types"
import { getCurrentUser } from "./auth-actions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { projectSchema } from "@/types/schemas"
import { FeedPost } from "@/types/feed"

/**
 * Server-side actions for interacting with Supabase.
 *
 * This module contains all logic related to:
 * - User profile and project CRUD operations
 * - Search and filtering
 * - Followers/following system
 * - Project feed, likes, saves, and comments
 * - Form submissions and validation
 *
 * These actions are used throughout the app to interact with Supabase tables such as
 * `Profiles`, `Project`, `Comments`, `Followers`, `Likes`, and `Patterns`.
 */
type ActionResponse = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: any
}

export async function searchProfiles(searchTerm: string) {
  if (searchTerm.trim().length < 2) return [];
  const supabase = await createClient();
  const formattedSearchTerm = `%${searchTerm.trim()}%`;

  console.log("Search Term:", formattedSearchTerm);

  const { data, error } = await supabase
    .from("Profiles")
    .select("id, full_name, username, email, avatar_url, follower_count")
    .or(
      `full_name.ilike.${formattedSearchTerm}, username.ilike.${formattedSearchTerm}`
    )
    .limit(10); //limit results to avoid excessive queries

  console.log("Query Result:", data);

  if (error) {
    console.error("Error searching profiles:", error);
    return [];
  }

  return data ?? [];
}

export async function getProfileByID(id: string): Promise<Tables<"Profiles">> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Profiles")
    .select("*")
    .eq("id", id)
    .single()
  if (error) throw error
  const user: Tables<"Profiles"> = data!
  return user
}

export async function getProjectByID(
  id: string
): Promise<(Tables<"Project"> & { Profiles?: Tables<"Profiles"> }) | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("Project")
    .select(
      `
      *,
      Profiles:Profiles (username, avatar_url)
    `
    )
    .eq("project_id", id)
    .single()

    if (error || !data) {
      console.error("Error fetching project:", error || "Project not found");
      throw new Error("Project not found");
  }

  console.log("Fetched project from DB:", data)
  return data
}

export async function getPatternByID(id: string): Promise<Tables<"Patterns">> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Patterns")
    .select("*")
    .eq("pattern_id", id)
    .returns<Tables<"Patterns">>()
  if (error) throw error
  const pattern: Tables<"Patterns"> = data!
  return pattern
}

export async function getCommentsByProjectID(
  id: string
): Promise<Tables<"Comments">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Comments")
    .select("*")
    .eq("project_id", id)
    .returns<Tables<"Comments">[]>()
  if (error) throw error
  const comments: Tables<"Comments">[] = data!
  return comments
}

export async function getCurrentUserProfile(): Promise<Tables<"Profiles">> {
  const user = await getCurrentUser()
  const profile = await getProfileByID(user.user.id)
  return profile
}

export async function updateProfile(formData: FormData) {
  try {
    const username = formData.get("username") as string
    const bio = formData.get("bio") as string
    const profilePicture = formData.get("profilePicture") as File | null

    const user = await getCurrentUser()
    if (!user) {
      console.error("User not authenticated")
      throw new Error("User not authenticated")
    }

    const supabase = await createClient()
    let avatarUrl = null

    if (profilePicture && profilePicture.size > 0) {
      console.log("Uploading profile picture...")

      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 10)
      const fileName = `avatar-${timestamp}-${randomString}.${profilePicture.name
        .split(".")
        .pop()}`
      const filePath = `${user.user.id}/avatars/${fileName}`

      const arrayBuf = await profilePicture.arrayBuffer()

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("knitted-images")
        .upload(filePath, arrayBuf, {
          contentType: profilePicture.type,
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Error uploading to Supabase:", uploadError)
        throw new Error(
          `Failed to upload profile picture: ${uploadError.message}`
        )
      }

      const { data: publicUrlData } = supabase.storage
        .from("knitted-images")
        .getPublicUrl(filePath)

      avatarUrl = publicUrlData.publicUrl
      console.log("Profile picture uploaded successfully:", avatarUrl)
    }

    const updateData: {
      username: string
      bio: string
      initialized: boolean
      avatar_url?: string
    } = {
      username,
      bio,
      initialized: true,
    }

    if (avatarUrl) {
      updateData.avatar_url = avatarUrl
    }

    const { data, error } = await supabase
      .from("Profiles")
      .update(updateData)
      .eq("id", user.user.id)
      .select()

    if (error) {
      console.error("Error updating profile:", error)
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    console.log("Profile updated successfully:", data)

    if (avatarUrl && data[0]?.avatar_url && data[0].avatar_url !== avatarUrl) {
      try {
        const oldAvatarPath = data[0].avatar_url.split("/").slice(-2).join("/")
        if (oldAvatarPath && oldAvatarPath.includes(user.user.id)) {
          await supabase.storage.from("profile-images").remove([oldAvatarPath])
          console.log("Old avatar removed successfully")
        }
      } catch (cleanupError) {
        console.warn("Failed to remove old avatar:", cleanupError)
      }
    }

    revalidatePath("/", "layout")
    redirect("/home/profile")
  } catch (error) {
    console.error("Error in updateProfile:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    }
  }
}

export async function getFollowersByUserID(
  id: string
): Promise<Tables<"Followers">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Followers")
    .select("*")
    .eq("followers_id", id)
    .returns<Tables<"Followers">[]>()
  if (error) throw error
  const followers: Tables<"Followers">[] = data!
  return followers
}

export async function getFollowingByUserID(
  id: string
): Promise<Tables<"Followers">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Followers")
    .select("*")
    .eq("user_id", id)
    .returns<Tables<"Followers">[]>()
  if (error) throw error
  const following: Tables<"Followers">[] = data!
  return following
}

export async function getPatternsByUserID(
  id: string
): Promise<Tables<"Patterns">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Patterns")
    .select("*")
    .eq("user_id", id)
    .returns<Tables<"Patterns">[]>()
  if (error) throw error
  const patterns: Tables<"Patterns">[] = data!
  return patterns
}

export async function getProjectsByUserID(userId: string) {
  const supabase = await createClient();

  //Fetches projects
  const { data: projects, error: projectsError } = await supabase
      .from("Project")
      .select("project_id, title, images")
      .eq("user_id", userId);
  if (projectsError) {
      console.error("Error fetching projects:", projectsError);
      return [];
  }
  //Fetches comment counts for all projects
  const projectsWithComments = await Promise.all(projects.map(async (project) => {
      const { count, error: countError } = await supabase
          .from("Comments")
          .select("*", { count: "exact", head: true })
          .eq("project_id", project.project_id);

      if (countError) {
          console.error(`Error fetching comment count for project ${project.project_id}:`, countError);
          return { ...project, comment_count: 0 };
      }

      return { ...project, comment_count: count ?? 0 };
  }));
  return projectsWithComments;
}


export async function getCommentsByUserID(
  id: string
): Promise<Tables<"Comments">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Comments")
    .select("*")
    .eq("user_id", id)
    .returns<Tables<"Comments">[]>()
  if (error) throw error
  const comments: Tables<"Comments">[] = data!
  return comments
}

export async function getCommentsByPatternID(
  id: string
): Promise<Tables<"Comments">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Comments")
    .select("*")
    .eq("pattern_id", id)
    .returns<Tables<"Comments">[]>()
  if (error) throw error
  const comments: Tables<"Comments">[] = data!
  return comments
}

export async function getPatternsByProjectID(
  id: string
): Promise<Tables<"Patterns">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Patterns")
    .select("*")
    .eq("project_id", id)
    .returns<Tables<"Patterns">[]>()
  if (error) throw error
  const patterns: Tables<"Patterns">[] = data!
  return patterns
}

export async function insertFollower(profileId: string) {
  const user = await getCurrentUser()
  if (!user) {
    console.log("Error: No User")
    return
  }
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("Followers")
    .insert({ user_id: user.user.id, followers_id: profileId })
    .select()
  if (error) {
    throw error
  }
  console.log(data)
}

export async function isFollowing(profileId: string): Promise<boolean> {
  const user = await getCurrentUser()
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("Followers")
    .select("*", { count: "exact", head: true }) // head: true returns only the count
    .eq("user_id", user.user.id)
    .eq("followers_id", profileId)
  if (error) {
    console.log(error)
    return false
  }
  return (count ?? 0) > 0
}

export async function unfollow(profileId: string) {
  const user = await getCurrentUser()
  const supabase = await createClient()
  const { error } = await supabase
    .from("Followers")
    .delete()
    .eq("user_id", user.user.id)
    .eq("followers_id", profileId)

  if (error) throw error
}

export async function uploadProject(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  console.log("Uploading project...")
  const validatedFields = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    yarnTypes: formData.getAll("yarnTypes"),
    pattern: formData.get("pattern"),
    needleSize: formData.get("needleSize"),
    difficultyLevel: formData.get("difficultyLevel"),
    projectStatus: formData.get("projectStatus"),
    timeSpent: Number(formData.get("timeSpent")),
    isPublic: formData.get("isPublic") === "true",
    tags: formData.get("tags"),
  })
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Form validation failed",
    }
  }
  const data = validatedFields.data
  try {
    const images = formData.getAll("images") as File[]
    const imageUrls: string[] = []
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)
    const folderPath = `projects/${timestamp}-${randomString}`
    const supabase = await createClient()
    const user = await getCurrentUser()
    for (const image of images) {
      console.log("Image:" + image.name)
      const fileName = `${Date.now()}-${image.name
        .replace(/\s+/g, "-")
        .toLowerCase()}`
      const filePath = `${user.user.id}/${folderPath}/${fileName}`

      const arrayBuf = await image.arrayBuffer()
      const { data: uploadData, error } = await supabase.storage
        .from("knitted-images")
        .upload(filePath, arrayBuf, {
          contentType: image.type,
          cacheControl: "3600",
          upsert: false,
        })
      console.log("Uploaded images")

      if (error) {
        console.error("Error uploading to Supabase:", error)
        throw new Error(`Failed to upload image: ${error.message}`)
      }
      console.log("adding image" + fileName)
      const { data: publicUrlData } = supabase.storage
        .from("knitted-images")
        .getPublicUrl(filePath)
      imageUrls.push(publicUrlData.publicUrl)
    }
    console.log("finished images")
    const { data: projectData, error: insertError } = await supabase
      .from("Project")
      .insert({
        title: data.title,
        description: data.description,
        yarn: data.yarnTypes,
        pattern: data.pattern,
        needle_size: data.needleSize,
        difficulty: data.difficultyLevel,
        status: data.projectStatus,
        time_spent: data.timeSpent,
        tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        images: imageUrls,
        user_id: user.user.id,
      })
      .select()
    if (insertError) {
      console.log("Error inserting project data:", insertError)
      throw new Error(`Failed to save project: ${insertError.message}`)
    }
    console.log("Inserted data!")
    return {
      success: true,
      message: "Project created successfully!",
      data: { ...data, imageUrls, id: projectData?.[0]?.id },
    }
  } catch (error) {
    console.error("Error creating project:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create project. Please try again.",
    }
  }
}

export async function getFeedPosts(): Promise<FeedPost[]> {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const { data: followingData, error: followingError } = await supabase
    .from("Followers")
    .select("followers_id")
    .eq("user_id", user.user.id)

  if (followingError || !followingData.length) {
    return []
  }

  const followedUserIds = followingData.map((follow) => follow.followers_id)

  const { data: posts, error: postsError } = await supabase
    .from("Project")
    .select(
      `
		*,
		Profiles:user_id (
		  id,
		  username,
		  avatar_url,
		  full_name
		)
	  `
    )
    .in("user_id", followedUserIds)
    .order("created_at", { ascending: false })

  if (postsError) {
    return []
  }

  return posts
}

export async function getPostDataByID(projectId: string): Promise<FeedPost> {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("Project")
    .select(
      `
      *,
      Profiles:user_id (
        id,
        username,
        avatar_url,
        full_name
      )
      `
    )
    .eq("project_id", projectId)
    .single()

  if (error) {
    console.error("Error fetching post:", error)
  }

  return post
}

export async function likePost(projectId: number) {
  const user = await getCurrentUser()
  const supabase = await createClient()
  const { error } = await supabase
    .from("Likes")
    .insert({ project_id: projectId, user_id: user.user.id })
  if (error) {
    throw error
  }
}

export async function unlikePost(projectId: number) {
  const user = await getCurrentUser()
  const supabase = await createClient()
  const { error } = await supabase
    .from("Likes")
    .delete()
    .eq("user_id", user.user.id)
    .eq("project_id", projectId)
  if (error) {
    throw error
  }
}

export async function isLiked(projectId: number) {
  const user = await getCurrentUser()
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("Likes")
    .select("*", { count: "exact", head: true }) // head: true returns only the count
    .eq("user_id", user.user.id)
    .eq("project_id", projectId)
  if (error) {
    console.log(error)
    return false
  }
  return (count ?? 0) > 0
}

export async function addComment(projectId: number, comment: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) throw new Error("User not authenticated")

  // First insert the comment
  const { data: commentData, error: commentError } = await supabase
    .from("Comments")
    .insert({
      project_id: projectId,
      user_id: user.user.id,
      comment: comment,
    })
    .select("comment_id, created_at")
    .single()

  if (commentError) throw commentError

  const { data: profileData, error: profileError } = await supabase
    .from("Profiles")
    .select("username, avatar_url")
    .eq("id", user.user.id)
    .single()

  if (profileError) throw profileError

  return {
    id: commentData.comment_id,
    comment,
    created_at: commentData.created_at,
    user_id: user.user.id,
    username: profileData.username,
    avatar_url: profileData.avatar_url,
  }
}

export async function getCommentCountByPostID(projectId: number) {
  const supabase = await createClient();

  const { count, error } = await supabase
      .from("Comments")
      .select("*", { count: "exact", head: true })
      .eq("project_id", projectId);

  if (error) {
      console.error("Error fetching comment count:", error);
      return 0;
  }
  return count ?? 0;
}

export async function updateProjectByID(projectId: string, updatedData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Project")
    .update(updatedData)
    .eq("project_id", projectId);

  if (error) {
    console.error("Error updating project in Supabase:", error);
    throw error;
  }

  console.log("Project updated successfully:", data);
  return data;
}

export async function getComments(projectId: number) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("Comments")
    .select(
      `
      comment_id,
      created_at,
      comment,
      user_id,
      Profiles:user_id (
        username,
        avatar_url
      )
    `
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data.map((comment: any) => ({
    id: comment.comment_id,
    comment: comment.comment,
    created_at: comment.created_at,
    user_id: comment.user_id,
    username: comment.Profiles?.username || "Unknown User",
    avatar_url: comment.Profiles?.avatar_url,
  }))
}

// --- Notifications (keep only one copy) ---
export type NotificationType = "like" | "comment" | "follow"

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
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { count, error } = await supabase
    .from("notifications")
    .select("notification_id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .or("is_read.is.false,is_read.is.null")

  if (error) return 0
  return count ?? 0
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .or("is_read.is.false,is_read.is.null")
}

export async function fetchNotifications(limit = 50): Promise<NotificationWithActor[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: notifs } = await supabase
    .from("notifications")
    .select("notification_id, user_id, actor_id, project_id, type, is_read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  const notifications = notifs ?? []
  const actorIds = Array.from(new Set(notifications.map(n => n.actor_id).filter(Boolean)))

  let profilesById: Record<string, { id: string; username: string | null; avatar_url: string | null; full_name: string | null }> = {}
  if (actorIds.length) {
    const { data: profiles } = await supabase
      .from("Profiles")
      .select("id, username, avatar_url, full_name")
      .in("id", actorIds)
    profilesById = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))
  }
  return notifications.map(n => ({
    ...n,
    actor_profile: profilesById[n.actor_id] ?? null,
  }))
}
// Normalize and fetch the current user's BIGINT[] of saved project IDs
async function getMySavedIdsRaw(userId: string): Promise<number[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Profiles")
    .select("saved_projects")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const raw = (data?.saved_projects ?? []) as unknown[];
  return raw
    .map((x) => (typeof x === "number" ? x : Number(x)))
    .filter((n) => Number.isFinite(n)) as number[];
}

export async function getMySavedProjectIds(): Promise<number[]> {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user?.user?.id) return [];
  return getMySavedIdsRaw(user.user.id);
}

export async function isSaved(projectId: number) {
  const user = await getCurrentUser();
  if (!user?.user?.id) return false;

  const ids = await getMySavedIdsRaw(user.user.id);
  return ids.includes(projectId);
}

export async function savePost(projectId: number) {
  const user = await getCurrentUser();
  if (!user?.user?.id) return { success: false, error: "User not found" };

  const supabase = await createClient();
  const ids = await getMySavedIdsRaw(user.user.id);
  if (!ids.includes(projectId)) ids.push(projectId);

  const { error } = await supabase
    .from("Profiles")
    .update({ saved_projects: ids })
    .eq("id", user.user.id);

  return { success: !error, error: error ?? null };
}

export async function unsavePost(projectId: number) {
  const user = await getCurrentUser();
  if (!user?.user?.id) return { success: false, error: "User not found" };

  const supabase = await createClient();
  const ids = await getMySavedIdsRaw(user.user.id);
  const next = ids.filter((id) => id !== projectId);

  const { error } = await supabase
    .from("Profiles")
    .update({ saved_projects: next })
    .eq("id", user.user.id);

  return { success: !error, error: error ?? null };
}

export async function toggleSavePost(projectId: number) {
  const saved = await isSaved(projectId);
  if (saved) {
    await unsavePost(projectId);
    return { saved: false };
  } else {
    await savePost(projectId);
    return { saved: true };
  }
}

export async function getMySavedProjects(): Promise<Tables<"Project">[]> {
  const supabase = await createClient();
  const ids = await getMySavedProjectIds();
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from("Project")
    .select("*")
    .in("project_id", ids)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Tables<"Project">[];
}
