import AboutCard from "@/components/skillCard";

export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        About Me
      </h1>

      <section className="mb-12">
        <AboutCard
          title="My Background"
          description="I am a developer passionate about solving problems and building clean solutions. I enjoy collaborating in a team and learning something new in every project."
          skills={["Critical Thinking", "Teamwork", "Achieving Goals"]}
        />
      </section>
    </main>
  );
}
