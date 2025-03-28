import { getPostDataByID } from "@/lib/db-actions";
import EditForm from "./EditForm";
/**
 * Page component for editing an existing project.
 *
 * Fetches project data by ID and renders the `EditForm` with pre-filled values.
 *
 * @param params - URL params containing the `projectId`.
 * @returns The edit project page.
 */
export default async function EditProjectPage({ params }: { params: { projectId: string } }) {
  const project = await getPostDataByID(params.projectId);
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Edit Project</h1>
      <EditForm project={project} />
    </div>
  );
}
