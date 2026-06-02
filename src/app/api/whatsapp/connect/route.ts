import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Corpo da requisição inválido.' }, { status: 400 });
  }

  const { access_token, phone_number_id, waba_id } = body as {
    access_token?: string;
    phone_number_id?: string;
    waba_id?: string;
  };

  if (!access_token || !phone_number_id || !waba_id) {
    return NextResponse.json(
      { error: 'access_token, phone_number_id e waba_id são obrigatórios.' },
      { status: 400 }
    );
  }

  // Busca o número de telefone exibível via API da Meta
  let phoneNumber: string = phone_number_id;
  try {
    const metaRes = await fetch(
      `https://graph.facebook.com/v21.0/${phone_number_id}?fields=display_phone_number&access_token=${access_token}`
    );
    if (metaRes.ok) {
      const metaData = (await metaRes.json()) as { display_phone_number?: string };
      if (metaData.display_phone_number) {
        phoneNumber = metaData.display_phone_number;
      }
    }
  } catch {
    // Continua com o phone_number_id como fallback
  }

  const { error } = await supabase
    .from('configuracoes_perfil')
    .upsert(
      {
        psicologo_id: user.id,
        meta_access_token: access_token,
        meta_phone_id: phone_number_id,
        meta_waba_id: waba_id,
        whatsapp_numero: phoneNumber,
        whatsapp_conectado: true,
        meta_token_connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'psicologo_id' }
    );

  if (error) {
    console.error('[whatsapp/connect] Supabase error:', error.message);
    return NextResponse.json({ error: 'Erro ao salvar a conexão.' }, { status: 500 });
  }

  // Retorna apenas dados não sensíveis — token nunca sai do servidor
  return NextResponse.json({ success: true, phone_number: phoneNumber });
}
