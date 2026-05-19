# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Non-standard Next.js version

This project uses Next.js 16.2.6 — a version that may have breaking changes from what you know. APIs, conventions, and file structure may differ from training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

All commands must be run from the `vitallink/` subdirectory.

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`)
- **Geist** font (sans + mono) loaded via `next/font/google`

## Architecture

The project is a standard App Router setup under `src/app/`:

- `layout.tsx` — root layout; sets up Geist font CSS variables and base body classes
- `page.tsx` — home page (currently the default Next.js scaffold)
- `globals.css` — global styles entry point for Tailwind

No custom routing, API routes, or data fetching patterns have been established yet.

Atualize o CLAUDE.md adicionando as seguintes informações do projeto:

## Sobre o VitalLink

SaaS para psicólogos autônomos gerenciarem cobranças e follow-ups de pacientes.
O produto resolve o problema de inadimplência e constrangimento de cobrar pessoalmente.

## Cores e identidade visual

- Teal (primária): #00B3A4
- Navy (secundária): #05326D
- Background: #F9FAFB
- Branco: #FFFFFF
- Fonte: Inter

## MVP — Telas a construir (nessa ordem)

1. Login e cadastro do psicólogo (email + senha via Supabase Auth)
2. Cadastro de paciente (nome, WhatsApp, valor da sessão, dia de vencimento)
3. Painel principal com lista de pacientes e status de pagamento:
   - Em dia (verde)
   - Pendente (amarelo)
   - Atrasado (vermelho)

## Integrações futuras (não construir agora)

- Asaas para pagamentos
- Z-API para WhatsApp automático
- n8n para automações

## Regras

- Manter o código simples e limpo
- Componentes em português
- Sem funcionalidades além do MVP definido acima
