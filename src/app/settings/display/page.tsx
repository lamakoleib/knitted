import { Separator } from "@/components/ui/separator";
import { DisplayForm } from "./display-form";
/**
 * Settings page for customizing displayed sidebar items.
 *
 * Renders:
 * - A heading and description about display preferences
 * - A separator line
 * - The `DisplayForm` component for selecting which items appear in the sidebar
 *
 * @returns The display settings page layout.
 */
export default function SettingsDisplayPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Display</h3>
				<p className="text-sm text-muted-foreground">
					Turn items on or off to control what&apos;s displayed in the app.
				</p>
			</div>
			<Separator />
			<DisplayForm />
		</div>
	);
}
