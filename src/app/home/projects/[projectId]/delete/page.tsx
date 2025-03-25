"use client"

import { useRouter, useParams } from "next/navigation"
import { useState } from "react"

export default function DeleteProjectPage() {
  const router = useRouter()
  const { projectId } = useParams() // <-- get [projectId] from the URL
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
        const res = await fetch(`/home/projects/${projectId}/delete/actions`, {
            method: "DELETE",
          })          
          
      if (!res.ok) throw new Error("Failed to delete project.")
      router.push("/home/feed")
    } catch (err) {
      console.error(err)
      alert("Failed to delete project.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
    <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-xl p-8 max-w-md w-full text-center border">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Delete Project
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Are you sure you want to delete this post? This action cannot be undone.
      </p>
  
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Yes, Delete"}
        </button>
        <button
          onClick={() => router.back()}
          disabled={isDeleting}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
  
  )
}