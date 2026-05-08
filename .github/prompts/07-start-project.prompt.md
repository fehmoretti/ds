# Start Project — React + Supabase + Mantine

Quero iniciar um novo projeto utilizando o pipeline configurado neste repositório.

Antes de gerar qualquer código:

1. Leia `.github/copilot-instructions.md`.
2. Siga o fluxo de arquitetura e segurança do projeto.
3. Use Mantine como biblioteca visual padrão.
4. Não ignore nenhuma regra de segurança.

Stack obrigatória:

- React
- TypeScript
- Vite
- Mantine
- Supabase
- TanStack Query
- Zod
- React Hook Form

Objetivo inicial:
Criar a estrutura base do projeto e uma página de exemplo apenas para validar:

- arquitetura
- integração do Mantine
- organização de pastas
- funcionamento do Supabase client
- providers globais
- responsividade
- padrão visual

Fluxo obrigatório:

1. Primeiro apresente:
   - estrutura de pastas
   - arquitetura inicial
   - providers necessários
   - estratégia de integração Supabase
   - riscos técnicos iniciais
2. Depois implemente.

Estrutura esperada:

- src/app
- src/features
- src/shared
- src/services
- src/lib

Regras obrigatórias:

- Usar Mantine para a UI.
- Não usar `any` sem justificativa.
- Não usar estilos inline desnecessários.
- Separar componentes, hooks, services e schemas.
- Criar loading state.
- Criar error state.
- Criar empty state.
- Preparar o projeto para multi-tenant no futuro.
- Configurar ESLint e Prettier.
- Preparar aliases de import.
- Configurar environment variables corretamente.
- Nunca expor service_role.
- Configurar Supabase client isolado em `/src/lib/supabase`.

Página de exemplo:
Criar uma página `DashboardExample` para validação visual e técnica contendo:

1. Header
- Logo textual
- Avatar do usuário
- Botão de ação principal

2. Cards
- 4 cards de métricas usando Mantine
- Ícones
- Valores mockados

3. Tabela
- Tabela responsiva
- Estado vazio
- Estado loading
- Badge de status

4. Formulário
- React Hook Form
- Zod
- Inputs Mantine
- Select
- Textarea
- Feedback de erro

5. Modal
- Modal Mantine
- Confirmação de ação

6. Responsividade
- Desktop
- Tablet
- Mobile

7. Organização
Criar:
- components/
- hooks/
- services/
- schemas/
- types/

8. Supabase
Criar:
- supabase client
- exemplo seguro de query
- mock de auth provider
- estrutura preparada para RLS

9. Revisão final
Depois da implementação:
- revise arquitetura
- revise segurança
- revise Mantine
- revise acessibilidade
- revise responsividade
- revise organização

No final:
1. Liste os arquivos criados.
2. Explique decisões importantes.
3. Liste possíveis melhorias futuras.
4. Liste riscos técnicos identificados.
