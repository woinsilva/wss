import {
  siAngular,
  siCamunda,
  siDatadog,
  siDocker,
  siDotnet,
  siGit,
  siGithubactions,
  siHibernate,
  siHtml5,
  siJavascript,
  siKubernetes,
  siLinux,
  siMongodb,
  siNodedotjs,
  siNuxt,
  siOpenapiinitiative,
  siOpenjdk,
  siPostgresql,
  siPrometheus,
  siRabbitmq,
  siRedis,
  siSonarqubeserver,
  siSpring,
  siTypescript,
  siVuedotjs,
  siXml,
} from 'simple-icons'

export interface TechIcon {
  path: string
  /** Official brand color (hex, without #), applied on hover. */
  hex: string
}

const icon = (i: { path: string, hex: string }): TechIcon => ({ path: i.path, hex: i.hex })

/**
 * Brand icons (simple-icons, CC0) keyed by the labels used in i18n.
 * Labels without an entry fall back to a monogram where a fallback is requested.
 */
const icons: Record<string, TechIcon> = {
  'TypeScript': icon(siTypescript),
  'JavaScript': icon(siJavascript),
  'Java': icon(siOpenjdk),
  'Vue.js': icon(siVuedotjs),
  'Nuxt': icon(siNuxt),
  'Angular': icon(siAngular),
  'HTML5 / CSS3': icon(siHtml5),
  'Node.js': icon(siNodedotjs),
  'Spring': icon(siSpring),
  'REST APIs': icon(siOpenapiinitiative),
  'APIs': icon(siOpenapiinitiative),
  'Camunda BPMN': icon(siCamunda),
  'RabbitMQ': icon(siRabbitmq),
  'Redis': icon(siRedis),
  'Entity Framework': icon(siDotnet),
  'NHibernate': icon(siHibernate),
  'MongoDB': icon(siMongodb),
  'Aggregation Pipelines': icon(siMongodb),
  'PostgreSQL': icon(siPostgresql),
  'Docker': icon(siDocker),
  'Kubernetes': icon(siKubernetes),
  'Linux': icon(siLinux),
  'CI/CD': icon(siGithubactions),
  'GitFlow': icon(siGit),
  'SonarQube': icon(siSonarqubeserver),
  'Datadog': icon(siDatadog),
  'Prometheus': icon(siPrometheus),
  'XML': icon(siXml),
}

export function techIcon(label: string): TechIcon | undefined {
  return icons[label]
}

/** Two-character monogram for technologies without a brand icon (e.g. "C#", "SQL Server" → "SS"). */
export function techMonogram(label: string): string {
  if (label.length <= 3 && !label.includes(' ')) return label.slice(0, 2)
  const words = label.split(/[\s/]+/).filter(Boolean)
  return words.length > 1 ? (words[0]![0]! + words[1]![0]!) : label.slice(0, 2)
}

/** Technologies shown in the home page marquee (all with brand icons). */
export const marqueeTechnologies = [
  'TypeScript', 'Node.js', 'Vue.js', 'Nuxt', 'Angular', 'Java', 'Spring', 'MongoDB', 'PostgreSQL',
  'Redis', 'RabbitMQ', 'Docker', 'Kubernetes', 'Datadog', 'Prometheus', 'SonarQube', 'Camunda BPMN',
]
