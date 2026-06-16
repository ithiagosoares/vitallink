import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | VitalLink",
};

export default function PrivacidadePage() {
  const dataAtualizacao = "16 de junho de 2026";

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#F9FAFB", minHeight: "100vh" }}>
      {/* Nav simples */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", height: 64 }}>
          <Link href="/" style={{ fontSize: "1.25rem", fontWeight: 800, textDecoration: "none" }}>
            <span style={{ color: "#05326D" }}>Vital</span>
            <span style={{ color: "#00B3A4" }}>Link</span>
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#05326D", marginBottom: 8 }}>
          Política de Privacidade
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: 40 }}>
          Última atualização: {dataAtualizacao}
        </p>

        <Secao titulo="1. Identificação do Controlador">
          <p>
            O VitalLink é operado por <strong>65.544.455 THIAGO DOS SANTOS SOARES</strong> (doravante "VitalLink",
            "nós" ou "nosso"), pessoa jurídica de direito privado. Para questões relacionadas à privacidade e ao
            tratamento de dados pessoais, entre em contato pelo e-mail{" "}
            <a href="mailto:contato@vitallink.clinic" style={{ color: "#00B3A4" }}>contato@vitallink.clinic</a>.
          </p>
        </Secao>

        <Secao titulo="2. Dados Coletados">
          <p>Coletamos os seguintes dados pessoais:</p>
          <ul>
            <li><strong>Dados do profissional (titular da conta):</strong> nome completo, endereço de e-mail, número de WhatsApp pessoal e senha (armazenada de forma criptografada).</li>
            <li><strong>Dados dos pacientes cadastrados pelo profissional:</strong> nome, número de WhatsApp e informações de cobrança (valor da sessão, dia de vencimento e status de pagamento).</li>
            <li><strong>Dados de uso:</strong> data e hora de acesso, ações realizadas na plataforma, endereço IP e tipo de dispositivo para fins de segurança e melhoria do serviço.</li>
            <li><strong>Dados de integração:</strong> caso o profissional conecte o WhatsApp Business via Meta, armazenamos o token de acesso e o identificador do número de forma criptografada.</li>
          </ul>
        </Secao>

        <Secao titulo="3. Finalidade do Tratamento">
          <p>Utilizamos seus dados exclusivamente para:</p>
          <ul>
            <li>Prestar o serviço de automação de cobranças e follow-ups contratado;</li>
            <li>Autenticar o acesso à plataforma e garantir a segurança da conta;</li>
            <li>Enviar comunicações transacionais relacionadas ao serviço (confirmações de cadastro, recuperação de senha);</li>
            <li>Cumprir obrigações legais e regulatórias;</li>
            <li>Melhorar continuamente os recursos e a experiência do usuário.</li>
          </ul>
          <p>Não utilizamos seus dados para publicidade direcionada nem os comercializamos a terceiros.</p>
        </Secao>

        <Secao titulo="4. Base Legal para o Tratamento">
          <p>O tratamento de dados pessoais pelo VitalLink fundamenta-se nas seguintes bases legais previstas na Lei nº 13.709/2018 (LGPD):</p>
          <ul>
            <li><strong>Execução de contrato</strong> (art. 7º, V): para prestar os serviços contratados pelo profissional;</li>
            <li><strong>Consentimento</strong> (art. 7º, I): obtido no momento do cadastro para o tratamento de dados dos pacientes cadastrados pelo profissional;</li>
            <li><strong>Legítimo interesse</strong> (art. 7º, IX): para melhorias do serviço e segurança da plataforma;</li>
            <li><strong>Cumprimento de obrigação legal</strong> (art. 7º, II): quando exigido por lei ou autoridade competente.</li>
          </ul>
        </Secao>

        <Secao titulo="5. Compartilhamento de Dados">
          <p>
            Os dados pessoais tratados pelo VitalLink não são vendidos ou cedidos a terceiros. Podemos
            compartilhá-los apenas nas seguintes situações:
          </p>
          <ul>
            <li><strong>Fornecedores de infraestrutura:</strong> utilizamos a plataforma Supabase (PostgreSQL) para armazenamento seguro de dados, sujeita a contrato de processamento de dados (DPA) compatível com LGPD e GDPR;</li>
            <li><strong>Meta Platforms (WhatsApp Business API):</strong> quando o profissional habilitar o envio de mensagens, os dados necessários para o envio serão transmitidos à Meta conforme os Termos da API do WhatsApp Business;</li>
            <li><strong>Autoridades competentes:</strong> quando exigido por lei, ordem judicial ou regulamentação aplicável.</li>
          </ul>
        </Secao>

        <Secao titulo="6. Tempo de Retenção">
          <p>
            Os dados são retidos pelo tempo necessário para a prestação do serviço. Após o encerramento da conta:
          </p>
          <ul>
            <li>Os dados pessoais do profissional e de seus pacientes são excluídos em até <strong>30 dias</strong>;</li>
            <li>Logs de segurança e registros financeiros podem ser mantidos por até <strong>5 anos</strong>, em cumprimento a obrigações legais (Código Civil, art. 206);</li>
            <li>Dados anonimizados utilizados para análise estatística podem ser retidos indefinidamente, pois não identificam pessoas físicas.</li>
          </ul>
        </Secao>

        <Secao titulo="7. Segurança dos Dados">
          <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:</p>
          <ul>
            <li>Criptografia de dados em trânsito (TLS 1.2+) e em repouso;</li>
            <li>Senhas armazenadas com hash bcrypt;</li>
            <li>Tokens de integração armazenados de forma criptografada e nunca expostos ao cliente;</li>
            <li>Controle de acesso baseado em identidade via Row Level Security (RLS) no banco de dados;</li>
            <li>Monitoramento contínuo de segurança e backups automáticos.</li>
          </ul>
        </Secao>

        <Secao titulo="8. Direitos do Titular">
          <p>Em conformidade com a LGPD (arts. 17–22), você tem direito a:</p>
          <ul>
            <li><strong>Confirmação e acesso:</strong> saber se tratamos seus dados e acessá-los;</li>
            <li><strong>Correção:</strong> solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
            <li><strong>Anonimização, bloqueio ou eliminação:</strong> de dados desnecessários ou tratados em desconformidade;</li>
            <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado (JSON), disponível na aba LGPD das Configurações;</li>
            <li><strong>Eliminação:</strong> solicitar a exclusão de todos os seus dados — disponível na aba LGPD das Configurações ou por e-mail;</li>
            <li><strong>Revogação do consentimento:</strong> a qualquer momento, sem prejuízo à licitude do tratamento anterior;</li>
            <li><strong>Oposição:</strong> opor-se ao tratamento realizado com fundamento em legítimo interesse.</li>
          </ul>
          <p>
            Para exercer seus direitos, acesse as Configurações da plataforma ou envie e-mail para{" "}
            <a href="mailto:contato@vitallink.clinic" style={{ color: "#00B3A4" }}>contato@vitallink.clinic</a>.
            Responderemos em até 15 dias úteis.
          </p>
        </Secao>

        <Secao titulo="9. Cookies">
          <p>
            Utilizamos apenas cookies essenciais para manter a sessão autenticada do usuário. Não utilizamos
            cookies de rastreamento, publicidade ou análise comportamental de terceiros.
          </p>
        </Secao>

        <Secao titulo="10. Transferência Internacional">
          <p>
            Seus dados podem ser processados em servidores localizados fora do Brasil (EUA) pelos
            fornecedores de infraestrutura (Supabase). Garantimos que esses fornecedores adotam medidas
            de proteção equivalentes às exigidas pela LGPD, incluindo cláusulas contratuais padrão e
            certificações de conformidade (SOC 2 Type II).
          </p>
        </Secao>

        <Secao titulo="11. Alterações nesta Política">
          <p>
            Podemos atualizar esta Política periodicamente. Notificaremos os usuários por e-mail sobre
            alterações materiais com pelo menos 30 dias de antecedência. O uso continuado da plataforma
            após a notificação constitui aceite das alterações.
          </p>
        </Secao>

        <Secao titulo="12. Contato e Encarregado (DPO)">
          <p>
            Para exercer seus direitos, tirar dúvidas ou registrar reclamações relacionadas ao tratamento
            de dados pessoais:
          </p>
          <ul>
            <li><strong>E-mail:</strong> <a href="mailto:contato@vitallink.clinic" style={{ color: "#00B3A4" }}>contato@vitallink.clinic</a></li>
            <li><strong>Empresa:</strong> 65.544.455 THIAGO DOS SANTOS SOARES</li>
          </ul>
          <p>
            Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD) em{" "}
            <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" style={{ color: "#00B3A4" }}>
              www.gov.br/anpd
            </a>.
          </p>
        </Secao>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
          <Link href="/termos" style={{ color: "#00B3A4", fontSize: "0.875rem", textDecoration: "none" }}>
            Termos de Uso →
          </Link>
        </div>
      </main>
    </div>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#05326D", marginBottom: 12 }}>
        {titulo}
      </h2>
      <div
        style={{
          fontSize: "0.9rem",
          color: "#374151",
          lineHeight: 1.75,
        }}
      >
        {children}
      </div>
      <style>{`
        section ul { padding-left: 20px; margin: 8px 0; }
        section li { margin-bottom: 6px; }
        section p { margin-bottom: 10px; }
        section p:last-child { margin-bottom: 0; }
      `}</style>
    </section>
  );
}
