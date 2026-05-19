import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

type Status = "em_dia" | "pendente" | "atrasado";

interface Paciente {
  id: number;
  nome: string;
  whatsapp: string;
  valor: number;
  diaVencimento: number;
  status: Status;
}

const pacientes: Paciente[] = [
  {
    id: 1,
    nome: "Ana Paula Ferreira",
    whatsapp: "(11) 98765-4321",
    valor: 180,
    diaVencimento: 5,
    status: "em_dia",
  },
  {
    id: 2,
    nome: "Carlos Eduardo Lima",
    whatsapp: "(21) 99123-4567",
    valor: 200,
    diaVencimento: 10,
    status: "pendente",
  },
  {
    id: 3,
    nome: "Mariana Costa Santos",
    whatsapp: "(31) 97654-3210",
    valor: 150,
    diaVencimento: 15,
    status: "atrasado",
  },
  {
    id: 4,
    nome: "Roberto Alves Nunes",
    whatsapp: "(41) 98888-1234",
    valor: 220,
    diaVencimento: 20,
    status: "em_dia",
  },
  {
    id: 5,
    nome: "Juliana Melo Braga",
    whatsapp: "(51) 99321-8765",
    valor: 170,
    diaVencimento: 28,
    status: "atrasado",
  },
];

const statusConfig: Record<
  Status,
  { label: string; badge: string; dot: string }
> = {
  em_dia: {
    label: "Em dia",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  pendente: {
    label: "Pendente",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-400",
  },
  atrasado: {
    label: "Atrasado",
    badge: "bg-red-50 text-red-600 ring-red-200",
    dot: "bg-red-500",
  },
};

const totalPacientes = pacientes.length;
const emDia = pacientes.filter((p) => p.status === "em_dia").length;
const inadimplentes = pacientes.filter((p) => p.status === "atrasado").length;

function formatarValor(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DashboardPage() {
  return (
    <div className={`${inter.className} min-h-screen bg-[#F9FAFB]`}>
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="text-xl tracking-tight select-none">
            <span className="font-bold text-[#05326D]">Vital</span>
            <span className="font-bold text-[#00B3A4]">Link</span>
          </span>
          <Link
            href="/pacientes/novo"
            className="inline-flex items-center gap-1.5 bg-[#00B3A4] hover:bg-[#009e91] active:bg-[#008a7e] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
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
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Novo paciente
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Título da página */}
        <div>
          <h1 className="text-2xl font-bold text-[#05326D]">Painel</h1>
          <p className="text-sm text-[#05326D]/50 mt-0.5">
            Acompanhe o status de pagamento dos seus pacientes
          </p>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-medium text-[#05326D]/50 uppercase tracking-wide">
              Total de pacientes
            </p>
            <p className="mt-2 text-3xl font-bold text-[#05326D]">
              {totalPacientes}
            </p>
          </div>

          {/* Em dia */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-medium text-emerald-600/70 uppercase tracking-wide">
              Em dia
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{emDia}</p>
            <p className="mt-1 text-xs text-[#05326D]/40">
              {Math.round((emDia / totalPacientes) * 100)}% do total
            </p>
          </div>

          {/* Inadimplentes */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-medium text-red-500/70 uppercase tracking-wide">
              Inadimplentes
            </p>
            <p className="mt-2 text-3xl font-bold text-red-500">
              {inadimplentes}
            </p>
            <p className="mt-1 text-xs text-[#05326D]/40">
              {Math.round((inadimplentes / totalPacientes) * 100)}% do total
            </p>
          </div>
        </div>

        {/* Tabela de pacientes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-[#05326D]">Pacientes</h2>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#F9FAFB]">
                  {["Nome", "WhatsApp", "Valor", "Vencimento", "Status"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-6 py-3 text-left text-xs font-medium text-[#05326D]/40 uppercase tracking-wide"
                      >
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pacientes.map((p) => {
                  const s = statusConfig[p.status];
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#F9FAFB] transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-[#05326D]">
                        {p.nome}
                      </td>
                      <td className="px-6 py-4 text-[#05326D]/60">
                        {p.whatsapp}
                      </td>
                      <td className="px-6 py-4 text-[#05326D]/80 font-medium">
                        {formatarValor(p.valor)}
                      </td>
                      <td className="px-6 py-4 text-[#05326D]/60">
                        Dia {p.diaVencimento}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${s.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-100">
            {pacientes.map((p) => {
              const s = statusConfig[p.status];
              return (
                <div key={p.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-[#05326D] text-sm">
                      {p.nome}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 shrink-0 ${s.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#05326D]/50">
                    <span>{p.whatsapp}</span>
                    <span>{formatarValor(p.valor)}</span>
                    <span>Dia {p.diaVencimento}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
