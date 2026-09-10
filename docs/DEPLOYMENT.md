# Deploy no Cloudflare Pages

Este projeto usa o preset `cloudflare-pages` do Nitro e gera um diretório `dist/` com páginas pré-renderizadas e o Worker que atende `/api/quote`.

Referências oficiais: [Nuxt no Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/) e [configuração do Wrangler](https://developers.cloudflare.com/workers/wrangler/configuration/).

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
- `NUXT_PUBLIC_SITE_URL` — `https://wssit.com.br` em produção

Não coloque valores reais em `.env.example`, no `wrangler.jsonc` ou no repositório.

## 4. Primeiro deploy e domínio

1. Dispare o deploy da branch `main` e confirme que o build termina com o diretório `dist`.
2. Adicione `wssit.com.br` em **Custom domains**.
3. Adicione também `www.wssit.com.br` se for utilizá-lo e escolha uma única origem canônica para redirecionamento.
4. Atualize a lista de hostnames do Turnstile.
5. Confirme que `NUXT_PUBLIC_SITE_URL` corresponde exatamente ao domínio canônico.

## 5. Checklist pós-publicação

- Abra `/`, `/en`, uma página de serviço em cada idioma e as páginas legais.
- Confirme `https://wssit.com.br/sitemap_index.xml` e `/robots.txt`.
- Envie um orçamento real controlado e valide os dois e-mails: interno e confirmação.
- Confirme que um token Turnstile inválido retorna erro sem enviar e-mail.
- Verifique canonical, `hreflang`, Open Graph e JSON-LD no HTML publicado.
- Cadastre o sitemap no Google Search Console.
- Valide o stream do GA4 em tempo real, quando `NUXT_PUBLIC_GA_ID` estiver configurado.
- Confira os logs do Pages Functions sem registrar dados pessoais do formulário.

## 6. Rollback

Cada push gera um deployment imutável no Pages. Em **Deployments**, selecione uma versão saudável anterior e promova-a para produção. Depois, corrija a branch `main`; evite alterar segredos apenas para contornar uma regressão de código.
