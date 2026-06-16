import Link from "next/link";

export const metadata = {
  title: "Termos de Uso | VitalLink",
};

export default function TermosPage() {
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
          Termos de Uso
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: 40 }}>
          Última atualização: {dataAtualizacao}
        </p>

        <Secao titulo="1. Aceitação dos Termos">
          <p>
            Ao criar uma conta ou utilizar o VitalLink, você declara que leu, compreendeu e concorda com
            estes Termos de Uso e com a{" "}
            <Link href="/privacidade" style={{ color: "#00B3A4" }}>Política de Privacidade</Link>.
            Se não concordar, não utilize o serviço.
          </p>
          <p>
            O VitalLink é operado por <strong>65.544.455 THIAGO DOS SANTOS SOARES</strong>. Dúvidas podem
            ser enviadas para{" "}
            <a href="mailto:contato@vitallink.clinic" style={{ color: "#00B3A4" }}>contato@vitallink.clinic</a>.
          </p>
        </Secao>

        <Secao titulo="2. Descrição do Serviço">
          <p>
            O VitalLink é uma plataforma SaaS (Software as a Service) voltada para profissionais de saúde
            autônomos — como psicólogos, nutricionistas e fisioterapeutas — que desejam automatizar o
            gerenciamento de cobranças e o envio de lembretes de pagamento aos seus pacientes via WhatsApp.
          </p>
          <p>Os principais recursos incluem:</p>
          <ul>
            <li>Cadastro e gerenciamento de pacientes;</li>
            <li>Painel de status de pagamentos (em dia, pendente, atrasado);</li>
            <li>Envio automatizado de mensagens de cobrança via WhatsApp Business API;</li>
            <li>Configuração de mensagens personalizadas;</li>
            <li>Integração com a Meta (WhatsApp Business) via Embedded Signup.</li>
          </ul>
        </Secao>

        <Secao titulo="3. Elegibilidade e Cadastro">
          <p>Para utilizar o VitalLink, você deve:</p>
          <ul>
            <li>Ser maior de 18 anos ou emancipado legalmente;</li>
            <li>Ser profissional de saúde legalmente habilitado ou pessoa jurídica;</li>
            <li>Fornecer informações verdadeiras, precisas e completas no cadastro;</li>
            <li>Manter as informações da conta atualizadas.</li>
          </ul>
          <p>
            Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as
            atividades realizadas em sua conta. Notifique-nos imediatamente em caso de uso não autorizado.
          </p>
        </Secao>

        <Secao titulo="4. Planos e Preços">
          <p>O VitalLink oferece os seguintes planos:</p>
          <ul>
            <li>
              <strong>Período de teste gratuito:</strong> 30 dias sem necessidade de cartão de crédito,
              com acesso completo a todos os recursos.
            </li>
            <li>
              <strong>Plano Profissional:</strong> R$ 59,00/mês ou R$ 590,00/ano (equivalente a 10 meses),
              com cobranças automáticas ilimitadas, follow-ups via WhatsApp, painel de inadimplência e
              suporte por WhatsApp.
            </li>
          </ul>
          <p>
            Os preços podem ser ajustados mediante comunicação prévia de 30 dias. O valor vigente no
            momento da contratação será mantido pelo período já pago.
          </p>
        </Secao>

        <Secao titulo="5. Pagamento e Renovação">
          <p>
            O pagamento é processado por meio de plataformas de pagamento seguras (Asaas ou similar).
            A assinatura mensal renova automaticamente a cada 30 dias; a anual, a cada 12 meses. Você
            pode cancelar a qualquer momento pela aba "Planos" nas Configurações ou por e-mail, sem multa.
          </p>
          <p>
            Em caso de inadimplência, o acesso ao serviço pode ser suspenso após 5 dias corridos. Os dados
            permanecem disponíveis por 30 dias adicionais para reativação.
          </p>
        </Secao>

        <Secao titulo="6. Cancelamento">
          <p>
            Você pode cancelar sua assinatura a qualquer momento, sem taxa de cancelamento. Após o
            cancelamento:
          </p>
          <ul>
            <li>O acesso ao serviço é mantido até o fim do período já pago;</li>
            <li>Os dados ficam disponíveis para exportação por 30 dias;</li>
            <li>Após 30 dias do encerramento, os dados são permanentemente excluídos.</li>
          </ul>
        </Secao>

        <Secao titulo="7. Uso Responsável e Restrições">
          <p>Ao utilizar o VitalLink, você se compromete a:</p>
          <ul>
            <li>Utilizar o serviço exclusivamente para fins lícitos e dentro das finalidades descritas;</li>
            <li>Obter o consentimento dos seus pacientes antes de cadastrá-los e enviar-lhes mensagens;</li>
            <li>Não utilizar a plataforma para envio de spam, conteúdo ilegal ou enganoso;</li>
            <li>Respeitar os Termos de Uso da API do WhatsApp Business da Meta;</li>
            <li>Não tentar contornar, desabilitar ou interferir nos mecanismos de segurança da plataforma.</li>
          </ul>
          <p>
            O uso indevido pode resultar na suspensão ou encerramento imediato da conta, sem reembolso.
          </p>
        </Secao>

        <Secao titulo="8. Responsabilidade pelo Conteúdo">
          <p>
            Você é o único responsável pelo conteúdo das mensagens enviadas aos seus pacientes e pela
            veracidade dos dados cadastrados. O VitalLink atua como ferramenta de automação e não se
            responsabiliza por:
          </p>
          <ul>
            <li>Mensagens enviadas com conteúdo inadequado ou ilegal pelo usuário;</li>
            <li>Disputas entre o profissional e seus pacientes;</li>
            <li>Falhas no entrega de mensagens decorrentes de limitações da API do WhatsApp;</li>
            <li>Perdas financeiras causadas por uso indevido da plataforma.</li>
          </ul>
        </Secao>

        <Secao titulo="9. Disponibilidade e Manutenção">
          <p>
            O VitalLink se esforça para manter a plataforma disponível 24/7, com meta de uptime de 99,5%.
            Podemos realizar manutenções programadas com aviso prévio de pelo menos 24 horas. Não nos
            responsabilizamos por interrupções causadas por terceiros (provedores de nuvem, Meta, etc.).
          </p>
        </Secao>

        <Secao titulo="10. Propriedade Intelectual">
          <p>
            Todo o conteúdo da plataforma (design, código, marca, textos) é propriedade do VitalLink e
            protegido por leis de propriedade intelectual. É vedada a reprodução, modificação ou
            distribuição sem autorização expressa. O usuário mantém a propriedade de todos os dados
            inseridos em sua conta.
          </p>
        </Secao>

        <Secao titulo="11. Limitação de Responsabilidade">
          <p>
            Na máxima extensão permitida pela lei, o VitalLink não se responsabiliza por danos indiretos,
            incidentais, especiais ou consequentes decorrentes do uso ou da impossibilidade de uso do
            serviço. Nossa responsabilidade total, em qualquer caso, fica limitada ao valor pago pelo
            usuário nos 3 meses anteriores ao evento causador do dano.
          </p>
        </Secao>

        <Secao titulo="12. Alterações nos Termos">
          <p>
            Podemos modificar estes Termos a qualquer momento. Usuários ativos serão notificados por
            e-mail com antecedência mínima de 30 dias para alterações materiais. O uso continuado após
            a vigência das alterações constitui aceite dos novos termos.
          </p>
        </Secao>

        <Secao titulo="13. Lei Aplicável e Foro">
          <p>
            Estes Termos são regidos pela legislação brasileira. Quaisquer disputas serão submetidas ao
            Foro da Comarca de domicílio do usuário, salvo disposição legal em contrário.
          </p>
        </Secao>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
          <Link href="/privacidade" style={{ color: "#00B3A4", fontSize: "0.875rem", textDecoration: "none" }}>
            Política de Privacidade →
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
      <div style={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.75 }}>
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
