"use client";

import { useState, useEffect } from "react";
import { Project } from "@/lib/projects-db";

export default function OpenSourceProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects?type=opensource");

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError("Something went wrong while loading the projects.");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Open Source Projects.
      </h1>

      {loading && (
        <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <div
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
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
