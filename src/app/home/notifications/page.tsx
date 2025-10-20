import Link from "next/link";
import { fetchNotifications, markAllNotificationsRead } from "@/lib/db-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

//time helper
export const dynamic = "force-dynamic"
function timeAgo(iso: string)
{
  const d = new Date(iso).getTime()
  const s = Math.max(1, Math.floor((Date.now() - d) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleString()
}
//mark read then render list
export default async function NotificationsPage() 
{
  await markAllNotificationsRead().catch(() => {})
  const notifications = await fetchNotifications(50)
  //no notifications
  if (!notifications.length) 
    {
    return (
      <div className="p-6">
        <h1 className="mb-4 text-xl font-semibold">Notifications</h1>
        <p className="text-muted-foreground">You have no notifications yet.</p>
      </div>
    )
  }
  //list notifications
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-semibold">Notifications</h1>
      <ul className="divide-y rounded-md border bg-background">
        {notifications.map((n) => {
          const p = n.actor_profile
          const name = p?.full_name || p?.username || n.actor_id.slice(0, 8)
          const fallback =
            (p?.full_name?.charAt(0) || p?.username?.charAt(0) || "U").toUpperCase();
          let verb = "";
          switch (n.type) {
            case "like":
              verb = "liked your post";
              break;
            case "comment":
              verb = "commented on your post";
              break;
            case "tag":
              verb = "tagged you in a post";
              break;
            default:
              verb = "started following you";
          }
          const href =
            n.type === "follow"
              ? `/home/profile/${n.actor_id}`
              : `/home/projects/${n.project_id ?? ""}`;

          return (
            <li key={n.notification_id} className="flex items-start gap-3 p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={p?.avatar_url || "/placeholder.svg"} alt={name} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className={`text-sm ${!n.is_read ? "font-medium" : ""}`}>
                  <Link
                    href={`/home/profile/${n.actor_id}`}
                    className="font-semibold hover:underline"
                  >
                    {name}
                  </Link>{" "}
                  {verb}.
                </p>
                <p className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</p>
              </div>

              <Link
                href={href}
                className="rounded-md border border-transparent bg-red-300 px-3 py-1 text-sm text-black transition-colors hover:bg-red-400"
              >
                View
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
