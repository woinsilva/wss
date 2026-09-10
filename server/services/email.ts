import type { QuotePayload } from '~~/shared/utils/quoteSchema'

export interface EmailService { sendQuote(payload: QuotePayload): Promise<void> }
interface EmailContent { subject: string, html: string, text: string }

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!)
}

function touchText(touch: QuotePayload['utmFirstTouch']): string {
  if (!touch) return 'Not captured'
  return [touch.source, touch.medium, touch.campaign].filter(Boolean).join(' / ') || touch.referrer || 'Direct'
}

export function buildQuoteEmails(payload: QuotePayload): { internal: EmailContent, confirmation: EmailContent } {
  const name = escapeHtml(payload.name)
  const project = escapeHtml(payload.projectType)
  const internalText = `New quote request\nName: ${payload.name}\nCompany: ${payload.company || '-'}\nEmail: ${payload.email}\nPhone: ${payload.phone || '-'}\nProject: ${payload.projectType}\nTimeline: ${payload.timeline || '-'}\nBudget: ${payload.budget || '-'}\nHow found: ${payload.howFound || '-'}\n\nDescription:\n${payload.description}\n\nFirst touch: ${touchText(payload.utmFirstTouch)}\nLast touch: ${touchText(payload.utmLastTouch)}`
  const internal = {
    subject: `[NOVO ORÇAMENTO] ${payload.projectType} - ${payload.name}`,
    text: internalText,
    html: `<h1>New quote request</h1><p><strong>Name:</strong> ${name}</p><p><strong>Company:</strong> ${escapeHtml(payload.company || '-')}</p><p><strong>Email:</strong> ${escapeHtml(payload.email)}</p><p><strong>Phone:</strong> ${escapeHtml(payload.phone || '-')}</p><p><strong>Project:</strong> ${project}</p><p><strong>Timeline:</strong> ${escapeHtml(payload.timeline || '-')}</p><p><strong>Budget:</strong> ${escapeHtml(payload.budget || '-')}</p><h2>Description</h2><p>${escapeHtml(payload.description).replace(/\n/g, '<br>')}</p><h2>Attribution</h2><p><strong>First touch:</strong> ${escapeHtml(touchText(payload.utmFirstTouch))}</p><p><strong>Last touch:</strong> ${escapeHtml(touchText(payload.utmLastTouch))}</p>`,
  }
  const english = payload.locale === 'en'
  const confirmation = english
    ? { subject: 'We received your request — WSS IT', text: `Hello, ${payload.name}.\n\nWe received your request regarding ${payload.projectType}. We will review the information and contact you to better understand your project.\n\nWSS IT\nSoftware • AI • Integrations`, html: `<p>Hello, ${name}.</p><p>We received your request regarding <strong>${project}</strong>. We will review the information and contact you to better understand your project.</p><p>WSS IT<br>Software • AI • Integrations</p>` }
    : { subject: 'Recebemos sua solicitação — WSS IT', text: `Olá, ${payload.name}.\n\nRecebemos sua solicitação referente a ${payload.projectType}. Analisaremos as informações enviadas e entraremos em contato para entender melhor o projeto.\n\nWSS IT\nSoftware • AI • Integrations`, html: `<p>Olá, ${name}.</p><p>Recebemos sua solicitação referente a <strong>${project}</strong>. Analisaremos as informações enviadas e entraremos em contato para entender melhor o projeto.</p><p>WSS IT<br>Software • AI • Integrations</p>` }
  return { internal, confirmation }
}

export class ResendEmailService implements EmailService {
  constructor(private readonly apiKey: string, private readonly from: string, private readonly destination: string) {}

  async sendQuote(payload: QuotePayload): Promise<void> {
    const { internal, confirmation } = buildQuoteEmails(payload)
    const response = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        'content-type': 'application/json',
        'x-batch-validation': 'strict',
      },
      body: JSON.stringify([
      { from: this.from, to: this.destination, reply_to: payload.email, ...internal },
      { from: this.from, to: payload.email, ...confirmation },
      ]),
    })
    if (!response.ok) throw new Error(`Email provider rejected request with status ${response.status}`)
  }
}
