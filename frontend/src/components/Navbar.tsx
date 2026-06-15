import { useState } from "react";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-surface border border-brand-border shadow-md shadow-black/50">
              <Sparkles className="h-4.5 w-4.5 text-[var(--color-accent)]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
              CareerVerse
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] uppercase tracking-wider transition-colors duration-200">
              Features
            </a>
            <a href="#how-it-works" className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] uppercase tracking-wider transition-colors duration-200">
              How It Works
            </a>
            <a href="#analytics" className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] uppercase tracking-wider transition-colors duration-200">
              Analytics
            </a>
            <a href="#pricing" className="text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] uppercase tracking-wider transition-colors duration-200">
              Pricing
            </a>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <button className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-xs font-bold text-brand-bg hover:opacity-90 hover:shadow-[0_8px_20px_-8px_rgba(102,73,48,0.12)] transition-all duration-300">
              Launch App
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-brand-surface hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-brand-border bg-brand-bg/95 backdrop-blur-lg">
          <div className="space-y-1 px-4 py-4">
            <a
              href="#features"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] hover:bg-brand-surface hover:text-[var(--color-text-primary)] transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wider text-slate-400 hover:bg-brand-surface hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#analytics"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wider text-slate-400 hover:bg-brand-surface hover:text-white transition-colors"
            >
              Analytics
            </a>
            <a
              href="#pricing"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wider text-slate-400 hover:bg-brand-surface hover:text-white transition-colors"
            >
              Pricing
            </a>
            <div className="mt-4 pt-4 border-t border-brand-border flex flex-col gap-3">
              <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-bold text-brand-bg hover:opacity-90 transition-opacity">
                Launch App
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
