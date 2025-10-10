"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

import {
  updateProjectByID,
  updateProjectTagsByUsernames,
} from "@/lib/db-actions";

const YARN_TYPES = [
  { label: "Merino Wool", value: "merino-wool" },
  { label: "Cotton", value: "cotton" },
  { label: "Alpaca", value: "alpaca" },
  { label: "Cashmere", value: "cashmere" },
  { label: "Acrylic", value: "acrylic" },
  { label: "Silk", value: "silk" },
  { label: "Bamboo", value: "bamboo" },
  { label: "Linen", value: "linen" },
];

const DIFFICULTY_LEVELS = [
  { label: "Beginner", value: "beginner" },
  { label: "Easy", value: "easy" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" },
];

const PROJECT_STATUS = [
  { label: "Not Started", value: "not-started" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

const PATTERNS = [
  { label: "Frog", value: "frog" },
  { label: "Cable Knit Sweater", value: "cable-knit-sweater" },
  { label: "Basic Scarf", value: "basic-scarf" },
];

const editSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  yarnTypes: z.array(z.string()).min(1),
  pattern: z.string().optional(),
  needleSize: z.string().optional(),
  difficultyLevel: z.string(),
  projectStatus: z.string(),
  timeSpent: z.number().min(0).optional(),
  tags: z.string().optional(),
  taggedUsernames: z.string().optional(),
});
/**
 * Renders an edit form for updating an existing knitting project.
 *
 * Allows users to:
 * - Upload and preview project images (up to 5)
 * - Update title, description, yarn types, pattern, difficulty, status, etc.
 * - Submit updated data to the database via `updateProjectByID`
 *
 * @param project - The existing project data to prefill the form with
 * @returns A fully featured form UI for editing a project
 */
type EditFormValues = z.infer<typeof editSchema>;

type Props = {
  project: any;
  initialTaggedUsernames: string;
};
export default function EditForm({ project, initialTaggedUsernames }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    project.images || project.image_urls || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: project.title || "",
      description: project.description || "",
      yarnTypes: project.yarn || [],
      pattern: project.pattern || "",
      needleSize: project.needle_size || "",
      difficultyLevel: project.difficulty || "",
      projectStatus: project.status || "not-started",
      timeSpent: project.time_spent || 0,
      tags: Array.isArray(project.tags)
        ? project.tags.join(", ")
        : (project.tags ?? ""),
      taggedUsernames: initialTaggedUsernames || "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setImageUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...imageUrls];
    URL.revokeObjectURL(newUrls[index]);
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    setImages(newImages);
    setImageUrls(newUrls);
  };

  const onSubmit = async (values: EditFormValues) => {
    setIsSubmitting(true);
    try {
      const updatedData = {
        title: values.title,
        description: values.description,
        yarn: values.yarnTypes,
        pattern: values.pattern,
        needle_size: values.needleSize,
        difficulty: values.difficultyLevel,
        status: values.projectStatus,
        time_spent: values.timeSpent,
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
      };

      await updateProjectByID(project.project_id, updatedData);
      await updateProjectTagsByUsernames(
        project.project_id,
        values.taggedUsernames ?? ""
      );

      alert("Project updated successfully!");
      router.push(`/home/projects/${project.project_id}`);
      router.refresh();
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Failed to update project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Project photos */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Project Photos</h2>
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {imageUrls.map((url: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-md overflow-hidden border"
                >
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
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
          {imageUrls.length < 5 && (
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
          )}
        </div>

        {/* Project details */}
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
                    <Input placeholder="Spiderman Crochet" {...field} />
                  </FormControl>
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
                      placeholder="Describe your project..."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
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
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value.length && "text-muted-foreground"
                          )}
                        >
                          {field.value.length > 0
                            ? `${field.value.length} selected`
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
                                  const values = field.value || [];
                                  const next = values.includes(yarn.value)
                                    ? values.filter((v) => v !== yarn.value)
                                    : [...values, yarn.value];
                                  form.setValue("yarnTypes", next, {
                                    shouldValidate: true,
                                  });
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
                      const yarn = YARN_TYPES.find((y) => y.value === value);
                      return yarn ? (
                        <Badge key={value} variant="secondary" className="gap-1">
                          {yarn.label}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => {
                              const next = field.value.filter(
                                (v) => v !== value
                              );
                              form.setValue("yarnTypes", next, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pattern" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PATTERNS.map((pattern) => (
                        <SelectItem key={pattern.value} value={pattern.value}>
                          {pattern.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Needle size */}
            <FormField
              control={form.control}
              name="needleSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Needle Size</FormLabel>
                  <FormControl>
                    <Input placeholder="US 8 (5mm)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Difficulty level */}
            <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project status */}
            <FormField
              control={form.control}
              name="projectStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time spent */}
            <FormField
              control={form.control}
              name="timeSpent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Spent (hours)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value || 0]}
                        onValueChange={(v) => field.onChange(v[0])}
                        className="flex-1"
                      />
                      <span className="w-12 text-center">
                        {field.value || 0}h
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="taggedUsernames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag users</FormLabel>
                  <FormControl>
                    <Input placeholder="Edit tags" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            type="submit"
            className="bg-red-300 h-12 min-w-[180px] text-base rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Edit Project"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/home/projects/${project.project_id}`)}
            disabled={isSubmitting}
            className="h-12 min-w-[180px] text-base rounded-md hover:shadow-md transition-shadow duration-200"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
