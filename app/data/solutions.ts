export interface SolutionDefinition {
  key: 'fintech' | 'mortgage'
  slugs: { 'pt-BR': string, en: string }
}

export const solutions: SolutionDefinition[] = [
  { key: 'fintech', slugs: { 'pt-BR': 'fintech', en: 'fintech' } },
  { key: 'mortgage', slugs: { 'pt-BR': 'mortgage-technology', en: 'mortgage-technology' } },
]

export function findSolutionBySlug(slug: string) {
  return solutions.find(solution => Object.values(solution.slugs).includes(slug))
}
