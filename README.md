# DS Tokens Setup

Plataforma web para **criar, validar e exportar Design Tokens** de forma colaborativa — com verificação automática de acessibilidade WCAG 2.1 e exportação sincronizada para Figma e código.

> _“Figma Variables + verificação de contraste + export para Mantine, num só fluxo.”_

---

## O que a plataforma faz

DS Tokens Setup resolve três dores comuns em times de produto:

1. **Tokens divergentes entre Figma e código.** O contrato é único, salvo no projeto, e exportado a partir da mesma fonte para os dois lados.
2. **Paletas que falham em WCAG ao virar interface real.** A plataforma replica o slot mapping do Mantine e ajusta automaticamente a luminosidade das cores até atingir o ratio de contraste exigido (AA ou AAA).
3. **Falta de padrão na distribuição dos tokens.** Um único clique gera código Mantine, variáveis Figma por categoria ou um ZIP com tudo.

Cada usuário cria projetos isolados, convida membros por time, edita os tokens em um editor visual com preview de componentes reais, valida o contraste e exporta o resultado.

---

## Funcionalidades

### Autenticação e colaboração
- Cadastro, login, recuperação de senha e magic link via **Supabase Auth**.
- Templates de email transacional customizados.
- **Times** com convite de membros.
- **Gestão de usuários** (admin) e **perfil pessoal**.
- Isolamento por projeto garantido por **RLS no banco** — não pelo frontend.

### Editor de Tokens
Interface em abas dentro de um `AppShell` Mantine:

| Aba | Função |
|---|---|
| **Settings** | Nome, descrição, logo, dados do projeto. |
| **Colors** | Configurador de paletas com geração de 10 shades por família (`brand`, `accent`, `tertiary`, `gray`) + feedback (`error`, `success`, `warning`, `info`). |
| **Radius** | Escala (`none`/`xs`/`sm`/`md`/`lg`/`xl`/`full`) + mapeamento por componente (button, input, card, modal, badge, pill). |
| **Typography** | Fontes (base + mono, suporte a Google Fonts e fontes custom), 10 tamanhos (`xs` a `6xl`), pesos. |
| **Spacing** | Escala de 8 níveis (`none` a `2xl`). |
| **Shadows** | Editor visual de elevação (`xs` a `xl`) com `x`, `y`, `blur`, `spread`. |
| **Preview** | Renderiza componentes Mantine reais (forms, dados, layouts, tipografia) consumindo os tokens em tempo real. |
| **Contrast** | Checker WCAG por par fg/bg, com relatório de cada combinação testada. |
| **Export** | Gera os formatos prontos para consumo externo. |

Header fixo com **Salvar**, **Resetar para padrão**, **Voltar** e o seletor de alvo WCAG (**AA** / **AAA**).

### Validação WCAG automática
- Replica o slot mapping do Mantine (`filled`, `light`, `outline`, `subtle`) — então valida o **mesmo pixel** que o usuário verá.
- Para cada par foreground × background (texto sobre botão, ícone sobre card, borda sobre superfície, feedback…), calcula o contraste real.
- Se o ratio não atinge o alvo, **ajusta a luminosidade HSL** preservando matiz e saturação até passar.
- Gera relatório completo: ratio exigido, ratio obtido, se passou, se foi ajustado.
- O resultado validado alimenta o preview e os exports — três visões sempre coerentes.

### Exportação multi-destino
| Destino | Formato |
|---|---|
| **Mantine** | Código TypeScript pronto para colar no `createTheme`. |
| **Figma — Cores** | JSON de variáveis com modos (light/dark) e referências. |
| **Figma — Radius / Spacing / Typography / Shadows** | JSONs categorizados, prontos para o plugin de import. |
| **Projeto completo** | ZIP empacotado via JSZip. |

Toda exportação é 100% client-side — nenhum dado sai do navegador.

---

## Stack técnica

- **React 19** + **TypeScript** (strict)
- **Vite 8** — bundler e dev server
- **Mantine 9** — core, form, hooks, notifications
- **@tabler/icons-react** — ícones
- **React Hook Form** + **Zod** + `@hookform/resolvers` — formulários e validação
- **TanStack Query 5** — estado servidor
- **Supabase** — Auth, Postgres (RLS), Storage
- **JSZip** — empacotamento de exports
- **ESLint 9** + **Prettier 3** — qualidade

---

## Arquitetura

```
UI (Mantine, feature-based)
   ↓
Hooks de feature (TanStack Query + Context)
   ↓
Domínio puro (src/lib — contrast, semantic-tokens, exports)
   ↓
Services (Supabase)
   ↓
Postgres + Auth + Storage (RLS sempre ativo)
```

Convenções estruturais:

- **Feature-based**: cada domínio em `src/features/<nome>/` com `components/`, `hooks/`, `services/`, `schemas/`, `types/`.
- **UI nunca chama Supabase direto** — sempre via hook → service.
- **Domínio puro** em `src/lib/` (sem React, Mantine ou Supabase) — testável isoladamente.
- **Tipagem fim a fim**: tipos do banco gerados em `src/lib/supabase/database.types.ts`; modelo de tokens em `src/types/tokens.ts`.
- **Path alias** `@/` → `src/`.

### Estrutura

```
src/
├── app/                  Bootstrap e composição de providers
├── providers/            Auth, Query, Theme, Tokens, WcagMode
├── features/
│   ├── auth/             Login, signup, landing
│   ├── dashboard/        Métricas e listagem
│   ├── projects/         CRUD de projetos
│   ├── tokens/           Editor de tokens (núcleo)
│   ├── teams/            Gestão de times
│   └── users/            Perfil e admin
├── lib/
│   ├── supabase/         Client + tipos gerados
│   ├── contrast.ts       WCAG 2.1 (luminância, ratio, ajuste HSL)
│   ├── semantic-tokens.ts Derivação semântica + validação
│   ├── default-tokens.ts Tokens iniciais
│   ├── figma-export.ts   Export Figma (radius/spacing/typography/shadows)
│   ├── figma-color-export.ts Export Figma — cores avançadas
│   ├── mantine-export.ts Export código Mantine
│   ├── mantine-tokens.ts Tokens auxiliares Mantine
│   ├── project-export.ts Empacotamento ZIP
│   └── query-client.ts   Config TanStack Query
├── services/             Services globais (projects)
├── shared/               Componentes/hooks/utils cross-feature
├── schemas/              Schemas Zod globais
├── styles/global.css
└── types/                Modelo de tokens e barrel
```

---

## Segurança (regras não negociáveis)

- `service_role` **jamais** no frontend; apenas `anon key`.
- **RLS ativado em toda tabela**, com policies por operação.
- Autorização **nunca** confiada ao React — toda regra crítica vive no banco ou em Edge Function.
- **Zod** valida nas bordas (formulários e respostas críticas).
- Erros são traduzidos antes de chegar à UI — nada do tipo `relation "projects" does not exist` vaza para o usuário.
- Proibido: `dangerouslySetInnerHTML`, `eval`, secrets em `localStorage`.
- Sessão Supabase gerenciada pelo próprio SDK.

---

## Como rodar

### Pré-requisitos
- Node.js 20+
- Conta Supabase (URL + `anon key`)

### Setup

```powershell
# 1. Instalar dependências
npm install

# 2. Criar .env (copiar do exemplo)
Copy-Item .env.example .env

# 3. Preencher .env
# VITE_SUPABASE_URL=https://...supabase.co
# VITE_SUPABASE_ANON_KEY=...

# 4. Rodar
npm run dev
```

Acesse `http://localhost:5173`.

### Scripts

| Script | Função |
|---|---|
| `npm run dev` | Vite em modo desenvolvimento |
| `npm run build` | `tsc -b` + `vite build` (produção) |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier escrevendo arquivos |
| `npm run format:check` | Prettier verificação |

### Scripts auxiliares

- `scripts/audit-semantic-pairs.mjs` — auditoria de pares semânticos.
- `scripts/realign-figma-semantic-map.mjs` — realinhamento Figma ↔ semântico.

---

## Fluxo de uso (usuário final)

1. **Cadastro / Login**
2. **Criar projeto** (nome + logo opcional + acesso de times/usuários)
3. **Editor abre automaticamente** no projeto recém-criado
4. Configurar **cores → raio → tipografia → espaçamento → sombras**
5. Visualizar componentes reais no **Preview**
6. Rodar **Contrast Checker** (AA / AAA)
7. **Salvar** no projeto
8. **Exportar** para Mantine, Figma ou ZIP

---

## Modelo de tokens

```ts
interface DesignTokens {
  colors: DesignTokenColors;     // 4 paletas + 4 feedback (10 shades cada)
  radius: DesignTokenRadius;     // escala + mapeamento por componente
  typography: DesignTokenTypography;
  spacing: DesignTokenSpacing;
  shadows: DesignTokenShadows;
}
```

Cada paleta é uma **tupla tipada de 10 hex strings**, garantindo que `palette[5]` tenha significado em tempo de compilação. O objeto inteiro é serializável como JSON e persistido no campo `tokens_data` (`jsonb`) da tabela `projects`.

---

## Roadmap

- Versionamento de tokens (histórico, diff entre releases).
- Comentários e revisão dentro do projeto.
- Tokens semânticos editáveis (hoje são derivados).
- Plugin Figma para sincronização bidirecional.
- Export para Tailwind, CSS Variables puro, iOS, Android.

---

## Licença

Uso interno. Veja `package.json` para detalhes.
