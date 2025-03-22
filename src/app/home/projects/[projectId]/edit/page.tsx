import { getPostDataByID } from "@/lib/db-actions";
import EditForm from "./EditForm";

export default async function EditProjectPage({ params }: { params: { projectId: string } }) {
  const project = await getPostDataByID(params.projectId);
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Edit Project</h1>
      <EditForm project={project} />
    </div>
  );
}
