import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"


/**
 * Badge style variants using class-variance-authority (CVA).
 * 
 * Variants:
 * - `default`: Primary color background with hover effect.
 * - `secondary`: Secondary background with hover.
 * - `destructive`: Red/destructive background with hover.
 * - `outline`: No background, uses default text color.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
/**
 * Props for the `Badge` component.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * `Badge` is a small UI element used to highlight or tag content.
 * It supports visual variants like `default`, `secondary`, `destructive`, and `outline`.
 *
 * @param props - Props for the badge component, including variant and standard div attributes.
 * @returns A styled badge element.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
