"use server"

import { redirect } from "next/navigation"
import { demoData } from "@/lib/demo-data"

/**
 * DEMO BUILD: there is no real auth. `getCurrentUser` always returns the
 * demo viewer; login/signup/signout just bounce around so the UI flows.
 */

export async function login(_formData: FormData) {
  redirect("/home")
}

export async function signup(_formData: FormData) {
  redirect("/home")
}

export async function getCurrentUser() {
  const profile = demoData.profilesById.get(demoData.viewerId)!
  return {
    user: {
      id: profile.id,
      email: profile.email ?? "",
      user_metadata: {
        full_name: profile.full_name,
        email: profile.email ?? "",
      },
    },
  }
}

export async function signout() {
  redirect("/login")
}

export async function signInWithGoogle() {
  redirect("/home")
}
