"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inter = Inter({ subsets: ["latin"] });

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`,
    });

    if (error) {
      setErro("Não foi possível enviar o link. Verifique o e-mail e tente novamente.");
      setLoading(false);
      return;
    }

    setEnviado(true);
    setLoading(false);
  }

  return (
    <main className={`${inter.className} min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-[#05326D]">Vital</span>
            <span className="text-[#00B3A4]">Link</span>
          </h1>
          <p className="mt-2 text-sm text-[#05326D]/60">Gestão de cobranças para psicólogos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {enviado ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#00B3A4]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00B3A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#05326D]">Link enviado!</h2>
                <p className="mt-2 text-sm text-[#05326D]/60 leading-relaxed">
                  Enviamos um link de recuperação para <span className="font-medium text-[#05326D]">{email}</span>.
                  Verifique sua caixa de entrada e spam.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-block mt-2 text-sm text-[#00B3A4] hover:underline font-medium"
              >
                ← Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#05326D]">Recuperar senha</h2>
                <p className="mt-1 text-sm text-[#05326D]/50">
                  Informe seu e-mail e enviaremos um link para criar uma nova senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#05326D] mb-1.5">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@exemplo.com"
                    required
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                  />
                </div>

                {erro && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
                    {erro}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00B3A4] hover:bg-[#009e91] active:bg-[#008a7e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  {loading ? "Enviando…" : "Enviar link de recuperação"}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-[#05326D]/40">
                Lembrou a senha?{" "}
                <Link href="/login" className="text-[#00B3A4] font-medium hover:underline">
                  Voltar para o login
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-[#05326D]/30">
          © {new Date().getFullYear()} VitalLink. Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
