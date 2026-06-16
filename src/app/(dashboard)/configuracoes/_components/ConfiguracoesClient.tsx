"use client";

// Atualize WHATSAPP_UPGRADE com o número real de vendas antes de ir para produção
const WHATSAPP_UPGRADE = "5511999999999";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import WhatsAppEmbeddedSignup from "@/components/WhatsAppEmbeddedSignup";

type Aba = "conta" | "whatsapp" | "mensagens" | "planos" | "lgpd";

const MENSAGEM_PADRAO =
  "Olá, {nome_paciente}! 👋\n\nPassando para lembrar que sua sessão no valor de {valor} vence no {data_vencimento}.\n\nQualquer dúvida, estou à disposição!\n\nAbraços 💙";

interface Profile {
  nome: string | null;
  email: string | null;
  whatsapp: string | null;
  accepted_terms_at: string | null;
  mensagem_cobranca: string | null;
}

interface ConfigPerfil {
  whatsapp_numero: string | null;
  whatsapp_conectado: boolean | null;
  mensagem_padrao: string | null;
  meta_phone_id: string | null;
}

function previewMensagem(template: string) {
  return template
    .replace(/{nome_paciente}/g, "Ana Silva")
    .replace(/{valor}/g, "R$ 150,00")
    .replace(/{data_vencimento}/g, "dia 15");
}

// ─── Aba Conta ────────────────────────────────────────────────────────────────
function AbaConta({ profile, userEmail }: { profile: Profile; userEmail: string }) {
  const [nome, setNome] = useState(profile.nome ?? "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? "");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function salvar() {
    setLoading(true);
    setSucesso(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ nome, whatsapp }).eq("id", user.id);
    setLoading(false);
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
  }

  return (
    <div className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-[#05326D] mb-1.5">Nome completo</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#05326D] mb-1.5">E-mail</label>
        <input
          type="email"
          value={userEmail}
          disabled
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D]/50 bg-gray-50 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-[#05326D]/40">O e-mail não pode ser alterado</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#05326D] mb-1.5">WhatsApp pessoal</label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="(11) 99999-9999"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={salvar}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] disabled:opacity-60 rounded-lg transition-colors"
        >
          {loading ? "Salvando…" : "Salvar alterações"}
        </button>
        {sucesso && <span className="text-sm text-emerald-600 font-medium">✓ Salvo!</span>}
      </div>
    </div>
  );
}

// ─── Aba WhatsApp ─────────────────────────────────────────────────────────────
function AbaWhatsApp({ configPerfil }: { configPerfil: ConfigPerfil }) {
  const [conectado, setConectado] = useState(configPerfil.whatsapp_conectado ?? false);
  const [numeroConectado, setNumeroConectado] = useState(
    configPerfil.whatsapp_numero ?? configPerfil.meta_phone_id ?? null
  );

  return (
    <WhatsAppEmbeddedSignup
      conectado={conectado}
      numeroConectado={numeroConectado}
      onConectado={(phoneNumber) => {
        setConectado(true);
        setNumeroConectado(phoneNumber);
      }}
      onDesconectado={() => {
        setConectado(false);
        setNumeroConectado(null);
      }}
    />
  );
}

// ─── Aba Mensagens ────────────────────────────────────────────────────────────
function AbaMensagens({ configPerfil }: { configPerfil: ConfigPerfil }) {
  const [mensagem, setMensagem] = useState(configPerfil.mensagem_padrao ?? MENSAGEM_PADRAO);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function salvar() {
    setLoading(true);
    setSucesso(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("configuracoes_perfil").upsert(
      {
        psicologo_id: user.id,
        mensagem_padrao: mensagem,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "psicologo_id" }
    );
    setLoading(false);
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Editor */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#05326D] mb-1.5">
            Mensagem padrão de cobrança
          </label>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={9}
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition resize-none font-mono"
          />
        </div>
        <div className="rounded-lg bg-[#F9FAFB] border border-gray-100 p-3">
          <p className="text-xs font-medium text-[#05326D] mb-1.5">Variáveis disponíveis</p>
          <div className="flex flex-wrap gap-1.5">
            {["{nome_paciente}", "{valor}", "{data_vencimento}"].map((v) => (
              <span key={v} className="px-2 py-1 rounded-md bg-[#00B3A4]/10 text-[#00B3A4] text-xs font-mono font-medium">
                {v}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={salvar}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] disabled:opacity-60 rounded-lg transition-colors"
          >
            {loading ? "Salvando…" : "Salvar mensagem"}
          </button>
          {sucesso && <span className="text-sm text-emerald-600 font-medium">✓ Salvo!</span>}
        </div>
      </div>

      {/* Preview */}
      <div>
        <p className="text-sm font-medium text-[#05326D] mb-1.5">Preview</p>
        <div className="rounded-xl bg-[#e9fef9] border border-[#00B3A4]/20 p-4">
          <p className="text-xs text-[#05326D]/50 mb-2 font-medium uppercase tracking-wide">
            Como o paciente vai receber
          </p>
          <div className="bg-white rounded-xl shadow-sm px-4 py-3 text-sm text-[#05326D] whitespace-pre-wrap leading-relaxed">
            {previewMensagem(mensagem)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Aba Planos ───────────────────────────────────────────────────────────────
function AbaPlanos() {
  return (
    <div className="max-w-lg space-y-4">
      {/* Plano atual */}
      <div className="rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-[#05326D]">Plano atual</p>
          <span className="px-2.5 py-1 rounded-full bg-[#05326D]/10 text-[#05326D] text-xs font-medium">Free</span>
        </div>
        <p className="text-xs text-[#05326D]/50">30 dias de teste gratuito</p>
      </div>

      {/* Plano Pro */}
      <div className="rounded-xl border-2 border-[#00B3A4] p-5 relative">
        <span className="absolute -top-3 left-5 px-3 py-1 bg-[#00B3A4] text-white text-xs font-semibold rounded-full">
          Mais escolhido
        </span>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-[#05326D]">Plano Profissional</p>
            <p className="text-2xl font-bold text-[#05326D] mt-1">
              R$ 59<span className="text-sm font-normal text-[#05326D]/50">/mês</span>
            </p>
          </div>
        </div>
        <ul className="space-y-2 mb-5">
          {[
            "Cobranças automáticas ilimitadas",
            "Follow-ups via WhatsApp",
            "Painel de inadimplência",
            "Suporte por WhatsApp",
            "Cancele quando quiser",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-[#05326D]/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00B3A4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
        <a
          href={`https://wa.me/${WHATSAPP_UPGRADE}?text=${encodeURIComponent("Olá! Gostaria de fazer upgrade para o Plano Profissional do VitalLink.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-2.5 text-center text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] rounded-lg transition-colors"
        >
          Fazer Upgrade
        </a>
      </div>
    </div>
  );
}

// ─── Modal Confirmar Exclusão de Conta ────────────────────────────────────────
function ModalExcluirConta({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleExcluir() {
    if (confirmacao !== "EXCLUIR") return;
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Erro ao excluir a conta.");
      router.push("/login");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl">
        <div className="px-6 pt-6 pb-5 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <div className="text-center">
            <h2 className="text-base font-semibold text-[#05326D]">Excluir minha conta</h2>
            <p className="mt-1.5 text-sm text-[#05326D]/60 leading-relaxed">
              Esta ação é <strong className="text-red-500">irreversível</strong>. Todos os seus dados —
              pacientes, cobranças, configurações e histórico — serão permanentemente excluídos.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#05326D]/70 mb-1.5">
              Para confirmar, digite <span className="font-mono font-bold text-red-500">EXCLUIR</span> abaixo:
            </label>
            <input
              type="text"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="EXCLUIR"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition font-mono"
            />
          </div>

          {erro && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              {erro}
            </p>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-semibold text-[#05326D] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExcluir}
            disabled={loading || confirmacao !== "EXCLUIR"}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? "Excluindo…" : "Excluir tudo"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Aba LGPD ─────────────────────────────────────────────────────────────────
function AbaLGPD({ acceptedTermsAt }: { acceptedTermsAt: string | null }) {
  const [modalExcluir, setModalExcluir] = useState(false);
  const [exportando, setExportando] = useState(false);

  const dataAceite = acceptedTermsAt
    ? new Date(acceptedTermsAt).toLocaleString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  async function exportarDados() {
    setExportando(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setExportando(false); return; }

    const [perfil, configPerfil, pacientes, templates, regras] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("configuracoes_perfil")
        .select("whatsapp_numero, whatsapp_conectado, mensagem_padrao, meta_phone_id, meta_token_connected_at")
        .eq("psicologo_id", user.id).single(),
      supabase.from("pacientes").select("nome, whatsapp, valor_sessao, dia_vencimento, status, created_at").eq("psicologo_id", user.id),
      supabase.from("templates").select("nome, conteudo, created_at").eq("psicologo_id", user.id),
      supabase.from("regras_cobranca").select("nome, ativa, aplicar_para, created_at").eq("psicologo_id", user.id),
    ]);

    const exportData = {
      exportado_em: new Date().toISOString(),
      perfil: { ...perfil.data, meta_access_token: "[OMITIDO POR SEGURANÇA]" },
      configuracoes: configPerfil.data,
      pacientes: pacientes.data ?? [],
      templates: templates.data ?? [],
      regras_cobranca: regras.data ?? [],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vitallink-dados-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportando(false);
  }

  return (
    <>
      <div className="max-w-lg space-y-5">
        {/* Informativo */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
          <h3 className="text-sm font-semibold text-[#05326D]">Como usamos seus dados</h3>
          <p className="text-sm text-[#05326D]/70 leading-relaxed">
            O VitalLink coleta e processa apenas os dados necessários para o funcionamento do serviço:
            nome, e-mail, WhatsApp e dados dos seus pacientes. Nenhuma informação é compartilhada com
            terceiros sem o seu consentimento. Todos os dados são armazenados com criptografia.
          </p>
        </div>

        {/* Aceite dos termos */}
        {dataAceite && (
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <p className="text-xs font-medium text-[#05326D]/50 uppercase tracking-wide mb-1">
              Aceite dos termos
            </p>
            <p className="text-sm text-[#05326D]">
              Você aceitou os Termos de Uso e a Política de Privacidade em{" "}
              <span className="font-medium">{dataAceite}</span>.
            </p>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3">
          <a href="/privacidade" target="_blank" rel="noopener noreferrer"
            className="text-sm text-[#00B3A4] hover:underline font-medium">
            Política de Privacidade ↗
          </a>
          <span className="text-[#05326D]/20">|</span>
          <a href="/termos" target="_blank" rel="noopener noreferrer"
            className="text-sm text-[#00B3A4] hover:underline font-medium">
            Termos de Uso ↗
          </a>
        </div>

        {/* Portabilidade */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-[#05326D]">Portabilidade de dados</h3>
            <p className="text-xs text-[#05326D]/50 mt-1 leading-relaxed">
              Baixe um arquivo JSON com todos os seus dados cadastrados na plataforma (LGPD, art. 18, V).
            </p>
          </div>
          <button
            type="button"
            onClick={exportarDados}
            disabled={exportando}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#05326D] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {exportando ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Exportando…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Exportar meus dados
              </>
            )}
          </button>
        </div>

        {/* Exclusão */}
        <div className="pt-2 border-t border-gray-100 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-red-500">Zona de perigo</h3>
            <p className="text-xs text-[#05326D]/50 mt-1 leading-relaxed">
              A exclusão da conta é irreversível. Todos os seus pacientes, cobranças e configurações
              serão permanentemente removidos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalExcluir(true)}
            className="px-5 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Excluir minha conta
          </button>
        </div>
      </div>

      {modalExcluir && <ModalExcluirConta onClose={() => setModalExcluir(false)} />}
    </>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ConfiguracoesClient({
  profile,
  configPerfil,
  userEmail,
}: {
  profile: Profile;
  configPerfil: ConfigPerfil;
  userEmail: string;
}) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>("conta");

  const abas: { id: Aba; label: string }[] = [
    { id: "conta", label: "Conta" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "mensagens", label: "Mensagens" },
    { id: "planos", label: "Planos" },
    { id: "lgpd", label: "LGPD" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#05326D]">Configurações</h1>
        <p className="text-sm text-[#05326D]/50 mt-0.5">Gerencie sua conta e preferências</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {abas.map((aba) => (
            <button
              key={aba.id}
              type="button"
              onClick={() => setAbaAtiva(aba.id)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                abaAtiva === aba.id
                  ? "border-[#00B3A4] text-[#00B3A4]"
                  : "border-transparent text-[#05326D]/50 hover:text-[#05326D] hover:border-gray-300"
              }`}
            >
              {aba.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo da aba */}
      <div>
        {abaAtiva === "conta" && <AbaConta profile={profile} userEmail={userEmail} />}
        {abaAtiva === "whatsapp" && <AbaWhatsApp configPerfil={configPerfil} />}
        {abaAtiva === "mensagens" && <AbaMensagens configPerfil={configPerfil} />}
        {abaAtiva === "planos" && <AbaPlanos />}
        {abaAtiva === "lgpd" && <AbaLGPD acceptedTermsAt={profile.accepted_terms_at} />}
      </div>
    </div>
  );
}
