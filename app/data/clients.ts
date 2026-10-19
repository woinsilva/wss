/**
 * Companies from the founder's career shown on the home page. Logos live in public/brand/clients
 * (sources in SOURCES.md). `wordmark` logos already spell the name, so the name is not repeated next to them.
 */
export interface Client {
  name: string
  logo?: string
  wordmark?: boolean
}

export const clients: Client[] = [
  { name: 'HSBC', logo: '/brand/clients/hsbc.svg' },
  { name: 'Caixa Econômica Federal', logo: '/brand/clients/caixa.svg', wordmark: true },
  { name: 'Banco Votorantim', logo: '/brand/clients/banco-bv.svg' },
  { name: 'RCI Banque (Renault)', logo: '/brand/clients/renault.svg' },
  { name: 'Philips', logo: '/brand/clients/philips.svg', wordmark: true },
  { name: 'Lorenzetti', logo: '/brand/clients/lorenzetti.svg', wordmark: true },
  { name: 'RE/MAX', logo: '/brand/clients/remax.svg', wordmark: true },
  { name: 'Finaxis', logo: '/brand/clients/finaxis.svg', wordmark: true },
]
