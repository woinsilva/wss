# WSS IT

Site institucional bilíngue da WSS IT, construído com Nuxt 4 e preparado para Cloudflare Pages. O projeto combina páginas pré-renderizadas para performance e SEO com uma função serverless para recebimento seguro de solicitações de orçamento.

## Stack

- Nuxt 4, Vue 3 e TypeScript estrito
- Tailwind CSS 4 e tokens CSS próprios
- `@nuxtjs/i18n` com rotas nativas em português e inglês
- Zod para validação compartilhada entre cliente e servidor
- Cloudflare Turnstile e envio de e-mail pela API da Resend
- Vitest, cobertura V8 e Playwright

## Requisitos

- Node.js 22.22.2 ou mais recente
- npm 10 ou mais recente

## Ambiente local

```bash
npm ci
cp .env.example .env
npm run dev
```

No PowerShell, copie o ambiente com `Copy-Item .env.example .env`. O servidor local fica disponível em `http://localhost:3000`.

As credenciais reais nunca devem ser commitadas. Para testar o envio completo do formulário, configure no `.env` uma chave Turnstile, uma chave Resend e um remetente pertencente a um domínio validado na Resend.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run lint` | Análise estática com ESLint |
| `npm run typecheck` | Verificação TypeScript estrita |
| `npm test` | Testes unitários e de integração |
| `npm run test:coverage` | Testes com relatório e limites de cobertura |
| `npm run test:e2e` | Cenários de navegador e API no Chromium |
| `npm run validate` | Lint, testes, typecheck e build de produção |
| `npm run build` | Build híbrido para Cloudflare Pages em `dist/` |
| `npm run deploy` | Build e upload direto com Wrangler |
| `npm run assets:generate` | Regenera os PNGs de marca a partir dos SVGs |

Na primeira execução local dos E2E, instale o navegador com:

```bash
npx playwright install chromium
```

## Estrutura

- `app/`: páginas, layouts, componentes, dados e composables
- `i18n/locales/`: conteúdo completo em `pt-BR` e `en`
- `shared/`: schema Zod compartilhado do orçamento
- `server/api/quote.post.ts`: endpoint serverless do formulário
- `server/services/`: adaptadores de integração externa
- `tests/unit/` e `tests/e2e/`: suíte automatizada
- `public/`: favicon, Open Graph, robots e demais ativos públicos

As páginas públicas são pré-renderizadas. O endpoint `/api/quote` continua dinâmico e executa no runtime do Cloudflare Pages.

## Variáveis de ambiente

Consulte [.env.example](.env.example). Variáveis sem o prefixo `PUBLIC` ficam disponíveis apenas no servidor; as variáveis `NUXT_PUBLIC_*` são incorporadas ou expostas ao cliente. As chaves de API e validação devem ser cadastradas como segredos.

| Variável | Uso |
| --- | --- |
| `NUXT_RESEND_API_KEY` | Autenticação da API Resend |
| `NUXT_QUOTE_FROM_EMAIL` | Remetente validado do orçamento |
| `NUXT_QUOTE_DESTINATION_EMAIL` | Caixa interna que recebe os leads |
| `NUXT_TURNSTILE_SECRET_KEY` | Validação server-side do Turnstile |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Widget Turnstile no formulário |
| `NUXT_PUBLIC_GA_ID` | ID opcional do Google Analytics 4 |
| `NUXT_PUBLIC_SITE_URL` | Origem canônica, sitemap e Open Graph |

## Qualidade e segurança

O endpoint limita o corpo a 50 KiB, valida JSON com schema estrito, aceita telefone internacional, usa honeypot, valida Turnstile e sanitiza campos livres antes do envio. Falhas do provedor não expõem detalhes ao visitante.

O CI executa lint, testes, cobertura, typecheck, build e E2E. Antes de abrir um pull request, rode:

```bash
npm run validate
npm run test:e2e
```

## Deploy

O procedimento completo, variáveis, domínio e checklist pós-publicação estão em [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

Resumo para a integração Git do Cloudflare Pages:

- Repositório: `woinsilva/wss`
- Branch de produção: `main`
- Comando de build: `npm run build`
- Diretório de saída: `dist`

## Licença

Código privado/proprietário da WSS IT. Nenhuma licença de redistribuição é concedida por padrão.
