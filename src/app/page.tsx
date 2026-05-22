'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './landing.css';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Preciso instalar alguma coisa?',
      a: 'Não. O VitalLink funciona direto no navegador, em qualquer dispositivo.',
    },
    {
      q: 'Meus clientes vão receber spam?',
      a: 'Não. As mensagens são enviadas de forma personalizada e no momento certo, respeitando o ritmo de cada cliente.',
    },
    {
      q: 'E se eu quiser cancelar?',
      a: 'Você cancela quando quiser, sem taxa e sem burocracia. Sem letras miúdas.',
    },
    {
      q: 'Funciona para qualquer profissional de saúde?',
      a: 'Sim. Psicólogos, nutricionistas, fisioterapeutas, fonoaudiólogos — qualquer autônomo que receba de forma recorrente.',
    },
    {
      q: 'Como é o suporte?',
      a: 'Direto pelo WhatsApp. Você fala com uma pessoa real, não com um bot.',
    },
  ];

  return (
    <div className="landing">
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <div className="logo">
            <span className="vital">Vital</span>
            <span className="link">Link</span>
          </div>
          <div className="nav-links">
            <a href="#funcionalidades" onClick={(e) => { e.preventDefault(); scrollTo('funcionalidades'); }}>Funcionalidades</a>
            <a href="#como-funciona" onClick={(e) => { e.preventDefault(); scrollTo('como-funciona'); }}>Como funciona</a>
            <a href="#precos" onClick={(e) => { e.preventDefault(); scrollTo('precos'); }}>Preços</a>
          </div>
          <Link href="/login" className="btn-primary nav-cta nav-cta-desktop">Começar grátis</Link>
          <button
            className="menu-toggle"
            aria-label="Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-menu" style={{ display: 'flex' }}>
            <a href="#funcionalidades" onClick={(e) => { e.preventDefault(); scrollTo('funcionalidades'); }}>Funcionalidades</a>
            <a href="#como-funciona" onClick={(e) => { e.preventDefault(); scrollTo('como-funciona'); }}>Como funciona</a>
            <a href="#precos" onClick={(e) => { e.preventDefault(); scrollTo('precos'); }}>Preços</a>
            <Link href="/login" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>Começar grátis</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-badge"><span></span>Para profissionais autônomos de saúde</div>
              <h1>
                Nunca mais persiga paciente para pagar.<br />
                <em>O VitalLink cobra por você.</em>
              </h1>
              <p>
                Automação de cobranças e follow-ups para psicólogos, nutricionistas e
                fisioterapeutas autônomos. Sem constrangimento, sem esquecimento.
              </p>
              <div className="hero-btns">
                <Link href="/login" className="btn-primary">Testar grátis por 30 dias</Link>
                <button className="btn-outline" onClick={() => scrollTo('como-funciona')}>
                  Ver como funciona
                </button>
              </div>
              <div className="hero-trust">
                <div className="trust-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  Sem cartão de crédito
                </div>
                <div className="trust-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  Cancele quando quiser
                </div>
                <div className="trust-item">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                  Setup em 5 minutos
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <Image src="/img1.webp" alt="Profissional com cobrança automática no celular" width={450} height={320} style={{ objectFit: 'contain', position: 'relative', zIndex: 1 }} priority />
            </div>
          </div>
        </div>
      </section>

      {/* DOR */}
      <section className="section-pain" id="funcionalidades">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">O problema real</span>
            <h2>Você está deixando dinheiro na mesa todo mês.</h2>
            <p>Não por falta de competência. Por falta de um sistema.</p>
          </div>
          <div className="cards-grid">
            <div className="card reveal">
              <div className="card-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  <line x1="9" y1="15" x2="15" y2="15"/><line x1="12" y1="12" x2="12" y2="18"/>
                </svg>
              </div>
              <h3>Clientes que somem</h3>
              <p>Você atende, termina a sessão, e o cliente some sem pagar o próximo ciclo.</p>
            </div>
            <div className="card reveal">
              <div className="card-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  <circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="12" cy="10" r="1" fill="currentColor"/>
                  <circle cx="15" cy="10" r="1" fill="currentColor"/>
                </svg>
              </div>
              <h3>Vergonha de cobrar</h3>
              <p>Você evita a conversa de cobrança e prefere esperar — mas o dinheiro não aparece sozinho.</p>
            </div>
            <div className="card reveal">
              <div className="card-icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3>Horas perdidas</h3>
              <p>Mensagens manuais, lembretes repetidos, follow-up esquecido. Tempo valioso jogado fora.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="section-how" id="como-funciona">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Passo a passo</span>
            <h2>Simples assim. Funciona assim.</h2>
          </div>
          <div className="how-grid">
            <div className="steps">
              <div className="step reveal">
                <div className="step-num">01</div>
                <div className="step-content">
                  <h3>Cadastre o cliente</h3>
                  <p>Adicione o nome, valor da sessão e data de vencimento. Leva menos de 2 minutos.</p>
                </div>
              </div>
              <div className="step reveal">
                <div className="step-num">02</div>
                <div className="step-content">
                  <h3>O VitalLink cobra por você</h3>
                  <p>Lembretes automáticos por WhatsApp no momento certo, com tom profissional e humano.</p>
                </div>
              </div>
              <div className="step reveal">
                <div className="step-num">03</div>
                <div className="step-content">
                  <h3>Você recebe. Sem drama.</h3>
                  <p>Acompanhe quem pagou, quem está pendente e quem precisa de um segundo lembrete.</p>
                </div>
              </div>
            </div>
            <div className="how-visual reveal">
              <Image src="/img2.webp" alt="Pessoa vendo confirmações de pagamento" width={450} height={320} style={{ objectFit: 'contain', position: 'relative', zIndex: 1 }} />
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="section-benefits">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Por que escolher</span>
            <h2>Por que profissionais autônomos escolhem o VitalLink</h2>
          </div>
          <div className="benefits-grid">
            {[
              {
                icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.74 16.92z"/>,
                title: 'Cobrança automática via WhatsApp',
                desc: 'Mensagens enviadas automaticamente no canal que seus clientes já usam.',
              },
              {
                icon: <><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>,
                title: 'Régua de follow-up sem esforço',
                desc: 'Sequência inteligente de lembretes que respeita o cliente e protege seu caixa.',
              },
              {
                icon: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
                title: 'Painel simples de inadimplência',
                desc: 'Visualize em segundos quem está em dia e quem precisa de atenção.',
              },
              {
                icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
                title: 'Linguagem humanizada nas mensagens',
                desc: 'Nada de tom robótico. As cobranças soam como você — educadas e firmes.',
              },
              {
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
                title: '100% LGPD e dados seguros',
                desc: 'Seus dados e dos seus clientes protegidos com criptografia e conformidade total.',
              },
              {
                icon: <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" strokeLinecap="round"/></>,
                title: 'Funciona no celular, sem instalação',
                desc: 'Acesse de qualquer lugar, direto no navegador. Sem downloads, sem configuração.',
              },
            ].map((item, i) => (
              <div key={i} className="benefit-item reveal">
                <div className="benefit-icon">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESTATÍSTICAS */}
      <section className="section-stats">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Dados reais</span>
            <h2>Os números falam por si.</h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card reveal">
              <span className="stat-number">R$ 800/mês</span>
              <p className="stat-desc">é a média que autônomos perdem com inadimplência não gerenciada</p>
            </div>
            <div className="stat-card reveal">
              <span className="stat-number">1 em cada 3</span>
              <p className="stat-desc">clientes atrasa pagamento por simples esquecimento — não má vontade</p>
            </div>
            <div className="stat-card reveal">
              <span className="stat-number">30 dias</span>
              <p className="stat-desc">é tudo que você precisa para ver o impacto no seu caixa</p>
            </div>
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section className="section-pricing" id="precos">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Investimento</span>
            <h2>Um plano. Simples e justo.</h2>
          </div>
          <div className="pricing-wrapper reveal">
            <div className="pricing-card">
              <div className="pricing-badge">30 dias grátis</div>
              <div className="pricing-price"><span>R$</span>59<small>/mês</small></div>
              <p className="pricing-sub">ou R$ 590/ano — 2 meses de bônus</p>
              <ul className="pricing-features">
                {[
                  'Cobranças automáticas ilimitadas',
                  'Follow-ups via WhatsApp',
                  'Painel de inadimplência',
                  'Suporte por WhatsApp',
                  'Cancele quando quiser',
                ].map((f) => (
                  <li key={f}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn-primary btn-full">Começar meus 30 dias grátis</Link>
              <p className="pricing-note">Sem cartão de crédito. Sem compromisso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-faq">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Dúvidas frequentes</span>
            <h2>Ainda tem dúvida? A gente responde.</h2>
          </div>
          <div className="faq-inner">
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                  <button className="faq-question" onClick={() => toggleFaq(i)}>
                    {faq.q}
                    <svg className="faq-chevron" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="faq-answer"><p>{faq.a}</p></div>
                </div>
              ))}
            </div>
            <div className="faq-visual reveal">
              <Image src="/img3.webp" alt="Profissional de saúde sorrindo com agenda cheia" width={430} height={320} style={{ objectFit: 'contain' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section-final">
        <div className="container">
          <div className="cta-inner reveal">
            <h2>Sua agenda cheia começa hoje.</h2>
            <p>
              Junte-se aos profissionais que pararam de cobrar manualmente e
              começaram a crescer de verdade.
            </p>
            <Link href="/login" className="btn-primary">Quero meus 30 dias grátis</Link>
            <p className="final-note">Sem cartão. Sem risco. Só resultado.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <div>
              <div className="logo" style={{ marginBottom: 8 }}>
                <span className="vital">Vital</span><span className="link">Link</span>
              </div>
              <p className="footer-copy">
                © 2026 VitalLink. Todos os direitos reservados.
                <span>65.544.455 THIAGO DOS SANTOS SOARES</span>
              </p>
            </div>
            <div className="footer-links">
              <a href="#funcionalidades" onClick={(e) => { e.preventDefault(); scrollTo('funcionalidades'); }}>Funcionalidades</a>
              <a href="#precos" onClick={(e) => { e.preventDefault(); scrollTo('precos'); }}>Preços</a>
              <a href="#">Contato</a>
              <a href="#">Política de Privacidade</a>
              <a href="#">Termos de Uso</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
