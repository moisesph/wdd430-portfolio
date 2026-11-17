import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProject } from "@/lib/actions";
import { getProjectById } from "@/lib/projects-db";

export const instant = false;

const fieldClassName =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: projectIdParam } = await params;
  const id = Number(projectIdParam);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const updateProjectWithId = updateProject.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
        Edit Project
      </h1>

      <form action={updateProjectWithId} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={2}
            defaultValue={project.title}
            className={fieldClassName}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block font-medium text-gray-900 dark:text-white"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            rows={5}
            defaultValue={project.description}
            className={fieldClassName}
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block font-medium text-gray-900 dark:text-white"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            defaultValue={project.type}
            className={fieldClassName}
          >
            <option value="opensource">Open Source</option>
            <option value="school">School</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="technologies"
            className="block font-medium text-gray-900 dark:text-white"
          >
            Technologies
          </label>
          <input
            id="technologies"
            name="technologies"
            type="text"
            required
            minLength={2}
            aria-describedby="technologies-help"
            defaultValue={project.technologies.join(", ")}
            className={fieldClassName}
          />
          <p
            id="technologies-help"
            className="mt-1 text-sm text-gray-600 dark:text-gray-300"
          >
            Separate technologies with commas.
          </p>
        </div>

        <div>
          <label
            htmlFor="link"
            className="block font-medium text-gray-900 dark:text-white"
          >
            Project URL (optional)
          </label>
          <input
            id="link"
            name="link"
            type="url"
            defaultValue={project.link ?? ""}
            className={fieldClassName}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Save Changes
          </button>
          <Link
            href="/projects"
            className="font-medium text-blue-700 hover:underline dark:text-blue-400"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}