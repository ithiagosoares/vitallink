import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { statusConfig, formatarValor, type Status } from "@/lib/status";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("pacientes")
    .select("id, nome, whatsapp, valor_sessao, dia_vencimento, status, created_at")
    .eq("psicologo_id", user.id)
    .order("created_at", { ascending: false });

  const lista = data ?? [];
  const total = lista.length;
  const emDia = lista.filter((p) => p.status === "em_dia").length;
  const inadimplentes = lista.filter((p) => p.status === "atrasado").length;
  const ultimos5 = lista.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-[#05326D]">Painel</h1>
        <p className="text-sm text-[#05326D]/50 mt-0.5">
          Acompanhe o status de pagamento dos seus pacientes
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-[#05326D]/50 uppercase tracking-wide">
            Total de pacientes
          </p>
          <p className="mt-2 text-3xl font-bold text-[#05326D]">{total}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-emerald-600/70 uppercase tracking-wide">
            Em dia
          </p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{emDia}</p>
          {total > 0 && (
            <p className="mt-1 text-xs text-[#05326D]/40">
              {Math.round((emDia / total) * 100)}% do total
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-medium text-red-500/70 uppercase tracking-wide">
            Inadimplentes
          </p>
          <p className="mt-2 text-3xl font-bold text-red-500">{inadimplentes}</p>
          {total > 0 && (
            <p className="mt-1 text-xs text-[#05326D]/40">
              {Math.round((inadimplentes / total) * 100)}% do total
            </p>
          )}
        </div>
      </div>

      {/* Últimos pacientes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#05326D]">
            Pacientes recentes
          </h2>
          <Link
            href="/pacientes"
            className="text-xs text-[#00B3A4] hover:underline font-medium"
          >
            Ver todos
          </Link>
        </div>

        {ultimos5.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-[#05326D]/40">
              Nenhum paciente cadastrado ainda.
            </p>
            <Link
              href="/pacientes"
              className="mt-3 inline-block text-sm text-[#00B3A4] hover:underline font-medium"
            >
              Cadastrar primeiro paciente
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop */}
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
                  {ultimos5.map((p) => {
                    const s = statusConfig[p.status as Status];
                    return (
                      <tr key={p.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-6 py-4 font-medium text-[#05326D]">{p.nome}</td>
                        <td className="px-6 py-4 text-[#05326D]/60">{p.whatsapp}</td>
                        <td className="px-6 py-4 text-[#05326D]/80 font-medium">
                          {formatarValor(p.valor_sessao)}
                        </td>
                        <td className="px-6 py-4 text-[#05326D]/60">Dia {p.dia_vencimento}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ${s.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="sm:hidden divide-y divide-gray-100">
              {ultimos5.map((p) => {
                const s = statusConfig[p.status as Status];
                return (
                  <div key={p.id} className="px-4 py-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-[#05326D] text-sm">{p.nome}</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 shrink-0 ${s.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
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
  );
}
