// components/ProjectDisplay.tsx
import { ChevronDown, ChevronUp, Code2, Database, Zap, Award } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { ProjectResponse } from "../services/projectService";

interface ProjectDisplayProps {
  project: ProjectResponse;
}

export default function ProjectDisplay({ project }: ProjectDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    overview: true,
    techStack: true,
    features: false,
    database: false,
    api: false,
    tasks: true,
    resume: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const Section = ({
    title,
    id,
    icon: Icon,
    children,
  }: {
    title: string;
    id: string;
    icon: LucideIcon;
    children: ReactNode;
  }) => (
    <div className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        {expandedSections[id] ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {expandedSections[id] && (
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/30">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <Section title="Project Overview" id="overview" icon={Zap}>
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {project.project_name}
            </h2>
            <p className="text-slate-300 text-lg">{project.description}</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="rounded-lg bg-purple-500/20 px-4 py-2 border border-purple-500/50">
              <p className="text-sm text-purple-300 font-medium">Difficulty</p>
              <p className="text-white font-semibold">{project.difficulty}</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Tech Stack */}
      <Section title="Tech Stack" id="techStack" icon={Code2}>
        <div className="flex flex-wrap gap-3">
          {project.tech_stack.map((tech, idx) => (
            <div
              key={idx}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-white text-sm font-medium"
            >
              {tech}
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section title={`Features (${project.features.length})`} id="features" icon={Zap}>
        <ul className="space-y-3">
          {project.features.map((feature, idx) => (
            <li
              key={idx}
              className="flex gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              <span className="text-purple-400 font-bold">•</span>
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Database Schema */}
      <Section title="Database Schema" id="database" icon={Database}>
        <div className="space-y-6">
          {project.database_schema.map((table, tableIdx) => (
            <div
              key={tableIdx}
              className="rounded-lg bg-slate-800/50 p-4 border border-slate-700"
            >
              <h4 className="text-white font-bold mb-1">{table.table_name}</h4>
              {table.description && (
                <p className="text-slate-400 text-sm mb-3">{table.description}</p>
              )}
              <div className="space-y-2">
                {table.fields.map((field, fieldIdx) => (
                  <div
                    key={fieldIdx}
                    className="flex items-start justify-between text-sm"
                  >
                    <div>
                      <code className="text-purple-300 font-mono">
                        {field.name}
                      </code>
                      <span className="text-slate-400 ml-2">{field.type}</span>
                    </div>
                    {field.constraints && (
                      <span className="text-yellow-300 text-xs">
                        {field.constraints}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* API Endpoints */}
      <Section title={`API Endpoints (${project.api_endpoints.length})`} id="api" icon={Code2}>
        <div className="space-y-4">
          {project.api_endpoints.map((endpoint, idx) => (
            <div key={idx} className="rounded-lg bg-slate-800/50 p-4">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-3 py-1 rounded font-mono text-white text-sm font-bold ${
                    endpoint.method === "GET"
                      ? "bg-blue-600"
                      : endpoint.method === "POST"
                        ? "bg-green-600"
                        : endpoint.method === "PUT"
                          ? "bg-yellow-600"
                          : endpoint.method === "DELETE"
                            ? "bg-red-600"
                            : "bg-slate-600"
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="text-slate-300 font-mono">
                  {endpoint.path}
                </code>
              </div>
              <p className="text-slate-300 text-sm mb-2">
                {endpoint.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold">Request:</p>
                  <pre className="bg-slate-900/50 p-2 rounded mt-1 text-slate-300 overflow-x-auto">
                    {JSON.stringify(endpoint.request_body, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold">Response:</p>
                  <pre className="bg-slate-900/50 p-2 rounded mt-1 text-slate-300 overflow-x-auto">
                    {JSON.stringify(endpoint.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tasks */}
      <Section title={`Implementation Tasks (${project.tasks.length})`} id="tasks" icon={Zap}>
        <ol className="space-y-3">
          {project.tasks.map((task, idx) => (
            <li
              key={idx}
              className="flex gap-3 p-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
            >
              <span className="text-purple-400 font-bold min-w-6">{idx + 1}.</span>
              <span className="text-slate-300">{task}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Resume Bullets */}
      <Section title="Resume Bullets" id="resume" icon={Award}>
        <ul className="space-y-3">
          {project.resume_bullets.map((bullet, idx) => (
            <li
              key={idx}
              className="flex gap-3 p-3 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
            >
              <span className="text-blue-400 font-bold">★</span>
              <span className="text-slate-300">{bullet}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
