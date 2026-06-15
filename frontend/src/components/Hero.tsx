// components/Hero.tsx
import { ArrowRight, Play, Briefcase, Bot, Sparkles, TrendingUp } from "lucide-react";

interface HeroProps {
  children?: React.ReactNode; // Accept children
}

export default function Hero({ children }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F5EEE8] pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Subtle warm radial wash */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFDBBB]/45 blur-[150px]" />

      {/* Render any children passed in */}
      {children}

      {/* Static content starts here */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Accent Banner */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#CCBEB1] bg-white px-4.5 py-1.5 text-xs font-semibold text-[#6B5A4D] shadow-sm shadow-[#664930]/5 backdrop-blur-md mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#997E67] opacity-35"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#664930]"></span>
          </span>
          Introducing CareerVerse v2.0
        </div>

        {/* Headings */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-[#2B2118] sm:text-5xl md:text-6xl lg:text-7xl">
          Supercharge Your Career with{" "}
          <span className="bg-gradient-to-r from-[#FFDBBB] via-[#997E67] to-[#664930] bg-clip-text text-transparent">
            Precision Intelligence
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-[#6B5A4D] md:text-lg leading-relaxed">
          Align your skills, optimize your developer profile, and discover high-growth engineering roles. The premium search workspace built for modern technical talent.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#664930] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#664930]/15 hover:bg-[#553A27] transition-all duration-300 transform hover:-translate-y-0.5">
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="group w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#CCBEB1] bg-white px-7 py-3.5 text-sm font-bold text-[#664930] hover:bg-[#FFF8F2] transition-all duration-300">
            <Play className="h-3.5 w-3.5 fill-current text-[#997E67] group-hover:text-[#664930]" />
            Watch Demo
          </button>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-16 sm:mt-20 relative mx-auto max-w-5xl rounded-3xl border border-[#CCBEB1] bg-white/75 p-3 shadow-2xl shadow-[#664930]/10 backdrop-blur-xl">
          <div className="rounded-2xl border border-[#D7CCC2] bg-white p-6 md:p-8 shadow-sm shadow-[#664930]/5">
            {/* Header controls of Mockup */}
            <div className="flex items-center justify-between border-b border-[#D7CCC2] pb-6 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFDBBB]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#CCBEB1]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#997E67]" />
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#F5EEE8] px-4 py-1.5 text-xs text-[#6B5A4D] border border-[#CCBEB1]">
                <Bot className="h-3.5 w-3.5 text-[#997E67]" />
                careerverse.ai/dashboard
              </div>
              <div className="w-12" />
            </div>

            {/* Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Analytics Card */}
              <div className="rounded-xl border border-[#D7CCC2] bg-white p-5 shadow-sm shadow-[#664930]/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#6B5A4D] uppercase tracking-wider">Profile Strength</span>
                  <TrendingUp className="h-4 w-4 text-[#997E67]" />
                </div>
                <div className="text-3xl font-extrabold text-[#2B2118]">94%</div>
                <div className="mt-2 text-xs text-[#6B5A4D] font-medium">Top 5% in your region</div>
                <div className="mt-4 h-1.5 w-full bg-[#F5EEE8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#664930] rounded-full" style={{ width: "94%" }} />
                </div>
              </div>

              {/* Bot Interaction Card */}
              <div className="rounded-xl border border-[#D7CCC2] bg-white p-5 flex flex-col justify-between shadow-sm shadow-[#664930]/5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-[#6B5A4D] uppercase tracking-wider">AI Copilot</span>
                    <Sparkles className="h-4 w-4 text-[#997E67]" />
                  </div>
                  <p className="text-xs text-[#6B5A4D] italic leading-relaxed">"Based on your codebase profile, we found 14 matching Frontend & AI engineering roles."</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-lg bg-[#FFF8F2] px-2.5 py-1 text-[11px] font-semibold text-[#664930] border border-[#D7CCC2] hover:border-[#997E67] cursor-pointer transition-colors">Optimize Profile</span>
                  <span className="rounded-lg bg-[#FFF8F2] px-2.5 py-1 text-[11px] font-semibold text-[#664930] border border-[#D7CCC2] hover:border-[#997E67] cursor-pointer transition-colors">Apply</span>
                </div>
              </div>

              {/* Jobs Card */}
              <div className="rounded-xl border border-[#D7CCC2] bg-white p-5 shadow-sm shadow-[#664930]/5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#6B5A4D] uppercase tracking-wider">Matches Found</span>
                  <Briefcase className="h-4 w-4 text-[#997E67]" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#D7CCC2] pb-2">
                    <div>
                      <div className="text-xs font-bold text-[#2B2118]">AI Platform Engineer</div>
                      <div className="text-[10px] text-[#6B5A4D]">NeuroLabs • Remote</div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#664930]">98% Match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#2B2118]">Staff Frontend Developer</div>
                      <div className="text-[10px] text-[#6B5A4D]">Stripe • Hybrid</div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#6B5A4D]">92% Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}