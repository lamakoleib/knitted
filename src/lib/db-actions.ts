"use server"
import { createClient } from "@/utils/supabase/server"
import { type Tables } from "@/types/database.types"
import { getCurrentUser } from "./auth-actions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { create } from "domain"

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
