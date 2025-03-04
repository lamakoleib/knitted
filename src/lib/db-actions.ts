"use server"
import { createClient } from "@/utils/supabase/server"
import { type Tables } from "@/types/database.types"
import { getCurrentUser } from "./auth-actions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { projectSchema } from "@/types/schemas"

type ActionResponse = {
  success: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: any
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

export async function getProjectByID(id: number): Promise<Tables<"Project">> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Project")
    .select("*")
    .eq("project_id", id)
    .returns<Tables<"Project">>()
  if (error) throw error
  const project: Tables<"Project"> = data!
  return project
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
  const username = formData.get("username") as string
  const bio = formData.get("bio") as string

  const user = await getCurrentUser()
  if (!user) {
    console.error("User not authenticated")
    return
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("Profiles")
    .update({ username, bio, initialized: true })
    .eq("id", user.user.id)
    .select()

  if (error) {
    console.log("Error updating profile:", error)
  } else {
    console.log("Update successful:", data)
  }

  revalidatePath("/", "layout")
  redirect("/home")
}

export async function getFollowersByUserID(
  id: string
): Promise<Tables<"Followers">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Followers")
    .select("*")
    .eq("user_id", id)
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
    .eq("follower_id", id)
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

export async function getProjectsByUserID(
  id: string
): Promise<Tables<"Project">[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("Project")
    .select("*")
    .eq("user_id", id)
    .returns<Tables<"Project">[]>()
  if (error) throw error
  const projects: Tables<"Project">[] = data!
  return projects
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
  console.log("validated schema")
  try {
    const images = formData.getAll("images") as File[]
    const imageUrls: string[] = []
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)
    const folderPath = `projects/${timestamp}-${randomString}`
    const supabase = await createClient()
    const user = await getCurrentUser()
    console.log("Going over images...")
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
