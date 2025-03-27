"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { deleteProjectByID } from "@/lib/db-actions";
import { Ban } from "lucide-react"; 

export default function DeleteProjectInlineButton({ projectId }: { projectId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProjectByID(projectId); // Delete the project
      window.location.href = "/home/feed"; // Redirect to the feed
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete project.");
    } finally {
      setIsDeleting(false);
      setOpen(false); // Close the modal
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link" 
          className="text-red-600 hover:bg-red-100 w-full text-left flex items-center gap-2 pl-5"
          onClick={() => setOpen(true)}
        >
          <Ban className="h-4 w-4" /> {/* Ban icon */}
          Delete Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this post?</DialogTitle>
        </DialogHeader>
        <p>This action cannot be undone. Are you sure you want to permanently delete this project?</p>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 border-gray-300"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
