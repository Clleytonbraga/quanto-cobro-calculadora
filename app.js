// Fiz a Conta (ex-Quanto Cobro?): UI. Regras no calc.js; aqui só estado, telas e eventos.
// Layout: mobile em uma dobra; desktop = Variante D (QC-DEC-018). Teclado "maquininha" (QC-DEC-017).
import * as C from './calc.js'
import { consent, track } from './analytics.js'

const L = C.LIMITS
const KEY = { rate: 'quantoCobro.hourlyRate', theme: 'quantoCobro.theme', draft: 'quantoCobro.currentEstimate.v1' }
const store = (kind, fn) => { try { return fn(kind === 'local' ? localStorage : sessionStorage) } catch { return null } } // storage bloqueado → memória
const SCOPE = {
  well_defined: ['Bem definido', 'Entregáveis e limites já estão claros.'],
  partial: ['Parcialmente definido', 'Existem escolhas ou dependências em aberto.'],
  open: ['Aberto', 'Escopo e entregáveis ainda pouco claros.'],
}
const FIELDS = { // valor em centavos, horas em minutos (dur: aceita "1h30"); revisionCount é inteiro simples no estado
  hourlyRate: { max: L.hourlyRate, required: true },
  executionHours: { max: L.hours, required: true, dur: true },
  revisionCount: { max: L.revisionCount * 100, integer: true, unit: 100 },
  revisionHoursPerRound: { max: L.revisionHoursPerRound, unit: 60, dur: true },
  deadlineImpactHours: { max: L.hours, unit: 60, dur: true },
  reserveHours: { max: L.hours, unit: 60, dur: true },
}
const parse = (f, raw) => FIELDS[f].dur ? C.parseDuration(raw, { max: FIELDS[f].max }) : C.parseHundredths(raw, { max: FIELDS[f].max, integer: FIELDS[f].integer })
const cmin = centi => C.roundDiv((centi ?? 0) * 60, 100) // horas/semana do Estimar (centésimos) → minutos, para exibir
const FIELD_META = { // rótulo, unidade, dica (modais de edição do resultado)
  hourlyRate: ['Valor por hora', 'R$', 'Fica salvo neste dispositivo ao aplicar.'],
  executionHours: ['Horas de execução', 'h', 'Sem revisões.'],
  revisionCount: ['Rodadas de revisão', 'rodadas', 'Quantas rodadas o cliente poderá solicitar.'],
  revisionHoursPerRound: ['Horas por rodada', 'h', 'Tempo estimado para cada rodada.'],
  deadlineImpactHours: ['Horas a mais pelo prazo', 'h', 'Inclua apenas o trabalho adicional necessário para cumprir o prazo.'],
  reserveHours: ['Horas para imprevistos', 'h', 'Tempo adicional para situações não previstas.'],
}
const num = cents => C.money(cents ?? 0).replace(/^R\$\s*/, '') // "1.234,56" para campos editáveis
const fieldRaw = f => f === 'revisionCount' ? String(st.s[f]) : f === 'hourlyRate' ? num(st.s[f]) : C.plainDuration(st.s[f])
const STEPS = ['step1', 'step2', 'step3', 'step4', 'step5']
const STEP_NAMES = ['Valor por hora', 'Execução', 'Prazo e revisões', 'Ajustes', 'Resultado']
const STEP_OF = { a1: 0, a2: 0, a3: 0, proposalForm: 4, preview: 4 }
const coarse = matchMedia('(pointer: coarse)').matches, canShare = !!navigator.share

const savedRate = () => Number(store('local', s => s.getItem(KEY.rate))) || null
function fresh() {
  const rate = savedRate()
  return {
    view: 'step1', maxStep: 0, fromResult: false, shown: {},
    s: { hourlyRate: rate, executionHours: null, scopeDefinition: null, deliveryDate: '', deliveryEnd: '', dateMode: 'single', revisionCount: 0, revisionHoursPerRound: 0,
      deadlineImpactHours: 0, reserveHours: 0, directCosts: [], commercialValue: null, commercialEdited: false, refAtEdit: null,
      errors: {}, raw: { hourlyRate: C.plain(rate) } },
    p: { projectName: '', scopeSummary: '', notes: '', errors: {} },
    mini: { goal: null, week: null, rate: null, raw: {}, errors: {} },
  }
}
const draft = store('session', s => JSON.parse(s.getItem(KEY.draft)))
let st = draft?.v === 3 ? draft.st : fresh() // schema incompatível → descarta (BR §9); v3 = horas em minutos
const save = () => store('session', s => s.setItem(KEY.draft, JSON.stringify({ v: 3, st })))
const app = document.getElementById('app'), dlg = document.getElementById('modal')
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`)
const $ = (sel, root = app) => root.querySelector(sel)
const idx = () => STEPS.includes(st.view) ? STEPS.indexOf(st.view) : STEP_OF[st.view]
const calc = () => C.calculate(st.s)
const ms = C.moneyShort
const SITE = 'https://clleytonbraga.github.io/quanto-cobro-calculadora/'
const shareText = () => `${C.proposal(st.s, st.p).text}\n\nFeito com Fiz a Conta: ${SITE}` // marca na proposta (freemium, decisão C de 2026-10-28)
const BREVO_FORM = 'https://98ff90b3.sibforms.com/serve/MUIFAKZJ0iqwhfxnwXQQwzDIoHjyQuTQ-fcfKwrwnUiUIFqVvcih4-EobB0PpAkJeCEtkue9cHIjkg9OrgtYlifp_w__PjwUHIKgKPKQuK6Pw-3Y28R5le7nY_kM4kzgMYh0xkT5LratyTY0m4cWO4jVTOJwmYlZgUc9xhCYVDFN3FCV4PIuvbLEDrsnQJyQu5wjTVZYmi2XyRTIAw==' // formulário Brevo "Fiz a Conta · aviso de lançamento" (lista #3)
// Pesquisa 5 estrelas (Fase 0, regra aprovada em 2026-10-28): no máximo 1 vez a cada 30 dias por aparelho;
// "Agora não" só volta depois de 3 propostas; quem respondeu não vê mais. ponytail: texto do feedback entra quando houver destino.
const SURVEY = 'quantoCobro.survey', DAY = 864e5
const surveyGet = () => store('local', s => JSON.parse(s.getItem(SURVEY))) || { done: false, last: 0, skipped: false, since: 0 }
const surveySet = patch => store('local', s => s.setItem(SURVEY, JSON.stringify({ ...surveyGet(), ...patch })))
const surveyDue = () => { const v = surveyGet(); return !v.done && Date.now() - v.last > 30 * DAY && (!v.skipped || v.since >= 3) }
const TRACK = { share: 'proposal_shared', copy: 'proposal_copied', print: 'proposal_printed', createProposal: 'proposal_started', historyModal: 'history_interest_clicked' }

// ---------- peças ----------
const ICON = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  theme: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/></svg>', // Lucide "pencil" (ISC)
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>', // Lucide "copy" (ISC)
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4A9.87 9.87 0 0 1 7.02 20.4l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.87 9.87 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z"/></svg>', // Simple Icons "WhatsApp" (CC0)
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>',
  printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"/></svg>',
  del: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M21 5H9l-6 7 6 7h12z"/><path d="M17 9l-5 6M12 9l5 6"/></svg>',
}
const errP = id => `<p class="error err" id="e-${id}" role="alert" hidden></p>`
const stepperRow = (name, label, sub) => `
  <div class="row"><label class="txt" for="f-${name}">${label}<small>${sub}</small></label>
  <div class="stepper"><button type="button" data-act="inc" data-name="${name}" data-dir="-1" aria-label="Diminuir ${label}">−</button>
  <input id="f-${name}" data-field="${name}" inputmode="decimal" autocomplete="off" value="${esc(st.s.raw[name] ?? fieldRaw(name))}" aria-describedby="e-${name}">
  <button type="button" data-act="inc" data-name="${name}" data-dir="1" aria-label="Aumentar ${label}">+</button></div></div>${errP(name)}`
const keypad = (ok, hrs) => `<div class="pad"><div class="keypad" role="group" aria-label="Teclado numérico">${ // hrs: tecla h no lugar da vírgula (1, h, 3, 0 = 1 h 30 min)
  [['1'], ['2'], ['3'], ['del', 'fn', 'Corrigir', ICON.del], ['4'], ['5'], ['6'], ['clear', 'fn', 'Limpar', 'C'], ['7'], ['8'], ['9'],
   ['ok', 'ok', 'Confirmar', '✓'], ['00'], ['0'], hrs ? ['h', 'hkey', 'Separar horas e minutos'] : [',', '', 'Vírgula']]
  .map(([k, cls = '', label, txt]) => `<button type="button" class="key ${cls}" data-key="${k}" data-ok="${ok}" ${label ? `aria-label="${label}"` : ''}>${txt ?? k}</button>`).join('')}</div></div>`
const cta = (act, label) => `<button type="button" class="cta" data-act="${act}">${label}</button>`
const ln = (k, v, o = {}) => `<div class="ln ${o.cls ?? ''}"><span class="k">${k}</span><span class="dots"></span><span class="v">${v}</span>${
  o.edit ? `<button type="button" class="emoji" data-act="${o.edit.act}" ${o.edit.attrs ?? ''} aria-label="Editar ${o.edit.label}">${ICON.edit}</button>` : o.slot ? '<span class="emoji" aria-hidden="true"></span>' : ''}</div>`
const today = () => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).replace(/\./g, '').replace(/ de /g, ' ')

// ---------- telas ----------
const miniSwitch = `<div class="segmented" role="group" aria-label="Como informar o valor por hora"><button type="button" aria-pressed="false" data-act="cancelMini">Já sei</button><button type="button" aria-pressed="true">Estimar</button></div>`
const tip = (label, text) => `<span class="tipwrap"><button type="button" class="tipbtn" data-act="tip" aria-label="${label}" aria-expanded="false"><span class="info" aria-hidden="true">i</span></button><span role="tooltip" class="tip" hidden>${text}</span></span>`
const WEEKS = 'Um mês tem, em média, 4,33 semanas (52 semanas do ano ÷ 12 meses).'
const DISPLAY_FIELD = { step1: ['hourlyRate', 'R$', ''], step2: ['executionHours', '', 'h'], a1: ['goal', 'R$', ''], a2: ['week', '', 'h'], a3: ['rate', 'R$', '/h'] }
const V = {
  step1: () => ({ title: 'Quanto você cobra por hora?', support: 'Informe seu valor por hora ou calcule uma estimativa.', body: `
    <div class="segmented" role="group" aria-label="Como informar o valor por hora"><button type="button" aria-pressed="true">Já sei</button><button type="button" aria-pressed="false" data-act="discover">Estimar</button></div>
    <p class="saved" data-out="saved" hidden><button type="button" data-act="forget">Apagar valor salvo</button></p>
    ${keypad('next')}` }),
  step2: () => ({ title: 'Quantas horas para executar?', support: 'Conte apenas as horas de execução. As revisões vêm depois.', body: `
    ${keypad('next', true)}
    <div class="scope"><details class="acc"><summary><span class="txt"><small>O escopo já está definido? (opcional)</small><b data-out="scopeVal"></b></span>${ICON.chev}</summary>
      <div class="opts" role="radiogroup" aria-label="Nível de definição do escopo">${Object.entries(SCOPE).map(([k, [l, d]]) =>
        `<label class="opt"><input type="radio" name="scope" value="${k}" ${st.s.scopeDefinition === k ? 'checked' : ''}><span class="txt"><b>${l}</b><small>${d}</small></span></label>`).join('')}</div></details>
    <p class="hint" data-out="scopeHint"></p></div>` }),
  step3: () => ({ title: 'Prazo e revisões', support: 'Inclua as revisões e horas extras que ainda não foram consideradas.', body: `
    <div class="card"><div class="pick"><span class="lbl">Data de entrega <small>(opcional)</small></span>
      <button type="button" class="input" data-act="calendar"><span class="v"><span data-out="dateVal"></span><small data-out="dateSub"></small></span>${ICON.calendar}</button>
      <span class="hint">Uma data ou um período. Não altera o valor.</span></div>
      <p class="warn err" data-out="dateWarn" hidden></p></div>
    <div class="card">${stepperRow('revisionCount', 'Rodadas de revisão', 'quantas o cliente pode pedir')}
      <div class="pick"><span class="lbl">Horas por rodada</span>
      <button type="button" class="input" data-act="hoursModal" aria-describedby="e-revisionHoursPerRound"><span class="v" data-out="perRound"></span>${ICON.clock}</button>
      <span class="hint">Tempo de cada rodada. Exemplo: 1h30.</span></div>${errP('revisionHoursPerRound')}
      <div class="foot"><span>Total em revisões</span><b data-out="revTotal"></b></div></div>
    <div class="card">${stepperRow('deadlineImpactHours', 'Horas a mais pelo prazo', 'só o trabalho adicional do prazo')}</div>
    <div class="bottom">${cta('next', st.fromResult ? 'Ver resultado' : 'Continuar')}</div>` }),
  step4: () => ({ title: 'Faltou algum custo ou tempo?', support: 'Inclua horas para imprevistos e custos que ainda não entraram no cálculo.', body: `
    <div class="card">${stepperRow('reserveHours', 'Horas para imprevistos', 'tempo extra para o não previsto (opcional)')}</div>
    ${['partial', 'open'].includes(st.s.scopeDefinition) ? `<p class="scope-tip" role="note"><b>${st.s.scopeDefinition === 'open' ? 'Escopo aberto.' : 'Escopo parcialmente definido.'}</b> Considere horas para imprevistos. O valor só muda se você preencher.</p>` : ''}
    <div class="card"><div class="row"><span class="txt">Custos do projeto<small>ex.: fontes, licenças, impressão · somados ao valor</small></span>
      ${st.s.directCosts.length < L.costs ? '<button type="button" class="link accent add" data-act="costModal">+ Adicionar</button>' : ''}</div>
      ${st.s.directCosts.length ? `<ul class="costs">${st.s.directCosts.map((c, i) => `<li><span class="d ${c.description.trim() ? '' : 'none'}">${esc(c.description.trim() || 'Sem descrição')}</span><span class="v">${C.money(c.amount)}</span>
        <button type="button" class="emoji" data-act="costModal" data-i="${i}" aria-label="Editar custo ${esc(c.description || i + 1)}">${ICON.edit}</button></li>`).join('')}</ul>` : ''}
      <div class="foot"><span>Total de custos</span><b data-out="costTotal"></b></div></div>
    <div class="bottom">${cta('next', st.fromResult ? 'Ver resultado' : 'Calcular')}</div>` }),
  step5: () => ({ wide: true, title: 'Sua estimativa está pronta', support: 'Veja o valor calculado e ajuste quanto deseja cobrar.', body: `
    ${resultTicket()}
    <div class="bottom">${cta('createProposal', 'Criar proposta')}
    <div class="actions"><button type="button" class="link" data-act="resetModal">Novo orçamento</button></div></div>` }),
  a1: () => ({ title: 'Quanto você quer faturar por mês?', support: 'Valor antes de descontar impostos e despesas.', body: `
    ${miniSwitch}${keypad('mini')}` }),
  a2: () => ({ title: 'Quantas horas por semana você consegue cobrar?', support: 'Conte apenas as horas que você consegue cobrar de clientes.', body: `
    ${miniSwitch}${keypad('mini')}` }),
  a3: () => ({ title: 'Sua estimativa de valor por hora', support: 'Este valor ainda não considera seus custos, impostos, férias ou margem. Você pode ajustá-lo.', body: `
    ${miniSwitch}<div class="card"><div class="row"><span class="txt">Meta mensal</span><b>${C.money(st.mini.goal)}</b></div><div class="row"><span class="txt">Horas faturáveis/semana</span><b>${C.hours(cmin(st.mini.week))}</b></div><div class="row"><span class="txt">Semanas por mês</span><span><b>4,33</b>${tip('Por que 4,33?', WEEKS)}</span></div></div>
    <p class="hint">Arredondado para centavos. Fica salvo quando você confirmar.</p>
    <div class="bottom">${cta('useMini', 'Usar este valor')}<div class="actions"><button type="button" class="link" data-act="cancelMini">Cancelar</button></div></div>` }),
  proposalForm: () => ({ wide: true, title: 'Prepare sua proposta', support: 'O valor escolhido, a data de entrega, as revisões e os custos informados entram automaticamente.', body: `
    <div class="field"><label for="f-projectName">Nome do projeto (obrigatório)</label><input class="input" id="f-projectName" data-p="projectName" maxlength="${L.projectName}" value="${esc(st.p.projectName)}" placeholder="Ex.: Landing page institucional" aria-describedby="e-projectName">${errP('projectName')}</div>
    <div class="field"><label for="f-scopeSummary">O que será entregue (obrigatório)</label><textarea id="f-scopeSummary" data-p="scopeSummary" maxlength="${L.longText}" placeholder="Ex.: criação de uma página responsiva com 3 seções" aria-describedby="e-scopeSummary">${esc(st.p.scopeSummary)}</textarea>${errP('scopeSummary')}</div>
    <div class="field"><label for="f-notes">Condições e observações (opcional)</label><textarea id="f-notes" data-p="notes" maxlength="${L.longText}" placeholder="Ex.: materiais enviados pelo cliente ou condições de pagamento">${esc(st.p.notes)}</textarea></div>
    <p class="error" data-out="costDescErr" hidden>Há custo sem descrição. <button type="button" class="link accent" data-act="costsModal">Descrever custos</button></p>
    <div class="bottom">${cta('preview', 'Ver proposta')}<div class="actions"><button type="button" class="link" data-act="go" data-to="step5">Voltar ao resultado</button></div></div>` }),
  preview: () => ({ wide: true, title: 'Confira sua proposta', support: 'Revise o conteúdo antes de compartilhar com o cliente.', body: `
    ${proposalTicket()}
    <div class="bottom"><a class="cta wa" href="https://wa.me/?text=${encodeURIComponent(shareText())}" target="_blank" rel="noopener" data-track="proposal_whatsapp">${ICON.whatsapp}Enviar pelo WhatsApp</a>
    <div class="shr" role="group" aria-label="Mais opções da proposta">${[['historyModal', ICON.history, 'Histórico'], ['copy', ICON.copy, 'Copiar'], ['print', ICON.printer, 'PDF'], canShare && ['share', ICON.more, 'Mais']]
      .filter(Boolean).map(([act, ico, label]) => `<button type="button" data-act="${act}"><span class="ic">${ico}</span>${label}</button>`).join('')}</div>
    <p class="status" role="status" data-out="status"></p>
    <div class="actions"><button type="button" class="link" data-act="resetModal">Novo orçamento</button></div></div>` }), // compartilhar V2 (aprovada em 2026-10-28)
}

const fm = (f, label) => ({ act: 'fieldModal', attrs: `data-f="${f}"`, label })
function resultTicket() { // V1 aprovada em 2026-10-28: Tempo (barra) + Dinheiro + valor da proposta em marca-texto
  const s = st.s, c = calc(), n = s.directCosts.length, ref = c.referenceCents, com = C.commercialValue(s, ref), sc = SCOPE[s.scopeDefinition]
  const changed = s.commercialEdited && s.refAtEdit !== ref && com !== ref
  const parts = [['Execução', s.executionHours ?? 0, 'var(--ink)', 'executionHours'], ['Revisões', c.revisionHours, 'var(--action)', 'revisionCount revisionHoursPerRound'],
    ['Prazo', s.deadlineImpactHours, 'var(--ink-soft)', 'deadlineImpactHours'], ['Imprevistos', s.reserveHours, 'var(--paper-line)', 'reserveHours']]
  return `<article class="ticket v1" aria-label="Orçamento detalhado"><div class="head"><h2>Orçamento</h2><p class="meta">${today()}</p></div>
    <span class="lbl">Tempo · ${C.hours(c.totalHours)}</span>
    <div class="bar" aria-hidden="true">${parts.map(([, v, col]) => v ? `<span style="flex:${v};background:${col}"></span>` : '').join('')}</div>
    <div class="lg">${parts.map(([l, v, col, f]) => `<button type="button" data-act="fieldModal" data-f="${f}" aria-label="Editar ${l.toLowerCase()}: ${C.hours(v)}">${v ? `<i style="background:${col}"></i>` : ''}${l} ${C.hours(v)}</button>`).join('')}</div><hr>
    <span class="lbl">Dinheiro</span>
    ${ln(`${C.hours(c.totalHours)} × ${C.money(s.hourlyRate)}`, C.money(c.laborCents), { edit: fm('hourlyRate', 'valor por hora') })}
    ${ln(`Custos do projeto (${n})`, C.money(c.costs), { edit: { act: 'costsModal', label: 'custos do projeto' } })}
    <div class="prop"><span class="lbl">Valor da proposta</span><button type="button" data-act="commercialModal" aria-label="Editar valor da proposta: ${C.money(com)}">${C.money(com)}${ICON.edit}</button></div>
    ${changed ? `<p class="note">O valor calculado mudou, mas o valor da proposta foi mantido. <button type="button" data-act="useRef">Usar valor calculado</button></p>` : ''}
    <p class="sub">Escopo: ${sc ? sc[0] : 'não informado'} (não altera o valor)</p></article>`
}
function proposalTicket() {
  const s = st.s, p = st.p, ref = calc().referenceCents, costs = s.directCosts
  return `<article class="ticket print-area" aria-label="Proposta"><h2>Proposta</h2><p class="meta">${today()}</p><hr>
    <p class="title">${esc(p.projectName.trim())}</p><p class="body">${esc(p.scopeSummary.trim())}</p><hr>
    ${C.period(s) ? ln('Período', C.period(s)) : C.validDate(s.deliveryDate) ? ln('Entrega', C.formatDate(s.deliveryDate)) : ''}
    ${s.revisionCount ? ln('Revisões incluídas', `${s.revisionCount} ${s.revisionCount === 1 ? 'rodada' : 'rodadas'}`) : ''}
    ${costs.length ? `<p class="mini">Custos incluídos no valor</p>${costs.map(c => ln(esc(c.description.trim()), C.money(c.amount))).join('')}` : ''}<hr>
    ${ln('Valor', C.money(C.commercialValue(s, ref)), { cls: 'total' })}
    ${p.notes.trim() ? `<p class="sub body">Obs.: ${esc(p.notes.trim())}</p>` : ''}<p class="sub brandline">Feito com Fiz a Conta</p></article>`
}
function liveTicket() { // orçamento impresso ao vivo (desktop, etapas 1–4 e mini-fluxo)
  const s = st.s, c = calc(), i = idx(), reached = k => k <= Math.max(i, st.maxStep), sc = SCOPE[s.scopeDefinition]
  const row = (k, label, v) => ln(`${reached(k) && k < i ? '✓ ' : k === i ? '● ' : ''}${label}`, reached(k) ? v : '…', { cls: k === i ? 'cur' : reached(k) ? '' : 'dim' })
  return `<article class="ticket" aria-label="Seu orçamento até agora"><h2>Seu orçamento</h2><p class="meta">atualiza a cada etapa</p><hr>
    ${row(0, 'Valor por hora', C.money(s.hourlyRate ?? 0))}${row(1, 'Execução', C.hours(s.executionHours ?? 0))}
    ${row(2, 'Revisões', `${s.revisionCount} × ${C.hours(s.revisionHoursPerRound)}`)}${row(2, 'A mais pelo prazo', C.hours(s.deadlineImpactHours))}
    ${row(3, 'Imprevistos', C.hours(s.reserveHours))}${row(3, 'Custos do projeto', C.money(c.costs))}<hr>
    ${ln('Subtotal parcial', C.money(c.referenceCents), { cls: 'bold' })}${sc ? `<p class="sub">Escopo: ${sc[0]}</p>` : ''}</article>`
}
const railSums = () => { const s = st.s, c = calc()
  return [ms(s.hourlyRate ?? 0), C.hours(s.executionHours ?? 0), `+${C.hours(c.revisionHours + s.deadlineImpactHours)}`, `${ms(c.costs)} custos`, ms(c.referenceCents)] }
function rail() {
  const i = idx(), sum = railSums()
  return `<nav class="rail desk" aria-label="Etapas do orçamento"><span class="eyebrow">Etapas do orçamento</span>
    ${STEP_NAMES.map((n, k) => { const state = k === i ? 'cur' : k <= st.maxStep ? 'done' : 'todo'
      return `<button type="button" class="stepbtn ${state}" data-act="rail" data-to="${STEPS[k]}" ${state === 'todo' ? 'disabled' : ''} ${state === 'cur' ? 'aria-current="step"' : ''}>
        <span class="n">${state === 'done' ? '✓' : k + 1}</span><span class="txt">${n}${state !== 'todo' ? `<small data-out="rail${k}">${sum[k]}</small>` : ''}</span></button>` }).join('')}
    <details class="acc shortcuts"><summary><span class="info" title="Atalhos do teclado">i</span><span class="txt">Atalhos do teclado</span>${ICON.chev}</summary>
      <dl><dt><kbd>0–9 , 00</kbd></dt><dd>digitar</dd><dt><kbd>↑ ↓</kbd></dt><dd>somar / subtrair 1</dd><dt><kbd>Enter</kbd></dt><dd>confirmar</dd><dt><kbd>Backspace</kbd></dt><dd>corrigir</dd><dt><kbd>Esc</kbd></dt><dd>voltar</dd></dl></details></nav>`
}

// ---------- render ----------
function header() {
  const i = idx(), mini = st.view[0] === 'a', prop = st.view === 'proposalForm' || st.view === 'preview'
  const [label, n, total] = mini ? ['Estimar valor por hora', +st.view[1], 3] : prop ? ['Proposta', st.view === 'preview' ? 2 : 1, 2] : [`Etapa ${i + 1} de 5 · ${STEP_NAMES[i]}`, i + 1, 5]
  return `<header class="top"><div class="lead">${st.view !== 'step1' && st.view !== 'a1' ? `<button type="button" class="icon-btn back" data-act="back" aria-label="Voltar">${ICON.back}</button>` : ''}<span class="brand-mark" role="img" aria-label="Fiz a Conta"><img class="mark th-light" src="assets/icon-light.svg" alt=""><img class="mark th-dark" src="assets/icon-dark.svg" alt=""><img class="wordmark th-light" src="assets/logo-light.svg" alt=""><img class="wordmark th-dark" src="assets/logo-dark.svg" alt=""></span></div>
    <div class="progress"><span>${label}</span><div class="bar" aria-hidden="true">${Array.from({ length: total }, (_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('')}</div></div>
    <button type="button" class="icon-btn theme" data-act="theme" aria-label="Alternar tema claro/escuro">${ICON.theme}</button></header>`
}
function render(focus = true) {
  const v = V[st.view](), df = DISPLAY_FIELD[st.view], i = idx()
  const raw = df && (st.view[0] === 'a' ? st.mini.raw[df[0]] : st.s.raw[df[0]])
  const value = df ? `<label class="value" for="dv"><span class="unit">${df[1]}</span><input id="dv" ${st.view[0] === 'a' ? 'data-mini' : 'data-field'}="${df[0]}" inputmode="${coarse && st.view !== 'a3' ? 'none' : 'decimal'}" autocomplete="off" value="${esc(raw ?? '')}" placeholder="0" aria-label="${v.title}" aria-describedby="e-${df[0]}" size="1"><span class="unit">${df[2]}</span></label>${errP(df[0])}`
    : '<output class="value" data-out="dValue"></output>'
  const showLive = !v.wide && st.view !== 'a3'
  app.className = 'calc' + (v.wide ? ' wide' : '')
  app.innerHTML = `${header()}
    <section class="band"><div class="q"><span class="eyebrow">${STEPS.includes(st.view) ? `Etapa ${i + 1} de 5` : st.view[0] === 'a' ? 'Estimar valor por hora' : 'Proposta'}</span><h1 tabindex="-1">${v.title}</h1><p class="support">${v.support}</p></div>
<!-- ponytail: sem publicidade por enquanto (2026-10-28); slots voltam no resultado/prévia quando houver rede de anúncios --><div class="display" aria-live="off"><span class="label" data-out="dLabel"></span>${value}<span class="formula" data-out="dFormula"></span><span class="accent"><span data-out="dAccent"></span>${st.view === 'a2' ? tip('Por que 4,33?', WEEKS) : ''}</span></div></section>
    <div class="cols">${rail()}<div class="device">${v.body}</div><aside class="receipt desk" aria-label="Orçamento ao vivo">${showLive ? liveTicket() : ''}</aside></div>`
  refresh()
  const dv = $('#dv')
  if (focus) { if (dv && !coarse) dv.focus({ preventScroll: true }); else $('h1').focus({ preventScroll: true }); scrollTo(0, 0) }
}

function display() {
  const s = st.s, c = calc(), rate = s.hourlyRate ?? 0
  const exec = s.executionHours ?? 0, so = exec + c.revisionHours + s.deadlineImpactHours
  const com = C.commercialValue(s, c.referenceCents)
  const costs = c.costs ? ` + ${ms(c.costs)} custos` : ''
  const allHours = `${C.hours(c.totalHours)} × ${ms(rate)}/h${costs}`
  const prop = [st.p.projectName.trim(), C.period(s) || (C.validDate(s.deliveryDate) && C.formatDate(s.deliveryDate))].filter(Boolean).join(' · ')
  const wk = st.mini.week ?? 0
  return {
    step1: ['Valor por hora', '', '', savedRate() && savedRate() === s.hourlyRate ? 'salvo neste dispositivo' : ''],
    step2: ['Horas de execução', '', `${C.hours(exec)} × ${ms(rate)}/h`, `${ms(C.roundDiv(exec * rate, 60))} até aqui`],
    step3: ['Tempo previsto', C.hours(so), `${C.hours(exec)} execução + ${C.hours(c.revisionHours)} revisão${s.deadlineImpactHours ? ` + ${C.hours(s.deadlineImpactHours)} prazo` : ''}`, `${ms(C.roundDiv(so * rate, 60))} até aqui`],
    step4: ['Subtotal parcial', ms(c.referenceCents), allHours, c.costs ? 'com custos do projeto' : 'sem custos do projeto'],
    step5: ['Valor calculado', ms(c.referenceCents), allHours, `${C.hours(c.totalHours)} previstas`],
    a1: ['Meta mensal', '', 'faturamento bruto desejado', 'impostos não são descontados'],
    a2: ['Horas faturáveis / semana', '', `${C.hours(cmin(wk))} × 4,33 = ${C.hours(C.roundDiv(cmin(wk) * 433, 100))}/mês`, '52 ÷ 12 ≈ 4,33 semanas/mês'],
    a3: ['Valor por hora estimado', '', `${ms(st.mini.goal ?? 0)} ÷ (${C.hours(cmin(wk))} × 4,33)`, 'base inicial, não é preço de mercado'],
    proposalForm: ['Valor da proposta', ms(com), prop, s.revisionCount ? `${s.revisionCount} ${s.revisionCount === 1 ? 'rodada' : 'rodadas'} de revisão` : ''],
  }
}

function refresh() {
  const s = st.s, view = st.view === 'preview' ? 'proposalForm' : st.view
  const [label, value, formula, accent] = display()[view]
  const out = (k, txt) => { const el = $(`[data-out="${k}"]`); if (el) el.textContent = txt; return el }
  out('dLabel', label); out('dValue', value); out('dFormula', formula); out('dAccent', accent)
  const dv = $('#dv'); if (dv) dv.size = Math.max(1, (dv.value || dv.placeholder).length)
  const vEl = $('.value') // nº de caracteres visíveis; unidade conta metade (fonte .48em)
  if (vEl) vEl.style.setProperty('--chars', dv ? (dv.value || '0').length + [...vEl.querySelectorAll('.unit')].reduce((n, u) => n + u.textContent.length * .5, 0) + .5 : Math.max(4, vEl.textContent.length))
  const errs = { ...s.errors, ...C.stepErrors(STEPS.indexOf(st.view) + 1, s), ...st.mini.errors, ...st.p.errors }
  for (const p of app.querySelectorAll('[id^="e-"]')) {
    const id = p.id.slice(2), on = !!errs[id] && !!st.shown[id]
    p.hidden = !on; p.textContent = on ? errs[id] : ''
    app.querySelector(`[aria-describedby~="e-${id}"]`)?.setAttribute('aria-invalid', on)
  }
  const saved = $('[data-out="saved"]'); if (saved) saved.hidden = !(savedRate() && savedRate() === s.hourlyRate)
  const sc = SCOPE[s.scopeDefinition]
  const sv = out('scopeVal', sc ? sc[0] : 'Não informado'); sv?.classList.toggle('none', !sc)
  out('scopeHint', sc ? `${sc[1]} Não altera o cálculo.` : 'Essa informação ajuda a revisar o orçamento, mas não altera o cálculo.')
  const per = C.period(s)
  const dvl = out('dateVal', per || (C.validDate(s.deliveryDate) ? C.formatDate(s.deliveryDate) : 'Escolher')); dvl?.classList.toggle('empty', !C.validDate(s.deliveryDate))
  out('dateSub', per ? `${C.periodDays(s.deliveryDate, s.deliveryEnd)} dias corridos` : '')
  out('perRound', fieldRaw('revisionHoursPerRound'))
  $('[data-act="hoursModal"]')?.setAttribute('aria-label', `Editar horas por rodada: ${C.hours(s.revisionHoursPerRound)}`)
  $('[data-act="calendar"]')?.setAttribute('aria-label', `Escolher data de entrega: ${dvl?.textContent}`)
  const unit = $('.value .unit:last-of-type'); if (unit && st.view === 'step2') unit.textContent = dv?.value.includes('h') ? '' : 'h' // "1h30" já traz o h
  const dw = out('dateWarn', C.dateWarning(s.deliveryDate) ?? ''); if (dw) dw.hidden = !dw.textContent
  out('revTotal', `${s.revisionCount} × ${C.hours(s.revisionHoursPerRound)} = ${C.hours(calc().revisionHours)}`)
  out('costTotal', C.money(calc().costs))
  railSums().forEach((t, k) => out('rail' + k, t)) // trilha ao vivo
  const live = $('.receipt'); if (live?.querySelector('.ticket')) live.innerHTML = liveTicket()
  const cde = $('[data-out="costDescErr"]'); if (cde) cde.hidden = !(st.shown.costDesc && Object.keys(C.proposal(s, st.p).errors).some(k => k.startsWith('cost')))
}

// ---------- estado ----------
function setField(name, raw) {
  const f = FIELDS[name], s = st.s
  s.raw[name] = raw
  const r = parse(name, raw)
  delete s.errors[name]
  if (r.error) { s.errors[name] = r.error; if (f.required) s[name] = null; return }
  const v = r.value ?? (f.required ? null : 0)
  s[name] = name === 'revisionCount' ? v / 100 : v
}
function setMini(name, raw) {
  const max = { goal: L.goal, week: L.weekHours, rate: L.hourlyRate }[name]
  st.mini.raw[name] = raw
  const r = C.parseHundredths(raw, { max })
  st.mini[name] = r.value
  const e = r.error || (!(r.value > 0) ? (name === 'week' ? C.MSG.week : name === 'rate' ? C.MSG.rate : C.MSG.commercial) : null)
  if (e) st.mini.errors[name] = e; else delete st.mini.errors[name]
}
function go(view, focus = true) {
  st.view = view
  track('step_viewed', { step: view }) // funil por tela; nenhum valor do orçamento
  if (STEPS.includes(view)) st.maxStep = Math.max(st.maxStep, STEPS.indexOf(view))
  render(focus); save()
}
function firstInvalid(errs) {
  for (const k of Object.keys(errs)) st.shown[k] = true
  refresh(); $('[aria-invalid="true"]')?.focus()
}

// ---------- modais (dialog nativo) ----------
let modalCtx = null
function openModal(kind, ctx = {}) {
  modalCtx = { kind, ...ctx }
  dlg.innerHTML = `<div class="grab"></div><form method="dialog" novalidate>${MODALS[kind](ctx)}</form>`
  if (!dlg.open) dlg.showModal() // troca de conteúdo com o modal aberto (lista → item, mês do calendário)
  dlg.querySelector('[autofocus]')?.focus()
}
const closeModal = () => { dlg.close(); modalCtx = null }
const modalErr = (msg, input) => { const p = dlg.querySelector('.error'); p.textContent = msg; p.hidden = false; input?.setAttribute('aria-invalid', 'true'); input?.focus() }
const MODALS = {
  cost: ({ i }) => { const c = st.s.directCosts[i] ?? { description: '', amount: null }; return `
    <h2 id="modal-title">${i == null ? 'Adicionar custo' : 'Editar custo'}</h2><p class="hint">A descrição será necessária para incluir este custo na proposta.</p>
    <div class="field"><label for="m-desc">Descrição</label><input class="input" id="m-desc" maxlength="${L.description}" value="${esc(c.description)}" placeholder="Ex.: licença de imagens" autofocus></div>
    <div class="field"><label for="m-amount">Valor (R$)</label><input class="input" id="m-amount" inputmode="decimal" autocomplete="off" value="${c.amount == null ? '' : num(c.amount)}" placeholder="0,00"></div>
    <p class="error" role="alert" hidden></p>
    <div class="split"><button type="button" class="secondary" data-m="close">Cancelar</button><button type="button" class="cta" data-m="applyCost">Aplicar</button></div>
    ${i != null ? '<button type="button" class="link danger-text" data-m="deleteCost">Excluir custo</button>' : ''}` },
  field: ({ fs }) => `<h2 id="modal-title">${fs.length > 1 ? 'Editar revisões' : `Editar ${FIELD_META[fs[0]][0].toLowerCase()}`}</h2>
    ${fs.map((f, k) => `<div class="field"><label for="m-${f}">${FIELD_META[f][0]} (${FIELD_META[f][1]})</label>
      <input class="input" id="m-${f}" data-mf="${f}" inputmode="decimal" autocomplete="off" value="${esc(fieldRaw(f))}" ${k ? '' : 'autofocus'}><small class="hint">${FIELD_META[f][2]}</small></div>`).join('')}
    <p class="error" role="alert" hidden></p>
    <div class="split"><button type="button" class="secondary" data-m="close">Cancelar</button><button type="button" class="cta" data-m="applyFields">Aplicar</button></div>`,
  costs: () => `<h2 id="modal-title">Custos do projeto</h2><p class="hint">Somados ao valor, fora das horas de trabalho.</p>
    ${st.s.directCosts.length ? `<ul class="costs">${st.s.directCosts.map((c, i) => `<li><span class="d ${c.description.trim() ? '' : 'none'}">${esc(c.description.trim() || 'Sem descrição')}</span><span class="v">${C.money(c.amount)}</span>
      <button type="button" class="emoji" data-ret data-m="costFromList" data-i="${i}" aria-label="Editar custo ${esc(c.description || i + 1)}">${ICON.edit}</button></li>`).join('')}</ul>` : '<p class="hint">Nenhum custo adicionado.</p>'}
    <div class="foot"><span>Total de custos</span><b>${C.money(calc().costs)}</b></div>
    <div class="split">${st.s.directCosts.length < L.costs ? '<button type="button" class="secondary" data-ret data-m="costFromList">+ Adicionar</button>' : '<span></span>'}<button type="button" class="cta" data-m="close" autofocus>Concluir</button></div>`,
  commercial: () => { const ref = calc().referenceCents, com = C.commercialValue(st.s, ref); return `
    <h2 id="modal-title">Valor da proposta</h2><p class="hint">Este é o valor que seu cliente verá. Se deixar em branco, usamos o valor calculado (${C.money(ref)}).</p>
    <div class="field"><label for="m-com">Valor (R$)</label><input class="input" id="m-com" inputmode="decimal" autocomplete="off" value="${st.s.commercialEdited ? num(com) : ''}" placeholder="${num(ref)}" autofocus></div>
    <p class="error" role="alert" hidden></p>
    <div class="split"><button type="button" class="secondary" data-m="close">Cancelar</button><button type="button" class="cta" data-m="applyCom">Aplicar</button></div>` },
  calendar: ({ y, m }) => {
    const s = st.s, range = s.dateMode === 'range', a = s.deliveryDate, b = s.deliveryEnd
    const first = new Date(y, m, 1), start = new Date(y, m, 1 - first.getDay()), t = new Date(); t.setHours(0, 0, 0, 0)
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const fmt = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
    const days = Array.from({ length: 42 }, (_, k) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + k))
    const days0 = a && b ? C.periodDays(a, b) : 0
    return `<h2 id="modal-title">Data de entrega</h2>
    <div class="segmented" role="group" aria-label="Tipo de data">${[['single', 'Data única'], ['range', 'Período']].map(([v, l]) => `<button type="button" data-m="dateMode" data-v="${v}" aria-pressed="${s.dateMode === v}">${l}</button>`).join('')}</div>
    <div class="cal-head"><button type="button" class="icon-btn" data-m="month" data-d="-1" aria-label="Mês anterior">${ICON.back}</button>
      <strong aria-live="polite">${new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(first)}</strong>
      <button type="button" class="icon-btn" data-m="month" data-d="1" aria-label="Próximo mês" style="transform:scaleX(-1)">${ICON.back}</button></div>
    <div class="cal">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => `<span class="wd" aria-hidden="true">${d}</span>`).join('')}
      ${days.map(d => { const k = iso(d), mid = range && b && k > a && k < b
        return d.getMonth() !== m ? '<span></span>' : `<button type="button" data-m="day" data-v="${k}" aria-label="${fmt.format(d)}" aria-pressed="${k === a || (range && k === b)}" class="${+d === +t ? 'today' : d < t ? 'past' : ''}${mid ? ' in-range' : ''}">${d.getDate()}</button>` }).join('')}</div>
    ${range ? `<p class="range-sum" aria-live="polite">${days0 ? `${C.period(s)} · ${days0} dias corridos` : a ? 'Agora toque no dia de fim.' : ''}</p>
    <p class="hint center">Toque no dia de início e depois no dia de fim.</p>` : ''}
    <div class="actions"><button type="button" class="link" data-m="day" data-v="">Limpar</button><button type="button" class="link accent" data-m="day" data-v="${iso(t)}">Hoje</button><button type="button" class="link" data-m="close">Fechar</button></div>` },
  hours: () => `<h2 id="modal-title">Horas por rodada</h2>
    <p class="hint">Digite as horas, toque em h e digite os minutos. Para 1 h 30 min, toque 1, h, 3, 0. Sem h, o número vale horas.</p>
    <div class="display"><span class="label">Tempo de cada rodada</span><label class="value" style="--chars:6"><input id="mdv" inputmode="${coarse ? 'none' : 'decimal'}" autocomplete="off" value="${esc(fieldRaw('revisionHoursPerRound'))}" placeholder="0" aria-label="Tempo de cada rodada" autofocus></label></div>
    <p class="error" role="alert" hidden></p>
    ${keypad('applyHours', true)}`, // modal V5 (aprovado em 2026-10-28)
  reset: () => { const pdf = st.view === 'preview' // só a prévia tem o cupom de impressão (.print-area)
    return `<h2 id="modal-title">Começar um novo orçamento?</h2>
    <p class="hint">${pdf ? 'Este orçamento ainda não fica salvo no app. Salve o PDF antes, para não perder o que você fez.' : 'Os dados deste orçamento e da proposta serão apagados.'} Seu valor por hora e o tema continuam salvos.</p>
    ${pdf ? '<button type="button" class="cta" data-m="pdfReset">Salvar PDF e recomeçar</button>' : ''}
    <div class="split"><button type="button" class="secondary" data-m="close" autofocus>Cancelar</button><button type="button" class="${pdf ? 'secondary' : 'cta danger'}" data-m="resetYes">Apagar e recomeçar</button></div>` },
  survey: () => `<h2 id="modal-title">O Fiz a Conta ajudou você?</h2>
    <p class="hint">Seu PDF foi salvo. Dê uma nota de 1 a 5.</p>
    <div class="stars" role="group" aria-label="Nota de 1 a 5 estrelas">${[1, 2, 3, 4, 5].map(k => `<button type="button" data-m="star" data-v="${k}" aria-pressed="false" aria-label="${k} de 5 estrelas">${ICON.star}</button>`).join('')}</div>
    <p class="error" role="alert" hidden></p>
    <button type="button" class="cta" data-m="surveySend">Enviar</button>
    <div class="actions"><button type="button" class="link" data-m="surveySkip">Agora não</button></div>`,
  history: () => `<h2 id="modal-title">Histórico de propostas</h2>
    <p class="hint">Em breve você vai salvar suas propostas e abrir de novo quando quiser, em qualquer aparelho. Esse recurso faz parte do plano para assinantes.</p>
    <p><b>Quer receber um aviso quando lançar?</b></p>
    <div class="field"><label for="m-email">Seu e-mail</label><input class="input" id="m-email" type="email" inputmode="email" autocomplete="email" placeholder="voce@email.com" autofocus></div>
    <label class="optin"><input id="m-optin" type="checkbox">Aceito receber 1 e-mail do Fiz a Conta sobre o lançamento. Posso cancelar quando quiser.</label>
    <p class="error" role="alert" hidden></p>
    <button type="button" class="cta" data-m="historySend">Quero ser avisado</button>
    <div class="actions"><button type="button" class="link" data-m="close">Agora não</button></div>`,
  historyDone: () => `<h2 id="modal-title">Pronto</h2>
    <p class="hint">Seu e-mail está na lista. Você recebe só 1 aviso, quando o histórico lançar.</p>
    <button type="button" class="cta" data-m="close" autofocus>Fechar</button>`,
}
const MODAL_ACTS = {
  close() { const ret = modalCtx?.ret; closeModal(); if (ret) openModal('costs') },
  applyCost() {
    const desc = dlg.querySelector('#m-desc').value, rawA = dlg.querySelector('#m-amount'), r = C.parseHundredths(rawA.value, { max: L.amount })
    if (r.error || r.value == null) return modalErr(r.error || C.MSG.costValue, rawA)
    const item = { description: desc, amount: r.value }
    if (modalCtx.i == null) st.s.directCosts.push(item); else st.s.directCosts[modalCtx.i] = item
    st.p.errors = {}; const ret = modalCtx.ret; closeModal(); render(false); save()
    if (ret) openModal('costs'); else $('[data-act="costModal"]')?.focus()
  },
  applyFields() {
    const inputs = [...dlg.querySelectorAll('[data-mf]')], parsed = []
    for (const input of inputs) {
      const f = input.dataset.mf, meta = FIELDS[f], r = parse(f, input.value)
      const err = r.error || (meta.required && !(r.value > 0) ? (f === 'hourlyRate' ? C.MSG.rate : C.MSG.exec) : null)
      if (err) return modalErr(err, input)
      parsed.push([f, input.value])
    }
    for (const [f, raw] of parsed) setField(f, raw)
    if (parsed.some(([f]) => f === 'hourlyRate')) store('local', x => x.setItem(KEY.rate, String(st.s.hourlyRate))) // QC-DEC-009
    closeModal(); render(false); save()
  },
  costFromList: b => actions.costModal(b),
  deleteCost() { st.s.directCosts.splice(modalCtx.i, 1); st.p.errors = {}; const ret = modalCtx.ret; closeModal(); render(false); save(); if (ret) openModal('costs') },
  applyCom() {
    const input = dlg.querySelector('#m-com'), raw = input.value, s = st.s
    if (raw.trim() === '') { s.commercialEdited = false } // vazio volta a acompanhar (QC-DEC-015)
    else {
      const r = C.parseHundredths(raw, { max: L.commercialValue })
      if (r.error || !(r.value > 0)) return modalErr(r.error || C.MSG.commercial, input)
      Object.assign(s, { commercialValue: r.value, commercialEdited: true, refAtEdit: calc().referenceCents })
    }
    closeModal(); render(false); save()
  },
  month(b) { const d = new Date(modalCtx.y, modalCtx.m + +b.dataset.d, 1); openModal('calendar', { y: d.getFullYear(), m: d.getMonth() }) },
  day(b) { // período: 1º toque = início, 2º = fim (se vier antes, inverte). Limpar e data única fecham o modal.
    const s = st.s, v = b.dataset.v, pick = s.dateMode === 'range' && v // "Hoje" no período conta como um toque
    if (pick && s.deliveryDate && !s.deliveryEnd && v !== s.deliveryDate) [s.deliveryDate, s.deliveryEnd] = v < s.deliveryDate ? [v, s.deliveryDate] : [s.deliveryDate, v]
    else { s.deliveryDate = v; s.deliveryEnd = '' }
    save(); refresh()
    if (pick && !s.deliveryEnd) return openModal('calendar', { y: modalCtx.y, m: modalCtx.m })
    closeModal(); $('[data-act="calendar"]')?.focus()
  },
  dateMode(b) { const s = st.s; s.dateMode = b.dataset.v; s.deliveryEnd = ''; save(); refresh(); openModal('calendar', { y: modalCtx.y, m: modalCtx.m }) },
  applyHours() {
    const input = dlg.querySelector('#mdv'), r = parse('revisionHoursPerRound', input.value)
    if (r.error) return modalErr(r.error, input)
    setField('revisionHoursPerRound', input.value); closeModal(); render(false); save()
  },
  resetYes() { track('new_budget_started'); closeModal(); store('session', s => s.removeItem(KEY.draft)); st = fresh(); render(); save() }, // QC-DEC-010
  pdfReset() { // freemium: salvar antes de apagar; depois, a pesquisa (Fase 0)
    track('proposal_printed'); print(); MODAL_ACTS.resetYes()
    if (surveyDue()) openModal('survey')
  },
  star(b) { for (const s of dlg.querySelectorAll('[data-m="star"]')) s.setAttribute('aria-pressed', +s.dataset.v <= +b.dataset.v); modalCtx.rating = +b.dataset.v },
  surveySend() {
    if (!modalCtx.rating) return modalErr('Toque numa estrela para dar a nota.')
    track('rating_submitted', { rating: modalCtx.rating }); surveySet({ done: true }); closeModal()
  },
  surveySkip() { surveySet({ last: Date.now(), skipped: true, since: 0 }); track('rating_skipped'); closeModal() },
  async historySend() { // teste de interesse (Fase 1): e-mail vai para a lista do Brevo; o aceite fica na caixa marcada aqui
    const email = dlg.querySelector('#m-email'), optin = dlg.querySelector('#m-optin'), v = email.value.trim()
    for (const el of [email, optin]) el.removeAttribute('aria-invalid')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return modalErr('Digite um e-mail válido, por exemplo voce@email.com.', email)
    if (!optin.checked) return modalErr('Marque a caixa para aceitar o e-mail de aviso.', optin)
    const body = new FormData()
    body.append('EMAIL', v); body.append('email_address_check', ''); body.append('locale', 'pt'); body.append('html_type', 'simple') // campos do HTML simples do Brevo
    try { await fetch(BREVO_FORM, { method: 'POST', mode: 'no-cors', body }) } // resposta opaca: o Brevo não libera CORS
    catch { return modalErr('Não foi possível salvar. Confira a internet e tente de novo.') }
    track('history_signup_submitted')
    openModal('historyDone')
  },
}
dlg.addEventListener('click', e => {
  if (e.target === dlg) return closeModal() // clique no fundo fecha
  const key = e.target.closest('[data-key]'); if (key) return pressKey(key)
  const b = e.target.closest('[data-m]'); if (b) MODAL_ACTS[b.dataset.m](b)
})
dlg.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); dlg.querySelector('.cta, [data-key="ok"]')?.click() } })

// ---------- ações ----------
const actions = {
  next() {
    const i = STEPS.indexOf(st.view), errs = C.stepErrors(i + 1, st.s)
    if (Object.keys(errs).length) return firstInvalid(errs)
    if (st.view === 'step1') store('local', s => s.setItem(KEY.rate, String(st.s.hourlyRate))) // QC-DEC-009
    go(st.fromResult ? 'step5' : STEPS[i + 1])
  },
  back() {
    const i = STEPS.indexOf(st.view)
    if (st.view === 'step1') return
    go(i > 0 ? STEPS[i - 1] : { a1: 'step1', a2: 'a1', a3: 'a2', proposalForm: 'step5', preview: 'proposalForm' }[st.view])
  },
  discover: () => go('a1'),
  cancelMini: () => go('step1'),
  mini() {
    const name = st.view === 'a1' ? 'goal' : 'week'
    setMini(name, st.mini.raw[name] ?? '')
    if (st.mini.errors[name]) return firstInvalid({ [name]: 1 })
    if (st.view === 'a1') return go('a2')
    st.mini.rate = C.hourlyReference(st.mini.goal, st.mini.week)
    st.mini.raw.rate = num(st.mini.rate); delete st.mini.errors.rate
    go('a3')
  },
  useMini() {
    setMini('rate', st.mini.raw.rate ?? '')
    if (st.mini.errors.rate) return firstInvalid({ rate: 1 })
    st.s.hourlyRate = st.mini.rate; st.s.raw.hourlyRate = st.mini.raw.rate; delete st.s.errors.hourlyRate
    go('step1')
  },
  forget() { store('local', s => s.removeItem(KEY.rate)); st.s.hourlyRate = null; st.s.raw.hourlyRate = ''; render(); save() }, // senão next() regrava o valor
  theme() {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = t; store('local', s => s.setItem(KEY.theme, t))
  },
  inc(btn) {
    const { name, dir } = btn.dataset, f = FIELDS[name]
    const cur = name === 'revisionCount' ? st.s[name] * 100 : st.s[name]
    const next = Math.min(f.max, Math.max(0, cur + dir * f.unit))
    const raw = name === 'revisionCount' ? String(next / 100) : C.plainDuration(next)
    setField(name, raw); const el = $(`#f-${name}`); if (el) el.value = raw; refresh(); save()
  },
  costModal: btn => openModal('cost', { i: btn.dataset.i == null ? null : +btn.dataset.i, ret: 'ret' in btn.dataset }),
  commercialModal: () => openModal('commercial'),
  fieldModal: btn => openModal('field', { fs: btn.dataset.f.split(' ') }),
  costsModal: () => openModal('costs'),
  calendar() { const d = C.validDate(st.s.deliveryDate) ? new Date(st.s.deliveryDate + 'T00:00:00') : new Date(); openModal('calendar', { y: d.getFullYear(), m: d.getMonth() }) },
  resetModal: () => openModal('reset'),
  historyModal: () => openModal('history'),
  hoursModal: () => openModal('hours'),
  tip(b) { const open = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', open); b.nextElementSibling.hidden = !open },
  rail(btn) { if (st.maxStep >= 4) st.fromResult = true; go(btn.dataset.to) },
  go: btn => go(btn.dataset.to),
  createProposal: () => go('proposalForm'),
  useRef() { st.s.commercialEdited = false; render(false); save() },
  preview() {
    const { errors } = C.proposal(st.s, st.p)
    st.p.errors = errors; st.shown.costDesc = true
    if (Object.keys(errors).length) return firstInvalid(errors)
    surveySet({ since: surveyGet().since + 1 }) // conta propostas geradas para a regra do "Agora não"
    go('preview')
  },
  async share() {
    const status = $('[data-out="status"]')
    try {
      await navigator.share({ title: st.p.projectName.trim(), text: shareText() }); status.textContent = ''
    } catch (e) { if (e.name !== 'AbortError') status.textContent = 'Não foi possível compartilhar. Tente copiar a proposta ou salvar em PDF.' }
  },
  async copy() {
    const status = $('[data-out="status"]')
    try { await navigator.clipboard.writeText(shareText()); status.textContent = 'Proposta copiada. Cole no aplicativo em que deseja enviar.' }
    catch { status.textContent = `Não foi possível copiar. Tente ${canShare ? 'compartilhar ou ' : ''}salvar em PDF.` }
  },
  print: () => print(),
}

function pressKey(btn) {
  const k = btn.dataset.key, inModal = dlg.contains(btn)
  if (k === 'ok') return (inModal ? MODAL_ACTS : actions)[btn.dataset.ok]()
  const input = inModal ? dlg.querySelector('#mdv') : $('#dv'); let v = input.value
  if (k === 'del') v = v.slice(0, -1)
  else if (k === 'clear') v = ''
  else if (k === ',') { if (!v.includes(',')) v = (v || '0') + ',' }
  else if (k === 'h') { if (!v.includes('h')) v = (v || '0') + 'h' }
  else if (!v.includes('h') || v.split('h')[1].length + k.length <= 2) v += k // depois do h, no máximo 2 dígitos de minutos
  input.value = v
  input.dispatchEvent(new Event('input', { bubbles: true }))
}
const bump = (input, dir) => { // ↑/↓ no teclado físico (QC-DEC-017); campo de horas anda 1 h
  const dur = FIELDS[input.dataset.field]?.dur
  input.value = dur ? C.plainDuration(Math.max(0, (C.parseDuration(input.value).value ?? 0) + dir * 60)) : C.plain(Math.max(0, (C.parseHundredths(input.value).value ?? 0) + dir * 100))
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

// ---------- eventos ----------
app.addEventListener('click', e => {
  const key = e.target.closest('[data-key]'); if (key) return pressKey(key)
  const r = e.target.closest('input[name="scope"]')
  if (r) { // escolher fecha o acordeão; clicar na já escolhida limpa
    const v = st.s.scopeDefinition === r.value ? null : r.value
    r.checked = !!v; st.s.scopeDefinition = v; r.closest('details').open = false; refresh(); save(); return
  }
  const tr = e.target.closest('[data-track]'); if (tr) track(tr.dataset.track)
  const btn = e.target.closest('[data-act]'); if (btn) { if (TRACK[btn.dataset.act]) track(TRACK[btn.dataset.act]); actions[btn.dataset.act](btn) }
})
app.addEventListener('input', e => {
  const t = e.target, d = t.dataset
  if ('field' in d) setField(d.field, t.value)
  else if ('mini' in d) setMini(d.mini, t.value)
  else if ('p' in d) { st.p[d.p] = t.value; delete st.p.errors[d.p] }
  else return
  refresh(); save()
})
app.addEventListener('focusout', e => { // valida ao sair do campo
  const id = e.target.getAttribute('aria-describedby')?.split(' ')[0]?.slice(2)
  if (id && (e.target.value ?? '') !== '') { st.shown[id] = true; refresh() }
})
document.addEventListener('keydown', e => {
  if (dlg.open) return
  const t = e.target
  if (t.id === 'dv' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); return bump(t, e.key === 'ArrowUp' ? 1 : -1) }
  if (e.key === 'Enter' && t.matches?.('input')) { e.preventDefault(); ($('[data-key="ok"]') || $('.cta'))?.click() }
  if (e.key === 'Escape' && !t.matches?.('textarea')) actions.back()
})

render(false)
consent('privacidade/')
