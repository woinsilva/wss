export interface AccentPart { text: string, accent: boolean }

/** Splits "a *b* c" into plain and accent parts; odd segments between asterisks are accents. */
export function splitAccent(text: string): AccentPart[] {
  return text.split('*').map((segment, index) => ({ text: segment, accent: index % 2 === 1 })).filter(part => part.text)
}

/** Removes the accent markers, for aria-labels, meta tags and structured data. */
export function stripAccent(text: string): string {
  return text.replaceAll('*', '')
}
