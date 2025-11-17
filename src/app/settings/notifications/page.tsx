import { Separator } from "@/components/ui/separator"
import { NotificationsForm } from "./notifications-form"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth-actions"
/**
 * Renders the Notifications Settings Page.
 *
 * Includes:
 * - Page heading and description
 * - NotificationsForm to configure notification preferences
 *
 * @returns The settings section for managing notifications
 */
export default async function SettingsNotificationsPage() {
  const me = await getCurrentUser().catch(() => null as any);
  const profileHref =
    me?.profile?.id ? `/home/profile/${me.profile.id}` : "/home";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Configure how you receive notifications.
          </p>
        </div>
        <Link
          href={profileHref}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "bg-red-300/80 hover:bg-red-300 text-primary-foreground"
          )}
        >
          ← Back to Profile
        </Link>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  )
}
