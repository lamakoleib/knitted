import Link from "next/link"
import { getCurrentUser } from "@/lib/auth-actions"
import { getCurrentUserProfile, unreadNotificationsCount } from "@/lib/db-actions"

import{
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Rss, Users, Bell, Plus, Search as SearchIcon } from "lucide-react"

//helper for time to greet users
function greet() {
  const h = new Date().getHours()
  if (h < 6) return "Good night"
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

function FeatureTile({
  href,
  icon: Icon,
  title,
  description,
  badge,
}: {
  href: string
  icon: React.ElementType
  title: string
  description: string
  badge?: string | number
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-colors hover:bg-accent">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-300/70 p-2">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          {badge !== undefined && badge !== 0 && (
            <span className="rounded-full bg-red-300 px-2 py-0.5 text-xs font-medium text-black">
              {badge}
            </span>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export const dynamic = "force-dynamic"

export default async function HomePage() {
  //Fetching signed-in user and profile
  const user = await getCurrentUser()
  const profile = await getCurrentUserProfile().catch(() => null)
  const unread = await unreadNotificationsCount().catch(() => 0)

  //Display name
  const name =
    profile?.username ||
    profile?.full_name ||
    user?.user?.email?.split("@")[0] ||
    "there"

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card className="border border-border/70">
        <CardHeader className="space-y-2">
          <Badge className="w-fit bg-red-300 text-black hover:bg-red-300">
            Welcome to Knitted
          </Badge>

          {/* Title */}
          <CardTitle className="text-2xl sm:text-3xl">
            {greet()}, {name}!
          </CardTitle>

          {/* Description */}
          <CardDescription className="max-w-3xl">
            Knitted is a cozy space to share your knitting & crochet projects,
            track yarn and patterns, follow creators, and discover inspiration
            from the community.
          </CardDescription>
        </CardHeader>

      </Card>

      {/* Features boxes */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FeatureTile
          href="/home/feed"
          icon={Rss}
          title="Explore feed"
          description="See the latest posts from people you follow and the wider community."
        />
        <FeatureTile
          href="/home/search"
          icon={SearchIcon}
          title="Find people"
          description="Search knitters by name and discover new profiles to follow."
        />
        <FeatureTile
          href="/home/upload"
          icon={Plus}
          title="Create a project"
          description="Share your makes with photos, yarn details, and patterns used."
        />
        <FeatureTile
          href="/home/notifications"
          icon={Bell}
          title="Notifications"
          description="Likes, comments, and follows appear here."
          badge={unread}
        />
        <FeatureTile
          href="/home/search?tab=yarn"
          icon={Users}
          title="Yarn & patterns"
          description="Browse materials and patterns to plan your next project."
        />
        <FeatureTile
          href="/home/profile"
          icon={Users}
          title="Your profile"
          description="Update your bio, avatar, and see your shared projects."
        />
      </div>
    </div>
  )
}
