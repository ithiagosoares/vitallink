"use client";

import { TEMPLATES, CATEGORIA_CORES } from "@/lib/templates";

export default function TemplatesClient() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#05326D]">Templates</h1>
        <p className="text-sm text-[#05326D]/50 mt-0.5">
          Modelos de mensagem disponíveis para uso nas regras de envio
        </p>
      </div>

      {/* Banner informativo */}
      <div className="flex gap-3 bg-[#00B3A4]/8 border border-[#00B3A4]/20 rounded-xl p-4">
        <div className="shrink-0 mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00B3A4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[#05326D]">
            Como os templates funcionam
          </p>
          <p className="text-sm text-[#05326D]/60 leading-relaxed">
            Estes templates já foram aprovados pela Meta e estão prontos para
            uso. As mensagens são enviadas automaticamente pelo WhatsApp de
            acordo com as regras que você configurar. Para usar um template,
            acesse{" "}
            <span className="font-medium text-[#05326D]">Regras de envio</span>{" "}
            e selecione o modelo desejado.
          </p>
        </div>
      </div>

      {/* Grid de templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
          >
            {/* Topo do card */}
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-[#05326D] leading-snug">
                {t.nome}
              </p>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORIA_CORES[t.categoria]}`}
                >
                  {t.categoria}
                </span>
                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Aprovado
                </span>
              </div>
            </div>

            {/* Preview da mensagem */}
            <div className="bg-[#F0FDF4] rounded-lg px-3.5 py-3 flex-1">
              <p className="text-xs text-[#05326D]/70 whitespace-pre-line leading-relaxed">
                {t.conteudo}
              </p>
            </div>

            {/* Variáveis */}
            <div>
              <p className="text-xs text-[#05326D]/40 mb-1.5 font-medium">
                Variáveis
              </p>
              <div className="flex flex-wrap gap-1">
                {t.variaveis.map((v, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[#05326D]/5 text-[#05326D]/60 text-xs font-mono"
                  >
                    {`{{${i + 1}}}`} {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
