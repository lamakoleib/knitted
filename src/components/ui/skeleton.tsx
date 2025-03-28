import { cn } from "@/lib/utils"

/**
 * A placeholder loading component with pulsing animation.
 * Used to indicate content is loading.
 *
 * @param className - Optional Tailwind classes for styling
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
