// node test.mjs — casos contratuais do Business Rules v1.1 §14 + regras de entrada/proposta.
import assert from 'node:assert/strict'
import { parseHundredths as p, calculate, hourlyReference, commercialValue, stepErrors, proposal, dateWarning, money, moneyShort, hours, LIMITS, MSG } from './calc.js'

const base = (o = {}) => ({ hourlyRate: null, executionHours: null, scopeDefinition: null, deliveryDate: null, revisionCount: 0,
  revisionHoursPerRound: 0, deadlineImpactHours: 0, reserveHours: 0, directCosts: [], commercialValue: null, commercialEdited: false, errors: {}, ...o })
const cost = (description, amount) => ({ description, amount })
const ref = s => calculate(s).referenceCents

// C1–C6
const c1 = base({ hourlyRate: 10000, executionHours: 1000, revisionCount: 2, revisionHoursPerRound: 200, deadlineImpactHours: 100, directCosts: [cost('a', 3000), cost('b', 2000)] })
assert.equal(ref(c1), 155000)
assert.equal(calculate(c1).totalHours, 1500)
assert.equal(ref(base({ hourlyRate: 10000, executionHours: 1000 })), 100000)
assert.equal(ref(base({ hourlyRate: 10000, executionHours: 2000, revisionCount: 2, revisionHoursPerRound: 200, directCosts: [cost('x', 12000), cost('y', 8000)] })), 260000)
assert.equal(ref(base({ hourlyRate: 9238, executionHours: 125 })), 11548)
assert.equal(hourlyReference(800000, 2000), 9238)
const c6 = { ...c1, commercialValue: 180000, commercialEdited: true, executionHours: 1200 }
assert.equal(ref(c6), 175000)
assert.equal(commercialValue(c6, ref(c6)), 180000)
assert.equal(commercialValue({ ...c6, commercialEdited: false }, ref(c6)), 175000)
// data e escopo não mudam a referência
assert.equal(ref({ ...c1, deliveryDate: '2030-01-01', scopeDefinition: 'open' }), 155000)

// parse
assert.equal(p('1.234,56').value, 123456)
assert.equal(p('R$ 92,38').value, 9238)
assert.equal(p('2.400').value, 240000)
assert.equal(p('1.5').value, 150)
assert.equal(p('1,5 h').value, 150)
assert.equal(p('').value, null)
assert.equal(p('1,234').error, MSG.decimals)
assert.equal(p('-3').error, MSG.negative)
assert.equal(p('abc').error, MSG.invalid)
assert.equal(p('2,5', { integer: true }).error, MSG.integer)
assert.equal(p('100000', { max: LIMITS.hourlyRate }).error, MSG.max)
// tetos cabem em inteiros seguros
assert(Number.isSafeInteger(LIMITS.hourlyRate * (3 * LIMITS.hours + LIMITS.revisionCount * LIMITS.revisionHoursPerRound) + 50 * LIMITS.amount * 100))

// obrigatórios e custos
assert.deepEqual(Object.keys(stepErrors(1, base())), ['hourlyRate'])
assert.deepEqual(Object.keys(stepErrors(2, base({ executionHours: 0 }))), ['executionHours'])
assert.deepEqual(stepErrors(3, base()), {})
assert.deepEqual(stepErrors(4, base({ directCosts: [cost('', 500)] })), {}) // sem descrição só bloqueia proposta

// proposta
const pr = proposal({ ...c1, directCosts: [cost('Licença', 12000)], deliveryDate: '2026-10-18' }, { projectName: 'Landing', scopeSummary: 'Página', notes: '' })
assert.deepEqual(pr.errors, {})
assert.match(pr.text, /Entrega: 18 out 2026/)
assert.match(pr.text, /Revisões incluídas: 2 rodadas/)
assert.match(pr.text, /- Licença: R\$\s?120,00/)
assert.doesNotMatch(pr.text, /Observações/)
const pr0 = proposal({ ...c1, revisionCount: 0, deliveryDate: 'xx', directCosts: [cost('', 100)] }, { projectName: ' ', scopeSummary: '', notes: 'n' })
assert.deepEqual(Object.keys(pr0.errors).sort(), ['cost0', 'projectName', 'scopeSummary'])
assert.doesNotMatch(pr0.text, /rodada|Entrega/)

// datas e formatação
assert.equal(dateWarning('2020-01-01', new Date(2026, 9, 12)), 'Essa data já passou. Confira antes de enviar a proposta.')
assert.equal(dateWarning('2026-10-12', new Date(2026, 9, 12)), null)
assert.match(money(260000), /R\$\s?2\.600,00/)
assert.match(moneyShort(260000), /R\$\s?2\.600$/)
assert.equal(hours(150), '1,5 h')
console.log('ok')
