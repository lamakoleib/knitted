import Link from "next/link";
import Image from "next/image";
import { getMySavedProjects } from "@/lib/db-actions";

export default async function ProfileSavedPage() {
  const projects = await getMySavedProjects();

  if (!projects.length) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        <h1 className="text-lg font-semibold mb-2">Saved Projects</h1>
        No saved projects yet.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-4">Saved Projects</h1>
      <div className="grid grid-cols-3 gap-1">
        {projects.map((p: any) => (
          <Link key={p.project_id} href={`/home/projects/${p.project_id}`} passHref>
            <div className="aspect-square relative group cursor-pointer">
              <Image
                src={p.images?.[0] ?? "/placeholder.svg?height=300&width=300"}
                alt={p.title ?? `Project ${p.project_id}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                {p.title ?? "Open"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
