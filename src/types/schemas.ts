import { z } from "zod"

export const projectSchema = z.object({
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
  customPattern: z.string().optional(),
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
