import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";
import { createClient } from "@/utils/supabase/server";

/**
 * Settings page for updating user account details.
 *
 * Renders:
 * - A heading and description
 * - A separator line
 * - The `AccountForm` component for editing name, date of birth, and preferences
 *
 * @returns The account settings page layout.
 */
export default async function SettingsAccountPage() 
{
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return <div>You must be logged in.</div>;
	const { data: profile } = await supabase
		.from("Profiles")
		.select("full_name, birthday")
		.eq("id", user.id)
		.single();

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-sm text-muted-foreground">
					Update your account settings.
				</p>
			</div>
			<Separator />
			<AccountForm
				profileIdForRoute={user.id}
				initial={{
					name: profile?.full_name ?? "",
					dob: profile?.birthday ? new Date(profile.birthday) : undefined,
				}}
			/>
		</div>
	);
}
