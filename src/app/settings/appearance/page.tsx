import { Separator } from "@/components/ui/separator";
import { AppearanceForm } from "./appearance-form";

/**
 * Settings page for customizing the application's appearance.
 *
 * Renders:
 * - A heading and description about appearance preferences
 * - A separator line
 * - The `AppearanceForm` component for selecting font and theme
 *
 * @returns The appearance settings page layout.
 */
export default function SettingsAppearancePage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Appearance</h3>
				<p className="text-sm text-muted-foreground">
					Customize the appearance of the app. Automatically switch between day
					and night themes.
				</p>
			</div>
			<Separator />
			<AppearanceForm />
		</div>
	);
}
