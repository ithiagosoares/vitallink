'use client';

import { useCallback, useEffect, useRef, useState, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './landing.css';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [proofInView, setProofInView] = useState(false);
  const [countProgress, setCountProgress] = useState(0);
  const [painInView, setPainInView] = useState([false, false, false]);
  const [solutionInView, setSolutionInView] = useState(false);
  const [stepsInView, setStepsInView] = useState([false, false, false]);
  const [statsInView, setStatsInView] = useState(false);
  const [featuresInView, setFeaturesInView] = useState<boolean[]>(Array(6).fill(false));
  const [testiInView, setTestiInView] = useState([false, false, false]);
  const [priceInView, setPriceInView] = useState(false);
  const [faqInView, setFaqInView] = useState<boolean[]>(Array(5).fill(false));
  const [faqOpen, setFaqOpen] = useState([true, false, false, false, false]);
  const [ctaFinalInView, setCtaFinalInView] = useState(false);

  const proofRef = useRef<HTMLElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const faqListRef = useRef<HTMLDivElement>(null);
  const ctaFinalRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const painRefsArr = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const stepRefsArr = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const featureRefsArr = useRef<(HTMLDivElement | null)[]>(Array(6).fill(null));
  const testiRefsArr = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  const runCounter = useCallback(() => {
    const start = performance.now();
    const duration = 1600;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setCountProgress(ease(t));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setProofInView(true); runCounter(); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (proofRef.current) obs.observe(proofRef.current);
    return () => obs.disconnect();
  }, [runCounter]);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const idx = painRefsArr.current.indexOf(en.target as HTMLDivElement);
        if (idx !== -1 && en.isIntersecting) {
          setPainInView(prev => prev.map((v, i) => i === idx ? true : v));
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.2 });
    painRefsArr.current.forEach(r => { if (r) obs.observe(r); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setSolutionInView(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    if (solutionRef.current) obs.observe(solutionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const idx = stepRefsArr.current.indexOf(en.target as HTMLDivElement);
        if (idx !== -1 && en.isIntersecting) {
          setStepsInView(prev => prev.map((v, i) => i === idx ? true : v));
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.3 });
    stepRefsArr.current.forEach(r => { if (r) obs.observe(r); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setStatsInView(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const idx = featureRefsArr.current.indexOf(en.target as HTMLDivElement);
        if (idx !== -1 && en.isIntersecting) {
          setFeaturesInView(prev => prev.map((v, i) => i === idx ? true : v));
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.2 });
    featureRefsArr.current.forEach(r => { if (r) obs.observe(r); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        const idx = testiRefsArr.current.indexOf(en.target as HTMLDivElement);
        if (idx !== -1 && en.isIntersecting) {
          setTestiInView(prev => prev.map((v, i) => i === idx ? true : v));
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.2 });
    testiRefsArr.current.forEach(r => { if (r) obs.observe(r); });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setPriceInView(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (priceRef.current) obs.observe(priceRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setFaqInView(Array(5).fill(true)); obs.disconnect(); }
    }, { threshold: 0.1 });
    if (faqListRef.current) obs.observe(faqListRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setCtaFinalInView(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ctaFinalRef.current) obs.observe(ctaFinalRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const p = countProgress;
  const fmtInt = (v: number) => Math.round(v).toLocaleString('pt-BR');

  const proofItems = [
    { display: fmtInt(500 * p) + '+', label: 'profissionais ativos', hasSep: true },
    { display: 'R$ ' + (p >= 1 ? '2' : (p * 2).toFixed(1)) + 'M+', label: 'recuperados em cobranças', hasSep: true },
    { display: Math.round(98 * p) + '%', label: 'de satisfação dos usuários', hasSep: false },
  ];

  const painData = [
    {
      title: 'Horas perdidas em follow-up manual',
      text: 'Mensagens manuais, lembretes repetidos, follow-up esquecido. Tempo valioso jogado fora.',
      delay: 0,
      icon: (
        <svg width="24" height="24" fill="none" stroke="#00B3A4" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      title: 'Vergonha de cobrar',
      text: 'Você evita a conversa de cobrança e prefere esperar — mas o dinheiro não aparece sozinho.',
      delay: 150,
      icon: (
        <svg width="24" height="24" fill="none" stroke="#00B3A4" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
    },
    {
      title: 'Clientes que somem sem pagar',
      text: 'Você atende, termina a sessão, e o cliente some sem pagar o próximo ciclo.',
      delay: 300,
      icon: (
        <svg width="24" height="24" fill="none" stroke="#00B3A4" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ];

  const steps = [
    { num: '01', title: 'Cadastre o paciente', text: 'Adicione nome, valor da sessão e data de vencimento. Leva menos de 2 minutos.', hasConnector: true, delay: 0 },
    { num: '02', title: 'O VitalLink cobra por você', text: 'Lembretes automáticos por WhatsApp no momento certo, com tom profissional e humano.', hasConnector: true, delay: 200 },
    { num: '03', title: 'Você recebe. Sem drama.', text: 'Acompanhe quem pagou, quem está pendente e quem precisa de um segundo lembrete.', hasConnector: false, delay: 400 },
  ];

  const statBlocks = [
    { num: 'R$ 800', suf: '/mês', desc: 'é a média que autônomos perdem com inadimplência não gerenciada', hasSep: true },
    { num: '1 em 3', suf: '', desc: 'clientes atrasa por simples esquecimento — não má vontade', hasSep: true },
    { num: '30', suf: ' dias', desc: 'é tudo que você precisa para ver o impacto no seu caixa', hasSep: false },
  ];

  const featureIcons: React.ReactNode[] = [
    <path key="f0" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>,
    <Fragment key="f1"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></Fragment>,
    <Fragment key="f2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Fragment>,
    <path key="f3" d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>,
    <path key="f4" d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5z"/>,
    <Fragment key="f5"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></Fragment>,
  ];

  const features = [
    { title: 'Cobrança automática via WhatsApp', text: 'Mensagens enviadas automaticamente no canal que seus clientes já usam.' },
    { title: 'Régua de follow-up sem esforço', text: 'Sequência inteligente de lembretes que respeita o cliente e protege seu caixa.' },
    { title: 'Painel simples de inadimplência', text: 'Visualize em segundos quem está em dia e quem precisa de atenção.' },
    { title: 'Linguagem humanizada nas mensagens', text: 'Nada de tom robótico. As cobranças soam como você — educadas e firmes.' },
    { title: '100% LGPD e dados seguros', text: 'Seus dados e dos seus clientes protegidos com criptografia e conformidade total.' },
    { title: 'Funciona no celular, sem instalação', text: 'Acesse de qualquer lugar, direto no navegador. Sem downloads, sem configuração.' },
  ];

  const testimonials = [
    { initial: 'A', bg: 'linear-gradient(135deg,#00B3A4,#05604f)', name: 'Ana Paula Silva', role: 'Psicóloga Clínica · São Paulo', text: 'Eu ficava com vergonha de cobrar. Hoje o VitalLink manda a mensagem por mim e minha inadimplência caiu 80%. Simplesmente incrível.' },
    { initial: 'M', bg: 'linear-gradient(135deg,#2874d1,#05326D)', name: 'Mariana Costa', role: 'Psicóloga · Rio de Janeiro', text: 'Setup em menos de 5 minutos e já no primeiro mês recuperei R$ 1.200 que estavam parados. Vale cada centavo.' },
    { initial: 'C', bg: 'linear-gradient(135deg,#9b5de5,#5e2b9e)', name: 'Carolina Mendes', role: 'Psicóloga Comportamental · BH', text: 'Meus pacientes recebem o lembrete e pagam antes mesmo de eu lembrar de cobrar. A automação é perfeita, parece que fui eu que mandei.' },
  ];

  const faqData = [
    { q: 'Preciso instalar alguma coisa?', a: 'Não. O VitalLink funciona direto no navegador, em qualquer dispositivo.' },
    { q: 'Meus clientes vão receber spam?', a: 'Não. As mensagens são enviadas de forma personalizada e no momento certo, respeitando o ritmo de cada cliente.' },
    { q: 'E se eu quiser cancelar?', a: 'Você cancela quando quiser, sem taxa e sem burocracia. Sem letras miúdas.' },
    { q: 'Funciona para qualquer profissional de saúde?', a: 'Sim. Psicólogos, nutricionistas, fisioterapeutas, fonoaudiólogos — qualquer autônomo que receba de forma recorrente.' },
    { q: 'Como é o suporte?', a: 'Direto pelo WhatsApp. Você fala com uma pessoa real, não com um bot.' },
  ];

  const priceFeatures = ['Cobranças automáticas ilimitadas', 'Follow-ups via WhatsApp', 'Painel de inadimplência', 'Suporte por WhatsApp', 'Cancele quando quiser'];
  const bullets = ['Cobranças enviadas automaticamente no WhatsApp', 'Lembretes no momento certo, sem parecer spam', 'Painel completo de quem pagou e quem está pendente', 'Mensagens com tom humanizado e profissional', 'Configuração em menos de 5 minutos'];

  const particleConfigs = [
    { top: '15%', left: '8%', size: 4, dur: '5s', delay: '0s', op: 0.3 },
    { top: '65%', left: '5%', size: 3, dur: '7s', delay: '1s', op: 0.25 },
    { top: '25%', left: '92%', size: 5, dur: '6s', delay: '0.5s', op: 0.35 },
    { top: '75%', left: '88%', size: 3, dur: '4s', delay: '2s', op: 0.2 },
    { top: '45%', left: '48%', size: 4, dur: '8s', delay: '1.5s', op: 0.25 },
    { top: '10%', left: '55%', size: 3, dur: '5.5s', delay: '0.8s', op: 0.3 },
  ];

  return (
    <div className="lp">
      {/* ── Nav ── */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="logo">Vital<span>Link</span></div>
        <div className="navlinks">
          <a href="#funcionalidades">Funcionalidades</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#precos">Preços</a>
        </div>
        <div className="navright">
          <Link className="nav-cta" href="/login">Começar grátis</Link>
          <button className="burger" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="menu-close" onClick={() => setMenuOpen(false)}>×</button>
        <a href="#funcionalidades" onClick={() => setMenuOpen(false)}>Funcionalidades</a>
        <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
        <a href="#precos" onClick={() => setMenuOpen(false)}>Preços</a>
        <Link className="nav-cta" href="/login" onClick={() => setMenuOpen(false)}>Começar grátis</Link>
      </div>

      {/* ── Hero ── */}
      <section className="hero">
        {particleConfigs.map((pc, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: pc.top, left: pc.left,
              width: pc.size, height: pc.size,
              opacity: pc.op,
              animation: `floatP ${pc.dur} ease-in-out ${pc.delay} infinite`,
            }}
          />
        ))}
        <div className="hero-inner">
          <div className="hero-text">
            <div className="badge"><span className="dot" />Para psicólogos autônomos</div>
            <h1>
              Nunca mais persiga paciente para pagar.
              <span className="accent">O VitalLink cobra por você.</span>
            </h1>
            <p className="subtitle">Automação de cobranças e follow-ups para psicólogos autônomos. Sem constrangimento, sem esquecimento.</p>
            <div className="hero-buttons">
              <Link className="btn-primary" href="/login">Testar grátis por 30 dias</Link>
              <a className="btn-secondary" href="#como-funciona">Ver como funciona</a>
            </div>
            <div className="trust-bar">
              <div className="trust-item"><span className="check">✓</span>Sem cartão de crédito</div>
              <div className="trust-item"><span className="check">✓</span>Cancele quando quiser</div>
              <div className="trust-item"><span className="check">✓</span>Setup em 5 minutos</div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="phone-wrap">
              <div className="phone-img">
                <Image src="/img1.webp" alt="App VitalLink no celular" width={280} height={500} style={{ objectFit: 'cover' }} priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proof bar ── */}
      <section ref={proofRef} className={`proof-bar${proofInView ? ' in-view' : ''}`}>
        <div className="proof-inner">
          {proofItems.map((item, i) => (
            <Fragment key={i}>
              <div className="proof-item">
                <div className="proof-num">{item.display}</div>
                <div className="proof-label">{item.label}</div>
              </div>
              {item.hasSep && <div className="proof-sep" />}
            </Fragment>
          ))}
        </div>
      </section>

      {/* ── Pain ── */}
      <section className="pain" id="funcionalidades">
        <div className="section-head">
          <div className="section-label">O problema real</div>
          <h2>Você está deixando dinheiro na mesa todo mês.</h2>
          <p>Não por falta de competência. Por falta de um sistema.</p>
        </div>
        <div className="pain-grid">
          {painData.map((card, i) => (
            <div
              key={i}
              ref={(el) => { painRefsArr.current[i] = el; }}
              className={`pain-card${painInView[i] ? ' in-view' : ''}`}
              style={{ transitionDelay: painInView[i] ? `${card.delay}ms` : '0ms' }}
            >
              <div className="pain-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="solution">
        <div className="solution-inner">
          <div
            ref={solutionRef}
            className={`solution-visual${solutionInView ? ' in-view' : ''}`}
          >
            <div className="solution-img-wrap">
              <Image src="/img2.webp" alt="Painel VitalLink" width={560} height={380} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
          </div>
          <div className={`solution-text${solutionInView ? ' in-view' : ''}`}>
            <div className="section-label">A solução</div>
            <h2>Automação que trabalha enquanto você foca nos seus pacientes.</h2>
            <div className="bullets">
              {bullets.map((b, i) => (
                <div key={i} className="bullet">
                  <div className="bullet-icon">✓</div>
                  <div className="bullet-text">{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how" id="como-funciona">
        <div className="section-head">
          <div className="section-label">Passo a passo</div>
          <h2>Configure uma vez. Receba sempre.</h2>
        </div>
        <div className="how-steps">
          {steps.map((step, i) => (
            <Fragment key={i}>
              <div className="step-wrap">
                <div
                  ref={(el) => { stepRefsArr.current[i] = el; }}
                  className={`step${stepsInView[i] ? ' in-view' : ''}`}
                  style={{ transitionDelay: stepsInView[i] ? `${step.delay}ms` : '0ms' }}
                >
                  <div className="step-num">{step.num}</div>
                  <div className="step-title">{step.title}</div>
                  <div className="step-text">{step.text}</div>
                </div>
              </div>
              {step.hasConnector && <div className="step-connector" />}
            </Fragment>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="stats">
        <div className="stats-inner">
          {statBlocks.map((s, i) => (
            <Fragment key={i}>
              <div
                className={`stat-block${statsInView ? ' in-view' : ''}`}
                style={{ transitionDelay: statsInView ? `${i * 150}ms` : '0ms' }}
              >
                <div className="stat-num">{s.num}<span className="suf">{s.suf}</span></div>
                <div className="stat-desc">{s.desc}</div>
              </div>
              {s.hasSep && <div className="stat-sep" />}
            </Fragment>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="section-head">
          <div className="section-label">Por que escolher</div>
          <h2>Por que profissionais autônomos escolhem o VitalLink</h2>
        </div>
        <div className="feature-grid">
          {features.map((f, i) => (
            <div
              key={i}
              ref={(el) => { featureRefsArr.current[i] = el; }}
              className={`feature-card${featuresInView[i] ? ' in-view' : ''}`}
              style={{ transitionDelay: featuresInView[i] ? `${i * 100}ms` : '0ms' }}
            >
              <div className="feature-icon">
                <svg width="22" height="22" fill="none" stroke="#00B3A4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  {featureIcons[i]}
                </svg>
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials">
        <div className="section-head">
          <div className="section-label">O que dizem</div>
          <h2>Profissionais que pararam de cobrar manualmente.</h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <div
              key={i}
              ref={(el) => { testiRefsArr.current[i] = el; }}
              className={`testi-card${testiInView[i] ? ' in-view' : ''}`}
              style={{ transitionDelay: testiInView[i] ? `${i * 150}ms` : '0ms' }}
            >
              <div className="testi-quote">&ldquo;</div>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-person">
                <div className="testi-avatar" style={{ background: t.bg }}>{t.initial}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="pricing" id="precos">
        <div className="section-head">
          <div className="section-label">Investimento</div>
          <h2>Um plano. Simples e justo.</h2>
        </div>
        <div ref={priceRef} className={`price-card${priceInView ? ' in-view' : ''}`}>
          <div className="price-badge">30 dias grátis</div>
          <div className="price-amount">
            <span className="price-currency">R$</span>
            <span className="price-big">59</span>
            <span className="price-period">/mês</span>
          </div>
          <div className="price-annual">ou R$ 590/ano — 2 meses de bônus</div>
          <ul className="price-features">
            {priceFeatures.map((pf, i) => (
              <li key={i}><span className="check">✓</span>{pf}</li>
            ))}
          </ul>
          <Link className="price-cta" href="/login">Começar meus 30 dias grátis</Link>
          <div className="price-note">Sem cartão de crédito. Sem compromisso.</div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq">
        <div className="section-head">
          <div className="section-label">Dúvidas frequentes</div>
          <h2>Ainda tem dúvida? A gente responde.</h2>
        </div>
        <div ref={faqListRef} className="faq-list">
          {faqData.map((faq, i) => (
            <div
              key={i}
              className={`faq-item${faqInView[i] ? ' in-view' : ''}`}
              style={{ transitionDelay: faqInView[i] ? `${i * 100}ms` : '0ms' }}
            >
              <button
                className="faq-q"
                onClick={() => setFaqOpen(prev => prev.map((v, j) => j === i ? !v : v))}
              >
                {faq.q}
                <span className={`faq-icon${faqOpen[i] ? ' open' : ''}`}>+</span>
              </button>
              <div className={`faq-a${faqOpen[i] ? ' open' : ''}`}>
                <div className="faq-a-inner">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="cta-final">
        <div ref={ctaFinalRef} className={`cta-final-inner${ctaFinalInView ? ' in-view' : ''}`}>
          <h2>Sua agenda cheia começa hoje.</h2>
          <p className="cta-final-sub">Junte-se aos profissionais que pararam de cobrar manualmente e começaram a crescer de verdade.</p>
          <Link className="cta-final-btn" href="/login">Quero meus 30 dias grátis</Link>
          <div className="cta-final-note">Sem cartão. Sem risco. Só resultado.</div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">Vital<span>Link</span></div>
            <div className="footer-copy">© {new Date().getFullYear()} VitalLink. Todos os direitos reservados.</div>
            <div className="footer-legal">65.544.455 THIAGO DOS SANTOS SOARES</div>
          </div>
          <div className="footer-links">
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#precos">Preços</a>
            <a href="mailto:contato@vitallink.clinic">Contato</a>
            <Link href="/privacidade">Política de Privacidade</Link>
            <Link href="/termos">Termos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
