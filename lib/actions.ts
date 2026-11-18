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

export type CreateProjectFormField =
  | "title"
  | "description"
  | "yearCompleted"
  | "type"
  | "technologies"
  | "link";

export type CreateProjectFormValues = {
  title: string;
  description: string;
  yearCompleted: string;
  type: string;
  technologies: string;
  link: string;
};

export type CreateProjectFormState = {
  message: string | null;
  errors: Partial<Record<CreateProjectFormField, string[]>>;
  values: CreateProjectFormValues;
};

function getProjectFormValues(
  formData: FormData,
): CreateProjectFormState["values"] {
  const getStringValue = (field: CreateProjectFormField) => {
    const value = formData.get(field);
    return typeof value === "string" ? value : "";
  };

  return {
    title: getStringValue("title"),
    description: getStringValue("description"),
    yearCompleted: getStringValue("yearCompleted"),
    type: getStringValue("type"),
    technologies: getStringValue("technologies"),
    link: getStringValue("link"),
  };
}

function getCreateProjectSchema() {
  const currentYear = new Date().getFullYear();
  const yearCompletedSchema = z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : ""),
    z
      .string()
      .superRefine((value, context) => {
        if (!value) {
          context.addIssue({
            code: "custom",
            message: "Year Completed is required.",
          });
          return;
        }

        if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)) {
          context.addIssue({
            code: "custom",
            message: "Enter a numeric completion year.",
          });
          return;
        }

        const year = Number(value);
        if (!Number.isFinite(year)) {
          context.addIssue({
            code: "custom",
            message: "Year Completed must be a finite number.",
          });
          return;
        }

        if (!Number.isInteger(year)) {
          context.addIssue({
            code: "custom",
            message: "Year Completed must be a whole number.",
          });
          return;
        }

        if (year < 2000 || year > currentYear) {
          context.addIssue({
            code: "custom",
            message: `Year Completed must be between 2000 and ${currentYear}.`,
          });
        }
      })
      .transform(Number),
  );

  return ProjectFormSchema.extend({
    title: z.string().trim().min(3, "Title must be at least 3 characters."),
    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters."),
    yearCompleted: yearCompletedSchema,
  });
}

async function insertProject(
  data: z.infer<typeof ProjectFormSchema>,
  yearCompleted: number | null,
): Promise<void> {
  const { title, description, type, technologies: technologiesText, link } =
    data;
  const technologies = technologiesText
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);
  const technologyArray = `ARRAY[${technologies
    .map((_, index) => `$${index + 4}::text`)
    .join(", ")}]::text[]`;
  const linkParameter = technologies.length + 4;
  const yearParameter = technologies.length + 5;

  await sql.query(
    `INSERT INTO projects (
       title, description, type, technologies, link, year_completed
     ) VALUES (
       $1, $2, $3, ${technologyArray}, $${linkParameter}, $${yearParameter}
     )`,
    [title, description, type, ...technologies, link || null, yearCompleted],
  );
}

export async function createProject(formData: FormData): Promise<void> {
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

  const technologies = parsed.data.technologies
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);

  if (technologies.length === 0) {
    throw new Error("Provide at least one technology.");
  }

  try {
    await insertProject(parsed.data, null);
  } catch {
    throw new Error("The project could not be saved. Please try again.");
  }

  revalidatePath("/projects");
  redirect("/projects");
}

export async function createProjectFormAction(
  _previousState: CreateProjectFormState,
  formData: FormData,
): Promise<CreateProjectFormState> {
  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    technologies: formData.get("technologies"),
    link: formData.get("link") ?? undefined,
    yearCompleted: formData.get("yearCompleted"),
  };
  const parsed = getCreateProjectSchema().safeParse(raw);

  if (!parsed.success) {
    const errors: CreateProjectFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (
        typeof field === "string" &&
        [
          "title",
          "description",
          "yearCompleted",
          "type",
          "technologies",
          "link",
        ].includes(field)
      ) {
        const key = field as CreateProjectFormField;
        (errors[key] ??= []).push(issue.message);
      }
    }
    return {
      message: "Please correct the highlighted fields and submit again.",
      errors,
      values: getProjectFormValues(formData),
    };
  }

  const technologies = parsed.data.technologies
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);

  if (technologies.length === 0) {
    return {
      message: "Provide at least one technology and submit again.",
      errors: { technologies: ["Provide at least one technology."] },
      values: getProjectFormValues(formData),
    };
  }

  try {
    await insertProject(parsed.data, parsed.data.yearCompleted);
  } catch {
    return {
      message: "The project could not be saved. Please try again.",
      errors: {},
      values: getProjectFormValues(formData),
    };
  }

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
