"use server";
import { createClient } from "@/utils/supabase/server";
import { type Tables } from "@/types/database.types";

export async function getProfileByID(id: number): Promise<Tables<"Profiles">> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Profiles")
		.select("*")
		.eq("id", id)
		.returns<Tables<"Profiles">>();
	if (error) throw error;
	const user: Tables<"Profiles"> = data!;
	return user;
}

export async function getProjectByID(id: number): Promise<Tables<"Project">> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Project")
		.select("*")
		.eq("project_id", id)
		.returns<Tables<"Project">>();
	if (error) throw error;
	const project: Tables<"Project"> = data!;
	return project;
}

export async function getPatternByID(id: string): Promise<Tables<"Patterns">> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Patterns")
		.select("*")
		.eq("pattern_id", id)
		.returns<Tables<"Patterns">>();
	if (error) throw error;
	const pattern: Tables<"Patterns"> = data!;
	return pattern;
}

export async function getCommentsByProjectID(
	id: string
): Promise<Tables<"Comments">[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Comments")
		.select("*")
		.eq("project_id", id)
		.returns<Tables<"Comments">[]>();
	if (error) throw error;
	const comments: Tables<"Comments">[] = data!;
	return comments;
}

export async function getFollowersByUserID(
	id: string
): Promise<Tables<"Followers">[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Followers")
		.select("*")
		.eq("user_id", id)
		.returns<Tables<"Followers">[]>();
	if (error) throw error;
	const followers: Tables<"Followers">[] = data!;
	return followers;
}

export async function getFollowingByUserID(
	id: string
): Promise<Tables<"Followers">[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Followers")
		.select("*")
		.eq("follower_id", id)
		.returns<Tables<"Followers">[]>();
	if (error) throw error;
	const following: Tables<"Followers">[] = data!;
	return following;
}

export async function getPatternsByUserID(
	id: string
): Promise<Tables<"Patterns">[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Patterns")
		.select("*")
		.eq("user_id", id)
		.returns<Tables<"Patterns">[]>();
	if (error) throw error;
	const patterns: Tables<"Patterns">[] = data!;
	return patterns;
}

export async function getProjectsByUserID(
	id: string
): Promise<Tables<"Project">[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Project")
		.select("*")
		.eq("user_id", id)
		.returns<Tables<"Project">[]>();
	if (error) throw error;
	const projects: Tables<"Project">[] = data!;
	return projects;
}

export async function getCommentsByUserID(
	id: string
): Promise<Tables<"Comments">[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Comments")
		.select("*")
		.eq("user_id", id)
		.returns<Tables<"Comments">[]>();
	if (error) throw error;
	const comments: Tables<"Comments">[] = data!;
	return comments;
}

export async function getCommentsByPatternID(
	id: string
): Promise<Tables<"Comments">[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Comments")
		.select("*")
		.eq("pattern_id", id)
		.returns<Tables<"Comments">[]>();
	if (error) throw error;
	const comments: Tables<"Comments">[] = data!;
	return comments;
}

export async function getPatternsByProjectID(
	id: string
): Promise<Tables<"Patterns">[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("Patterns")
		.select("*")
		.eq("project_id", id)
		.returns<Tables<"Patterns">[]>();
	if (error) throw error;
	const patterns: Tables<"Patterns">[] = data!;
	return patterns;
}
