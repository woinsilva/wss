import { describe, expect, it } from 'vitest'
import { splitAccent, stripAccent } from '../../app/utils/accent'

describe('accent text', () => {
  it('splits plain and accent segments', () => {
    expect(splitAccent('Somos *parceiros*, não só fornecedores.')).toEqual([
      { text: 'Somos ', accent: false },
      { text: 'parceiros', accent: true },
      { text: ', não só fornecedores.', accent: false },
    ])
  })

  it('handles text without markers and leading accents', () => {
    expect(splitAccent('Sem destaque')).toEqual([{ text: 'Sem destaque', accent: false }])
    expect(splitAccent('*Engenharia* sênior')).toEqual([
      { text: 'Engenharia', accent: true },
      { text: ' sênior', accent: false },
    ])
  })

  it('strips the markers', () => {
    expect(stripAccent('Perguntas *frequentes*')).toBe('Perguntas frequentes')
  })
})
