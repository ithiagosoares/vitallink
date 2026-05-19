"use client";

// Atualize WHATSAPP_UPGRADE com o número real de vendas antes de ir para produção
const WHATSAPP_UPGRADE = "5511999999999";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
function AbaWhatsApp() {
  const [numero, setNumero] = useState("");
  const [status] = useState<"conectado" | "desconectado">("desconectado");

  return (
    <div className="space-y-5 max-w-lg">
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ${
            status === "conectado"
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-red-50 text-red-600 ring-red-200"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status === "conectado" ? "bg-emerald-500" : "bg-red-500"}`} />
          {status === "conectado" ? "Conectado" : "Desconectado"}
        </span>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#05326D] mb-1.5">
          Número que enviará as cobranças
        </label>
        <input
          type="tel"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="(11) 99999-9999"
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
        />
      </div>

      <div className="rounded-xl bg-[#05326D]/5 border border-[#05326D]/10 p-4 space-y-2">
        <p className="text-sm font-medium text-[#05326D]">Como conectar via Z-API</p>
        <ol className="space-y-1.5 text-xs text-[#05326D]/70 list-decimal list-inside leading-relaxed">
          <li>Crie uma conta em <span className="font-medium">z-api.io</span> e obtenha suas credenciais de API.</li>
          <li>Abra o WhatsApp no celular e acesse <span className="font-medium">Dispositivos vinculados</span>.</li>
          <li>Escaneie o QR Code exibido no painel da Z-API.</li>
          <li>Cole o <span className="font-medium">Instance ID</span> e o <span className="font-medium">Token</span> nas configurações de integração.</li>
          <li>Clique em <span className="font-medium">Testar conexão</span> — o status mudará para Conectado.</li>
        </ol>
      </div>

      <button
        type="button"
        className="px-5 py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] rounded-lg transition-colors"
      >
        Salvar e testar conexão
      </button>
    </div>
  );
}

// ─── Aba Mensagens ────────────────────────────────────────────────────────────
function AbaMensagens({ mensagemInicial }: { mensagemInicial: string | null }) {
  const [mensagem, setMensagem] = useState(mensagemInicial ?? MENSAGEM_PADRAO);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function salvar() {
    setLoading(true);
    setSucesso(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("profiles").update({ mensagem_cobranca: mensagem }).eq("id", user.id);
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

// ─── Aba LGPD ─────────────────────────────────────────────────────────────────
function AbaLGPD({ acceptedTermsAt }: { acceptedTermsAt: string | null }) {
  const dataAceite = acceptedTermsAt
    ? new Date(acceptedTermsAt).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="max-w-lg space-y-5">
      <div className="rounded-xl border border-gray-100 bg-white p-5 space-y-3">
        <h3 className="text-sm font-semibold text-[#05326D]">Como usamos seus dados</h3>
        <p className="text-sm text-[#05326D]/70 leading-relaxed">
          O VitalLink coleta e processa apenas os dados necessários para o funcionamento do serviço:
          nome, e-mail, WhatsApp e dados dos seus pacientes. Nenhuma informação é compartilhada com
          terceiros sem o seu consentimento. Todos os dados são armazenados com criptografia e você
          pode solicitar a exclusão a qualquer momento.
        </p>
      </div>

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

      <div className="flex flex-wrap gap-3">
        <a
          href="/politica-de-privacidade"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#00B3A4] hover:underline font-medium"
        >
          Política de Privacidade ↗
        </a>
        <span className="text-[#05326D]/20">|</span>
        <a
          href="/termos-de-uso"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#00B3A4] hover:underline font-medium"
        >
          Termos de Uso ↗
        </a>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-[#05326D]/50 mb-3">
          A solicitação de exclusão de dados é irreversível. Todos os seus pacientes e cobranças
          cadastrados serão permanentemente removidos.
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm("Tem certeza? Esta ação é irreversível e excluirá todos os seus dados.")) {
              window.open(
                `https://wa.me/${WHATSAPP_UPGRADE}?text=${encodeURIComponent("Olá, gostaria de solicitar a exclusão da minha conta e de todos os meus dados no VitalLink.")}`,
                "_blank"
              );
            }
          }}
          className="px-5 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Solicitar exclusão dos dados
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ConfiguracoesClient({
  profile,
  userEmail,
}: {
  profile: Profile;
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
        {abaAtiva === "whatsapp" && <AbaWhatsApp />}
        {abaAtiva === "mensagens" && <AbaMensagens mensagemInicial={profile.mensagem_cobranca} />}
        {abaAtiva === "planos" && <AbaPlanos />}
        {abaAtiva === "lgpd" && <AbaLGPD acceptedTermsAt={profile.accepted_terms_at} />}
      </div>
    </div>
  );
}
