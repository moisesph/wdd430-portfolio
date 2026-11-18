import CreateProjectForm from "./create-project-form";

export default function CreateProjectPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">
        Create Project
      </h1>

      <CreateProjectForm />
    </div>
  );
}
