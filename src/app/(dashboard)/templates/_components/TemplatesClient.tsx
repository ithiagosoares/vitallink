"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Template {
  id: string;
  nome: string;
  conteudo: string;
  created_at: string;
}

const SUGESTOES: Pick<Template, "nome" | "conteudo">[] = [
  {
    nome: "Lembrete de vencimento",
    conteudo:
      "Olá, {nome_paciente}! 👋\n\nPassando para lembrar que sua sessão no valor de {valor} vence em 3 dias, no {data_vencimento}.\n\nAté logo! 💙",
  },
  {
    nome: "Aviso de vencimento",
    conteudo:
      "Olá, {nome_paciente}! 👋\n\nHoje vence o pagamento da sua sessão no valor de {valor}.\n\nConta com você! 💙",
  },
  {
    nome: "Aviso de atraso",
    conteudo:
      "Olá, {nome_paciente}, tudo bem? 👋\n\nNotamos que o pagamento da sua sessão no valor de {valor} ainda não foi identificado. Poderia verificar?\n\nEstou à disposição! 💙",
  },
];

const VARIAVEIS = ["{nome_paciente}", "{valor}", "{data_vencimento}"];

export default function TemplatesClient({
  templatesIniciais,
}: {
  templatesIniciais: Template[];
}) {
  const [templates, setTemplates] = useState(templatesIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [templateEditando, setTemplateEditando] = useState<Template | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formConteudo, setFormConteudo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  function abrirNovo(sugestao?: Pick<Template, "nome" | "conteudo">) {
    setTemplateEditando(null);
    setFormNome(sugestao?.nome ?? "");
    setFormConteudo(sugestao?.conteudo ?? "");
    setModalAberto(true);
  }

  function abrirEditar(t: Template) {
    setTemplateEditando(t);
    setFormNome(t.nome);
    setFormConteudo(t.conteudo);
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setTemplateEditando(null);
  }

  async function salvar() {
    if (!formNome.trim() || !formConteudo.trim()) return;
    setSalvando(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) { setSalvando(false); return; }

    if (templateEditando) {
      const { data } = await supabase
        .from("templates")
        .update({ nome: formNome.trim(), conteudo: formConteudo.trim() })
        .eq("id", templateEditando.id)
        .select()
        .single();
      if (data) setTemplates((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    } else {
      const { data } = await supabase
        .from("templates")
        .insert({ psicologo_id: user.id, nome: formNome.trim(), conteudo: formConteudo.trim() })
        .select()
        .single();
      if (data) setTemplates((prev) => [data, ...prev]);
    }

    setSalvando(false);
    fecharModal();
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este template?")) return;
    setExcluindo(id);
    const supabase = createClient();
    await supabase.from("templates").delete().eq("id", id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    setExcluindo(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#05326D]">Templates</h1>
          <p className="text-sm text-[#05326D]/50 mt-0.5">Modelos de mensagem para cobranças</p>
        </div>
        <button
          onClick={() => abrirNovo()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo template
        </button>
      </div>

      {/* Estado vazio */}
      {templates.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-[#05326D]/50">
            Nenhum template criado ainda. Comece com uma sugestão:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SUGESTOES.map((s) => (
              <button
                key={s.nome}
                onClick={() => abrirNovo(s)}
                className="text-left bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-[#00B3A4]/40 hover:shadow-md transition-all group"
              >
                <p className="text-sm font-semibold text-[#05326D] group-hover:text-[#00B3A4] transition-colors mb-2">
                  {s.nome}
                </p>
                <p className="text-xs text-[#05326D]/50 line-clamp-3 whitespace-pre-line leading-relaxed">
                  {s.conteudo}
                </p>
                <span className="mt-3 inline-block text-xs font-medium text-[#00B3A4]">
                  Usar este modelo →
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-sm font-semibold text-[#05326D] leading-snug">{t.nome}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => abrirEditar(t)}
                    title="Editar"
                    className="p-1.5 text-[#05326D]/40 hover:text-[#05326D] hover:bg-[#05326D]/5 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => excluir(t.id)}
                    disabled={excluindo === t.id}
                    title="Excluir"
                    className="p-1.5 text-[#05326D]/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-xs text-[#05326D]/50 whitespace-pre-line line-clamp-4 leading-relaxed flex-1">
                {t.conteudo}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={fecharModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#05326D]">
                {templateEditando ? "Editar template" : "Novo template"}
              </h2>
              <button
                onClick={fecharModal}
                className="p-1.5 text-[#05326D]/40 hover:text-[#05326D] hover:bg-[#05326D]/5 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#05326D] mb-1.5">
                Nome do template
              </label>
              <input
                type="text"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Ex: Lembrete de vencimento"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#05326D] mb-1.5">
                Conteúdo da mensagem
              </label>
              <textarea
                value={formConteudo}
                onChange={(e) => setFormConteudo(e.target.value)}
                rows={7}
                placeholder="Digite a mensagem..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition resize-none font-mono"
              />
            </div>

            <div className="rounded-lg bg-[#F9FAFB] border border-gray-100 p-3">
              <p className="text-xs font-medium text-[#05326D] mb-1.5">
                Variáveis disponíveis — clique para inserir
              </p>
              <div className="flex flex-wrap gap-1.5">
                {VARIAVEIS.map((v) => (
                  <span
                    key={v}
                    onClick={() => setFormConteudo((prev) => prev + v)}
                    className="px-2 py-1 rounded-md bg-[#00B3A4]/10 text-[#00B3A4] text-xs font-mono font-medium cursor-pointer hover:bg-[#00B3A4]/20 transition-colors"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={salvar}
                disabled={salvando || !formNome.trim() || !formConteudo.trim()}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] disabled:opacity-60 rounded-lg transition-colors"
              >
                {salvando ? "Salvando…" : "Salvar template"}
              </button>
              <button
                onClick={fecharModal}
                className="px-5 py-2.5 text-sm font-medium text-[#05326D]/60 hover:text-[#05326D] border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
