import { sql } from "@vercel/postgres";

export interface Project {
  id: number;
  title: string;
  description: string;
  type: "opensource" | "school";
  technologies: string[];
  link?: string;
  yearCompleted: number | null;
}

const ITEMS_PER_PAGE = 6;

export async function getProjects(type?: string | null): Promise<Project[]> {
  if (type) {
    const { rows } = await sql<Project>`
      SELECT
        id, title, description, type, technologies, link,
        year_completed AS "yearCompleted"
      FROM projects
      WHERE type = ${type}
      ORDER BY id
    `;

    return rows;
  }

  const { rows } = await sql<Project>`
    SELECT
      id, title, description, type, technologies, link,
      year_completed AS "yearCompleted"
    FROM projects
    ORDER BY id
  `;

  return rows;
}

export async function getProjectById(id: number): Promise<Project | null> {
  const { rows } = await sql<Project>`
    SELECT
      id, title, description, type, technologies, link,
      year_completed AS "yearCompleted"
    FROM projects
    WHERE id = ${id}
  `;

  return rows[0] ?? null;
}

export async function fetchFilteredProjects(
  query: string,
  currentPage: number,
): Promise<Project[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;

  const { rows } = await sql<Project>`
    SELECT
      id, title, description, type, technologies, link,
      year_completed AS "yearCompleted"
    FROM projects
    WHERE
      title ILIKE ${searchTerm}
      OR description ILIKE ${searchTerm}
      OR EXISTS (
        SELECT 1
        FROM unnest(technologies) AS technology
        WHERE technology ILIKE ${searchTerm}
      )
    ORDER BY id
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `;

  return rows;
}

export async function fetchProjectsPages(query: string): Promise<number> {
  const searchTerm = `%${query}%`;

  const { rows } = await sql<{ count: string }>`
    SELECT COUNT(*) AS count
    FROM projects
    WHERE
      title ILIKE ${searchTerm}
      OR description ILIKE ${searchTerm}
      OR EXISTS (
        SELECT 1
        FROM unnest(technologies) AS technology
        WHERE technology ILIKE ${searchTerm}
      )
  `;

  const totalProjects = Number(rows[0]?.count ?? 0);

  return Math.ceil(totalProjects / ITEMS_PER_PAGE);
}
