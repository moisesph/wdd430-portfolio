import Link from "next/link";
import React from "react";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <nav className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
            Projects
          </h2>

          <Link
            href="/projects"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
          >
            All Projects
          </Link>

          <Link
            href="/projects/opensource"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
          >
            Open Source
          </Link>

          <Link
            href="/projects/school"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
          >
            School
          </Link>

          <Link
            href="/projects/settings"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
          >
            Settings
          </Link>
        </nav>
      </aside>

      <section className="flex-1">{children}</section>
    </div>
  );
}
