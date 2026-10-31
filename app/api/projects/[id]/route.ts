import { NextRequest, NextResponse } from "next/server";
import { getProjectById } from "@/lib/projects-db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const projectId = parseInt(id, 10);

  if (isNaN(projectId)) {
    return NextResponse.json(
      { status: 400, error: "Invalid ID format. Must be a number." },
      { status: 400 },
    );
  }

  const project = getProjectById(projectId);

  if (!project) {
    return NextResponse.json(
      { status: 404, error: "Project not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(project);
}
