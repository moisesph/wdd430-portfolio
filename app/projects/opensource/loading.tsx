export default function Loading() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 w-80 max-w-full mb-6 rounded bg-gray-200 dark:bg-gray-700" />

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((project) => (
          <div
            key={project}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div className="h-7 w-3/4 mb-3 rounded bg-gray-200 dark:bg-gray-700" />

            <div className="space-y-2 mb-4">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="h-6 w-20 rounded bg-blue-100 dark:bg-blue-900" />
              <div className="h-6 w-16 rounded bg-blue-100 dark:bg-blue-900" />
              <div className="h-6 w-24 rounded bg-blue-100 dark:bg-blue-900" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
