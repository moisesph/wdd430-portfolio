"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  createProjectFormAction,
  type CreateProjectFormField,
  type CreateProjectFormState,
} from "@/lib/actions";

const fieldClassName =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

const initialState: CreateProjectFormState = {
  message: null,
  errors: {},
  values: {
    title: "",
    description: "",
    yearCompleted: "",
    type: "",
    technologies: "",
    link: "",
  },
};

function getDescribedBy(helpId?: string, errorId?: string) {
  return [helpId, errorId].filter(Boolean).join(" ") || undefined;
}

export default function CreateProjectForm() {
  const [state, formAction, isPending] = useActionState(
    createProjectFormAction,
    initialState,
  );
  const yearCompletedInputRef = useRef<HTMLInputElement>(null);
  const [editedValues, setEditedValues] = useState<
    CreateProjectFormState["values"] | null
  >(null);
  useEffect(() => {
    if (yearCompletedInputRef.current) {
      yearCompletedInputRef.current.max = String(new Date().getFullYear());
    }
  }, []);
  const visibleErrors = state.errors;
  const values = editedValues ?? state.values;
  const announcement = isPending
    ? "Submitting project for validation."
    : state.message ?? "";

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
          minLength={3}
          readOnly={isPending}
          value={values.title}
          aria-describedby={getDescribedBy(undefined, "title-error")}
          aria-invalid={visibleErrors.title?.length ? true : undefined}
          onChange={(event) => updateField("title", event.currentTarget.value)}
          className={fieldClassName}
        />
        <div id="title-error" aria-live="polite" aria-atomic="true">
          {visibleErrors.title?.map((error, index) => (
            <p
              key={`title-${index}`}
              className="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {error}
            </p>
          ))}
        </div>
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
          minLength={20}
          rows={5}
          readOnly={isPending}
          value={values.description}
          aria-describedby={getDescribedBy(undefined, "description-error")}
          aria-invalid={visibleErrors.description?.length ? true : undefined}
          onChange={(event) =>
            updateField("description", event.currentTarget.value)
          }
          className={fieldClassName}
        />
        <div id="description-error" aria-live="polite" aria-atomic="true">
          {visibleErrors.description?.map((error, index) => (
            <p
              key={`description-${index}`}
              className="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {error}
            </p>
          ))}
        </div>
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
          aria-describedby={getDescribedBy(undefined, "type-error")}
          aria-invalid={visibleErrors.type?.length ? true : undefined}
          onChange={(event) => updateField("type", event.currentTarget.value)}
          className={fieldClassName}
        >
          <option value="" disabled>
            Select a project type
          </option>
          <option value="opensource">Open Source</option>
          <option value="school">School</option>
        </select>
        <div id="type-error" aria-live="polite" aria-atomic="true">
          {visibleErrors.type?.map((error, index) => (
            <p
              key={`type-${index}`}
              className="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {error}
            </p>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="yearCompleted"
          className="block font-medium text-gray-900 dark:text-white"
        >
          Year Completed
        </label>
        <input
          ref={yearCompletedInputRef}
          id="yearCompleted"
          name="yearCompleted"
          type="number"
          required
          min={2000}
          step="1"
          disabled={isPending}
          value={values.yearCompleted}
          aria-describedby={getDescribedBy(undefined, "yearCompleted-error")}
          aria-invalid={visibleErrors.yearCompleted?.length ? true : undefined}
          onChange={(event) =>
            updateField("yearCompleted", event.currentTarget.value)
          }
          className={fieldClassName}
        />
        <div
          id="yearCompleted-error"
          aria-live="polite"
          aria-atomic="true"
        >
          {visibleErrors.yearCompleted?.map((error, index) => (
            <p
              key={`yearCompleted-${index}`}
              className="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {error}
            </p>
          ))}
        </div>
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
            "technologies-error",
          )}
          aria-invalid={visibleErrors.technologies?.length ? true : undefined}
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
        <div
          id="technologies-error"
          aria-live="polite"
          aria-atomic="true"
        >
          {visibleErrors.technologies?.map((error, index) => (
            <p
              key={`technologies-${index}`}
              className="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {error}
            </p>
          ))}
        </div>
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
          aria-describedby={getDescribedBy(undefined, "link-error")}
          aria-invalid={visibleErrors.link?.length ? true : undefined}
          onChange={(event) => updateField("link", event.currentTarget.value)}
          className={fieldClassName}
        />
        <div id="link-error" aria-live="polite" aria-atomic="true">
          {visibleErrors.link?.map((error, index) => (
            <p
              key={`link-${index}`}
              className="mt-1 text-sm text-red-700 dark:text-red-400"
            >
              {error}
            </p>
          ))}
        </div>
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