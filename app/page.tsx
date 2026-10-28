import ProjectList from "@/components/ProjectList";

const projects = [
  {
    title: "Raven Calculator",
    description: "An app to transform your currency to USD dollars",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    link: "https://raven-5m7j.onrender.com",
  },
  {
    title: "Online Store",
    description: "A store website to buy many things",
    technologies: ["JavaScript", "CSS"],
    link: "https://wdd330-qfv5.onrender.com/",
  },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* HERO SECTION */}
      <section className="text-center py-12 mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          My Portfolio
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          I&apos;m a full-stack developer learning Next.js and React. Here are
          some of my recent projects.
        </p>
      </section>

      {/* PROJECTS SECTION */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Projects
        </h2>
        <ProjectList projects={projects} />
      </section>
    </main>
  );
}
