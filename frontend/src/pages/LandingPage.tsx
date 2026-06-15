import { 
  Cpu, 
  Compass, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Network, 
  Sparkles, 
  ArrowRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";

export default function LandingPage() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [project, setProject] = useState<any>(null);

  const generateProject = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/projects/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role, experience }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch project data");
      }

      const data = await response.json();
      setProject(data);
    } catch (error) {
      console.error(error);
      alert("Error generating project. Please try again.");
    }
  };

  const features = [
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "AI Profile Optimization",
      description:
        "Tailor your professional profile using specialized language models optimized to pass applicant tracking filters easily.",
      tag: "Popular",
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: "Predictive Career Paths",
      description:
        "Map out high-yield growth trajectories and learn which new skills yield the largest compensation boosts.",
      tag: "AI Guided",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Resume Enhancer",
      description:
        "Re-phrase bullet points, construct impactful summaries, and structure achievements for immediate positive impression.",
      tag: "Fast",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Market Insight & Intelligence",
      description:
        "Real-time industry salary distribution maps, skill rarity metrics, and geographic growth trends.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Anonymized Matching Mode",
      description:
        "Shield sensitive details. Stealth mode allows secure matching with verified recruiters without disclosing identity.",
    },
    {
      icon: <Network className="h-6 w-6" />,
      title: "Intelligent Network Graph",
      description:
        "Instantly locate secondary connections inside prospective employers to source high-conversion referrals.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500/30 selection:text-white relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-transparent" />

      {/* Header / Navbar */}
      <Navbar />

      {/* Hero section with Project Generator inside */}
      <Hero>
        {/* Project Generator inside Hero for better UX */}
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
              className="w-full bg-purple-600 px-6 py-3 rounded text-white hover:bg-purple-700 transition"
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
                  {project.tasks?.map((task: string, index: number) => (
                    <li key={index} className="rounded-lg bg-slate-800 p-3">{task}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </Hero>

      {/* Features Grid Section */}
      <section id="features" className="bg-[#F5EEE8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#2B2118] mb-4">
              Equipped with Everything to{" "}
              <span className="text-[#997E67]">Accelerate Growth</span>
            </h2>
            <p className="text-[#6B5A4D] text-lg">
              Unlock powerful career tools engineered on top of modern language intelligence, specifically tailored for engineers, developers, and tech professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                tag={feature.tag}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent -z-10" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl border border-[#664930] bg-[#997E67] p-8 sm:p-12 md:p-16 text-center shadow-xl">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-600/5 via-transparent to-transparent pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FFF8F2] mb-6">
              Ready to Navigate Your Next Big Leap?
            </h2>
            <p className="text-[#FFDBBB] text-lg max-w-2xl mx-auto mb-8">
              Join thousands of engineers and tech leaders using CareerVerse to discover roles and accelerate professional milestones.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#FFF8F2] px-6 py-3.5 text-sm font-bold text-[#664930] hover:bg-[#FFDBBB] transition-shadow shadow-lg">
                Join CareerVerse Free
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#FFF8F2] px-6 py-3.5 text-sm font-bold text-[#FFF8F2] hover:bg-[#8A705B] transition-shadow shadow-lg">
                Contact Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">CareerVerse</span>
          </div>
          <p className="text-xs text-slate-500 order-last md:order-none">
            © {new Date().getFullYear()} CareerVerse Inc. All rights reserved.
          </p>
          {/* Social Links - add if needed */}
        </div>
      </footer>
    </div>
  );
}