import Link from "next/link";
import Pagination from "@/components/Pagination";
import ProjectList from "@/components/ProjectList";
import ProjectSearch from "@/components/ProjectSearch";
import { fetchFilteredProjects, fetchProjectsPages } from "@/lib/projects-db";

export const instant = false;

interface ProjectsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const params = await searchParams;

  const query = params.query ?? "";
  const currentPage = Math.max(1, Number(params.page) || 1);

  const [projects, totalPages] = await Promise.all([
    fetchFilteredProjects(query, currentPage),
    fetchProjectsPages(query),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Projects Overview
        </h1>
        <Link
          href="/projects/create"
          className="inline-flex w-fit items-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Create Project
        </Link>
      </div>

      <ProjectSearch />

      {projects.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">
          No projects were found.
        </p>
      ) : (
        <>
          <ProjectList projects={projects} />

          <Pagination totalPages={totalPages} />
        </>
      )}
    </main>
  );
}
