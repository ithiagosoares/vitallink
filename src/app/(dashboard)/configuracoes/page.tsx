import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConfiguracoesClient from "./_components/ConfiguracoesClient";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileResult, configResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("nome, email, whatsapp, accepted_terms_at, mensagem_cobranca")
      .eq("id", user.id)
      .single(),
    supabase
      .from("configuracoes_perfil")
      .select("whatsapp_numero, whatsapp_conectado, mensagem_padrao, meta_phone_id")
      .eq("psicologo_id", user.id)
      .single(),
  ]);

  return (
    <ConfiguracoesClient
      profile={
        profileResult.data ?? {
          nome: null,
          email: null,
          whatsapp: null,
          accepted_terms_at: null,
          mensagem_cobranca: null,
        }
      }
      configPerfil={
        configResult.data ?? {
          whatsapp_numero: null,
          whatsapp_conectado: false,
          mensagem_padrao: null,
          meta_phone_id: null,
        }
      }
      userEmail={user.email ?? ""}
    />
  );
}
