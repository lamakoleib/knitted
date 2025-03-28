import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";

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

export default function SettingsAccountPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-sm text-muted-foreground">
					Update your account settings. Set your preferred language and
					timezone.
				</p>
			</div>
			<Separator />
			<AccountForm />
		</div>
	);
}
