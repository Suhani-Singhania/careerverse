import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  tag?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  tag,
}: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#CCBEB1] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#997E67] hover:shadow-2xl hover:-translate-y-2">

      {tag && (
        <span className="absolute right-6 top-6 inline-flex items-center rounded-full border border-[#CCBEB1] bg-[#FFF8F2] px-3 py-1 text-xs font-medium tracking-wide text-[#664930]">
          {tag}
        </span>
      )}

      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#CCBEB1] bg-[#FFF8F2] text-[#664930] transition-all duration-300 group-hover:bg-[#FFDBBB] group-hover:border-[#997E67]">
        {icon}
      </div>

      <h3 className="mb-3 text-xl font-bold tracking-tight text-[#2B2118]">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[#6B5A4D]">
        {description}
      </p>
    </div>
  );
}