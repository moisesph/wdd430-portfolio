interface AboutCardProps {
  title: string;
  description: string;
  skills: string[];
}

export default function AboutCard({
  title,
  description,
  skills,
}: AboutCardProps) {
  return (
    <article className="p-4 border-l-4 border-blue-600 bg-gray-50 rounded text-gray-900">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-3">{description}</p>
      <p className="text-sm text-gray-600">
        <strong>Technical Skills:</strong> {skills.join(", ")}
      </p>
    </article>
  );
}
