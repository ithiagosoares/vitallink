import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConfiguracoesClient from "./_components/ConfiguracoesClient";

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, email, whatsapp, accepted_terms_at, mensagem_cobranca")
    .eq("id", user.id)
    .single();

  return (
    <ConfiguracoesClient
      profile={profile ?? { nome: null, email: null, whatsapp: null, accepted_terms_at: null, mensagem_cobranca: null }}
      userEmail={user.email ?? ""}
    />
  );
}
