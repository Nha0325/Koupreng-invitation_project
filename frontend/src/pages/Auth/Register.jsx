import { useId, useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const nameId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-5 px-4">
      <main className="flex flex-col max-w-sm w-96 items-start relative z-10">
        <div className="flex flex-col items-start relative self-stretch w-full">
          <section className="flex flex-col items-start gap-6 px-0 py-8 relative self-stretch bg-white border border-solid border-zinc-200 w-full rounded-[23.2px] shadow-xl">
            <header className="flex flex-col items-center gap-4 px-6 relative self-stretch w-full">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                <span className="text-2xl">💍</span>
              </div>
              <h1 className="font-semibold text-zinc-950 text-xl text-center">
                បង្កើតគណនីថ្មី
              </h1>
              <p className="text-sm text-zinc-500 text-center leading-relaxed">
                ចាប់ផ្តើមរៀបចំពិធីមង្គលការរបស់អ្នកជាមួយ Koupreng
              </p>
            </header>
            
            <div className="flex flex-col items-start px-6 relative self-stretch w-full">
              <form className="flex flex-col items-start gap-4 relative self-stretch w-full" onSubmit={handleSubmit}>
                
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
                  <label className="font-semibold text-zinc-950 text-sm" htmlFor={nameId}>ឈ្មោះ</label>
                  <input
                    id={nameId}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                    className="flex h-10 items-center self-stretch w-full rounded-[12px] border border-zinc-200 px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6b3fa0] transition-all"
                  />
                </div>

                <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
                  <label className="font-semibold text-zinc-950 text-sm" htmlFor={phoneId}>លេខទូរស័ព្ទ</label>
                  <input
                    id={phoneId}
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                    className="flex h-10 items-center self-stretch w-full rounded-[12px] border border-zinc-200 px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6b3fa0] transition-all"
                  />
                </div>
                
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
                  <label className="font-semibold text-zinc-950 text-sm" htmlFor={passwordId}>លេខសម្ងាត់</label>
                  <div className="relative self-stretch w-full">
                    <input
                      id={passwordId}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="បញ្ចូលលេខសម្ងាត់"
                      className="flex h-10 items-center self-stretch w-full rounded-[12px] border border-zinc-200 pl-4 pr-10 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6b3fa0] transition-all"
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

                <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
                  <label className="font-semibold text-zinc-950 text-sm" htmlFor={confirmPasswordId}>បញ្ជាក់លេខសម្ងាត់</label>
                  <input
                    id={confirmPasswordId}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="បញ្ជាក់លេខសម្ងាត់"
                    className="flex h-10 items-center self-stretch w-full rounded-[12px] border border-zinc-200 px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6b3fa0] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="flex h-10 items-center justify-center px-4 self-stretch w-full bg-[#6b3fa0] hover:bg-[#4a2870] text-white font-medium rounded-[12px] transition-colors shadow-md mt-4"
                >
                  ចុះឈ្មោះ
                </button>
              </form>
              
              <div className="flex items-center justify-center gap-2 mt-6 w-full">
                <span className="text-sm text-zinc-600">មានគណនីរួចហើយ?</span>
                <Link to="/login" className="text-sm font-bold text-[#6b3fa0] hover:underline">
                  ចូលគណនី
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
