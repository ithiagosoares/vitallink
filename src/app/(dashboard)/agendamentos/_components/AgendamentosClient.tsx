"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Template } from "@/lib/templates";

interface Gatilho {
  id: string;
  dias_offset: number;
  template_id: string | null;
  horario_envio: string;
}

interface Regra {
  id: string;
  nome: string;
  ativa: boolean;
  aplicar_para: string;
  created_at: string;
  gatilhos_regra: Gatilho[];
  regra_pacientes: { paciente_id: string }[];
}

interface Paciente {
  id: string;
  nome: string;
}

interface GatilhoForm {
  key: string;
  dias_offset: number;
  template_id: string;
  horario_envio: string;
}

const DIAS_OPCOES = [
  { value: -7, label: "7 dias antes do vencimento" },
  { value: -5, label: "5 dias antes do vencimento" },
  { value: -3, label: "3 dias antes do vencimento" },
  { value: -2, label: "2 dias antes do vencimento" },
  { value: -1, label: "1 dia antes do vencimento" },
  { value: 0, label: "No dia do vencimento" },
  { value: 1, label: "1 dia após o vencimento" },
  { value: 2, label: "2 dias após o vencimento" },
  { value: 3, label: "3 dias após o vencimento" },
  { value: 5, label: "5 dias após o vencimento" },
  { value: 7, label: "7 dias após o vencimento" },
];

const GATILHOS_SUGERIDOS: Omit<GatilhoForm, "key">[] = [
  { dias_offset: -3, template_id: "", horario_envio: "09:00" },
  { dias_offset: 0, template_id: "", horario_envio: "08:00" },
  { dias_offset: 2, template_id: "", horario_envio: "10:00" },
];

function labelOffset(dias: number): string {
  if (dias === 0) return "No dia do vencimento";
  if (dias < 0) return `${Math.abs(dias)} dia${Math.abs(dias) > 1 ? "s" : ""} antes`;
  return `${dias} dia${dias > 1 ? "s" : ""} após`;
}

let keyCounter = 0;
function nextKey() {
  return `g-${++keyCounter}`;
}

export default function AgendamentosClient({
  regrasIniciais,
  pacientes,
  templates,
}: {
  regrasIniciais: Regra[];
  pacientes: Paciente[];
  templates: Template[];
}) {
  const [regras, setRegras] = useState(regrasIniciais);
  const [modalAberto, setModalAberto] = useState(false);
  const [regraEditando, setRegraEditando] = useState<Regra | null>(null);
  const [formNome, setFormNome] = useState("");
  const [formAplicarPara, setFormAplicarPara] = useState<"todos" | "especificos">("todos");
  const [formGatilhos, setFormGatilhos] = useState<GatilhoForm[]>([]);
  const [formPacientes, setFormPacientes] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  function abrirNovo() {
    setRegraEditando(null);
    setFormNome("");
    setFormAplicarPara("todos");
    setFormGatilhos(GATILHOS_SUGERIDOS.map((g) => ({ ...g, key: nextKey() })));
    setFormPacientes([]);
    setModalAberto(true);
  }

  function abrirEditar(r: Regra) {
    setRegraEditando(r);
    setFormNome(r.nome);
    setFormAplicarPara(r.aplicar_para as "todos" | "especificos");
    setFormGatilhos(
      r.gatilhos_regra.map((g) => ({
        key: g.id,
        dias_offset: g.dias_offset,
        template_id: g.template_id ?? "",
        horario_envio: g.horario_envio.substring(0, 5),
      }))
    );
    setFormPacientes(r.regra_pacientes.map((rp) => rp.paciente_id));
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setRegraEditando(null);
  }

  function updateGatilho(key: string, patch: Partial<GatilhoForm>) {
    setFormGatilhos((prev) => prev.map((g) => (g.key === key ? { ...g, ...patch } : g)));
  }

  function addGatilho() {
    setFormGatilhos((prev) => [
      ...prev,
      { key: nextKey(), dias_offset: 0, template_id: "", horario_envio: "09:00" },
    ]);
  }

  function removeGatilho(key: string) {
    setFormGatilhos((prev) => prev.filter((g) => g.key !== key));
  }

  function togglePaciente(id: string) {
    setFormPacientes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function toggleAtiva(regra: Regra) {
    const supabase = createClient();
    await supabase
      .from("regras_cobranca")
      .update({ ativa: !regra.ativa })
      .eq("id", regra.id);
    setRegras((prev) =>
      prev.map((r) => (r.id === regra.id ? { ...r, ativa: !r.ativa } : r))
    );
  }

  async function excluirRegra(id: string) {
    if (!confirm("Excluir esta regra de agendamento?")) return;
    setExcluindo(id);
    const supabase = createClient();
    await supabase.from("regras_cobranca").delete().eq("id", id);
    setRegras((prev) => prev.filter((r) => r.id !== id));
    setExcluindo(null);
  }

  async function salvar() {
    if (!formNome.trim()) return;
    setSalvando(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) { setSalvando(false); return; }

    let regraId: string;

    if (regraEditando) {
      await supabase
        .from("regras_cobranca")
        .update({ nome: formNome.trim(), aplicar_para: formAplicarPara })
        .eq("id", regraEditando.id);
      regraId = regraEditando.id;
      await supabase.from("gatilhos_regra").delete().eq("regra_id", regraId);
      await supabase.from("regra_pacientes").delete().eq("regra_id", regraId);
    } else {
      const { data: novaRegra } = await supabase
        .from("regras_cobranca")
        .insert({
          psicologo_id: user.id,
          nome: formNome.trim(),
          ativa: true,
          aplicar_para: formAplicarPara,
        })
        .select()
        .single();
      if (!novaRegra) { setSalvando(false); return; }
      regraId = novaRegra.id;
    }

    if (formGatilhos.length > 0) {
      const gatilhosParaInserir = formGatilhos.map((g) => ({
        regra_id: regraId,
        dias_offset: Number(g.dias_offset),
        template_id: g.template_id || null,
        horario_envio: g.horario_envio,
      }));
      console.log("[agendamentos] formGatilhos antes de inserir:", formGatilhos);
      console.log("[agendamentos] payload enviado ao banco:", gatilhosParaInserir);
      const { error: gatilhosError } = await supabase
        .from("gatilhos_regra")
        .insert(gatilhosParaInserir);
      if (gatilhosError) {
        console.error("[agendamentos] erro ao inserir gatilhos:", gatilhosError);
        setSalvando(false);
        return;
      }
    }

    if (formAplicarPara === "especificos" && formPacientes.length > 0) {
      await supabase.from("regra_pacientes").insert(
        formPacientes.map((pid) => ({ regra_id: regraId, paciente_id: pid }))
      );
    }

    const { data: atualizadas } = await supabase
      .from("regras_cobranca")
      .select(
        "id, nome, ativa, aplicar_para, created_at, gatilhos_regra(id, dias_offset, horario_envio, template_id), regra_pacientes(paciente_id)"
      )
      .eq("psicologo_id", user.id)
      .order("created_at", { ascending: false });

    if (atualizadas) setRegras(atualizadas);
    setSalvando(false);
    fecharModal();
  }

  function nomeTemplate(id: string | null) {
    if (!id) return null;
    return templates.find((t) => t.id === id)?.nome ?? null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#05326D]">Agendamentos</h1>
          <p className="text-sm text-[#05326D]/50 mt-0.5">Regras de cobrança automática</p>
        </div>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nova regra
        </button>
      </div>

      {/* Lista de regras */}
      {regras.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-16 text-center">
          <p className="text-sm text-[#05326D]/40 mb-3">Nenhuma regra criada ainda.</p>
          <button
            onClick={abrirNovo}
            className="text-sm font-semibold text-[#00B3A4] hover:underline"
          >
            Criar primeira regra →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {regras.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <p className="text-sm font-semibold text-[#05326D] truncate">{r.nome}</p>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${
                        r.ativa
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-gray-50 text-gray-500 ring-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${r.ativa ? "bg-emerald-500" : "bg-gray-400"}`}
                      />
                      {r.ativa ? "Ativa" : "Pausada"}
                    </span>
                  </div>
                  <p className="text-xs text-[#05326D]/50 mb-3">
                    {r.gatilhos_regra.length} gatilho{r.gatilhos_regra.length !== 1 ? "s" : ""}
                    {" · "}
                    {r.aplicar_para === "todos"
                      ? "todos os pacientes"
                      : `${r.regra_pacientes.length} paciente${r.regra_pacientes.length !== 1 ? "s" : ""}`}
                  </p>
                  {r.gatilhos_regra.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {r.gatilhos_regra.map((g) => (
                        <span
                          key={g.id}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F9FAFB] border border-gray-100 text-xs text-[#05326D]/70"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                          {labelOffset(g.dias_offset)}
                          {" · "}
                          {g.horario_envio.substring(0, 5)}
                          {nomeTemplate(g.template_id) && (
                            <> · <span className="text-[#00B3A4]">{nomeTemplate(g.template_id)}</span></>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Toggle ativa */}
                  <button
                    onClick={() => toggleAtiva(r)}
                    title={r.ativa ? "Pausar" : "Ativar"}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      r.ativa ? "bg-[#00B3A4]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        r.ativa ? "translate-x-[18px]" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => abrirEditar(r)}
                    title="Editar"
                    className="p-1.5 text-[#05326D]/40 hover:text-[#05326D] hover:bg-[#05326D]/5 rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => excluirRegra(r.id)}
                    disabled={excluindo === r.id}
                    title="Excluir"
                    className="p-1.5 text-[#05326D]/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={fecharModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-[#05326D]">
                {regraEditando ? "Editar regra" : "Nova regra de agendamento"}
              </h2>
              <button
                onClick={fecharModal}
                className="p-1.5 text-[#05326D]/40 hover:text-[#05326D] hover:bg-[#05326D]/5 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body modal com scroll */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-[#05326D] mb-1.5">
                  Nome da regra
                </label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: Cobrança padrão mensal"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                />
              </div>

              {/* Gatilhos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#05326D]">Gatilhos</label>
                  <button
                    type="button"
                    onClick={addGatilho}
                    className="text-xs font-medium text-[#00B3A4] hover:text-[#009e91] transition-colors"
                  >
                    + Adicionar gatilho
                  </button>
                </div>
                {formGatilhos.length === 0 ? (
                  <p className="text-xs text-[#05326D]/40 text-center py-4 border border-dashed border-gray-200 rounded-lg">
                    Nenhum gatilho. Clique em &quot;Adicionar gatilho&quot; para incluir um.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {formGatilhos.map((g) => (
                      <div
                        key={g.key}
                        className="flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-lg border border-gray-100"
                      >
                        <select
                          value={g.dias_offset}
                          onChange={(e) =>
                            updateGatilho(g.key, { dias_offset: parseInt(e.target.value) })
                          }
                          className="flex-1 min-w-0 px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-[#05326D] bg-white focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                        >
                          {DIAS_OPCOES.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={g.template_id}
                          onChange={(e) =>
                            updateGatilho(g.key, { template_id: e.target.value })
                          }
                          className="flex-1 min-w-0 px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-[#05326D] bg-white focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                        >
                          <option value="">Nenhum template</option>
                          {templates.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.nome}
                            </option>
                          ))}
                        </select>
                        <input
                          type="time"
                          value={g.horario_envio}
                          onChange={(e) =>
                            updateGatilho(g.key, { horario_envio: e.target.value })
                          }
                          className="w-28 shrink-0 px-2.5 py-2 rounded-lg border border-gray-200 text-xs text-[#05326D] bg-white focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                        />
                        <button
                          type="button"
                          onClick={() => removeGatilho(g.key)}
                          className="shrink-0 p-1.5 text-[#05326D]/30 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Aplicar para */}
              <div>
                <label className="block text-sm font-medium text-[#05326D] mb-3">
                  Aplicar para
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="aplicar_para"
                      value="todos"
                      checked={formAplicarPara === "todos"}
                      onChange={() => setFormAplicarPara("todos")}
                      className="accent-[#00B3A4]"
                    />
                    <span className="text-sm text-[#05326D]">Todos os pacientes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="aplicar_para"
                      value="especificos"
                      checked={formAplicarPara === "especificos"}
                      onChange={() => setFormAplicarPara("especificos")}
                      className="accent-[#00B3A4]"
                    />
                    <span className="text-sm text-[#05326D]">Pacientes específicos</span>
                  </label>
                </div>

                {formAplicarPara === "especificos" && (
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {pacientes.length === 0 ? (
                      <p className="text-xs text-[#05326D]/40 text-center py-4">
                        Nenhum paciente cadastrado.
                      </p>
                    ) : (
                      pacientes.map((p) => (
                        <label
                          key={p.id}
                          className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formPacientes.includes(p.id)}
                            onChange={() => togglePaciente(p.id)}
                            className="accent-[#00B3A4]"
                          />
                          <span className="text-sm text-[#05326D]">{p.nome}</span>
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer modal */}
            <div className="flex items-center gap-3 px-6 py-5 border-t border-gray-100 shrink-0">
              <button
                onClick={salvar}
                disabled={salvando || !formNome.trim()}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] disabled:opacity-60 rounded-lg transition-colors"
              >
                {salvando ? "Salvando…" : "Salvar regra"}
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
