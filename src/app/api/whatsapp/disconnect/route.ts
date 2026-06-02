import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  const { error } = await supabase
    .from('configuracoes_perfil')
    .upsert(
      {
        psicologo_id: user.id,
        meta_access_token: null,
        meta_phone_id: null,
        meta_waba_id: null,
        whatsapp_conectado: false,
        meta_token_connected_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'psicologo_id' }
    );

  if (error) {
    console.error('[whatsapp/disconnect] Supabase error:', error.message);
    return NextResponse.json({ error: 'Erro ao desconectar.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
