import { useId, useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const emailId = useId();
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
      <main className="flex flex-col max-w-sm w-96 items-start relative z-10">
        <div className="flex flex-col items-start relative self-stretch w-full">
          <section className="flex flex-col items-start gap-6 px-0 py-8 relative self-stretch bg-white border border-solid border-zinc-200 w-full rounded-[23.2px] shadow-xl">
            <header className="flex flex-col items-center gap-4 px-6 relative self-stretch w-full">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                <span className="text-2xl">🔑</span>
              </div>
              <h1 className="font-semibold text-zinc-950 text-xl text-center">
                ភ្លេចលេខសម្ងាត់
              </h1>
              <p className="text-sm text-zinc-500 text-center leading-relaxed">
                បញ្ចូលលេខទូរស័ព្ទ ឬអ៊ីមែលរបស់អ្នក ដើម្បីកំណត់លេខសម្ងាត់ឡើងវិញ
              </p>
            </header>
            
            <div className="flex flex-col items-start px-6 relative self-stretch w-full">
              {!submitted ? (
                <form className="flex flex-col items-start gap-5 relative self-stretch w-full" onSubmit={handleSubmit}>
                  <div className="flex flex-col items-start gap-1 relative self-stretch w-full">
                    <label className="font-semibold text-zinc-950 text-sm" htmlFor={emailId}>លេខទូរស័ព្ទ ឬ អ៊ីមែល</label>
                    <input
                      id={emailId}
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="សូមបញ្ចូលលេខទូរស័ព្ទ ឬ អ៊ីមែល"
                      className="flex h-10 items-center self-stretch w-full rounded-[12px] border border-zinc-200 px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#6b3fa0] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex h-10 items-center justify-center px-4 self-stretch w-full bg-[#6b3fa0] hover:bg-[#4a2870] text-white font-medium rounded-[12px] transition-colors shadow-md mt-2"
                  >
                    ផ្ញើសារកំណត់ឡើងវិញ
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center w-full gap-4 py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">✓</div>
                  <p className="text-center text-sm font-medium text-zinc-800">
                    យើងបានផ្ញើសារទៅកាន់ <br/><span className="font-bold text-[#6b3fa0]">{identifier}</span>
                  </p>
                  <p className="text-center text-xs text-zinc-500">
                    សូមពិនិត្យមើលសាររបស់អ្នក ដើម្បីបន្ត។
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-center mt-8 w-full">
                <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-[#6b3fa0] flex items-center gap-1 transition-colors">
                  <span>←</span> ត្រឡប់ទៅចូលគណនីវិញ
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
