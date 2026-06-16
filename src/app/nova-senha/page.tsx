"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inter = Inter({ subsets: ["latin"] });

export default function NovaSenhaPage() {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // O Supabase dispara PASSWORD_RECOVERY quando o usuário chega
  // vindo do link de e-mail com token válido na URL
  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setPronto(true);
      }
    });
    // Verifica se já há sessão ativa (recarregamento da página)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setPronto(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      setErro("Não foi possível redefinir a senha. O link pode ter expirado. Solicite um novo.");
      setLoading(false);
      return;
    }

    setSucesso(true);
    setTimeout(() => router.push("/login"), 2500);
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
          {sucesso ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#00B3A4]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00B3A4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#05326D]">Senha redefinida!</h2>
                <p className="mt-2 text-sm text-[#05326D]/60">Redirecionando para o login…</p>
              </div>
            </div>
          ) : !pronto ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#05326D]">Link inválido ou expirado</h2>
                <p className="mt-2 text-sm text-[#05326D]/60 leading-relaxed">
                  Acesse esta página pelo link enviado ao seu e-mail.
                  Se expirou, solicite um novo.
                </p>
              </div>
              <Link
                href="/recuperar-senha"
                className="inline-block text-sm text-[#00B3A4] hover:underline font-medium"
              >
                Solicitar novo link
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#05326D]">Nova senha</h2>
                <p className="mt-1 text-sm text-[#05326D]/50">
                  Escolha uma nova senha segura para sua conta.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="senha" className="block text-sm font-medium text-[#05326D] mb-1.5">
                    Nova senha
                  </label>
                  <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    autoFocus
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                  />
                </div>

                <div>
                  <label htmlFor="confirmar" className="block text-sm font-medium text-[#05326D] mb-1.5">
                    Confirmar nova senha
                  </label>
                  <input
                    id="confirmar"
                    type="password"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    placeholder="Repita a senha"
                    required
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
                  {loading ? "Redefinindo…" : "Redefinir senha"}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-[#05326D]/40">
                <Link href="/login" className="text-[#00B3A4] font-medium hover:underline">
                  ← Voltar para o login
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
