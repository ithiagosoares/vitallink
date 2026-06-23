export interface Template {
  id: string;
  nome: string;
  categoria: string;
  conteudo: string;
  variaveis: string[];
}

export const TEMPLATES: Template[] = [
  {
    id: "1",
    nome: "Lembrete de consulta (dia anterior)",
    categoria: "Lembrete",
    conteudo:
      "Olá, {{1}}! 😊 Passando para lembrar que sua consulta está agendada para amanhã, {{2}}, às {{3}}. Qualquer dúvida, estou à disposição.",
    variaveis: ["nome do paciente", "data", "horário"],
  },
  {
    id: "2",
    nome: "Lembrete de consulta (mesmo dia)",
    categoria: "Lembrete",
    conteudo: "Olá, {{1}}! Sua consulta de hoje é às {{2}}. Te espero! 🗓️",
    variaveis: ["nome do paciente", "horário"],
  },
  {
    id: "3",
    nome: "Cobrança simples",
    categoria: "Cobrança",
    conteudo:
      "Olá, {{1}}! Segue o valor referente à sua sessão do dia {{2}}: *R$ {{3}}*. Chave Pix: {{4}}. Obrigada! 😊",
    variaveis: ["nome do paciente", "data", "valor", "chave Pix"],
  },
  {
    id: "4",
    nome: "Cobrança com vencimento",
    categoria: "Cobrança",
    conteudo:
      "Olá, {{1}}! O valor de *R$ {{2}}* referente à sessão de {{3}} vence em {{4}}. Chave Pix: {{5}}. Em caso de dúvidas, estou aqui.",
    variaveis: [
      "nome do paciente",
      "valor",
      "data da sessão",
      "data de vencimento",
      "chave Pix",
    ],
  },
  {
    id: "5",
    nome: "Confirmação de agendamento",
    categoria: "Agendamento",
    conteudo:
      "Olá, {{1}}! Sua consulta foi agendada para {{2}} às {{3}}. Para confirmar presença, responda *SIM*. Para reagendar, entre em contato. 😊",
    variaveis: ["nome do paciente", "data", "horário"],
  },
  {
    id: "6",
    nome: "Reagendamento",
    categoria: "Agendamento",
    conteudo:
      "Olá, {{1}}! Precisei reagendar nossa consulta. Novo horário: {{2}} às {{3}}. Qualquer problema, me avise. Obrigada pela compreensão!",
    variaveis: ["nome do paciente", "nova data", "novo horário"],
  },
  {
    id: "7",
    nome: "Cancelamento pela psicóloga",
    categoria: "Agendamento",
    conteudo:
      "Olá, {{1}}! Infelizmente precisei cancelar a consulta do dia {{2}}. Entrarei em contato para reagendarmos. Peço desculpas pelo transtorno.",
    variaveis: ["nome do paciente", "data"],
  },
  {
    id: "8",
    nome: "Confirmação de pagamento recebido",
    categoria: "Cobrança",
    conteudo:
      "Olá, {{1}}! Pagamento de *R$ {{2}}* referente à sessão de {{3}} recebido com sucesso. Obrigada! 🙏",
    variaveis: ["nome do paciente", "valor", "data da sessão"],
  },
  {
    id: "9",
    nome: "Retorno após período sem consulta",
    categoria: "Relacionamento",
    conteudo:
      "Olá, {{1}}! Faz um tempo que não nos vemos. Quando quiser retomar as sessões, estou à disposição. Cuide-se! 💙",
    variaveis: ["nome do paciente"],
  },
  {
    id: "10",
    nome: "Boas-vindas ao novo paciente",
    categoria: "Relacionamento",
    conteudo:
      "Olá, {{1}}! Seja bem-vindo(a)! 😊 Sua primeira consulta está agendada para {{2}} às {{3}}. Em caso de dúvidas, pode me chamar aqui mesmo.",
    variaveis: ["nome do paciente", "data", "horário"],
  },
];

export const CATEGORIA_CORES: Record<string, string> = {
  Lembrete: "bg-blue-50 text-blue-600",
  Cobrança: "bg-green-50 text-green-600",
  Agendamento: "bg-purple-50 text-purple-600",
  Relacionamento: "bg-orange-50 text-orange-600",
};
