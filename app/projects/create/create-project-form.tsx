"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  createProjectFormAction,
  type CreateProjectFormField,
  type CreateProjectFormState,
} from "@/lib/actions";

const fieldClassName =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

const initialState: CreateProjectFormState = {
  errors: {},
  values: {
    title: "",
    description: "",
    type: "",
    technologies: "",
    link: "",
  },
};

const fieldLabels: Record<CreateProjectFormField, string> = {
  title: "Title",
  description: "Description",
  type: "Type",
  technologies: "Technologies",
  link: "Project URL",
};

function getDescribedBy(helpId?: string, errorId?: string) {
  return [helpId, errorId].filter(Boolean).join(" ") || undefined;
}

export default function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(
    createProjectFormAction,
    initialState,
  );
  const [editedValues, setEditedValues] = useState<
    CreateProjectFormState["values"] | null
  >(null);
  const visibleErrors = state.errors;
  const values = editedValues ?? state.values;
  const errorFields = Object.keys(visibleErrors) as CreateProjectFormField[];
  const announcement = isPending
    ? "Submitting project for validation."
    : errorFields.length
      ? `The submitted project has validation errors in: ${errorFields
        .map((field) => fieldLabels[field])
        .join(", ")}. Please correct them and submit again.`
      : "";

  function updateField(field: CreateProjectFormField, value: string) {
    setEditedValues((current) => ({ ...(current ?? values), [field]: value }));
  }

  return (
    <form
      action={formAction}
      className="space-y-5"
      noValidate
      onSubmit={(event) => {
        if (isPending) {
          event.preventDefault();
        }
      }}
    >
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-sm font-medium text-red-700 dark:text-red-400"
      >
        {announcement}
      </p>

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
          readOnly={isPending}
          value={values.title}
          aria-describedby={getDescribedBy(
            undefined,
            visibleErrors.title ? "title-error" : undefined,
          )}
          aria-invalid={visibleErrors.title ? true : undefined}
          onChange={(event) => updateField("title", event.currentTarget.value)}
          className={fieldClassName}
        />
        {visibleErrors.title && (
          <p
            id="title-error"
            className="mt-1 text-sm text-red-700 dark:text-red-400"
          >
            {visibleErrors.title}
          </p>
        )}
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
          readOnly={isPending}
          value={values.description}
          aria-describedby={getDescribedBy(
            undefined,
            visibleErrors.description ? "description-error" : undefined,
          )}
          aria-invalid={visibleErrors.description ? true : undefined}
          onChange={(event) =>
            updateField("description", event.currentTarget.value)
          }
          className={fieldClassName}
        />
        {visibleErrors.description && (
          <p
            id="description-error"
            className="mt-1 text-sm text-red-700 dark:text-red-400"
          >
            {visibleErrors.description}
          </p>
        )}
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
          disabled={isPending}
          value={values.type}
          aria-describedby={getDescribedBy(
            undefined,
            visibleErrors.type ? "type-error" : undefined,
          )}
          aria-invalid={visibleErrors.type ? true : undefined}
          onChange={(event) => updateField("type", event.currentTarget.value)}
          className={fieldClassName}
        >
          <option value="" disabled>
            Select a project type
          </option>
          <option value="opensource">Open Source</option>
          <option value="school">School</option>
        </select>
        {visibleErrors.type && (
          <p
            id="type-error"
            className="mt-1 text-sm text-red-700 dark:text-red-400"
          >
            {visibleErrors.type}
          </p>
        )}
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
          readOnly={isPending}
          value={values.technologies}
          aria-describedby={getDescribedBy(
            "technologies-help",
            visibleErrors.technologies ? "technologies-error" : undefined,
          )}
          aria-invalid={visibleErrors.technologies ? true : undefined}
          onChange={(event) =>
            updateField("technologies", event.currentTarget.value)
          }
          className={fieldClassName}
        />
        <p
          id="technologies-help"
          className="mt-1 text-sm text-gray-600 dark:text-gray-300"
        >
          Separate technologies with commas.
        </p>
        {visibleErrors.technologies && (
          <p
            id="technologies-error"
            className="mt-1 text-sm text-red-700 dark:text-red-400"
          >
            {visibleErrors.technologies}
          </p>
        )}
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
          readOnly={isPending}
          value={values.link}
          aria-describedby={getDescribedBy(
            undefined,
            visibleErrors.link ? "link-error" : undefined,
          )}
          aria-invalid={visibleErrors.link ? true : undefined}
          onChange={(event) => updateField("link", event.currentTarget.value)}
          className={fieldClassName}
        />
        {visibleErrors.link && (
          <p
            id="link-error"
            className="mt-1 text-sm text-red-700 dark:text-red-400"
          >
            {visibleErrors.link}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          aria-disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-70"
        >
          {isPending ? "Saving..." : "Save Project"}
        </button>
        <Link
          href="/projects"
          className="font-medium text-blue-700 hover:underline dark:text-blue-400"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}