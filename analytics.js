// GA4 só depois do "Aceitar" (LGPD). Sem aceite, track() não envia nada.
// Nunca enviar valores, horas ou textos do orçamento (architecture.md §14).
const ID = 'G-F2HS60LDV0', KEY = 'quantoCobro.consent'
const store = v => { try { return v === undefined ? localStorage.getItem(KEY) : localStorage.setItem(KEY, v) } catch { return null } }
let on = false

function load() {
  if (on) return
  on = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', ID)
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`
  document.head.append(s)
}

export const track = (name, params) => { if (on) window.gtag('event', name, params) }

// Mostra o aviso só na primeira visita. A escolha fica salva neste aparelho.
export function consent(privacyHref) {
  const c = store()
  if (c === 'granted') return load()
  if (c === 'denied') return
  const bar = document.createElement('div')
  bar.className = 'consent'
  bar.setAttribute('role', 'region')
  bar.setAttribute('aria-label', 'Aviso de privacidade')
  bar.innerHTML = `<p>Usamos o Google Analytics para saber como o app é usado. Seus valores e textos não são enviados. <a href="${privacyHref}">Privacidade</a></p>
    <div class="split"><button type="button" class="secondary sm" data-c="denied">Recusar</button><button type="button" class="cta" data-c="granted">Aceitar</button></div>`
  bar.addEventListener('click', e => {
    const v = e.target.closest('[data-c]')?.dataset.c
    if (!v) return
    store(v)
    bar.remove()
    if (v === 'granted') load()
  })
  document.body.append(bar)
}
