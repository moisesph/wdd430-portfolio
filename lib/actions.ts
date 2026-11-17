"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const ProjectFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters."),
  type: z.enum(["opensource", "school"]),
  technologies: z
    .string()
    .trim()
    .min(2, "Technologies must be at least 2 characters."),
  link: z
    .string()
    .trim()
    .refine((value) => {
      if (!value) {
        return true;
      }

      try {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    }, "Project URL must be a valid HTTP or HTTPS URL.")
    .optional(),
});

export async function createProject(formData: FormData) {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link") ?? undefined,
  };
  const parsed = ProjectFormSchema.safeParse(raw);

  if (!parsed.success) {
    const messages = parsed.error.issues.map((issue) => issue.message);
    throw new Error(`Invalid project input: ${messages.join(" ")}`);
  }

  const { title, description, type, technologies: technologiesText, link } =
    parsed.data;
  const technologies = technologiesText
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);

  if (technologies.length === 0) {
    throw new Error("Provide at least one technology.");
  }

  const technologyArray = `ARRAY[${technologies
    .map((_, index) => `$${index + 4}::text`)
    .join(", ")}]::text[]`;
  const linkParameter = technologies.length + 4;

  await sql.query(
    `INSERT INTO projects (title, description, type, technologies, link)
     VALUES ($1, $2, $3, ${technologyArray}, $${linkParameter})`,
    [title, description, type, ...technologies, link || null],
  );

  revalidatePath("/projects");
  redirect("/projects");
}

export async function updateProject(id: number, formData: FormData) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid project ID.");
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link") ?? undefined,
  };
  const parsed = ProjectFormSchema.safeParse(raw);

  if (!parsed.success) {
    const messages = parsed.error.issues.map((issue) => issue.message);
    throw new Error(`Invalid project input: ${messages.join(" ")}`);
  }

  const { title, description, type, technologies: technologiesText, link } =
    parsed.data;
  const technologies = technologiesText
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);

  if (technologies.length === 0) {
    throw new Error("Provide at least one technology.");
  }

  const technologyArray = `ARRAY[${technologies
    .map((_, index) => `$${index + 4}::text`)
    .join(", ")}]::text[]`;
  const linkParameter = technologies.length + 4;
  const idParameter = technologies.length + 5;

  const { rows } = await sql.query(
    `UPDATE projects
     SET title = $1, description = $2, type = $3,
         technologies = ${technologyArray}, link = $${linkParameter}
     WHERE id = $${idParameter}
     RETURNING id`,
    [title, description, type, ...technologies, link || null, id],
  );

  if (rows.length === 0) {
    throw new Error(`Project ${id} does not exist.`);
  }

  revalidatePath("/projects");
  redirect("/projects");
}

export async function deleteProject(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid project ID.");
  }

  const { rows } = await sql.query(
    "DELETE FROM projects WHERE id = $1 RETURNING id",
    [id],
  );

  if (rows.length === 0) {
    throw new Error(`Project ${id} does not exist.`);
  }

  revalidatePath("/projects");
}
