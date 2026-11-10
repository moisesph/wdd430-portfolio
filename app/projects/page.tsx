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
      <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
        Projects Overview
      </h1>

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
