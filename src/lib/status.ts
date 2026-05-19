export type Status = "em_dia" | "pendente" | "atrasado";

export const statusConfig: Record<
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

export function formatarValor(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
