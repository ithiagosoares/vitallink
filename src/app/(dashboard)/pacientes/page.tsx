import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PacientesClient from "./_components/PacientesClient";

export default async function PacientesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("pacientes")
    .select("id, nome, whatsapp, valor_sessao, dia_vencimento, status")
    .eq("psicologo_id", user.id)
    .order("nome", { ascending: true });

  return <PacientesClient lista={data ?? []} />;
}
