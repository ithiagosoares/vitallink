"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { statusConfig, formatarValor, type Status } from "@/lib/status";

interface Paciente {
  id: string;
  nome: string;
  whatsapp: string;
  valor_sessao: number;
  dia_vencimento: number;
  status: Status;
}

function aplicarMascaraWhatsApp(v: string) {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n;
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

function aplicarMascaraValor(v: string) {
  const n = v.replace(/\D/g, "");
  if (!n) return "";
  return (parseInt(n, 10) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parsearValor(mascara: string) {
  return parseFloat(mascara.replace(/\./g, "").replace(",", ".")) || 0;
}

// Campos de formulário reutilizados nos dois modais
function CamposFormulario({
  nome, setNome,
  whatsapp, setWhatsapp,
  valorSessao, setValorSessao,
  diaVencimento, setDiaVencimento,
  autoFocusNome,
}: {
  nome: string; setNome: (v: string) => void;
  whatsapp: string; setWhatsapp: (v: string) => void;
  valorSessao: string; setValorSessao: (v: string) => void;
  diaVencimento: string; setDiaVencimento: (v: string) => void;
  autoFocusNome?: boolean;
}) {
  return (
    <>
      <div>
        <label htmlFor="m-nome" className="block text-sm font-medium text-[#05326D] mb-1.5">
          Nome completo
        </label>
        <input
          id="m-nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do paciente"
          required
          autoFocus={autoFocusNome}
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
        />
      </div>

      <div>
        <label htmlFor="m-whatsapp" className="block text-sm font-medium text-[#05326D] mb-1.5">
          WhatsApp
        </label>
        <input
          id="m-whatsapp"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(aplicarMascaraWhatsApp(e.target.value))}
          placeholder="(11) 99999-9999"
          required
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="m-valor" className="block text-sm font-medium text-[#05326D] mb-1.5">
            Valor da sessão
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#05326D]/40 pointer-events-none">
              R$
            </span>
            <input
              id="m-valor"
              type="text"
              inputMode="numeric"
              value={valorSessao}
              onChange={(e) => setValorSessao(aplicarMascaraValor(e.target.value))}
              placeholder="0,00"
              required
              className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="m-dia" className="block text-sm font-medium text-[#05326D] mb-1.5">
            Dia de vencimento
          </label>
          <input
            id="m-dia"
            type="text"
            inputMode="numeric"
            value={diaVencimento}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              if (!v) return setDiaVencimento("");
              const n = parseInt(v, 10);
              if (n >= 1 && n <= 31) setDiaVencimento(String(n));
            }}
            placeholder="Ex: 10"
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
          />
          <p className="mt-1 text-xs text-[#05326D]/40">Entre 1 e 31</p>
        </div>
      </div>
    </>
  );
}

// ─── Modal Novo Paciente ───────────────────────────────────────────────────────

function ModalNovoPaciente({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [valorSessao, setValorSessao] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { error } = await supabase.from("pacientes").insert({
      psicologo_id: user.id,
      nome,
      whatsapp,
      valor_sessao: parsearValor(valorSessao),
      dia_vencimento: parseInt(diaVencimento, 10),
      status: "em_dia",
    });

    if (error) {
      setErro("Erro ao salvar paciente. Tente novamente.");
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-[#05326D]">Novo paciente</h2>
            <p className="text-xs text-[#05326D]/50 mt-0.5">Preencha os dados para cadastrar</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#05326D]/40 hover:bg-[#05326D]/5 hover:text-[#05326D]/70 transition-colors"
            aria-label="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <CamposFormulario
            nome={nome} setNome={setNome}
            whatsapp={whatsapp} setWhatsapp={setWhatsapp}
            valorSessao={valorSessao} setValorSessao={setValorSessao}
            diaVencimento={diaVencimento} setDiaVencimento={setDiaVencimento}
            autoFocusNome
          />

          {erro && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              {erro}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-[#00B3A4] border border-[#00B3A4] rounded-lg hover:bg-[#00B3A4]/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] active:bg-[#008a7e] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading ? "Salvando…" : "Salvar paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal Editar Paciente ─────────────────────────────────────────────────────

function ModalEditarPaciente({
  paciente,
  onClose,
}: {
  paciente: Paciente;
  onClose: () => void;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [nome, setNome] = useState(paciente.nome);
  const [whatsapp, setWhatsapp] = useState(paciente.whatsapp);
  const [valorSessao, setValorSessao] = useState(
    aplicarMascaraValor(String(Math.round(paciente.valor_sessao * 100)))
  );
  const [diaVencimento, setDiaVencimento] = useState(String(paciente.dia_vencimento));
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("pacientes")
      .update({
        nome,
        whatsapp,
        valor_sessao: parsearValor(valorSessao),
        dia_vencimento: parseInt(diaVencimento, 10),
      })
      .eq("id", paciente.id);

    if (error) {
      setErro("Erro ao atualizar paciente. Tente novamente.");
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-[#05326D]">Editar paciente</h2>
            <p className="text-xs text-[#05326D]/50 mt-0.5">Altere os dados e salve</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#05326D]/40 hover:bg-[#05326D]/5 hover:text-[#05326D]/70 transition-colors"
            aria-label="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <CamposFormulario
            nome={nome} setNome={setNome}
            whatsapp={whatsapp} setWhatsapp={setWhatsapp}
            valorSessao={valorSessao} setValorSessao={setValorSessao}
            diaVencimento={diaVencimento} setDiaVencimento={setDiaVencimento}
            autoFocusNome
          />

          {erro && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              {erro}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-[#00B3A4] border border-[#00B3A4] rounded-lg hover:bg-[#00B3A4]/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] active:bg-[#008a7e] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {loading ? "Salvando…" : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal Confirmar Exclusão ──────────────────────────────────────────────────

function ModalConfirmarExclusao({
  paciente,
  onClose,
}: {
  paciente: Paciente;
  onClose: () => void;
}) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleExcluir() {
    setLoading(true);
    setErro("");

    const supabase = createClient();
    const { error } = await supabase
      .from("pacientes")
      .delete()
      .eq("id", paciente.id);

    if (error) {
      setErro("Erro ao excluir paciente. Tente novamente.");
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl">
        <div className="px-6 pt-6 pb-5">
          {/* Ícone de alerta */}
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </div>

          <h2 className="text-base font-semibold text-[#05326D] text-center mb-1">
            Excluir paciente
          </h2>
          <p className="text-sm text-[#05326D]/60 text-center leading-relaxed">
            Tem certeza que deseja excluir{" "}
            <span className="font-semibold text-[#05326D]">{paciente.nome}</span>?
            <br />
            Esta ação não pode ser desfeita.
          </p>

          {erro && (
            <p className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5 text-center">
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
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {loading ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Botões de ação ────────────────────────────────────────────────────────────

function BotoesAcao({
  paciente,
  onEditar,
  onExcluir,
}: {
  paciente: Paciente;
  onEditar: (p: Paciente) => void;
  onExcluir: (p: Paciente) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onEditar(paciente)}
        title="Editar paciente"
        className="p-1.5 rounded-lg text-[#05326D]/40 hover:text-[#00B3A4] hover:bg-[#00B3A4]/8 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onExcluir(paciente)}
        title="Excluir paciente"
        className="p-1.5 rounded-lg text-[#05326D]/40 hover:text-red-500 hover:bg-red-50 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function PacientesClient({ lista }: { lista: Paciente[] }) {
  const [modalNovo, setModalNovo] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(null);
  const [pacienteExcluindo, setPacienteExcluindo] = useState<Paciente | null>(null);

  const abrirNovo = useCallback(() => setModalNovo(true), []);
  const fecharNovo = useCallback(() => setModalNovo(false), []);

  return (
    <>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#05326D]">Pacientes</h1>
            <p className="text-sm text-[#05326D]/50 mt-0.5">
              {lista.length} paciente{lista.length !== 1 ? "s" : ""} cadastrado
              {lista.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-1.5 bg-[#00B3A4] hover:bg-[#009e91] active:bg-[#008a7e] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Novo paciente
          </button>
        </div>

        {/* Tabela / Estado vazio */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {lista.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#00B3A4]/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B3A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-sm font-medium text-[#05326D]">Nenhum paciente cadastrado</p>
              <p className="mt-1 text-xs text-[#05326D]/40">
                Adicione seu primeiro paciente para começar a gerenciar cobranças.
              </p>
              <button
                onClick={abrirNovo}
                className="mt-4 inline-flex items-center gap-1.5 bg-[#00B3A4] hover:bg-[#009e91] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Cadastrar paciente
              </button>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                      {["Nome", "WhatsApp", "Valor da sessão", "Vencimento", "Status", "Ações"].map((col) => (
                        <th
                          key={col}
                          className={`px-6 py-3 text-left text-xs font-medium text-[#05326D]/40 uppercase tracking-wide ${col === "Ações" ? "text-right" : ""}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {lista.map((p) => {
                      const s = statusConfig[p.status];
                      return (
                        <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                          <td className="px-6 py-4 font-medium text-[#05326D]">{p.nome}</td>
                          <td className="px-6 py-4 text-[#05326D]/60">{p.whatsapp}</td>
                          <td className="px-6 py-4 text-[#05326D]/80 font-medium">{formatarValor(p.valor_sessao)}</td>
                          <td className="px-6 py-4 text-[#05326D]/60">Dia {p.dia_vencimento}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${s.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end">
                              <BotoesAcao
                                paciente={p}
                                onEditar={setPacienteEditando}
                                onExcluir={setPacienteExcluindo}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="sm:hidden divide-y divide-gray-100">
                {lista.map((p) => {
                  const s = statusConfig[p.status];
                  return (
                    <div key={p.id} className="px-4 py-4 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-[#05326D] text-sm">{p.nome}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${s.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                          <BotoesAcao
                            paciente={p}
                            onEditar={setPacienteEditando}
                            onExcluir={setPacienteExcluindo}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#05326D]/50">
                        <span>{p.whatsapp}</span>
                        <span>{formatarValor(p.valor_sessao)}</span>
                        <span>Dia {p.dia_vencimento}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {modalNovo && <ModalNovoPaciente onClose={fecharNovo} />}
      {pacienteEditando && (
        <ModalEditarPaciente
          paciente={pacienteEditando}
          onClose={() => setPacienteEditando(null)}
        />
      )}
      {pacienteExcluindo && (
        <ModalConfirmarExclusao
          paciente={pacienteExcluindo}
          onClose={() => setPacienteExcluindo(null)}
        />
      )}
    </>
  );
}
