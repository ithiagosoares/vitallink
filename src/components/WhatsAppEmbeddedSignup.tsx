'use client';

import { useEffect, useRef, useState } from 'react';

const META_APP_ID = '26341114515514036';
const META_SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';

declare global {
  interface Window {
    FB: {
      init: (options: object) => void;
      login: (
        callback: (response: FBLoginResponse) => void,
        options: object
      ) => void;
    };
    fbAsyncInit: () => void;
  }
}

interface FBLoginResponse {
  authResponse: {
    accessToken: string;
    userID: string;
    code?: string;
  } | null;
  status: 'connected' | 'not_authorized' | 'unknown';
}

interface EmbeddedSignupMessage {
  type: string;
  event: string;
  data?: {
    phone_number_id?: string;
    waba_id?: string;
  };
}

interface Props {
  conectado: boolean;
  numeroConectado: string | null;
  onConectado: (phoneNumber: string) => void;
  onDesconectado: () => void;
}

export default function WhatsAppEmbeddedSignup({
  conectado,
  numeroConectado,
  onConectado,
  onDesconectado,
}: Props) {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Captura phone_number_id e waba_id via message event antes do callback do FB.login
  const pendingWAData = useRef<{ phone_number_id?: string; waba_id?: string }>({});

  // Carrega o SDK do Facebook uma única vez
  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      if (window.FB) setSdkReady(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: META_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v21.0',
      });
      setSdkReady(true);
    };

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = META_SDK_URL;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Listener de mensagens da Meta (captura phone_number_id e waba_id)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== 'https://www.facebook.com') return;
      try {
        const msg: EmbeddedSignupMessage =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (msg.type === 'WA_EMBEDDED_SIGNUP' && msg.event === 'FINISH' && msg.data) {
          pendingWAData.current = {
            phone_number_id: msg.data.phone_number_id,
            waba_id: msg.data.waba_id,
          };
        }
      } catch {
        // mensagem de outra origem — ignorar
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  async function handleFacebookResponse(response: FBLoginResponse) {
    if (!response.authResponse?.accessToken) {
      setLoading(false);
      if (response.status !== 'connected') {
        setErro('Conexão cancelada ou não autorizada.');
      }
      return;
    }

    const { accessToken } = response.authResponse;
    const { phone_number_id, waba_id } = pendingWAData.current;

    if (!phone_number_id || !waba_id) {
      setLoading(false);
      setErro(
        'Não foi possível obter os dados do número. Certifique-se de completar todos os passos do formulário Meta.'
      );
      return;
    }

    try {
      const res = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken, phone_number_id, waba_id }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'Erro ao salvar a conexão.');
      }

      onConectado(json.phone_number ?? phone_number_id);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  async function conectar() {
    if (!sdkReady || !window.FB) {
      setErro('SDK do Facebook ainda não carregou. Tente novamente em instantes.');
      return;
    }

    setLoading(true);
    setErro(null);
    pendingWAData.current = {};

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          handleFacebookResponse(response).catch(console.error);
        } else {
          setLoading(false);
          if (response.status !== 'connected') {
            setErro('Conexão cancelada ou não autorizada.');
          }
        }
      },
      {
        scope: 'whatsapp_business_management,whatsapp_business_messaging',
        extras: {
          feature: 'whatsapp_embedded_signup',
          setup: {},
          sessionInfoVersion: '3',
        },
      }
    );
  }

  async function desconectar() {
    setLoading(true);
    setErro(null);
    try {
      const res = await fetch('/api/whatsapp/disconnect', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Erro ao desconectar.');
      onDesconectado();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5 max-w-lg">
      {/* Status */}
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ${
            conectado
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
              : 'bg-red-50 text-red-600 ring-red-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              conectado ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          />
          {conectado ? 'Conectado' : 'Desconectado'}
        </span>
        {conectado && numeroConectado && (
          <span className="text-sm text-[#05326D] font-medium">{numeroConectado}</span>
        )}
      </div>

      {/* Número conectado (detalhe) */}
      {conectado && numeroConectado && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-sm font-medium text-emerald-800 mb-0.5">WhatsApp Business conectado</p>
          <p className="text-xs text-emerald-700">
            Número ID: <span className="font-mono">{numeroConectado}</span>
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            As cobranças serão enviadas automaticamente por este número.
          </p>
        </div>
      )}

      {/* Botões */}
      {!conectado ? (
        <button
          type="button"
          onClick={conectar}
          disabled={loading || !sdkReady}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1fbc59] disabled:opacity-60 rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Conectando…
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.527 5.855L0 24l6.335-1.502A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.516-5.187-1.415l-.371-.221-3.763.891.946-3.65-.242-.381A9.964 9.964 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Conectar WhatsApp Business
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={desconectar}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-60 rounded-lg transition-colors"
        >
          {loading ? 'Desconectando…' : 'Desconectar'}
        </button>
      )}

      {erro && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{erro}</p>
        </div>
      )}

      {/* Informativo */}
      {!conectado && (
        <div className="rounded-xl bg-[#05326D]/5 border border-[#05326D]/10 p-4 space-y-2">
          <p className="text-sm font-medium text-[#05326D]">Como funciona</p>
          <ol className="space-y-1.5 text-xs text-[#05326D]/70 list-decimal list-inside leading-relaxed">
            <li>Clique em <span className="font-medium">Conectar WhatsApp Business</span>.</li>
            <li>Uma janela da Meta será aberta — faça login com sua conta do Facebook.</li>
            <li>Selecione ou crie sua conta do WhatsApp Business.</li>
            <li>Confirme o número de telefone que enviará as cobranças.</li>
            <li>Pronto! O VitalLink estará autorizado a enviar mensagens por você.</li>
          </ol>
        </div>
      )}

      {/* Aviso LGPD */}
      <p className="text-xs text-[#05326D]/40 leading-relaxed">
        Seus dados de acesso são armazenados com criptografia e nunca são compartilhados.
        Você pode desconectar a qualquer momento. Conforme a LGPD, tratamos apenas os dados
        necessários para o funcionamento do serviço.
      </p>
    </div>
  );
}
