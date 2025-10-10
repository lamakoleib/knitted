"use client"

import type React from "react"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X, Upload, Loader2 } from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { uploadProject } from "@/lib/db-actions"
// Sample data for dropdowns
const YARN_TYPES = [
  { label: "Merino Wool", value: "merino-wool" },
  { label: "Cotton", value: "cotton" },
  { label: "Alpaca", value: "alpaca" },
  { label: "Cashmere", value: "cashmere" },
  { label: "Acrylic", value: "acrylic" },
  { label: "Silk", value: "silk" },
  { label: "Bamboo", value: "bamboo" },
  { label: "Linen", value: "linen" },
]

const PATTERNS = [
  { label: "Frog", value: "frog" },
  { label: "Basic Scarf", value: "basic-scarf" },
  { label: "Cable Knit Sweater", value: "cable-knit-sweater" },
  { label: "Lace Shawl", value: "lace-shawl" },
  { label: "Beanie Hat", value: "beanie-hat" },
  { label: "Mittens", value: "mittens" },
  { label: "Socks", value: "socks" },
  { label: "Baby Blanket", value: "baby-blanket" },
  { label: "Cardigan", value: "cardigan" },
]

const DIFFICULTY_LEVELS = [
  { label: "Beginner", value: "beginner" },
  { label: "Easy", value: "easy" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" },
]

const PROJECT_STATUS = [
  { label: "Not Started", value: "not-started" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
]

const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(10).max(500),
  yarnTypes: z.array(z.string()).min(1),
  pattern: z.string().optional(),
  needleSize: z.string().optional(),
  difficultyLevel: z.string({ required_error: "Please select a difficulty level." }),
  projectStatus: z.string({ required_error: "Please select a project status." }),
  timeSpent: z.number().min(0).optional(),
  isPublic: z.boolean().default(true),
  tags: z.string().optional(),
  taggedUsernames: z.string().optional(),
})
/**
 * Renders a form for uploading a new knitting project.
 *
 * Includes:
 * - Image uploader with previews and a 5-image limit
 * - Inputs for project title, description, yarn types, pattern, needle size, difficulty, status, time spent, tags, and visibility
 * - Form validation using Zod and react-hook-form
 * - Submission to the database via `uploadProject`
 *
 * @returns The complete project upload form UI
 */
export default function ProjectUploadForm() {
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      yarnTypes: [],
      pattern: undefined,
      needleSize: "",
      difficultyLevel: "",
      projectStatus: "not-started",
      timeSpent: 0,
      isPublic: true,
      tags: "",
      taggedUsernames: "",
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files)
    setImages(prev => [...prev, ...newFiles])
    const newUrls = newFiles.map((file) => URL.createObjectURL(file))
    setImageUrls(prev => [...prev, ...newUrls])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newUrls = [...imageUrls]
    URL.revokeObjectURL(newUrls[index])
    newImages.splice(index, 1)
    newUrls.splice(index, 1)
    setImages(newImages)
    setImageUrls(newUrls)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item))
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString())
        }
      })
      images.forEach((image) => formData.append("images", image))

      const result = await uploadProject(null, formData)
      if (result.success) {
        form.reset()
        setImages([])
        setImageUrls([])
        alert(result.message)
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as any, { type: "server", message: messages[0] })
          })
        } else {
          alert(result.message)
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Share Your Knitting Project</h1>
        <p className="text-muted-foreground">Upload photos and details about your latest knitting creation</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-lg font-medium">Project Photos</h2>
              <p className="text-sm text-muted-foreground">Upload photos (up to 5)</p>
            </div>
            {/* Image Preview Grid */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                    <img src={url || "/placeholder.svg"} alt={`Project preview ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {/* Upload Button */}
            {imageUrls.length < 5 && (
              <div className="flex items-center justify-center w-full">
                <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB each)</p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={imageUrls.length >= 5 || isSubmitting}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Project Details */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl><Input placeholder="Bird" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl><Textarea placeholder="Share the story…" className="min-h-32 resize-y" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Yarn types */}
              <FormField
                control={form.control}
                name="yarnTypes"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Yarn Types</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value.length && "text-muted-foreground")}>
                            {field.value.length > 0 ? `${field.value.length} selected` : "Select yarn types"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search yarn types..." />
                          <CommandList>
                            <CommandEmpty>No yarn type found.</CommandEmpty>
                            <CommandGroup className="max-h-64 overflow-auto">
                              {YARN_TYPES.map((yarn) => (
                                <CommandItem
                                  key={yarn.value}
                                  value={yarn.value}
                                  onSelect={() => {
                                    const values = field.value || []
                                    const newValues = values.includes(yarn.value)
                                      ? values.filter((v) => v !== yarn.value)
                                      : [...values, yarn.value]
                                    form.setValue("yarnTypes", newValues, { shouldValidate: true })
                                  }}
                                >
                                  <Checkbox checked={field.value?.includes(yarn.value)} className="mr-2" />
                                  {yarn.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((value) => {
                        const yarn = YARN_TYPES.find((y) => y.value === value)
                        return yarn ? (
                          <Badge key={value} variant="secondary" className="gap-1">
                            {yarn.label}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => {
                                const newValues = field.value.filter((v) => v !== value)
                                form.setValue("yarnTypes", newValues, { shouldValidate: true })
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                    <FormDescription>Select all yarn types used</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pattern</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a pattern or leave blank" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {PATTERNS.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="needleSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Needle Size</FormLabel>
                    <FormControl><Input placeholder="US 8 (5mm)" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map((l) => (<SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {PROJECT_STATUS.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent (hours)</FormLabel>
                    <div className="space-y-2">
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Slider min={0} max={100} step={1} value={[field.value || 0]} onValueChange={(v) => field.onChange(v[0])} className="flex-1" />
                          <span className="w-12 text-center">{field.value || 0}h</span>
                        </div>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tag users */}
              <FormField
                control={form.control}
                name="taggedUsernames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag users</FormLabel>
                    <FormControl><Input placeholder="Enter username" {...field} /></FormControl>
                    <FormDescription>Tag users by their usernames (comma separated).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make this project public</FormLabel>
                      <FormDescription>When enabled, your project will be visible to all users</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full bg-red-300" disabled={isSubmitting || images.length === 0}>
            {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>) : ("Share Project")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
