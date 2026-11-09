// Quanto Cobro? — implementação de referência do Business Rules v1.0 §4 (inteiros).
// Dinheiro em centavos, horas em centésimos. Rodar: node calc-reference.mjs
import assert from 'node:assert/strict'

const roundDiv = (n, d) => Math.floor((2 * n + d) / (2 * d)) // metade para cima, n,d >= 0

export function calculate({ rateCents, execH, revCount = 0, revPerRoundH = 0, impactH = 0, reserveH = 0, costsCents = [] }) {
  const revisionH = revCount * revPerRoundH
  const totalH = execH + revisionH + impactH + reserveH
  const costs = costsCents.reduce((s, c) => s + c, 0)
  const exact = totalH * rateCents + costs * 100
  assert(Number.isSafeInteger(exact))
  return { revisionH, totalH, laborCents: roundDiv(totalH * rateCents, 100), costsCents: costs, referenceCents: roundDiv(exact, 100) }
}

export const hourlyReference = (goalCents, weekH) => roundDiv(goalCents * 10000, weekH * 433)

// C1–C5 do Business Rules §14
assert.equal(calculate({ rateCents: 10000, execH: 1000, revCount: 2, revPerRoundH: 200, impactH: 100, costsCents: [3000, 2000] }).referenceCents, 155000)
assert.equal(calculate({ rateCents: 10000, execH: 1000 }).referenceCents, 100000)
assert.equal(calculate({ rateCents: 10000, execH: 2000, revCount: 2, revPerRoundH: 200, costsCents: [12000, 8000] }).referenceCents, 260000)
assert.equal(calculate({ rateCents: 9238, execH: 125 }).referenceCents, 11548)
assert.equal(hourlyReference(800000, 2000), 9238)
// C6: referência após editar execução para 12 h
assert.equal(calculate({ rateCents: 10000, execH: 1200, revCount: 2, revPerRoundH: 200, impactH: 100, costsCents: [3000, 2000] }).referenceCents, 175000)
// Tetos técnicos §11 cabem em inteiros seguros
calculate({ rateCents: 9999999, execH: 999999, revCount: 99, revPerRoundH: 99999, impactH: 999999, reserveH: 999999, costsCents: Array(50).fill(999999999) })
assert(Number.isSafeInteger(999999999 * 10000))
console.log('Business Rules §14: todos os casos OK')
