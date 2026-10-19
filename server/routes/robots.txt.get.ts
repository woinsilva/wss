export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  if (!config.public.siteIndexable) return 'User-agent: *\nDisallow: /\n'
  return `User-agent: *\nAllow: /\n\nSitemap: ${config.public.siteUrl}/sitemap_index.xml\n`
})
