import { deleteProjectByID } from "@/lib/db-actions"
import { NextResponse } from "next/server"

export async function DELETE(
    request: Request,
    { params }: { params: { projectId: string } }
  ) {
    const projectId = params.projectId
  
    try {
      await deleteProjectByID(projectId)
      return NextResponse.json({ success: true }, { status: 200 })
    } catch (error: any) {
      console.error("Delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }
  
  