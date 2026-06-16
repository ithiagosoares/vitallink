"use client";

// ATENÇÃO: para testes locais, desative a confirmação de e-mail no Supabase:
// Authentication → Providers → Email → desmarque "Confirm email"

import { Inter } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inter = Inter({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "cadastro">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function trocarModo(novoModo: "entrar" | "cadastro") {
    setModo(novoModo);
    setErro("");
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const supabase = createClient();

    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) {
        setErro("Email ou senha incorretos.");
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password: senha });
      if (error) {
        setErro(
          error.message === "User already registered"
            ? "Este e-mail já está cadastrado."
            : "Erro ao criar conta. Tente novamente."
        );
        setLoading(false);
        return;
      }
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          nome,
          email,
          accepted_terms_at: new Date().toISOString(),
        });
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  const botaoDesabilitado = loading || (modo === "cadastro" && !aceitouTermos);

  return (
    <main
      className={`${inter.className} min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4`}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#05326D] tracking-tight">
            <span className="text-[#05326D]">Vital</span>
            <span className="text-[#00B3A4]">Link</span>
          </h1>
          <p className="mt-2 text-sm text-[#05326D]/60">
            Gestão de cobranças para psicólogos
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Alternador */}
          <div className="flex rounded-lg bg-[#F9FAFB] p-1 mb-6">
            <button
              type="button"
              onClick={() => trocarModo("entrar")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                modo === "entrar"
                  ? "bg-white text-[#05326D] shadow-sm"
                  : "text-[#05326D]/50 hover:text-[#05326D]/80"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => trocarModo("cadastro")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                modo === "cadastro"
                  ? "bg-white text-[#05326D] shadow-sm"
                  : "text-[#05326D]/50 hover:text-[#05326D]/80"
              }`}
            >
              Criar conta
            </button>
          </div>

          {/* Subtítulo */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#05326D]">
              {modo === "entrar" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="mt-1 text-sm text-[#05326D]/50">
              {modo === "entrar"
                ? "Acesse sua conta para continuar"
                : "Comece a gerenciar suas cobranças hoje"}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === "cadastro" && (
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-[#05326D] mb-1.5">
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                />
              </div>
            )}

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
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="senha" className="block text-sm font-medium text-[#05326D]">
                  Senha
                </label>
                {modo === "entrar" && (
                  <Link href="/recuperar-senha" className="text-xs text-[#00B3A4] hover:underline">
                    Esqueceu a senha?
                  </Link>
                )}
              </div>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
              />
            </div>

            {/* Checkbox LGPD — apenas no cadastro */}
            {modo === "cadastro" && (
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#00B3A4] cursor-pointer"
                />
                <span className="text-xs text-[#05326D]/70 leading-relaxed">
                  Li e concordo com os{" "}
                  <a
                    href="/termos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00B3A4] hover:underline font-medium"
                  >
                    Termos de Uso
                  </a>{" "}
                  e a{" "}
                  <a
                    href="/privacidade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00B3A4] hover:underline font-medium"
                  >
                    Política de Privacidade
                  </a>
                </span>
              </label>
            )}

            {erro && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={botaoDesabilitado}
              className="w-full mt-2 bg-[#00B3A4] hover:bg-[#009e91] active:bg-[#008a7e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading
                ? modo === "entrar" ? "Entrando…" : "Criando conta…"
                : modo === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          {/* Rodapé do card */}
          <p className="mt-5 text-center text-xs text-[#05326D]/40">
            {modo === "entrar" ? (
              <>
                Ainda não tem conta?{" "}
                <button type="button" onClick={() => trocarModo("cadastro")} className="text-[#00B3A4] font-medium hover:underline">
                  Criar conta
                </button>
              </>
            ) : (
              <>
                Já tem conta?{" "}
                <button type="button" onClick={() => trocarModo("entrar")} className="text-[#00B3A4] font-medium hover:underline">
                  Entrar
                </button>
              </>
            )}
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[#05326D]/30">
          © {new Date().getFullYear()} VitalLink. Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
