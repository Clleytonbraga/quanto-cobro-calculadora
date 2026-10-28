// Domínio puro do Fiz a Conta (ex-Quanto Cobro?): Business Rules v1.1.
// Dinheiro em centavos, tudo inteiro (QC-DEC-007). Horas do orçamento em MINUTOS (decisão de 2026-10-28: entrada "1h30");
// o mini-fluxo Estimar (meta e horas/semana) segue em centésimos.

export const LIMITS = { // ponytail: tetos técnicos §11 (QC-DEC-014), ajustáveis sem decisão de produto
  hourlyRate: 9_999_999, hours: 599_999, revisionCount: 99, revisionHoursPerRound: 59_999, // horas em minutos
  costs: 50, amount: 999_999_999, description: 120, commercialValue: 99_999_999_999,
  goal: 999_999_999, weekHours: 16_800, projectName: 120, longText: 2000,
}

export const MSG = { // Business Rules §13
  rate: 'Informe um valor por hora maior que zero.',
  exec: 'Informe as horas de execução para continuar.',
  negative: 'Use zero ou um valor positivo.',
  integer: 'Use um número inteiro de rodadas.',
  decimals: 'Use no máximo 2 casas decimais.',
  invalid: 'Digite um número, por exemplo 12,5.',
  costValue: 'Informe o valor deste custo.',
  costDesc: 'Adicione uma descrição para incluir este custo na proposta.',
  projectName: 'Informe o nome do projeto.',
  scopeSummary: 'Descreva o escopo em poucas palavras.',
  week: 'Informe quantas horas por semana você consegue cobrar de clientes.',
  max: 'Valor acima do limite aceito pela calculadora.',
  commercial: 'Informe um valor maior que zero.',
  duration: 'Digite as horas, por exemplo 12 ou 1h30.',
  minutes: 'Depois do h, use de 0 a 59 minutos.',
}

export const roundDiv = (n, d) => Math.floor((2 * n + d) / (2 * d)) // metade para cima, n,d >= 0

// "1.234,56" | "1234.5" | "2.400" | "R$ 92,38" | "1,5 h" → centésimos inteiros.
// Retorna { value: int|null, error?: string }. Vazio → value null.
export function parseHundredths(raw, { max, integer = false } = {}) {
  let s = String(raw ?? '').replace(/R\$|h|\s/gi, '')
  if (s === '') return { value: null }
  if (s.startsWith('-')) return { value: null, error: MSG.negative }
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '') // "2.400" só pode ser milhar
  const m = s.match(/^(\d+)(?:\.(\d*))?$/)
  if (!m) return { value: null, error: MSG.invalid }
  const frac = m[2] ?? ''
  if (frac.length > 2) return { value: null, error: MSG.decimals }
  if (integer && frac.replace(/0/g, '') !== '') return { value: null, error: MSG.integer }
  const value = Number(m[1]) * 100 + Number(frac.padEnd(2, '0'))
  if (!Number.isSafeInteger(value) || (max != null && value > max)) return { value: null, error: MSG.max }
  return { value }
}

// "1h30" | "1h" | "12" | "1,5" | "1 h 30 min" → minutos inteiros. Sem h, o número vale horas (1,33 h arredonda para 80 min).
export function parseDuration(raw, { max } = {}) {
  const s = String(raw ?? '').replace(/\s/g, '')
  const m = s.match(/^(\d+)h(\d{1,2})(?:min)?$/i)
  if (m && +m[2] > 59) return { value: null, error: MSG.minutes }
  const r = m ? { value: +m[1] * 100 } : parseHundredths(s)
  if (r.error) return { value: null, error: r.error === MSG.invalid ? MSG.duration : r.error }
  if (r.value == null) return r
  const value = roundDiv(r.value * 60, 100) + (m ? +m[2] : 0)
  return max != null && value > max ? { value: null, error: MSG.max } : { value }
}

export function calculate(s) { // horas em minutos
  const revisionHours = (s.revisionCount ?? 0) * (s.revisionHoursPerRound ?? 0)
  const totalHours = (s.executionHours ?? 0) + revisionHours + (s.deadlineImpactHours ?? 0) + (s.reserveHours ?? 0)
  const costs = s.directCosts.reduce((sum, c) => sum + (c.amount ?? 0), 0)
  const laborExact = totalHours * (s.hourlyRate ?? 0)
  return {
    revisionHours, totalHours, costs,
    laborCents: roundDiv(laborExact, 60),
    referenceCents: roundDiv(laborExact + costs * 60, 60),
  }
}

export const hourlyReference = (goalCents, weekCentiHours) => roundDiv(goalCents * 10000, weekCentiHours * 433)

// Valor comercial (QC-DEC-008/015): acompanha a referência até ser editado.
export const commercialValue = (s, ref) => (s.commercialEdited && s.commercialValue != null ? s.commercialValue : ref)

// Erros bloqueantes por etapa (QC-DEC-005/011). Retorna { campo: mensagem }.
export function stepErrors(step, s) {
  const e = {}
  if (step === 1 && !(s.hourlyRate > 0)) e.hourlyRate = s.errors?.hourlyRate || MSG.rate
  if (step === 2 && !(s.executionHours > 0)) e.executionHours = s.errors?.executionHours || MSG.exec
  for (const k of ['revisionCount', 'revisionHoursPerRound', 'deadlineImpactHours'])
    if (step === 3 && s.errors?.[k]) e[k] = s.errors[k]
  if (step === 4 && s.errors?.reserveHours) e.reserveHours = s.errors.reserveHours // custos entram pelo modal, sempre válidos
  return e
}

// Proposta (QC-DEC-013/015, BR §8). Retorna { errors, text }.
export function proposal(s, p) {
  const errors = {}
  if (!p.projectName.trim()) errors.projectName = MSG.projectName
  if (!p.scopeSummary.trim()) errors.scopeSummary = MSG.scopeSummary
  const costs = s.directCosts
  costs.forEach((c, i) => { if (!c.description.trim()) errors['cost' + i] = MSG.costDesc })
  const ref = calculate(s).referenceCents
  const lines = [p.projectName.trim(), '', `Escopo: ${p.scopeSummary.trim()}`]
  const per = period(s)
  if (per) lines.push(`Período: ${per}`)
  else if (validDate(s.deliveryDate)) lines.push(`Entrega: ${formatDate(s.deliveryDate)}`)
  const rounds = s.revisionCount ?? 0
  if (rounds > 0) lines.push(`Revisões incluídas: ${rounds} ${rounds === 1 ? 'rodada' : 'rodadas'}`)
  if (costs.length) {
    lines.push('', 'Custos incluídos no valor:')
    for (const c of costs) lines.push(`- ${c.description.trim()}: ${money(c.amount)}`)
  }
  lines.push('', `Valor: ${money(commercialValue(s, ref))}`)
  if (p.notes.trim()) lines.push('', `Observações: ${p.notes.trim()}`)
  return { errors, text: lines.join('\n') }
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const num2 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })
export const money = cents => brl.format(cents / 100)
export const moneyShort = cents => (cents % 100 === 0 ? brl.format(cents / 100).replace(/,00$/, '') : money(cents))
export const hours = min => { const h = Math.floor(min / 60), m = min % 60; return m ? (h ? `${num2.format(h)} h ${m} min` : `${m} min`) : `${num2.format(h)} h` } // minutos → "1 h 30 min"
export const plainDuration = min => (min == null ? '' : `${Math.floor(min / 60)}${min % 60 ? 'h' + String(min % 60).padStart(2, '0') : ''}`) // minutos → "1h30" (input)
export const plain = centi => (centi == null ? '' : num2.format(centi / 100).replace(/\./g, '')) // valor editável no input
export const formatDate = iso => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
  .format(new Date(iso + 'T00:00:00Z')).replace(/\./g, '').replace(/ de /g, ' ')

// Período de entrega (decisão de 2026-10-28): duração em dias corridos, contando os 2 dias. Só aparece na tela e na proposta.
const dm = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const short = iso => dm.format(new Date(iso + 'T00:00:00Z')).replace(/\./g, '').replace(/ de /g, ' ')
export const periodDays = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 864e5) + 1
export const period = s => (validDate(s.deliveryDate) && validDate(s.deliveryEnd) ? `${short(s.deliveryDate)} a ${short(s.deliveryEnd)}` : '') // "3 nov a 14 nov"

// Data no passado / malformada → aviso não bloqueante (QC-DEC-012/015)
export const validDate = iso => !!iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) && !isNaN(new Date(iso + 'T00:00:00'))

export function dateWarning(iso, today = new Date()) {
  if (!iso) return null
  if (!validDate(iso)) return 'Data inválida; ela não aparecerá na proposta.'
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return new Date(iso + 'T00:00:00') < t ? 'Essa data já passou. Confira antes de enviar a proposta.' : null
}
