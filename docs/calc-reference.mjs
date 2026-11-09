// Fiz a Conta (ex-Quanto Cobro?): implementação de referência do Business Rules v2.0 §4 (inteiros).
// Dinheiro em centavos. Horas do orçamento em MINUTOS inteiros (QC-DEC-027).
// O mini-fluxo Estimar segue em centésimos de hora. Rodar: node docs/calc-reference.mjs
// Versão anterior (horas em centésimos): historico/versoes-anteriores/calc-reference_v1.0.mjs
import assert from 'node:assert/strict'

const roundDiv = (n, d) => Math.floor((2 * n + d) / (2 * d)) // metade para cima, n e d >= 0

// Horas em minutos: mão de obra exata = minutos × centavos (unidade: 1/60 de centavo).
export function calculate({ rateCents, execMin, revCount = 0, revPerRoundMin = 0, impactMin = 0, reserveMin = 0, costsCents = [] }) {
  const revisionMin = revCount * revPerRoundMin
  const totalMin = execMin + revisionMin + impactMin + reserveMin
  const costs = costsCents.reduce((s, c) => s + c, 0)
  const exact = totalMin * rateCents + costs * 60
  assert(Number.isSafeInteger(exact))
  return { revisionMin, totalMin, laborCents: roundDiv(totalMin * rateCents, 60), costsCents: costs, referenceCents: roundDiv(exact, 60) }
}

// Estimar: meta em centavos, horas por semana em centésimos.
export const hourlyReference = (goalCents, weekCentiH) => roundDiv(goalCents * 10000, weekCentiH * 433)

// Entrada de horas (QC-DEC-027/028): "1h30" = 90 min; sem h, o número vale horas (até 2 casas).
export function durationMin(raw) {
  const s = raw.replace(/\s/g, '')
  const m = s.match(/^(\d+)h(\d{1,2})(?:min)?$/i)
  if (m) { assert(+m[2] <= 59, 'minutos de 0 a 59'); return +m[1] * 60 + +m[2] }
  const d = s.replace(/h$/i, '').replace(',', '.').match(/^(\d+)(?:\.(\d{1,2}))?$/)
  assert(d, 'entrada inválida')
  const centi = +d[1] * 100 + +(d[2] ?? '').padEnd(2, '0')
  return roundDiv(centi * 60, 100) // centésimos de hora para minutos, metade para cima
}

// Entrada de horas
assert.equal(durationMin('1h30'), 90)
assert.equal(durationMin('1 h 30 min'), 90)
assert.equal(durationMin('12'), 720)
assert.equal(durationMin('1,5'), 90)
assert.equal(durationMin('1h'), 60)
assert.equal(durationMin('1,33'), 80) // 79,8 min arredonda para 80
assert.throws(() => durationMin('2h75'))

// C1 a C6 do Business Rules §16 (horas em minutos)
assert.equal(calculate({ rateCents: 10000, execMin: 600, revCount: 2, revPerRoundMin: 120, impactMin: 60, costsCents: [3000, 2000] }).referenceCents, 155000)
assert.equal(calculate({ rateCents: 10000, execMin: 600, revCount: 2, revPerRoundMin: 120, impactMin: 60 }).totalMin, 900)
assert.equal(calculate({ rateCents: 10000, execMin: 600 }).referenceCents, 100000)
assert.equal(calculate({ rateCents: 10000, execMin: 1200, revCount: 2, revPerRoundMin: 120, costsCents: [12000, 8000] }).referenceCents, 260000)
assert.equal(calculate({ rateCents: 9238, execMin: 75 }).referenceCents, 11548) // 115,475 arredonda para 115,48
assert.equal(hourlyReference(800000, 2000), 9238)
assert.equal(calculate({ rateCents: 10000, execMin: 720, revCount: 2, revPerRoundMin: 120, impactMin: 60, costsCents: [3000, 2000] }).referenceCents, 175000) // C6
// C7: 1h30 a R$ 100/h
assert.equal(calculate({ rateCents: 10000, execMin: durationMin('1h30') }).referenceCents, 15000)

// Tetos técnicos §14 (calc.js LIMITS) cabem em inteiros seguros
calculate({ rateCents: 9999999, execMin: 599999, revCount: 99, revPerRoundMin: 59999, impactMin: 599999, reserveMin: 599999, costsCents: Array(50).fill(999999999) })
assert(Number.isSafeInteger(999999999 * 10000))
console.log('Business Rules v2.0 §16: todos os casos OK')
