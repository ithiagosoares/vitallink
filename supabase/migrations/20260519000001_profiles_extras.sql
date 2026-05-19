alter table public.profiles
  add column if not exists accepted_terms_at  timestamptz,
  add column if not exists mensagem_cobranca  text;
