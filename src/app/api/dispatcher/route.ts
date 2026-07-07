import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const META_API_VERSION = 'v19.0';
const TEMPLATE_NAME = 'cobranca_simples';

function formatarWhatsApp(numero: string): string {
  return numero.replace(/\D/g, '');
}

function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function formatarValor(valor: number): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function enviarMensagem(
  metaPhoneId: string,
  metaAccessToken: string,
  whatsapp: string,
  nomePaciente: string,
  valorSessao: number,
): Promise<void> {
  const url = `https://graph.facebook.com/${META_API_VERSION}/${metaPhoneId}/messages`;
  const hoje = formatarData(new Date());

  const payload = {
    messaging_product: 'whatsapp',
    to: formatarWhatsApp(whatsapp),
    type: 'template',
    template: {
      name: TEMPLATE_NAME,
      language: { code: 'pt_BR' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: nomePaciente },
            { type: 'text', text: hoje },
            { type: 'text', text: `R$ ${formatarValor(valorSessao)}` },
          ],
        },
      ],
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${metaAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const erro = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(erro?.error?.message ?? JSON.stringify(erro));
  }
}

export async function POST(request: NextRequest) {
  // 1. Autenticação
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || token !== process.env.DISPATCHER_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // 2. Cliente Supabase com service role (ignora RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // 3. Buscar psicólogas com WhatsApp conectado
  const { data: configs, error: erroConfigs } = await supabase
    .from('configuracoes_perfil')
    .select('psicologo_id, meta_access_token, meta_phone_id, mensagem_padrao')
    .eq('whatsapp_conectado', true)
    .not('meta_access_token', 'is', null)
    .not('meta_phone_id', 'is', null);

  if (erroConfigs) {
    return NextResponse.json({ error: 'Erro ao buscar configurações', detalhe: erroConfigs.message }, { status: 500 });
  }

  const hoje = new Date().getDate();
  const detalhes: Array<{ paciente: string; psicologo_id: string; status: 'enviado' | 'erro'; erro?: string }> = [];
  let enviadas = 0;
  let erros = 0;

  for (const config of configs ?? []) {
    // 4. Buscar pacientes elegíveis para esta psicóloga
    const { data: pacientes, error: erroPacientes } = await supabase
      .from('pacientes')
      .select('id, nome, whatsapp, valor_sessao, dia_vencimento, status')
      .eq('psicologo_id', config.psicologo_id)
      .or(`and(status.in.(pendente,atrasado),dia_vencimento.eq.${hoje}),status.eq.atrasado`);

    if (erroPacientes) {
      detalhes.push({
        paciente: `[psicologo ${config.psicologo_id}]`,
        psicologo_id: config.psicologo_id,
        status: 'erro',
        erro: `Erro ao buscar pacientes: ${erroPacientes.message}`,
      });
      erros++;
      continue;
    }

    // 5. Enviar mensagem para cada paciente individualmente
    for (const paciente of pacientes ?? []) {
      try {
        await enviarMensagem(
          config.meta_phone_id,
          config.meta_access_token,
          paciente.whatsapp,
          paciente.nome,
          Number(paciente.valor_sessao),
        );
        detalhes.push({ paciente: paciente.nome, psicologo_id: config.psicologo_id, status: 'enviado' });
        enviadas++;
      } catch (err) {
        detalhes.push({
          paciente: paciente.nome,
          psicologo_id: config.psicologo_id,
          status: 'erro',
          erro: err instanceof Error ? err.message : String(err),
        });
        erros++;
      }
    }
  }

  return NextResponse.json({ success: true, enviadas, erros, detalhes });
}
