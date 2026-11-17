import Link from "next/link";
import { deleteProject } from "@/lib/actions";

interface ProjectCardProps {
  id?: number;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export default function ProjectCard({
  id,
  title,
  description,
  technologies,
  link,
}: ProjectCardProps) {
  return (
    // 👇 Added text-gray-900 here
    <article className="flex h-full flex-col p-4 border-l-4 border-blue-600 bg-gray-50 rounded text-gray-900">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-3">{description}</p>
      <p className="text-sm text-gray-600">
        <strong>Technologies:</strong> {technologies.join(", ")}
      </p>
      {link && (
        <p className="mt-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Project
          </a>
        </p>
      )}
      {id !== undefined && (
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
          {Number.isSafeInteger(id) && id > 0 && (
            <Link
              href={`/projects/${id}/edit`}
              aria-label={`Edit ${title}, project ID ${id}`}
              className="rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:text-blue-400 dark:hover:bg-blue-950 dark:focus:ring-offset-gray-900"
            >
              Edit
            </Link>
          )}
          <form action={deleteProject.bind(null, id)}>
            <button
              type="submit"
              aria-label={`Delete ${title}, project ID ${id}`}
              className="rounded-md border border-red-600 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:text-red-400 dark:hover:bg-red-950 dark:focus:ring-offset-gray-900"
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
