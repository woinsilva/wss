# Deploy no Cloudflare Pages

Este projeto usa o preset `cloudflare-pages` do Nitro e gera um diretório `dist/` com páginas pré-renderizadas e o Worker que atende `/api/quote`.

Referências oficiais: [Nuxt no Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/) e [configuração do Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/).

## Publicação no domínio próprio

O projeto Pages é `wss-it-teste`, na conta da empresa. Endereço oficial: `https://wssitconsultoria.com.br`. A variante `www.wssitconsultoria.com.br` também está associada ao Pages.

Para republicar pelo PowerShell, com o Wrangler autorizado:

```powershell
npm run build:preview
npx wrangler pages deploy dist --project-name wss-it-teste --branch main --commit-dirty=true
```

O build usa as variáveis públicas do `wrangler.jsonc`, mantendo canonical, Open Graph e dados estruturados no domínio oficial. `NUXT_PUBLIC_SITE_INDEXABLE=true` permite a indexação. Para uma implantação de teste separada, use `false` e configure sua origem canônica.

Nesta versão, `NUXT_PUBLIC_QUOTE_DELIVERY_MODE=formsubmit` valida os campos e encaminha o visitante ao formulário hospedado, que realiza a verificação de segurança e envia o orçamento por e-mail. A caixa da empresa precisa confirmar a ativação do provedor. O modo alternativo `email-client` prepara uma mensagem para envio pelo aplicativo do visitante. O endpoint Resend permanece protegido por Turnstile e só será utilizado no modo `server`.

Para testar o site publicado sem iniciar servidor local:

```powershell
$env:PLAYWRIGHT_BASE_URL = 'https://wss-it-teste.pages.dev'
$env:NUXT_PUBLIC_QUOTE_DELIVERY_MODE = 'formsubmit'
npm run test:e2e
```

A reserva criada em Sites, identificada em `.openai/hosting.json`, não é a hospedagem ativa deste projeto e não foi publicada. A hospedagem ativa é Cloudflare Pages.

## 1. Preparar os serviços externos

### Resend

1. Adicione e valide o domínio que será usado como remetente.
2. Crie uma API key restrita ao envio de e-mails.
3. Defina `NUXT_QUOTE_FROM_EMAIL` com um endereço do domínio validado.

### Cloudflare Turnstile

1. Crie um widget para os domínios de produção e preview necessários.
2. Guarde a site key e a secret key separadamente.
3. Para desenvolvimento, use as chaves de teste oficiais do Turnstile ou credenciais de um widget autorizado para localhost.

## 2. Criar o projeto Pages pela integração Git

No painel da Cloudflare, abra **Workers & Pages**, crie uma aplicação Pages e importe `woinsilva/wss` do GitHub.

Configure:

| Campo | Valor |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

O arquivo `wrangler.jsonc` fixa o nome técnico, o diretório de saída e a data de compatibilidade do runtime.

## 3. Configurar variáveis

Cadastre as variáveis abaixo em **Settings > Variables and Secrets**. Repita a configuração no ambiente de Preview quando quiser validar o fluxo completo antes da produção.

### Segredos

- `NUXT_RESEND_API_KEY`
- `NUXT_TURNSTILE_SECRET_KEY`

### Variáveis de texto

- `NUXT_QUOTE_FROM_EMAIL`
- `NUXT_QUOTE_DESTINATION_EMAIL`
- `NUXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NUXT_PUBLIC_GA_ID` — opcional
- `NUXT_PUBLIC_SITE_URL` — endereço real da hospedagem ou domínio adquirido
- `NUXT_PUBLIC_SITE_INDEXABLE` — `false` no teste; `true` quando o site definitivo estiver pronto
- `NUXT_PUBLIC_QUOTE_DELIVERY_MODE` — `server` para Resend; `email-client` para preparar uma mensagem; `formsubmit` para o formulário hospedado com verificação de segurança

Não coloque valores reais em `.env.example`, no `wrangler.jsonc` ou no repositório.

## 4. Primeiro deploy e domínio

### Domínio próprio configurado (20/10/2026)

- Domínio registrado na Hostinger: `wssitconsultoria.com.br`.
- Zona criada no plano Free da mesma conta Cloudflare do Pages.
- Nameservers salvos na Hostinger: `byron.ns.cloudflare.com` e `pat.ns.cloudflare.com`.
- Registros `autoconfig` e `autodiscover` importados como DNS only; não há serviço de e-mail do domínio configurado.
- Nameservers propagados e domínio principal e `www` associados ao projeto Pages; o apontamento de estacionamento foi substituído por CNAME para `wss-it-teste.pages.dev`.
- HTTPS validado nos dois hostnames com verificação normal do certificado, usando os IPs retornados pelo DNS autoritativo da Cloudflare. HTTP redireciona para HTTPS.
- Alguns resolvedores ainda podem manter o IP antigo em cache durante a propagação. A origem canônica passa a ser `https://wssitconsultoria.com.br`, com indexação habilitada.

1. Dispare o deploy da branch `main` e confirme que o build termina com o diretório `dist`.
2. Adicione o domínio adquirido em **Custom domains** depois que a zona estiver ativa na Cloudflare.
3. Adicione também a variante `www` se for utilizá-la e escolha uma única origem canônica para redirecionamento.
4. Atualize a lista de hostnames do Turnstile.
5. Confirme que `NUXT_PUBLIC_SITE_URL` corresponde exatamente ao domínio canônico.

## 5. Checklist pós-publicação

- Abra `/`, `/en`, uma página de serviço em cada idioma e as páginas legais.
- Confirme `/sitemap_index.xml` e `/robots.txt` no endereço publicado.
- Envie um orçamento real controlado e valide os dois e-mails: interno e confirmação.
- Confirme que um token Turnstile inválido retorna erro sem enviar e-mail.
- Verifique canonical, `hreflang`, Open Graph e JSON-LD no HTML publicado.
- Cadastre o sitemap no Google Search Console.
- Valide o stream do GA4 em tempo real, quando `NUXT_PUBLIC_GA_ID` estiver configurado.
- Confira os logs do Pages Functions sem registrar dados pessoais do formulário.

Ao ativar o envio automático, configure um remetente autorizado na Resend e as chaves Turnstile para o hostname publicado. Atualize `NUXT_PUBLIC_QUOTE_DELIVERY_MODE` para `server`, reconstrua as páginas e publique novamente. Variáveis públicas precisam existir no build por causa das páginas pré-renderizadas; alterar apenas o runtime não atualiza o formulário já gerado.

Como alternativa sem domínio, o modo `formsubmit` envia um formulário nativo para `https://formsubmit.co/wssitconsultoria@gmail.com`. Ele preserva a verificação de segurança do provedor e o honeypot, inclui os campos do orçamento e uma mensagem de confirmação. Antes de ativar esse modo na hospedagem, confirme o link que o FormSubmit envia para a caixa da empresa. Um teste automatizado intercepta a navegação e verifica os dados sem enviar e-mails reais; ele não comprova entrega na caixa de entrada.

## 6. Rollback

Cada push gera um deployment imutável no Pages. Em **Deployments**, selecione uma versão saudável anterior e promova-a para produção. Depois, corrija a branch `main`; evite alterar segredos apenas para contornar uma regressão de código.
