"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/projects-db";
import ProjectsSkeleton from "./ProjectsSkeleton";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/projects", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data: Project[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
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
        Projects Overview
      </h1>

      {loading && <ProjectsSkeleton />}

      {!loading && error && (
        <p className="text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="text-gray-600 dark:text-gray-300">
          No projects were found.
        </p>
      )}

      {!loading && !error && projects.length > 0 && (
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
