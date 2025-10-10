import { getPostDataByID, getTaggedUsersForProject } from "@/lib/db-actions";
import EditForm from "./EditForm";
/**
 * Page component for editing an existing project.
 *
 * Fetches project data by ID and renders the `EditForm` with pre-filled values.
 *
 * @param params - URL params containing the `projectId`.
 * @returns The edit project page.
 */
export default async function EditProjectPage({
  params,
}: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  const project = await getPostDataByID(projectId);
  if (!project) return <div className="p-6">Project not found.</div>;
  const taggedUsers = await getTaggedUsersForProject(projectId);
  const initialTaggedUsernames = taggedUsers
    .map(u => u.username || "")
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-muted min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <EditForm
          project={project}
          initialTaggedUsernames={initialTaggedUsernames}
        />
      </div>
    </div>
  );
}
