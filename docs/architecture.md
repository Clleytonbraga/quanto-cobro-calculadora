# Fiz a Conta · Architecture

**Versão documental:** 2.5 · **Atualizado:** 10/11/2026
**Versão anterior:** v2.4 (10/11/2026), em `historico/versoes-anteriores/architecture_v2.4.md`.
**Base:** QC-DEC-001 a QC-DEC-043 (`decision-log.md` v2.9), `PRD.md` v2.5 e `business-rules.md` v2.2.
**Código de referência:** branch `edicao`, cache `fiz-v36`. Implementação de referência das regras numéricas: `docs/calc-reference.mjs`.

Nome anterior do produto: "Quanto Cobro?". O nome atual é **Fiz a Conta** (QC-DEC-026). As chaves `quantoCobro.*` e o namespace `FazAConta` do design system não mudam.

## O que mudou da v1.2 para a v2.0

| Tema | Antes (v1.2) | Agora (v2.0) | Decisão |
| --- | --- | --- | --- |
| Nome | Quanto Cobro? | Fiz a Conta | QC-DEC-026 |
| Stack | Proposta genérica (reducer, TypeScript) | Vanilla HTML, CSS e JS. Sem build. Módulos ES | Código atual |
| Horas | Centésimos de hora | Minutos inteiros. `parseDuration` aceita "1h30" | QC-DEC-027, 028 |
| Data | `deliveryDate` | `deliveryDate`, `deliveryEnd`, `dateMode` | QC-DEC-029 |
| Etapa 3 e custos | Steppers e linhas | Campos que abrem modais (`<dialog>`) | QC-DEC-019, 030 |
| Rascunho | Formato sem versão interna | `{ v: 3, st }` com horas em minutos | QC-DEC-027 |
| Persistência | 3 chaves | 5 chaves (`consent` e `survey` novas) | QC-DEC-036 |
| Publicidade | Componente `AdSlot` | AdSense aprovado (resultado e guias); código entra com o ID da conta | QC-DEC-042 (supera 034) |
| Analytics | Eventos sugeridos | GA4 só após aceite. 11 eventos sem valores | QC-DEC-036 |
| Freemium | Não previsto | Pesquisa de 5 estrelas e teste "Histórico" (Brevo) | QC-DEC-036 |
| Proposta | Copiar e imprimir | Compartilhar V2: WhatsApp, Histórico, Copiar, PDF, Mais | QC-DEC-037 |
| App | Só site | PWA instalável, offline (`sw.js`) e APK de teste | QC-DEC-038 |
| Textos e comentários | Com travessão | Sem travessão | QC-DEC-035 |

## 1. Objetivos

- Cálculo determinístico e testável.
- Custo de operação perto de zero.
- Carregamento rápido.
- SEO nas páginas públicas.
- Nenhum backend próprio no fluxo principal.
- Evolução por fases (freemium), só com dados (QC-DEC-036).

## 2. Premissa principal

O app roda inteiro no navegador. Motivos:

- O cálculo não usa dado secreto.
- Não existe login.
- Não existe histórico em nuvem.
- A persistência é local.
- A proposta é gerada no navegador.

Serviços externos (só rede, nunca no cache offline):

| Serviço | Uso | Quando |
| --- | --- | --- |
| Google Analytics 4 (`G-F2HS60LDV0`) | Eventos de uso | Só depois de "Aceitar" |
| Brevo (formulário, lista #3) | E-mail do teste "Histórico" | Só quando a pessoa envia |
| GitHub Pages | Hospedagem estática | Sempre |

Contas GA4 e Brevo: só a conta pessoal do responsável (QC-DEC-036).

## 3. Arquivos e módulos

| Arquivo | Papel |
| --- | --- |
| `index.html` | Página da calculadora. Aplica o tema salvo antes de pintar. Registra `sw.js` |
| `app.js` | Estado, telas, modais, eventos e persistência. Sem regra de cálculo |
| `calc.js` | Regras puras: `LIMITS`, `MSG`, `parseHundredths`, `parseDuration`, `calculate`, `hourlyReference`, `commercialValue`, `stepErrors`, `proposal`, formatação e datas |
| `analytics.js` | Aviso de privacidade, `consent()` e `track()` do GA4 |
| `styles.css` | Tokens e layout (mobile e desktop) |
| `sw.js` | Service worker: cache `fiz-vN` e modo offline |
| `manifest.webmanifest` | Dados do PWA: nome, ícones, `standalone` |
| `privacidade/index.html` | Página de privacidade. Permite mudar a escolha do GA4 |
| `guias/como-fazer-orcamento-freelancer/` | Guia de SEO |
| `assets/` | Ícones, wordmark, imagem de compartilhamento |
| `test.mjs` | Testes de `calc.js` (`node test.mjs`) |
| `docs/calc-reference.mjs` | Implementação de referência independente (`node docs/calc-reference.mjs`) |

Regras de código:

- `calc.js` não acessa DOM nem armazenamento.
- `app.js` importa `calc.js` e não duplica regra.
- Nenhuma biblioteca de JS. Exceção: `gtag.js` do GA4, só após aceite.

## 4. Telas e fluxo

```text
/  (calculadora direto, QC-DEC-004)
├── step1  Valor por hora ──► a1 Meta mensal ► a2 Horas por semana ► a3 Valor sugerido ► step1
├── step2  Execução (+ menu de escopo)
├── step3  Prazo e revisões (campos: Data de entrega, Horas por rodada)
├── step4  Ajustes (Horas para imprevistos, Custos do projeto, dica de escopo)
├── step5  Resultado (cupom V1)
│    └── proposalForm ► preview (Compartilhar V2)
└── modais: cost, costs, field, commercial, calendar, hours, reset, survey, history, historyDone
```

- `st.view` guarda a tela atual.
- Cada tela é uma função em `V` que devolve título, apoio e corpo.
- `render()` monta a tela inteira. `refresh()` atualiza só os textos derivados (visor, erros, totais).
- Os modais usam `<dialog>` nativo (`showModal`). Clique no fundo fecha.

## 5. Estado

Estado único `st`, salvo em `sessionStorage` (§9).

```ts
type Cents = number     // centavos inteiros
type Minutes = number   // minutos inteiros (QC-DEC-027)
type CentiHours = number // centésimos de hora, só no Estimar

type DirectCost = { description: string; amount: Cents }

type CalculatorState = {
  hourlyRate: Cents | null              // obrigatório > 0 (QC-DEC-005)
  executionHours: Minutes | null        // obrigatório > 0 (QC-DEC-005)
  scopeDefinition: 'well_defined' | 'partial' | 'open' | null
  dateMode: 'single' | 'range'          // QC-DEC-029
  deliveryDate: string                  // 'YYYY-MM-DD' ou ''
  deliveryEnd: string                   // fim do período ou ''
  revisionCount: number                 // inteiro, 0 a 99
  revisionHoursPerRound: Minutes        // 0 por padrão
  deadlineImpactHours: Minutes          // Horas a mais pelo prazo
  reserveHours: Minutes                 // Horas para imprevistos
  directCosts: DirectCost[]             // QC-DEC-001
  commercialValue: Cents | null         // Valor da proposta (QC-DEC-008)
  commercialEdited: boolean             // false = acompanha o Valor calculado
  refAtEdit: Cents | null               // Valor calculado no momento da edição
  errors: Record<string, string>        // erro por campo
  raw: Record<string, string>           // texto digitado por campo
}

type ProposalDraft = { projectName: string; scopeSummary: string; notes: string; errors: Record<string, string> }
type MiniFlow = { goal: Cents | null; week: CentiHours | null; rate: Cents | null; raw: Record<string, string>; errors: Record<string, string> }

type AppState = {
  view: string            // step1..step5, a1..a3, proposalForm, preview
  maxStep: number         // maior etapa alcançada (trilha do desktop)
  fromResult: boolean     // Continuar volta direto ao Resultado
  shown: Record<string, boolean> // erros já mostrados
  s: CalculatorState
  p: ProposalDraft
  mini: MiniFlow
}
```

- `revisionHours` e `totalHours` são derivados. Não guarde.
- Data, período e escopo ficam no estado, mas não entram na fórmula.

## 6. Cálculo (`calc.js`)

```js
export function calculate(s) { // horas em minutos
  const revisionHours = s.revisionCount * s.revisionHoursPerRound
  const totalHours = s.executionHours + revisionHours + s.deadlineImpactHours + s.reserveHours
  const costs = soma(s.directCosts.amount)
  const laborExact = totalHours * s.hourlyRate        // unidade: 1/60 de centavo
  return {
    revisionHours, totalHours, costs,
    laborCents: roundDiv(laborExact, 60),
    referenceCents: roundDiv(laborExact + costs * 60, 60), // um arredondamento, no final
  }
}
export const roundDiv = (n, d) => Math.floor((2 * n + d) / (2 * d)) // metade para cima
export const hourlyReference = (goalCents, weekCentiHours) => roundDiv(goalCents * 10000, weekCentiHours * 433)
export const commercialValue = (s, ref) => (s.commercialEdited && s.commercialValue != null ? s.commercialValue : ref)
```

Contrato:

- Toda a aritmética é inteira.
- `deadlineImpactHours` é só o trabalho adicional declarado. A data não gera acréscimo.
- Sem percentual oculto.
- Custos somam em dinheiro, fora das horas.
- `referenceCents` é o "Valor calculado" da tela.
- Com os tetos de `LIMITS`, os inteiros ficam abaixo de `Number.MAX_SAFE_INTEGER`. `test.mjs` verifica.

## 7. Entrada e validação

### 7.1 Parsers (`calc.js`)

| Função | Entrada | Saída | Usado em |
| --- | --- | --- | --- |
| `parseHundredths(raw, { max, integer })` | "1.234,56", "R$ 92,38", "2.400" | centésimos inteiros (centavos para dinheiro) | Valor por hora, custos, Valor da proposta, Rodadas de revisão, Estimar |
| `parseDuration(raw, { max })` | "1h30", "1 h 30 min", "12", "1,5" | minutos inteiros | Horas de execução, Horas por rodada, Horas a mais pelo prazo, Horas para imprevistos |

- Ambas devolvem `{ value }` ou `{ value: null, error }`. Vazio devolve `{ value: null }`.
- `parseDuration` converte horas decimais para minutos com `roundDiv` (1,33 h = 80 min).
- Formatação para campo editável: `plain()` (dinheiro) e `plainDuration()` ("1h30").
- Formatação para leitura: `money()`, `moneyShort()`, `hours()` ("1 h 30 min").

### 7.2 Validação por etapa (`stepErrors`)

| Etapa | Bloqueia se |
| --- | --- |
| 1 | `hourlyRate` não é > 0 |
| 2 | `executionHours` não é > 0 |
| 3 | erro em Rodadas de revisão, Horas por rodada ou Horas a mais pelo prazo |
| 4 | erro em Horas para imprevistos |

- Custos não bloqueiam a etapa 4. O modal só aceita item com valor válido.
- A proposta valida em `proposal()`: nome, resumo e descrição de cada custo.
- Entrada inválida nunca propaga `NaN` para o visor. O campo guarda o erro e o valor fica `null` (obrigatório) ou o último valor válido.
- Regras e mensagens completas: `business-rules.md` §2 a §8, §14 e §15.

## 8. Navegação

- `/` abre a calculadora direto (QC-DEC-004).
- `go(view)` troca a tela, registra `step_viewed` e salva o rascunho.
- Voltar: botão no cabeçalho (não aparece em `step1` e `a1`) e tecla Esc.
- Ordem de volta: etapa anterior; `a1` → `step1`; `a2` → `a1`; `a3` → `a2`; `proposalForm` → `step5`; `preview` → `proposalForm`.
- Trilha do desktop: só etapas já alcançadas. Depois do Resultado, Continuar volta direto ao Resultado (`fromResult`).
- No Resultado, editar abre modais (`field`, `costs`, `commercial`) e recalcula na hora.
- A proposta abre só depois de "Criar proposta" (QC-DEC-002).

## 9. Persistência

```text
localStorage:
  quantoCobro.hourlyRate     // centavos, como texto
  quantoCobro.theme          // 'light' | 'dark'
  quantoCobro.consent        // 'granted' | 'denied'
  quantoCobro.survey         // JSON { done, last, skipped, since }

sessionStorage:
  quantoCobro.currentEstimate.v1   // JSON { v: 3, st }
```

- Todo acesso passa por `store()`, com `try/catch`. Armazenamento bloqueado: o app funciona na memória.
- O rascunho grava a cada mudança. Versão diferente de 3: o app descarta e começa vazio.
- O nome da chave termina em `.v1`, mas o formato interno é v3. Não renomeie a chave (QC-DEC-026).
- `hourlyRate` grava ao confirmar a etapa 1 e ao aplicar o Valor por hora no modal do resultado (QC-DEC-009).
- "Apagar valor salvo" remove a chave e limpa o campo. Ver `business-rules.md` §17, item 2.
- "Novo orçamento" remove só o rascunho. Valor por hora e tema continuam (QC-DEC-010).
- Nenhum valor do orçamento sai do aparelho.

## 10. Proposta e compartilhamento

- `proposal(s, p)` devolve `{ errors, text }`. O texto é a fonte única para WhatsApp, Copiar e Mais.
- `shareText()` soma ao texto a linha "Feito com Fiz a Conta: <site>" (QC-DEC-036).
- O cupom da prévia (`proposalTicket`) usa os mesmos dados. Ele mostra "Feito com Fiz a Conta".
- Não guarde cópia de data, revisões, custos ou valor. A prévia é sempre derivada do estado.

| Ação | Implementação |
| --- | --- |
| Enviar pelo WhatsApp | Link `https://wa.me/?text=<texto>` |
| Histórico | Modal `history` (§15) |
| Copiar | `navigator.clipboard.writeText` |
| PDF | `window.print()` com folha de impressão (`.print-area`) |
| Mais | `navigator.share`. O botão só aparece se a API existe |

## 11. PDF

- Hoje: impressão do navegador ("Salvar em PDF"). Zero backend.
- Futuro: geração dedicada só se houver necessidade de templates, paginação ou histórico em nuvem.

## 12. Rotas e SEO

| Rota | Conteúdo |
| --- | --- |
| `/` | Calculadora |
| `/privacidade/` | Privacidade (LGPD) |
| `/guias/` | Índice dos guias |
| `/guias/como-fazer-orcamento-freelancer/` | Guia 1 de SEO |
| `/guias/como-calcular-valor-hora-freelancer/` | Guia 2 de SEO |
| `/guias/como-cobrar-revisoes-de-um-projeto/` | Guia 3 de SEO |

- Site: `https://fizaconta.com/` (QC-DEC-039). Canonical, `og:url`, `og:image` 1200×630, `sitemap.xml` e o arquivo `CNAME` usam esse endereço. O endereço antigo do GitHub Pages redireciona para ele.
- Rota antiga `/calculadora`: Pendente. Depende do inventário de URLs.
- Conteúdo de SEO não pode afastar a pessoa da calculadora.

## 13. Publicidade

**Estado atual:** AdSense aprovado como decisão (QC-DEC-042, supera QC-DEC-034). Ainda sem código de anúncio: entra com o ID da conta.

- Lugar permitido: **tela de resultado** (mobile: abaixo de "Novo orçamento", depois do fim da tela; desktop: coluna da direita) e **guias** (1 bloco no meio do texto e 1 depois das dúvidas);
- nunca nas etapas 1 a 4, na prévia da proposta, no PDF ou no texto enviado ao cliente;
- rótulo "Publicidade", espaço fixo reservado e pelo menos 24 px de distância de botões;
- consentimento: um aviso; "Aceitar" libera GA4 e anúncios personalizados; "Recusar" bloqueia o GA4 e mostra só anúncios não personalizados; Europa e Reino Unido usam a ferramenta certificada do Google (AdSense, Privacidade e mensagens);
- rede: Google AdSense (site). O app funciona com bloqueador de anúncio.
- Reserve a altura do slot para evitar CLS. A falha da rede de anúncios não pode bloquear o cálculo.
- O formulário do cliente do Briefing nunca mostra anúncio (QC-DEC-025).

## 14. Analytics (GA4)

### 14.1 Consentimento (`analytics.js`)

- Na primeira visita, o app mostra o aviso com "Recusar" e "Aceitar".
- `granted`: o app carrega `gtag.js` e liga `track()`.
- `denied` ou sem escolha: `track()` não faz nada. O script do GA4 não carrega.
- A escolha fica em `quantoCobro.consent`. A página `/privacidade/` apaga a escolha para o aviso voltar.

### 14.2 Eventos

| Evento | Quando | Parâmetro |
| --- | --- | --- |
| `step_viewed` | Toda troca de tela por `go()` | `step`: nome da tela |
| `proposal_started` | "Criar proposta" | nenhum |
| `proposal_whatsapp` | "Enviar pelo WhatsApp" | nenhum |
| `proposal_shared` | "Mais" | nenhum |
| `proposal_copied` | "Copiar" | nenhum |
| `proposal_printed` | "PDF" ou "Salvar PDF e recomeçar" | nenhum |
| `new_budget_started` | Confirma "Novo orçamento" | nenhum |
| `rating_submitted` | Envia a nota da pesquisa | `rating`: 1 a 5 |
| `rating_skipped` | "Agora não" na pesquisa | nenhum |
| `history_interest_clicked` | Toca em "Histórico" | nenhum |
| `history_signup_submitted` | Envia o e-mail no teste "Histórico" | nenhum |

- Nunca envie valores, horas, nomes, textos ou e-mail ao GA4 (QC-DEC-036).

## 15. Freemium no código

### 15.1 Pesquisa de 5 estrelas (Fase 0)

- `surveyDue()`: `!done` e mais de 30 dias desde `last` e (`!skipped` ou `since ≥ 3`).
- `preview()` soma 1 em `since`.
- O modal `survey` abre só depois de "Salvar PDF e recomeçar".
- O texto livre ainda não tem destino. Pendente (§27).

### 15.2 Teste "Histórico" (Fase 1)

- Modal `history`: e-mail e caixa de aceite.
- Envio: `fetch(BREVO_FORM, { method: 'POST', mode: 'no-cors', body: FormData })`.
- A resposta é opaca (o Brevo não libera CORS). O app só detecta falha de rede.
- Sem login. Sem backend próprio.

## 16. PWA e offline (QC-DEC-038)

- `manifest.webmanifest`: nome "Fiz a Conta", `display: standalone`, ícones 192, 512 e maskable 512.
- `index.html` registra `sw.js`.
- Cache: `fiz-vN`. **Regra:** o N é igual ao `?v=N` dos arquivos CSS e JS nas 3 páginas (`index.html`, `privacidade/`, `guias/…`). Hoje: `fiz-v36`.
- Ao publicar CSS ou JS novo: suba o `?v=` nas 3 páginas e o `CACHE` em `sw.js` juntos.

Estratégia do `sw.js`:

| Pedido | Estratégia |
| --- | --- |
| Navegação (páginas) | Rede primeiro. Offline: cache da página ou do app |
| Arquivos do mesmo site | Cache primeiro. Sem cache: rede e guarda |
| Outros sites (GA4, Brevo) | Não intercepta. Só rede |
| Métodos diferentes de GET | Não intercepta |

- `activate` apaga caches com outro nome.

Faixa "Instalar app" (QC-DEC-043), em `app.js`:

- `installBar()` desenha a faixa logo depois do `header()`, só em `step1` e só se `canInstall()`.
- `canInstall()`: (evento `beforeinstallprompt` guardado **ou** iPhone) **e** largura < 1024 px **e** fora de `display-mode: standalone` e `navigator.standalone` **e** sem a chave `quantoCobro.installDismissed`.
- `beforeinstallprompt`: `preventDefault()`, guarda o evento e redesenha a etapa 1. `appinstalled`: limpa o evento e redesenha.
- Ação `install`: com evento, chama `prompt()` uma vez e descarta o evento; sem evento (iPhone), abre o modal `install`.
- Ação `installClose`: grava `quantoCobro.installDismissed = 1` no `localStorage`.

## 17. APK Android de teste (QC-DEC-038)

- Projeto local `fiz-a-conta-android` (WebView). Fora deste repositório.
- O APK não é publicado em loja.

## 18. Visor

O visor é uma projeção do estado. Não guarde subtotais.

| Tela | Rótulo do visor |
| --- | --- |
| step1 | Valor por hora |
| step2 | Horas de execução |
| step3 | Tempo previsto |
| step4 | Subtotal parcial |
| step5 | Valor calculado |
| proposalForm, preview | Valor da proposta |
| a1, a2, a3 | Meta mensal, Horas faturáveis / semana, Valor por hora estimado |

- O visor é o próprio campo nas telas com entrada numérica (QC-DEC-019).
- Subtotais parciais têm rótulo de parcial.
- O Valor da proposta não altera o Valor calculado.
- Valor vazio no cupom ao vivo: "…" (QC-DEC-035).

## 19. Teclado

- Teclado "maquininha" na tela (QC-DEC-017): 1 a 9, linha `00 · 0 · ,`, coluna `⌫`, `C`, `✓`.
- Nas horas (etapa 2 e modal "Horas por rodada"), a tecla h substitui a vírgula (QC-DEC-028).
- Depois do h, o teclado aceita no máximo 2 dígitos.
- O teclado da tela e o teclado físico escrevem no mesmo campo e disparam o mesmo evento `input`. Não existe segunda lógica.
- Teclado físico: no visor, ↑/↓ soma ou subtrai 1 (1 h nos campos de horas). Enter confirma. Esc volta.
- Em tela de toque (`pointer: coarse`), o campo usa `inputmode="none"` para não abrir o teclado do sistema.

## 20. Layout e responsividade

- Uma só aplicação. Mobile e desktop mudam só o layout.
- Mobile: coluna única, cada tela em uma dobra (QC-DEC-019).
- Desktop: Variante D (QC-DEC-018). Faixa de visor no topo, trilha de etapas à esquerda, aparelho no centro, orçamento ao vivo à direita.

## 21. Segurança e privacidade

- Sem servidor próprio. Nenhum orçamento sai do aparelho.
- `esc()` escapa HTML em todo texto da pessoa mostrado na tela.
- O texto da proposta é texto puro.
- Não existe CSP no HTML hoje. Pendente (§27).
- Página `/privacidade/` descreve armazenamento local, GA4 e Brevo.

## 22. Internacionalização

- App em pt-BR.
- Moeda, números e datas usam `Intl` com `pt-BR`.
- `calculate()` não conhece "R$". A formatação fica em `money()`.

## 23. Testes

Rodar na raiz do projeto:

```bash
node test.mjs                 # testes de calc.js
node docs/calc-reference.mjs  # referência independente
```

Cobertura atual de `test.mjs`:

- casos C1 a C6 com horas em minutos;
- data e escopo não mudam o valor;
- parse de dinheiro (milhar, "R$", 2 casas, negativo, inteiro, teto);
- parse de horas ("1h30", "1 h 30 min", "12", "1,5", "1h", minutos > 59, teto);
- tetos em inteiros seguros;
- obrigatórios por etapa e custo sem descrição;
- texto da proposta (entrega, revisões, custos, observações, linhas omitidas);
- período: "3 nov a 14 nov", 12 dias corridos, sem mudar o valor.

Sem testes automáticos de interface. Teste manual: fluxo completo, voltar e editar, modais, offline, tema claro e escuro, mobile e desktop.

## 24. Evolução futura

- Fase 2 (assinatura) e histórico real: só com demanda comprovada (QC-DEC-036).
- Backend só quando houver necessidade de sincronização ou histórico.
- Briefing (QC-DEC-022 a 025): sem backend, dados no fragmento `#` do link. Contrato em `PRD-briefing.md`.

## 25. Contrato com o design system

- O código usa os tokens de `design-system.md`. Sem cor funcional fora dos tokens.
- Tema claro e escuro com a mesma estrutura.
- Tecla quadrada, raio de 22 px, relevo de 2 px (QC-DEC-033).

## 26. Fontes visuais

- Canvas Claude Design "Fiz a Conta · Telas": telas aprovadas em 28/10/2026 (QC-DEC-026 a 037).
- Figma `87RIlysRO3vHEDm7Ghdzf3`: wordmark no nó `125:72`; desktop Variante D no nó `115:2`; faixa v1.4 como histórico.
- FigJam `LoGu3vG6gQtt9KEGnAJ9CA`: fluxo e sitemap (histórico).

## 27. Pendentes

| # | Tema | Pergunta |
| --- | --- | --- |
| 1 | Domínio final | **Resolvido (QC-DEC-039):** `fizaconta.com`. |
| 2 | Texto da pesquisa | **Resolvido (QC-DEC-039):** Google Forms, implementado |
| 3 | Dupla confirmação no Brevo | Ativar depois de verificar o telefone? |
| 4 | CSP | Adicionar Content-Security-Policy que permita GA4 e Brevo? |
| 5 | Rota `/calculadora` | Qual destino, depois do inventário de URLs? |
| 6 | Regras abertas de entrada | Ver `business-rules.md` §17, itens 1 a 5 |
