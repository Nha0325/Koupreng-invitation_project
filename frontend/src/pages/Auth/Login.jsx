import { useId, useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const emailId = useId();
  const passwordId = useId();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const socialButtons = [
    {
      id: "telegram",
      label: "ចូលបានតាមរយៈ Telegram",
      icon: (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.2 3.45-.49.34-.94.5-1.35.49-.45-.01-1.32-.26-1.96-.47-.79-.26-1.42-.39-1.37-.83.03-.22.33-.44.91-.68 3.56-1.55 5.94-2.58 7.12-3.07 3.39-1.41 4.1-1.65 4.56-1.66.1 0 .32.02.46.12.12.09.15.22.16.32.01.07.02.16.02.24z" fill="#0088cc"/>
        </svg>
      ),
      className:
        "flex h-10 items-center justify-center gap-2 px-3 relative self-stretch w-full bg-white rounded-[12px] border border-solid border-zinc-200 shadow-sm hover:bg-zinc-50 transition-colors",
    },
    {
      id: "google",
      label: "ចូលបានតាមរយៈ Google",
      icon: (
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
      ),
      className:
        "flex h-10 items-center justify-center gap-2 px-3 relative self-stretch w-full bg-white rounded-[12px] border border-solid border-zinc-200 shadow-sm hover:bg-zinc-50 transition-colors",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-5 px-4">
      <main className="flex flex-col max-w-sm w-96 items-start relative z-10">
        <div className="flex flex-col items-start relative self-stretch w-full">
          <section className="flex flex-col items-start gap-6 px-0 py-8 relative self-stretch bg-white border border-solid border-zinc-200 w-full rounded-[23.2px] shadow-xl">
            <header className="flex flex-col items-center gap-4 px-6 relative self-stretch w-full">
              <div className="flex items-center justify-center gap-3 relative self-stretch w-full">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                  <span className="text-2xl">💒</span>
                </div>
                <div className="flex items-center justify-start relative">
                  <div className="font-bold text-purple-600 text-xl tracking-tight">
                    Koupreng
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-center relative self-stretch w-full">
                <h1 className="font-semibold text-zinc-950 text-xl text-center">
                  ចូលទៅកាន់គណនីរបស់អ្នក
                </h1>
              </div>
              <div className="flex items-start justify-center relative self-stretch w-full">
                <p className="text-sm text-zinc-500 text-center leading-relaxed">
                  ចូលទៅកាន់គណនីរបស់អ្នកប្រកបដោយសុវត្ថិភាព និងភាពងាយស្រួល។
                </p>
              </div>
            </header>
            
            <div className="flex flex-col items-start px-6 relative self-stretch w-full">
              <form className="flex flex-col items-start gap-5 relative self-stretch w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
                  <label className="font-semibold text-zinc-950 text-sm" htmlFor={emailId}>
                    លេខទូរស័ព្ទ ឬ អ៊ីមែល
                  </label>
                  <input
                    id={emailId}
                    name="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="សូមបញ្ចូលលេខទូរស័ព្ទ ឬ អ៊ីមែល"
                    className="flex h-10 items-center self-stretch w-full rounded-[12px] border border-zinc-200 px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
                  <div className="flex justify-between w-full items-center">
                    <label className="font-semibold text-zinc-950 text-sm" htmlFor={passwordId}>
                      លេខសម្ងាត់
                    </label>
                    <Link to="/forgot-password" className="text-xs text-purple-600 hover:underline">
                      ភ្លេចលេខសម្ងាត់?
                    </Link>
                  </div>
                  <div className="relative self-stretch w-full">
                    <input
                      id={passwordId}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="បញ្ចូលលេខសម្ងាត់"
                      className="flex h-10 items-center self-stretch w-full rounded-[12px] border border-zinc-200 pl-4 pr-10 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex h-10 items-center justify-center px-4 self-stretch w-full bg-[#6b3fa0] hover:bg-[#4a2870] text-white font-medium rounded-[12px] transition-colors shadow-md mt-2"
                >
                  ចូលគណនី
                </button>

                <div className="flex items-center self-stretch w-full my-1">
                  <div className="h-[1px] flex-1 bg-zinc-200"></div>
                  <span className="px-3 text-xs text-zinc-400">ឬ</span>
                  <div className="h-[1px] flex-1 bg-zinc-200"></div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  {socialButtons.map((btn) => (
                    <button key={btn.id} type="button" className={btn.className}>
                      {btn.icon}
                      <span className="text-sm font-medium text-zinc-800">{btn.label}</span>
                    </button>
                  ))}
                </div>
              </form>
              
              <div className="flex items-center justify-center gap-2 mt-8 w-full">
                <span className="text-sm text-zinc-600">មិនទាន់មានគណនីមែនទេ?</span>
                <Link to="/register" className="text-sm font-bold text-[#6b3fa0] hover:underline">
                  ចុះឈ្មោះនៅទីនេះ
                </Link>
              </div>
            </div>
          </section>
          
          <footer className="flex justify-center pt-4 w-full">
            <span className="text-xs text-zinc-400">Koupreng © 2026</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
