import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AgendamentosClient from "./_components/AgendamentosClient";

export default async function AgendamentosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [regrasResult, pacientesResult, templatesResult] = await Promise.all([
    supabase
      .from("regras_cobranca")
      .select(
        "id, nome, ativa, aplicar_para, created_at, gatilhos_regra(id, dias_offset, horario_envio, template_id), regra_pacientes(paciente_id)"
      )
      .eq("psicologo_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("pacientes")
      .select("id, nome")
      .eq("psicologo_id", user.id)
      .order("nome"),
    supabase
      .from("templates")
      .select("id, nome")
      .eq("psicologo_id", user.id)
      .order("nome"),
  ]);

  return (
    <AgendamentosClient
      regrasIniciais={regrasResult.data ?? []}
      pacientes={pacientesResult.data ?? []}
      templates={templatesResult.data ?? []}
    />
  );
}
