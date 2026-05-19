-- ============================================================
-- Tabela: profiles
-- Criada automaticamente após signup via trigger em auth.users
-- ============================================================
create table public.profiles (
  id         uuid        not null references auth.users (id) on delete cascade,
  nome       text,
  email      text,
  whatsapp   text,
  created_at timestamptz not null default now(),
  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Usuário lê o próprio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuário atualiza o próprio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger que cria o perfil automaticamente no cadastro
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- Tabela: pacientes
-- ============================================================
create table public.pacientes (
  id              uuid        not null default gen_random_uuid(),
  psicologo_id    uuid        not null references public.profiles (id) on delete cascade,
  nome            text        not null,
  whatsapp        text        not null,
  valor_sessao    numeric     not null,
  dia_vencimento  integer     not null check (dia_vencimento between 1 and 31),
  status          text        not null default 'em_dia'
                              check (status in ('em_dia', 'pendente', 'atrasado')),
  created_at      timestamptz not null default now(),
  primary key (id)
);

alter table public.pacientes enable row level security;

create policy "Psicóloga vê seus próprios pacientes"
  on public.pacientes for select
  using (auth.uid() = psicologo_id);

create policy "Psicóloga insere seus próprios pacientes"
  on public.pacientes for insert
  with check (auth.uid() = psicologo_id);

create policy "Psicóloga atualiza seus próprios pacientes"
  on public.pacientes for update
  using (auth.uid() = psicologo_id);

create policy "Psicóloga exclui seus próprios pacientes"
  on public.pacientes for delete
  using (auth.uid() = psicologo_id);


-- ============================================================
-- Tabela: cobrancas
-- ============================================================
create table public.cobrancas (
  id              uuid        not null default gen_random_uuid(),
  paciente_id     uuid        not null references public.pacientes (id) on delete cascade,
  psicologo_id    uuid        not null references public.profiles (id) on delete cascade,
  valor           numeric     not null,
  status          text        not null default 'enviada'
                              check (status in ('enviada', 'paga', 'ignorada')),
  data_envio      timestamptz not null default now(),
  data_vencimento date        not null,
  created_at      timestamptz not null default now(),
  primary key (id)
);

alter table public.cobrancas enable row level security;

create policy "Psicóloga vê suas próprias cobranças"
  on public.cobrancas for select
  using (auth.uid() = psicologo_id);

create policy "Psicóloga insere suas próprias cobranças"
  on public.cobrancas for insert
  with check (auth.uid() = psicologo_id);

create policy "Psicóloga atualiza suas próprias cobranças"
  on public.cobrancas for update
  using (auth.uid() = psicologo_id);

create policy "Psicóloga exclui suas próprias cobranças"
  on public.cobrancas for delete
  using (auth.uid() = psicologo_id);
