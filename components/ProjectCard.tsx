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
    <article className="p-4 border-l-4 border-blue-600 bg-gray-50 rounded text-gray-900">
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
        <form action={deleteProject.bind(null, id)} className="mt-4">
          <button
            type="submit"
            aria-label={`Delete ${title}, project ID ${id}`}
            className="rounded-md border border-red-600 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-red-400 dark:hover:bg-red-950"
          >
            Delete
          </button>
        </form>
      )}
    </article>
  );
}
