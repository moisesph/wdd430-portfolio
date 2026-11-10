import { getProjects } from "@/lib/projects-db";

export default async function OpenSourceProjects() {
  const projects = await getProjects("opensource");

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Open Source Projects.
      </h1>

      {projects.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300">
          No open source projects were found.
        </p>
      )}

      {projects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>

              <div className="flex gap-2 flex-wrap">
                {project.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded"
                  >
                    {technology}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
