import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function POST() {
  // Cliente normal (autenticado via cookies do usuário)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  const userId = user.id;

  // Deleta dados nas tabelas dependentes em ordem
  // As políticas RLS garantem que só os próprios dados são deletados
  // ON DELETE CASCADE cuida das tabelas filhas automaticamente,
  // mas deletamos explicitamente para garantia
  const tabelas = [
    'gatilhos_regra',     // depende de regras_cobranca
    'regra_pacientes',    // depende de regras_cobranca e pacientes
    'regras_cobranca',
    'templates',
    'configuracoes_perfil',
    'pacientes',
  ];

  for (const tabela of tabelas) {
    const coluna = tabela === 'gatilhos_regra' || tabela === 'regra_pacientes'
      ? null  // deletadas via cascade quando regras_cobranca for deletada
      : tabela === 'regras_cobranca' || tabela === 'templates' || tabela === 'configuracoes_perfil' || tabela === 'pacientes'
        ? 'psicologo_id'
        : null;

    if (!coluna) continue;

    const { error } = await supabase.from(tabela).delete().eq(coluna, userId);
    if (error) {
      console.error(`[account/delete] Erro ao deletar ${tabela}:`, error.message);
    }
  }

  // Deleta o profile (cascata para auth.users não ocorre neste sentido —
  // precisamos deletar o auth user separadamente via service role)
  await supabase.from('profiles').delete().eq('id', userId);

  // Deleta o usuário do Supabase Auth (requer service role)
  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: authError } = await serviceSupabase.auth.admin.deleteUser(userId);
  if (authError) {
    console.error('[account/delete] Erro ao deletar auth user:', authError.message);
    return NextResponse.json({ error: 'Erro ao excluir a conta. Entre em contato com o suporte.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
