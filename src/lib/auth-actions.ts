"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/utils/supabase/server"

export async function login(formData: FormData) {
	const supabase = await createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	}

	console.log(data)
	const { error } = await supabase.auth.signInWithPassword(data)
	console.log(error)

	if (error) {
		redirect("/error")
	}

	revalidatePath("/", "layout")
	redirect("/home")
}

export async function signup(formData: FormData) {
	const supabase = await createClient()

	const firstName = formData.get("first-name") as string
	const lastName = formData.get("last-name") as string
	console.log(formData)
	const data = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		options: {
			data: {
				full_name: `${firstName + " " + lastName}`,
				email: formData.get("email") as string,
			},
		},
	}
	const { error } = await supabase.auth.signUp(data)
	console.log(error)
	if (error) {
		redirect("/error")
	}

	revalidatePath("/", "layout")
	redirect("/home")
}

export async function getCurrentUser() {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.getUser()

	if (error) {
		console.log(error)
		redirect("/error")
	}

	return data
}

export async function signout() {
	const supabase = await createClient()
	const { error } = await supabase.auth.signOut()
	if (error) {
		console.log(error)
		redirect("/error")
	}

	redirect("/login")
}

export async function signInWithGoogle() {
	const supabase = await createClient()
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			queryParams: {
				access_type: "offline",
				prompt: "consent",
			},
		},
	})

	if (error) {
		console.log(error)
		redirect("/error")
	}

	redirect(data.url)
}
