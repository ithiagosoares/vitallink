"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

function aplicarMascaraWhatsApp(valor: string): string {
  const numeros = valor.replace(/\D/g, "").slice(0, 11);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 11)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
}

function aplicarMascaraValor(valor: string): string {
  const numeros = valor.replace(/\D/g, "");
  if (!numeros) return "";
  const centavos = parseInt(numeros, 10);
  return (centavos / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function NovoPacientePage() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [valorSessao, setValorSessao] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");

  function handleWhatsApp(e: React.ChangeEvent<HTMLInputElement>) {
    setWhatsapp(aplicarMascaraWhatsApp(e.target.value));
  }

  function handleValor(e: React.ChangeEvent<HTMLInputElement>) {
    setValorSessao(aplicarMascaraValor(e.target.value));
  }

  function handleDia(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, "");
    const num = parseInt(v, 10);
    if (!v) return setDiaVencimento("");
    if (num >= 1 && num <= 31) setDiaVencimento(String(num));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Integração com banco de dados será feita em etapa futura
  }

  return (
    <main
      className={`${inter.className} min-h-screen bg-[#F9FAFB] px-4 py-8`}
    >
      <div className="max-w-lg mx-auto">
        {/* Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#00B3A4] hover:underline mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Voltar
        </Link>

        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#05326D]">Novo paciente</h1>
          <p className="mt-1 text-sm text-[#05326D]/50">
            Preencha os dados para cadastrar um novo paciente
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-[#05326D] mb-1.5"
              >
                Nome completo
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do paciente"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label
                htmlFor="whatsapp"
                className="block text-sm font-medium text-[#05326D] mb-1.5"
              >
                WhatsApp
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                onChange={handleWhatsApp}
                placeholder="(11) 99999-9999"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
              />
            </div>

            {/* Valor e Dia — linha dupla */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="valor"
                  className="block text-sm font-medium text-[#05326D] mb-1.5"
                >
                  Valor da sessão
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#05326D]/40 pointer-events-none">
                    R$
                  </span>
                  <input
                    id="valor"
                    type="text"
                    inputMode="numeric"
                    value={valorSessao}
                    onChange={handleValor}
                    placeholder="0,00"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dia"
                  className="block text-sm font-medium text-[#05326D] mb-1.5"
                >
                  Dia de vencimento
                </label>
                <input
                  id="dia"
                  type="text"
                  inputMode="numeric"
                  value={diaVencimento}
                  onChange={handleDia}
                  placeholder="Ex: 10"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm text-[#05326D] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00B3A4]/30 focus:border-[#00B3A4] transition"
                />
                <p className="mt-1 text-xs text-[#05326D]/40">Entre 1 e 31</p>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-2">
              <Link
                href="/"
                className="flex-1 py-2.5 text-sm font-semibold text-[#00B3A4] border border-[#00B3A4] rounded-lg text-center hover:bg-[#00B3A4]/5 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#00B3A4] hover:bg-[#009e91] active:bg-[#008a7e] rounded-lg transition-colors"
              >
                Salvar paciente
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
