-- Rodar no Supabase SQL Editor antes de testar

-- Tabela: templates
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  psicologo_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  conteudo text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "psicologo_templates_all" ON templates
  FOR ALL USING (auth.uid() = psicologo_id)
  WITH CHECK (auth.uid() = psicologo_id);

-- Tabela: regras_cobranca
CREATE TABLE IF NOT EXISTS regras_cobranca (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  psicologo_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  nome text NOT NULL,
  ativa boolean DEFAULT true,
  aplicar_para text DEFAULT 'todos',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE regras_cobranca ENABLE ROW LEVEL SECURITY;

CREATE POLICY "psicologo_regras_all" ON regras_cobranca
  FOR ALL USING (auth.uid() = psicologo_id)
  WITH CHECK (auth.uid() = psicologo_id);

-- Tabela: gatilhos_regra
CREATE TABLE IF NOT EXISTS gatilhos_regra (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regra_id uuid REFERENCES regras_cobranca(id) ON DELETE CASCADE NOT NULL,
  dias_offset integer NOT NULL, -- negativo = antes do vencimento, positivo = depois
  template_id uuid REFERENCES templates(id) ON DELETE SET NULL,
  horario_envio time NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gatilhos_regra ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gatilhos_via_regra" ON gatilhos_regra
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM regras_cobranca
      WHERE regras_cobranca.id = gatilhos_regra.regra_id
        AND regras_cobranca.psicologo_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM regras_cobranca
      WHERE regras_cobranca.id = gatilhos_regra.regra_id
        AND regras_cobranca.psicologo_id = auth.uid()
    )
  );

-- Tabela: regra_pacientes
CREATE TABLE IF NOT EXISTS regra_pacientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  regra_id uuid REFERENCES regras_cobranca(id) ON DELETE CASCADE NOT NULL,
  paciente_id uuid REFERENCES pacientes(id) ON DELETE CASCADE NOT NULL
);

ALTER TABLE regra_pacientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "regra_pacientes_via_regra" ON regra_pacientes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM regras_cobranca
      WHERE regras_cobranca.id = regra_pacientes.regra_id
        AND regras_cobranca.psicologo_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM regras_cobranca
      WHERE regras_cobranca.id = regra_pacientes.regra_id
        AND regras_cobranca.psicologo_id = auth.uid()
    )
  );

-- Tabela: configuracoes_perfil
CREATE TABLE IF NOT EXISTS configuracoes_perfil (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  psicologo_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  whatsapp_numero text,
  whatsapp_conectado boolean DEFAULT false,
  mensagem_padrao text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE configuracoes_perfil ENABLE ROW LEVEL SECURITY;

CREATE POLICY "psicologo_config_all" ON configuracoes_perfil
  FOR ALL USING (auth.uid() = psicologo_id)
  WITH CHECK (auth.uid() = psicologo_id);
