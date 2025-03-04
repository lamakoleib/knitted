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
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not exceed 50 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  yarnTypes: z.array(z.string()).min(1, {
    message: "Please select at least one yarn type.",
  }),
  pattern: z.string().optional(),
  needleSize: z.string().optional(),
  difficultyLevel: z.string({
    required_error: "Please select a difficulty level.",
  }),
  projectStatus: z.string({
    required_error: "Please select a project status.",
  }),
  timeSpent: z.number().min(0).optional(),
  isPublic: z.boolean().default(true),
  tags: z.string().optional(),
})

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
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages((prev) => [...prev, ...newFiles])

      const newUrls = newFiles.map((file) => URL.createObjectURL(file))
      setImageUrls((prev) => [...prev, ...newUrls])
    }
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

      images.forEach((image) => {
        formData.append("images", image)
      })

      const result = await uploadProject(null, formData)

      if (result.success) {
        form.reset()
        setImages([])
        setImageUrls([])

        alert(result.message)
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as any, {
              type: "server",
              message: messages[0],
            })
          })
        } else {
          alert(result.message)
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Share Your Knitting Project
        </h1>
        <p className="text-muted-foreground">
          Upload photos and details about your latest knitting creation
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <h2 className="text-lg font-medium">Project Photos</h2>
              <p className="text-sm text-muted-foreground">
                Upload photos of your knitting project (up to 5 images)
              </p>
            </div>

            {/* Image Preview Grid */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border"
                  >
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Project preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
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
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or WEBP (MAX. 5MB each)
                    </p>
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
                    <FormControl>
                      <Input placeholder="Bird" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your project a descriptive name
                    </FormDescription>
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
                    <FormControl>
                      <Textarea
                        placeholder="Share the story behind your project, challenges you faced, and any tips for others..."
                        className="min-h-32 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your project in detail (up to 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Yarn Types - Multi-select */}
              <FormField
                control={form.control}
                name="yarnTypes"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Yarn Types</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value.length && "text-muted-foreground"
                            )}
                          >
                            {field.value.length > 0
                              ? `${field.value.length} yarn type${
                                  field.value.length > 1 ? "s" : ""
                                } selected`
                              : "Select yarn types"}
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
                                    const newValues = values.includes(
                                      yarn.value
                                    )
                                      ? values.filter(
                                          (value) => value !== yarn.value
                                        )
                                      : [...values, yarn.value]
                                    form.setValue("yarnTypes", newValues, {
                                      shouldValidate: true,
                                    })
                                  }}
                                >
                                  <Checkbox
                                    checked={field.value?.includes(yarn.value)}
                                    className="mr-2"
                                  />
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
                          <Badge
                            key={value}
                            variant="secondary"
                            className="gap-1"
                          >
                            {yarn.label}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => {
                                const newValues = field.value.filter(
                                  (v) => v !== value
                                )
                                form.setValue("yarnTypes", newValues, {
                                  shouldValidate: true,
                                })
                              }}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">
                                Remove {yarn.label}
                              </span>
                            </Button>
                          </Badge>
                        ) : null
                      })}
                    </div>
                    <FormDescription>
                      Select all yarn types used in this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pattern */}
              <FormField
                control={form.control}
                name="pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pattern</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pattern or leave blank for custom" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PATTERNS.map((pattern) => (
                          <SelectItem
                            key={pattern.value}
                            value={pattern.value}
                          >
                            {pattern.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose from common patterns or leave blank if using a
                      custom pattern
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Needle Size */}
              <FormField
                control={form.control}
                name="needleSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Needle Size</FormLabel>
                    <FormControl>
                      <Input placeholder="US 8 (5mm)" {...field} />
                    </FormControl>
                    <FormDescription>
                      What needle size did you use?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Difficulty Level */}
              <FormField
                control={form.control}
                name="difficultyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How challenging was this project?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project Status */}
              <FormField
                control={form.control}
                name="projectStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECT_STATUS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Current status of your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Spent */}
              <FormField
                control={form.control}
                name="timeSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Spent (hours)</FormLabel>
                    <div className="space-y-2">
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value || 0]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="flex-1"
                          />
                          <span className="w-12 text-center">
                            {field.value || 0}h
                          </span>
                        </div>
                      </FormControl>
                    </div>
                    <FormDescription>
                      Approximately how many hours did you spend on this
                      project?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="winter, gift, colorwork (comma separated)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add tags to help others find your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Visibility */}
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make this project public</FormLabel>
                      <FormDescription>
                        When enabled, your project will be visible to all users
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-red-300"
            disabled={isSubmitting || images.length === 0}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Share Project"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
