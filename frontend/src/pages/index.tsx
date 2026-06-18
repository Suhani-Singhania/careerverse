import { useState } from "react";
import Hero from "../components/Hero";

interface ProjectPreview {
  project_name: string;
  description: string;
  sprint_goal: string;
  tasks: string[];
}

export default function Home() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [project, setProject] = useState<ProjectPreview | null>(null);

  const generateProject = () => {
    // Dummy data for the project, replace with your API call
    const data = {
      project_name: "My New Project",
      description: "A description of my project.",
      sprint_goal: "Build core features",
      tasks: ["Task 1", "Task 2", "Task 3"]
    };
    setProject(data);
  };

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Project Generator Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-8">AI Project Generator</h2>

          {/* Role Input */}
          <input
            type="text"
            placeholder="Backend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 mb-4"
          />

          {/* Experience Input */}
          <input
            type="text"
            placeholder="Fresher"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-400 mb-4"
          />

          {/* Generate Button */}
          <button
            onClick={generateProject}
            className="rounded-xl bg-[#664930] px-6 py-3 text-white hover:bg-[#553A27] transition"
          >
            Generate Project
          </button>

          {/* Display project data */}
          {project && (
            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h3 className="text-2xl font-bold mb-4">{project.project_name}</h3>
              <p className="text-slate-300 mb-4">{project.description}</p>
              <div className="mb-4">
                <span className="font-semibold">Sprint Goal:</span> {project.sprint_goal}
              </div>
              <ul className="space-y-2">
                {project.tasks.map((task, index) => (
                  <li key={index} className="rounded-lg bg-slate-800 p-3">{task}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
