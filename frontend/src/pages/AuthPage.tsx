import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Sparkles,
  Bot,
  FileText,
  Map,
  BarChart3,
  BriefcaseBusiness,
} from "lucide-react";
import {
  forgotPassword,
  fetchCurrentUser,
  loginUser,
  registerUser,
  resendOtp,
  resetPassword,
  saveToken,
  verifyOtp,
} from "../services/authService";

interface AuthPageProps {
  onLogin: () => void;
}

const features = [
  {
    icon: Bot,
    label: "AI Project Generator",
  },
  {
    icon: FileText,
    label: "Resume Intelligence",
  },
  {
    icon: Map,
    label: "Career Roadmaps",
  },
  {
    icon: BarChart3,
    label: "Personalized Dashboard",
  },
  {
    icon: BriefcaseBusiness,
    label: "Project History",
  },
];

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
//   const [step, setStep] = useState<"credentials" | "otp">("credentials");
const [step, setStep] = useState<"credentials" | "otp" | "forgot" | "reset">("credentials");
const [newPassword, setNewPassword] = useState("");
const [email, setEmail] = useState("");
const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSubmit() {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "register") {
        await registerUser({ email, password, name: name.trim() });
      }

      const result = await loginUser({ email, password });

      if (result.requires_otp) {
        setStep("otp");
        setMessage("OTP sent. Check your email inbox.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit() {
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await verifyOtp({ email, otp });
      saveToken(result.access_token);
      await fetchCurrentUser();
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await resendOtp(email);
      setMessage("New OTP sent. Check your email inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }
async function handleForgotPassword() {
  if (!email.trim()) {
    setError("Please enter your email first.");
    return;
  }

  setLoading(true);
  setError("");
  setMessage("");

  try {
    await forgotPassword(email);
    setStep("reset");
    setMessage("Reset code sent. Check your email or backend terminal.");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to send reset code");
  } finally {
    setLoading(false);
  }
}

async function handleResetPassword() {
  if (!otp.trim() || !newPassword.trim()) {
    setError("Please enter reset code and new password.");
    return;
  }

  setLoading(true);
  setError("");
  setMessage("");

  try {
    await resetPassword({
      email,
      otp,
      new_password: newPassword,
    });

    setStep("credentials");
    setMode("login");
    setOtp("");
    setNewPassword("");
    setMessage("Password reset successful. Please login.");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Password reset failed");
  } finally {
    setLoading(false);
  }
}
  const isLogin = mode === "login";
  const isOtpStep = step === "otp";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="order-2 flex items-center justify-center overflow-hidden border-t border-slate-800 bg-slate-950 px-6 py-12 lg:order-1 lg:border-r lg:border-t-0 lg:px-12">
          <div className="relative w-full max-w-xl">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-pink-600/20 blur-3xl" />

            <div className="relative">
              <div className="mb-12 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#997E67]/40 bg-slate-900 shadow-lg">
                  <Sparkles className="h-5 w-5 text-[#FFDBBB]" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  CareerVerse
                </span>
              </div>

              <h1 className="max-w-lg text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                Supercharge Your Career with AI
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                Generate portfolio-ready projects, analyze your resume, discover
                skill gaps, and build personalized career roadmaps.
              </p>

              <div className="mt-10 grid gap-3">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.label}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                        <Icon className="h-4.5 w-4.5 text-white" />
                      </div>
                      <span className="font-medium text-slate-200">
                        {feature.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="order-1 flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(153,126,103,0.18),_transparent_36%),#020617] px-6 py-10 lg:order-2 lg:px-12">
          <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900/75 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <p className="mb-3 inline-flex rounded-full border border-[#997E67]/40 bg-[#997E67]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FFDBBB]">
                Secure access
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {isOtpStep
                  ? "Verify OTP"
                  : isLogin
                    ? "Welcome Back"
                    : "Create Account"}{" "}
                {!isOtpStep && "👋"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {isOtpStep
                  ? `Enter the 6-digit code sent to ${email}.`
                  : isLogin
                    ? "Sign in to continue your CareerVerse journey."
                    : "Create your account and start building your career roadmap."}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {message}
              </div>
            )}


{step === "reset" && (
  <div className="space-y-4">
    <div>
      <label
        htmlFor="reset-otp"
        className="mb-2 block text-sm font-semibold text-slate-300"
      >
        Reset Code
      </label>
      <input
        id="reset-otp"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25"
        placeholder="Enter reset code"
      />
    </div>

    <div>
      <label
        htmlFor="new-password"
        className="mb-2 block text-sm font-semibold text-slate-300"
      >
        New Password
      </label>
      <input
        id="new-password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25"
        placeholder="Enter new password"
      />
    </div>

    <button
      onClick={handleResetPassword}
      disabled={loading}
      className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-bold text-white"
    >
      {loading ? "Resetting..." : "Reset Password"}
    </button>

    <button
      onClick={() => {
        setStep("credentials");
        setOtp("");
        setNewPassword("");
        setError("");
        setMessage("");
      }}
      className="w-full text-sm font-semibold text-slate-400 hover:text-white"
    >
      Back to login
    </button>
  </div>
)}

            {step === "credentials" ? (
              <div className="space-y-4">
                {mode === "register" && (
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-10 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-10 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-300"
                    >
                      Password
                    </label>
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-xs font-semibold text-[#FFDBBB] hover:text-white"
                        >
                        Forgot Password?
                        </button>
                  </div>

                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-10 py-3 pr-12 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleCredentialsSubmit}
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700"
                >
                  {loading
                    ? isLogin
                      ? "Signing In..."
                      : "Creating Account..."
                    : isLogin
                      ? "Sign In"
                      : "Create Account"}
                </button>

                <div className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-slate-700" />
                  <span className="text-xs font-semibold text-slate-500">
                    OR
                  </span>
                  <div className="h-px flex-1 bg-slate-700" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                    Continue with Google
                  </button>
                  <button className="rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800">
                        Continue with GitHub
                        </button>
                </div>

                <p className="pt-2 text-center text-sm text-slate-400">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={() => {
                      setMode(isLogin ? "register" : "login");
                      setName("");
                      setError("");
                      setMessage("");
                    }}
                    className="font-semibold text-[#FFDBBB] hover:text-white"
                  >
                    {isLogin ? "Create an account" : "Sign in"}
                  </button>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-center text-2xl font-bold tracking-[0.35em] text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25"
                    placeholder="000000"
                  />
                </div>

                <button
                  onClick={handleOtpSubmit}
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-bold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Resend OTP
                </button>

                <button
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                    setError("");
                    setMessage("");
                  }}
                  className="w-full text-sm font-semibold text-slate-400 hover:text-white"
                >
                  Back to login
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}