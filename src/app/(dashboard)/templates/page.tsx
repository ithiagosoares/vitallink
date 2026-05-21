import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TemplatesClient from "./_components/TemplatesClient";

export default async function TemplatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: templates } = await supabase
    .from("templates")
    .select("id, nome, conteudo, created_at")
    .eq("psicologo_id", user.id)
    .order("created_at", { ascending: false });

  return <TemplatesClient templatesIniciais={templates ?? []} />;
}
