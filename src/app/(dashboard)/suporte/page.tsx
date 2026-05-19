"use client";

// Atualize WHATSAPP_SUPORTE com o número real de suporte antes de ir para produção
const WHATSAPP_SUPORTE = "5511999999999";

import { useState } from "react";

const faqItems = [
  {
    pergunta: "Como conecto meu WhatsApp para enviar mensagens?",
    resposta:
      "Acesse Configurações → aba WhatsApp e siga as instruções para conectar via Z-API. Você precisará escanear um QR Code com o WhatsApp que deseja usar para as cobranças.",
  },
  {
    pergunta: "Posso personalizar as mensagens de cobrança?",
    resposta:
      "Sim! Em Configurações → aba Mensagens você pode editar o template padrão usando variáveis como {nome_paciente}, {valor} e {data_vencimento} para personalizar cada envio.",
  },
  {
    pergunta: "Onde vejo as mensagens que foram enviadas?",
    resposta:
      "No menu Outbox você encontra o histórico completo de mensagens enviadas, com data, horário, destinatário e status de entrega.",
  },
  {
    pergunta: "Como cancelo minha assinatura?",
    resposta:
      "Você pode cancelar a qualquer momento em Configurações → aba Planos, ou entrando em contato com nosso suporte via WhatsApp. Não há multa ou fidelidade.",
  },
  {
    pergunta: "Meus dados estão seguros?",
    resposta:
      "Sim. Todos os dados são armazenados com criptografia no Supabase, hospedado na AWS. Seguimos as diretrizes da LGPD. Consulte nossa Política de Privacidade em Configurações → aba LGPD para mais detalhes.",
  },
];

function AccordionItem({
  pergunta,
  resposta,
}: {
  pergunta: string;
  resposta: string;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[#05326D] hover:bg-[#F9FAFB] transition-colors"
      >
        <span>{pergunta}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-200 text-[#00B3A4] ${aberto ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {aberto && (
        <p className="px-5 pb-4 text-sm text-[#05326D]/60 leading-relaxed">
          {resposta}
        </p>
      )}
    </div>
  );
}

export default function SuportePage() {
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");

  function abrirWhatsApp() {
    if (!assunto && !mensagem) return;
    const texto = encodeURIComponent(
      `Olá, preciso de suporte!\n\nAssunto: ${assunto}\n\n${mensagem}`
    );
    window.open(`https://wa.me/${WHATSAPP_SUPORTE}?text=${texto}`, "_blank");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#05326D]">Suporte</h1>
        <p className="text-sm text-[#05326D]/50 mt-0.5">
          Estamos aqui para ajudar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Coluna esquerda */}
        <div className="space-y-4">
          {/* Tour guiado */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#00B3A4]/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B3A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#05326D]">Ajuda Interativa</h2>
                <p className="text-xs text-[#05326D]/50 mt-0.5">
                  Veja um passo a passo das principais funcionalidades
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-full py-2.5 text-sm font-semibold text-[#00B3A4] border border-[#00B3A4] rounded-lg hover:bg-[#00B3A4]/5 transition-colors"
            >
              Refazer Tour Guiado
            </button>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#00B3A4]/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B3A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#05326D]">Entre em Contato</h2>
                <p className="text-xs text-[#05326D]/50 mt-0.5">
                  Nossa equipe responde em até 24h úteis
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#05326D] mb-1.5">
                  Assunto
                </label>
                <input
                  type="text"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  placeholder="Ex: Problema com envio de mensagens"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#05326D] mb-1.5">
                  Mensagem
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Descreva o problema ou dúvida em detalhes…"
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition resize-none"
                />
              </div>
              <button
                type="button"
                onClick={abrirWhatsApp}
                disabled={!assunto || !mensagem}
                className="w-full py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>

        {/* Coluna direita — FAQ */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-[#05326D]">
              Perguntas frequentes
            </h2>
          </div>
          {faqItems.map((item) => (
            <AccordionItem
              key={item.pergunta}
              pergunta={item.pergunta}
              resposta={item.resposta}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
