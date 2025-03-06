import {
  format,
  formatDistanceToNow,
  isAfter,
  subDays,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns"
export function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp)

  if (isNaN(date.getTime())) {
    return "Invalid"
  }

  const now = new Date()
  const diffInSeconds = differenceInSeconds(now, date)

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`
  }

  const diffInMinutes = differenceInMinutes(now, date)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`
  }

  const diffInHours = differenceInHours(now, date)
  if (diffInHours < 24) {
    return `${diffInHours}h`
  }

  const diffInDays = differenceInDays(now, date)
  if (diffInDays < 30) {
    return `${diffInDays}d`
  }

  const diffInMonths = differenceInMonths(now, date)
  if (diffInMonths < 12) {
    return `${diffInMonths}mo`
  }

  const diffInYears = differenceInYears(now, date)
  return `${diffInYears}y`
}

/**
 * Formats a timestamp for display in a post or comment
 * Provides both relative time and exact time on hover
 */
export function formatPostTime(timestamp: string): {
  display: string
  title: string
} {
  const date = new Date(timestamp)

  if (isNaN(date.getTime())) {
    return { display: "Invalid date", title: "Invalid date" }
  }

  const exactTime = format(date, "PPpp") // e.g., "Mar 5, 2025, 9:04 PM"

  const oneDayAgo = subDays(new Date(), 1)
  const displayTime = isAfter(date, oneDayAgo)
    ? formatTimeAgo(timestamp)
    : format(date, "MMM d, yyyy")

  return { display: displayTime, title: exactTime }
}
