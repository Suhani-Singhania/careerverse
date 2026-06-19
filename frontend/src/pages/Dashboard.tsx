import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Calendar,
  Clock,
  Crown,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  Map,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import ProjectDisplay from "../components/ProjectDisplay";
import { getProjectHistory } from "../services/projectService";
import { analyzeResume } from "../services/resumeService";
import {
  fetchCurrentUser,
  getUserProfile,
  type UserProfile,
} from "../services/authService";
import type { ResumeAnalysisResponse } from "../services/resumeService";
import type { ProjectHistoryItem } from "../services/projectService";

interface DashboardProps {
  onHome: () => void;
  onLogout: () => void;
}

export default function Dashboard({ onHome, onLogout }: DashboardProps) {
  const [user, setUser] = useState<UserProfile | null>(getUserProfile());
  const [history, setHistory] = useState<ProjectHistoryItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [resumeResult, setResumeResult] = useState<ResumeAnalysisResponse | null>(null);
  const featureCards = [
    {
      title: "AI Project Generator",
      description: "Generate production-ready projects with AI.",
      icon: Bot,
      color: "from-purple-600/30 to-purple-950/20 border-purple-500/50",
      button: "bg-purple-600",
      section: "generator",
    },
    {
      title: "Resume Analyzer",
      description: "Analyze your resume and get AI-powered insights.",
      icon: FileText,
      color: "from-blue-600/30 to-blue-950/20 border-blue-500/40",
      button: "bg-blue-600",
      section: "resume",
    },
    {
      title: "Career Roadmap",
      description: "Get a personalized roadmap to achieve your goals.",
      icon: Map,
      color: "from-emerald-600/25 to-emerald-950/20 border-emerald-500/40",
      button: "bg-emerald-600",
      section: "roadmap",
    },
    {
      title: "Learning Path",
      description: "Discover skills and get a structured learning path.",
      icon: GraduationCap,
      color: "from-orange-600/25 to-orange-950/20 border-orange-500/40",
      button: "bg-orange-500",
      section: "learning",
    },
  ];

  const navItems = [
    { label: "AI Project Generator", icon: Bot, section: "generator" },
    { label: "Resume Analyzer", icon: FileText, section: "resume" },
    { label: "Career Roadmap", icon: Map, section: "roadmap" },
    { label: "Learning Path", icon: GraduationCap, section: "learning" },
    { label: "Project History", icon: Clock, section: "history" },
    { label: "Saved Projects", icon: FolderOpen, section: "saved" },
  ];

  const stats = [
    {
      label: "Projects Generated",
      value: history.length,
      change: "+3 this week",
      icon: Briefcase,
      color: "bg-purple-600/30 text-purple-300",
    },
    {
      label: "Resume Analyses",
      value: 4,
      change: "+1 this week",
      icon: FileText,
      color: "bg-blue-600/30 text-blue-300",
    },
    {
      label: "Career Roadmaps",
      value: 2,
      change: "No change",
      icon: Map,
      color: "bg-emerald-600/30 text-emerald-300",
    },
    {
      label: "Learning Hours",
      value: "18h",
      change: "+5h this week",
      icon: Clock,
      color: "bg-orange-600/30 text-orange-300",
    },
  ];

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getProjectHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    }

    async function loadUser() {
      try {
        const profile = await fetchCurrentUser();
        setUser(profile);
      } catch (error) {
        console.error("Failed to load user profile", error);
      }
    }

    loadHistory();
    loadUser();
  }, []);

  const displayName = user?.name?.trim() || user?.email?.split("@")[0] || "there";
  const displayInitial = displayName.charAt(0).toUpperCase();

  const handleAnalyzeResume = async () => {
  if (!resumeFile) {
    setResumeError("Please choose a resume file first.");
    return;
  }

  setResumeLoading(true);
  setResumeError("");
  setResumeResult(null);

  try {
    const result = await analyzeResume(resumeFile);
    setResumeResult(result);
  } catch (error) {
    setResumeError("Failed to analyze resume. Please try again.");
    console.error(error);
  } finally {
    setResumeLoading(false);
  }
};

  const visibleProjects = showAllProjects ? history : history.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#050d1f] text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-700/60 bg-[#061022] p-5 lg:flex lg:flex-col">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-600 bg-[#0b1630] text-sm font-bold">
                CV
              </div>
              <h2 className="text-xl font-bold">CareerVerse</h2>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex w-full items-center gap-3 rounded-lg border-l-4 border-purple-500 bg-purple-600/20 px-4 py-3 text-left font-semibold text-purple-300"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </button>

              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                   onClick={() => {
                      if (item.section === "generator") {
                        onHome();
                      } else {
                        setActiveSection(item.section);
                      }
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto space-y-4">
            <div className="rounded-xl border border-slate-700 bg-[#0b1630] p-5">
              <div className="mb-3 flex items-center gap-2 font-bold">
                <Crown className="h-5 w-5 text-yellow-400" />
                Upgrade to Pro
              </div>
              <p className="mb-4 text-sm text-slate-300">
                Unlock advanced AI insights, unlimited generations, and more.
              </p>
              <button className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-semibold">
                Upgrade Now
              </button>
            </div>

            <div className="rounded-xl border border-slate-700 bg-[#0b1630] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 font-bold">
                  {displayInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold">{displayName}</p>
                  <p className="text-xs text-slate-400">{user?.email ?? ""}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={onHome}
                  className="rounded-lg border border-slate-700 bg-[#101b33] px-3 py-2 text-sm font-semibold"
                >
                  Home
                </button>
                <button
                  onClick={onLogout}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-[#0b1630] text-sm font-bold">
              CV
            </div>
            <h2 className="text-xl font-bold">CareerVerse</h2>
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Welcome back, {displayName}!
                </h1>
              </div>
              <p className="mt-2 text-slate-400">
                Here's what's happening with your projects and career journey.
              </p>
            </div>

            <div className="mb-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featureCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`rounded-xl border bg-gradient-to-br p-6 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:shadow-purple-950/30 ${card.color}`}
                  >
                    <Icon className="mb-8 h-9 w-9 text-white" />
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="mb-3 text-xl font-bold">{card.title}</h2>
                        <p className="text-sm leading-6 text-slate-300">
                          {card.description}
                        </p>
                      </div>
                      <button
                      onClick={() => {
                        if (card.section === "generator") {
                          onHome();
                        } else {
                          setActiveSection(card.section);
                        }
                      }}
                      aria-label={`Open ${card.title}`}
                       className={`rounded-full p-3 ${card.button}`}
                      >
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mb-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-700/80 bg-[#0b1630]/90 p-6 shadow-lg shadow-black/10"
                  >
                    <div className="flex items-center gap-5">
                      <div className={`rounded-full p-5 ${stat.color}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-slate-300">{stat.label}</p>
                        <p
                          className={`mt-1 text-sm ${
                            stat.change === "No change"
                              ? "text-slate-400"
                              : "text-green-400"
                          }`}
                        >
                          {stat.change}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {activeSection === "resume" && (
  <section className="mb-5 rounded-xl border border-blue-500/40 bg-blue-950/20 p-5">
    <h2 className="text-xl font-bold">Resume Analyzer</h2>
    <p className="mt-2 text-slate-300">
      Upload your resume and get a score, skills, and improvement suggestions.
    </p>

    <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-600 bg-[#101b33] p-6 text-center hover:border-blue-400">
      <FileText className="mb-3 h-10 w-10 text-blue-300" />
      <span className="font-semibold">
        {resumeFileName || "Choose resume file"}
      </span>
      <span className="mt-1 text-sm text-slate-400">
        PDF, DOCX, DOC, or TXT file
      </span>

      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            setResumeFile(file);
            setResumeFileName(file.name);
            setResumeError("");
            setResumeResult(null);
          }
        }}
      />
    </label>

    {resumeError && (
      <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-200">
        {resumeError}
      </div>
    )}

    <button
      onClick={handleAnalyzeResume}
      disabled={resumeLoading}
      className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
    >
      {resumeLoading ? "Analyzing..." : "Analyze Resume"}
    </button>

    {resumeResult && (
      <div className="mt-5 rounded-xl border border-blue-500/30 bg-[#101b33] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Resume Result</h3>
            <p className="text-sm text-slate-400">{resumeResult.summary}</p>
          </div>

          <div className="text-center">
            <p className="text-3xl font-bold text-blue-300">
              {resumeResult.score}
            </p>
            <p className="text-xs text-slate-400">{resumeResult.level}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="mb-2 font-semibold">Skills Found</h4>
          <div className="flex flex-wrap gap-2">
            {resumeResult.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-semibold">Suggestions</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            {resumeResult.suggestions.map((suggestion) => (
              <li key={suggestion}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </section>
)}

{activeSection !== "dashboard" && activeSection !== "resume" && (
  <section className="mb-5 rounded-xl border border-purple-500/40 bg-purple-950/20 p-5">
    <h2 className="text-xl font-bold capitalize">{activeSection}</h2>
    <p className="mt-2 text-slate-300">
      This section is selected. We can connect it to a real feature next.
    </p>
  </section>
)}

            <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
              <section className="rounded-xl border border-slate-700 bg-[#0b1630] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Recent Project History</h2>
                  <button
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    className="flex items-center gap-2 text-sm font-semibold text-blue-400"
                  >
                    {showAllProjects ? "Show Less" : "View All"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {loading && <p className="text-slate-400">Loading saved projects...</p>}

                {!loading && history.length === 0 && (
                  <p className="text-slate-400">
                    No saved projects yet. Generate one first.
                  </p>
                )}

                <div className="space-y-3">
                  {visibleProjects.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedProject(item)}
                      aria-label={`View project ${item.project_name}`}
                      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-700 bg-[#101b33] p-4 text-left transition hover:border-purple-500/60 hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-violet-800">
                          <FolderOpen className="h-6 w-6 text-white" />
                        </div>

                        <div>
                          <h3 className="font-bold">{item.project_name}</h3>
                          <p className="text-sm text-slate-400">
                            {item.role} - {item.experience}
                          </p>
                        </div>
                      </div>

                      <div className="hidden items-center gap-5 text-sm text-slate-400 md:flex">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="rounded-lg bg-purple-700 px-4 py-2 font-semibold text-white">
                          View
                        </span>
                        <MoreVertical className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <aside className="space-y-5">
                <section className="rounded-xl border border-slate-700 bg-[#0b1630] p-5">
                  <h2 className="mb-5 text-xl font-bold">
                    Resume Score{" "}
                    <span className="text-sm font-normal text-slate-300">
                      (Latest)
                    </span>
                  </h2>
                  <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full border-8 border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-950/40">
                    <div className="text-center">
                     <p className="text-3xl font-bold">{resumeResult?.score ?? 82}</p>
                      <p className="text-xs text-slate-400">{resumeResult?.level ?? "Good"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSection("resume")}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#101b33] py-3 font-semibold"
                  >
                    View Full Analysis <ArrowRight className="h-4 w-4" />
                  </button>
                </section>

                <section className="rounded-xl border border-slate-700 bg-[#0b1630] p-5">
                  <h2 className="mb-4 text-xl font-bold">Top Skills Identified</h2>
                  <div className="flex flex-wrap gap-3">
                   {(resumeResult?.skills ?? ["Python", "FastAPI", "JavaScript", "React", "SQL", "MongoDB"]).map(
                    (skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </section>

                <section className="rounded-xl border border-slate-700 bg-[#0b1630] p-5">
                  <div className="flex gap-4">
                    <Lightbulb className="h-8 w-8 text-green-400" />
                    <div>
                      <h2 className="mb-3 text-xl font-bold">
                        Next Recommended Step
                      </h2>
                      <p className="mb-4 text-slate-300">
                        Improve your Docker skills to boost your backend profile.
                      </p>
                      <button
                        onClick={() => setActiveSection("learning")}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#101b33] py-3 font-semibold"
                      >
                        Start Learning <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </section>
              </aside>
            </div>

            <section className="mt-5 rounded-xl border border-purple-500/50 bg-gradient-to-r from-purple-950/70 to-[#0b1630] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Sparkles className="h-8 w-8 text-purple-300" />
                  <div>
                    <h2 className="font-bold">Explore More with CareerVerse</h2>
                    <p className="text-sm text-slate-300">
                      Unlock advanced features and accelerate your career growth.
                    </p>
                  </div>
                </div>

                <button className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 font-semibold">
                  Upgrade to Pro
                </button>
              </div>
            </section>

            {selectedProject && (
              <div className="mt-10 rounded-xl border border-slate-700 bg-[#0b1630] p-5">
                <ProjectDisplay project={selectedProject.project_data} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
