import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/app/settings/profile-form"
import { getCurrentUserProfile } from "@/lib/db-actions"
/**
 * Server component for the user profile settings page.
 *
 * Fetches the current user's profile and renders the profile form
 * to allow updates to public-facing profile details (e.g., username, bio).
 *
 * @returns The profile settings page with form for editing user profile.
 */

export default async function SettingsProfilePage() {
  const profile = await getCurrentUserProfile()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <ProfileForm profile={profile} />
    </div>
  )
}
