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

/**
 * Returns a concise, human-readable relative time string (e.g. "5m", "3h", "2d") 
 * for how long ago the given timestamp occurred.
 *
 * @param timestamp - An ISO date string to format.
 * @returns A string representing the time difference from now in a short format.
 */
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
 * Formats a timestamp for UI display in posts or comments.
 *
 * Returns both:
 * - a compact relative time (e.g. "2h" or "Mar 12, 2025"), used for display
 * - a full formatted date string (e.g. "Mar 12, 2025, 5:45 PM"), used for tooltips or `title` attributes
 *
 * @param timestamp - An ISO date string to format.
 * @returns An object with `display` (compact string) and `title` (full string) values.
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
