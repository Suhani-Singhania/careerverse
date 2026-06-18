import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import { getToken, logout } from "./services/authService";

function App() {
  // const [page, setPage] = useState<"home" | "dashboard">("home");
  const [page, setPage] = useState<"home" | "dashboard">("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));

  if (!isLoggedIn) {
    // return <AuthPage onLogin={() => setIsLoggedIn(true)} />;
  return (
  <AuthPage
    onLogin={() => {
      setIsLoggedIn(true);
      setPage("dashboard");
    }}
  />
);
  }

  return (
    <>
      <div className="fixed right-5 top-5 z-50 flex gap-3">
        <button
          onClick={() => setPage("home")}
            className="rounded-lg border border-slate-700 bg-[#0b1630] px-5 py-2.5 font-semibold text-white shadow-lg"        >
          Home
        </button>

        <button
          onClick={() => setPage("dashboard")}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 px-5 py-2.5 font-semibold text-white shadow-lg"        >
          Dashboard
        </button>

        <button
          onClick={() => {
            logout();
            setIsLoggedIn(false);
          }}
          className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white shadow-lg"        >
          Logout
        </button>
      </div>

{page === "home" ? (
  <LandingPage />
) : (
  <Dashboard
    onHome={() => setPage("home")}
    onLogout={() => {
      logout();
      setIsLoggedIn(false);
    }}
  />
)}    </>
  );
}

export default App;

  // return (
  //   <>
  //     <header className="sticky top-0 z-50 border-b border-[#eadfd4] bg-[#f7efe7]">
  //       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
  //         <div className="flex items-center gap-3">
  //           <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b1325] text-lg shadow-sm">
  //             🚀
  //           </div>
  //           <span className="text-lg font-bold text-[#111827]">
  //             CareerVerse
  //           </span>
  //         </div>

  //         <div className="flex items-center gap-3">
  //           <button
  //             onClick={() => setPage("home")}
  //             className="rounded-lg bg-[#101b33] px-4 py-2 text-sm font-semibold text-white shadow-sm"
  //           >
  //             Home
  //           </button>

  //           <button
  //             onClick={() => setPage("dashboard")}
  //             className="rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#a855f7] px-4 py-2 text-sm font-semibold text-white shadow-sm"
  //           >
  //             Dashboard
  //           </button>

  //           <button
  //             onClick={() => {
  //               logout();
  //               setIsLoggedIn(false);
  //             }}
  //             className="rounded-lg bg-[#e50914] px-4 py-2 text-sm font-semibold text-white shadow-sm"
  //           >
  //             Logout
  //           </button>
  //         </div>
  //       </div>
  //     </header>

  //     {page === "home" ? <LandingPage /> : <Dashboard />}
  //   </>
  // );