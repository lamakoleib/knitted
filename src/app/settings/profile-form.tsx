"use client"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Camera, X } from "lucide-react"
import { useRouter } from "next/navigation";


import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "@/lib/db-actions"
import { Tables } from "@/types/database.types"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  bio: z.string().max(160).min(4),
  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than 5MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp files are accepted.",
    })
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  profile: Tables<"Profiles">
}
/**
 * A form component for editing the current user's public profile.
 *
 * This form allows the user to:
 * - Update their username (2–30 characters)
 * - Edit their bio (4–160 characters)
 * - Upload or remove a profile picture (JPG, PNG, or WebP, max 5MB)
 *
 * The component uses Zod for schema validation and `react-hook-form` for form handling.
 * Submitted data is packaged as `FormData` and sent to the `updateProfile` function.
 *
 * @param profile - The user's existing profile data retrieved from the database.
 * @returns A form UI for updating the user's profile information.
 */
export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const avatarUrl = profile.avatar_url
  const defaultValues = {
    username: profile.username ?? "",
    bio: profile.bio ?? "I like to knit!",
  }
  const [imagePreview, setImagePreview] = useState<string | null>(avatarUrl)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview !== avatarUrl) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    form.setValue("profilePicture", undefined, {
      shouldValidate: true,
      shouldDirty: true,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      console.error("File input ref is not available")
    }
  }

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("username", data.username)
      formData.append("bio", data.bio)

 if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture)
      }

      const result = await updateProfile(formData)

      if (result?.success === false) {
        throw new Error(result.message || "Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-8">
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem className="flex flex-col w-full sm:w-1/3 md:w-1/4">
                <FormLabel>Profile Picture</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center space-y-3 pt-2">
                    <div className="relative group">
                      <Avatar
                        className="h-24 w-24 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          triggerFileInput()
                        }}
                      >
                        <AvatarImage
                          src={
                            imagePreview ||
                            "/placeholder.svg?height=96&width=96"
                          }
                          alt="Profile picture"
                        />
                        <AvatarFallback className="text-xl">
                          {form.watch("username")?.charAt(0).toUpperCase() ||
                            "J"}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          triggerFileInput()
                        }}
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </div>

                      {imagePreview && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        // Create a preview URL for the selected image
                        const previewUrl = URL.createObjectURL(file)
                        setImagePreview(previewUrl)

                        // Set the file in the form
                        onChange(file)
                      }}
                      // Destructure ref from fieldProps to avoid conflict
                      {...(({ ref, ...rest }) => rest)(fieldProps)}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        triggerFileInput()
                      }}
                      className="w-full"
                    >
                      Change
                    </Button>
                  </div>
                </FormControl>
                <FormDescription className="text-center text-xs mt-2">
                  JPG, PNG or WebP. Max 5MB.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="@johndoe" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym. You can only change this once every 30
                    days.                  
                    </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can <span>@mention</span> other users and organizations
                    to link to them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
          <Button
            type="button"
            className="w-full sm:w-auto bg-red-300 text-primary-foreground hover:bg-red-300/90"
            onClick={() => {
              const id = (profile as any)?.id ?? (profile as any)?.user_id
              if (id) router.push(`/home/profile/${id}`)
              else router.back()
            }}
          >
            ← Back to Profile
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-red-300 text-primary-foreground hover:bg-red-300/90"
          >
            {isSubmitting ? "Updating..." : "Update profile"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
