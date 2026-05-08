# React + Supabase + Mantine Secure Pipeline

Pacote de configuração para usar GitHub Copilot no VS Code com um pipeline seguro de desenvolvimento.

## Inclui

- Instruções globais do Copilot
- Prompts por etapa
- Pipeline React + Supabase
- Prompt de revisão de segurança
- Prompt de revisão Mantine
- Prompt para iniciar projeto com página de exemplo
- `.env.example`

## Como usar

1. Copie a pasta `.github` para a raiz do seu projeto.
2. Copie o `.env.example`.
3. No VS Code, use o Copilot Chat com os prompts da pasta `.github/prompts`.
4. Comece pelo `07-start-project.prompt.md`.

## Fluxo recomendado

1. `01-architecture.prompt.md`
2. `02-supabase-security.prompt.md`
3. `03-react-module.prompt.md`
4. `06-mantine-ui.prompt.md`
5. `04-code-review.prompt.md`
6. `05-qa-abuse-tests.prompt.md`

## Observação

Esta versão não usa arquivos customizados de tema Mantine. O Mantine é usado como biblioteca visual padrão, sem contrato visual externo.
