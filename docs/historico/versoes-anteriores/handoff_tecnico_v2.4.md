# Fiz a Conta · Handoff Técnico

**Versão documental:** 2.4 · **Atualizado:** 10/11/2026
**Versão anterior:** v2.3 (10/11/2026) em `docs/historico/versoes-anteriores/handoff_tecnico_v2.3.md`.
**Base:** QC-DEC-001 a QC-DEC-042 (`decision-log.md` v2.8) e `PRD.md` v2.5.
**Regras de cálculo e validação:** `business-rules.md` v2.0 e `calc.js`. **Arquitetura:** `architecture.md` v2.0. **Visual:** `design-system.md` v2.0.
**Código de referência:** branch `edicao`, cache `fiz-v35`.
**Regra de conflito:** o Decision Log vence. Registros novos superam os antigos.

Nomes anteriores do produto: "Quanto Cobro?" e "Faz a Conta". O nome atual é **Fiz a Conta** (QC-DEC-026). As chaves `quantoCobro.*` não mudam.

## O que mudou da v1.3 para a v2.0

| Tema | Antes (v1.3) | Agora (v2.0) | Decisão |
| --- | --- | --- | --- |
| Estado do app | Especificação, app não implementado | App implementado e publicado (GitHub Pages) | |
| Unidade das horas | Centésimos de hora | Minutos inteiros. Entrada "1h30". Estimar segue em centésimos | QC-DEC-027 |
| Teclado | Circular, com `CalculatorQuickAdjust` (+1/−1) | "Maquininha" com tecla h. ↑/↓ no teclado físico | QC-DEC-017, QC-DEC-028, QC-DEC-033 |
| Data | Data única | Data única ou Período (`dateMode`, `deliveryEnd`) | QC-DEC-029 |
| Etapa 3 | Steppers | Campos que abrem modais | QC-DEC-030 |
| Resultado | Lista de composição | Cupom V1 com edição por modal | QC-DEC-019, QC-DEC-032 |
| Desktop | Coluna estreita | Variante D, ponto de quebra 1024 px | QC-DEC-018 |
| Publicidade | Slot após o resultado | AdSense aprovado: resultado e guias; código depois do ID da conta | QC-DEC-042 |
| Analytics | Lista sugerida, sem ferramenta | GA4 `G-F2HS60LDV0`, só após aceite, 11 eventos | QC-DEC-036 |
| E-mail | Não existia | Brevo, lista #3, formulário no `app.js` | QC-DEC-036 |
| Proposta | Copiar e imprimir | WhatsApp, Histórico, Copiar, PDF, Mais | QC-DEC-037 |
| Celular | Site responsivo | PWA offline + APK Android de teste | QC-DEC-038 |
| Persistência | 3 chaves | 5 chaves (mais consentimento e pesquisa) | QC-DEC-036 |
| Rascunho | Formato livre | Formato `v: 3` (horas em minutos). Outro formato é descartado | QC-DEC-027 |
| Textos | Com travessão | Sem travessão, também em comentários de código | QC-DEC-035 |

## 1. Escopo

Calculadora web de orçamento para freelancers. Sem login e sem backend.

- 5 etapas: **Valor por hora**, **Execução**, **Prazo e revisões**, **Ajustes**, **Resultado**.
- Mini-fluxo opcional **Estimar** (3 telas).
- Proposta depois do CTA **"Criar proposta"** (QC-DEC-002).
- Tema escuro (padrão) e claro.
- A rota `/` abre a calculadora direto (QC-DEC-004).
- Freemium Fase 0 e Fase 1 implementadas (QC-DEC-036). Fase 2 não iniciada.

## 2. Arquitetura de arquivos

Vanilla HTML, CSS e JS (módulos ES). Sem build, sem framework, sem dependência de npm.

| Arquivo | Papel |
| --- | --- |
| `index.html` | Página do app. Aplica o tema salvo antes de pintar. Carrega `styles.css?v=N` e `app.js?v=N`. Registra `sw.js` |
| `calc.js` | Domínio puro: `LIMITS`, `MSG`, `roundDiv`, `parseHundredths`, `parseDuration`, `calculate`, `hourlyReference`, `commercialValue`, `stepErrors`, `proposal`, formatação (`money`, `moneyShort`, `hours`, `plainDuration`, `plain`, `formatDate`, `period`, `periodDays`, `validDate`, `dateWarning`). Sem DOM |
| `app.js` | Interface: estado, telas (`V`), modais (`MODALS`, `MODAL_ACTS`), teclado (`keypad`, `pressKey`, `bump`), eventos, pesquisa, formulário Brevo |
| `analytics.js` | GA4 e aviso de consentimento: `consent(privacyHref)` e `track(name, params)` |
| `styles.css` | Tokens dos 2 temas, layout mobile e desktop, teclado, cupom, modais, impressão |
| `sw.js` | Service worker. Cache `fiz-vN` |
| `manifest.webmanifest` | PWA: nome, cores `#111315`, ícones 192, 512 e maskable |
| `privacidade/index.html` | Página de privacidade (LGPD). Botão para refazer a escolha de consentimento |
| `guias/index.html` e `guias/*/index.html` | Índice e guias de SEO (HTML estático). Chamam `consent()`. Estilo em `guias/guia.css` |
| `assets/` | Ícones e logos (claro e escuro), ícones PWA, `apple-touch-icon.png`, `og-image.png` |
| `test.mjs` | Testes do domínio (`node:assert`) |
| `package.json` | Só `{"type":"module"}` para o Node rodar `test.mjs` |
| `sitemap.xml`, `google6c04e8926dd49506.html` | SEO e verificação do Search Console |
| `docs/` | Documentação. Versões antigas em `docs/historico/versoes-anteriores/` |

Regras:

- Regra de negócio fica em `calc.js`. `app.js` não calcula.
- Não adicione dependência, bundler ou framework.
- Comentários de código sem travessão (QC-DEC-035).

## 3. Como rodar

1. Abra o terminal na pasta do repositório.
2. Rode o servidor local:

```bash
python3 -m http.server 8000
```

3. Abra `http://localhost:8000/`.
4. Rode os testes:

```bash
node test.mjs
```

O teste imprime `ok` quando todos os casos passam.

Atenção:

- O service worker guarda arquivos em cache. Ao testar uma mudança, use aba anônima ou "Update on reload" no DevTools.
- Abrir `index.html` direto do disco (`file://`) não funciona: o app usa módulos ES.

## 4. Branches e publicação

| Item | Regra |
| --- | --- |
| Repositório | `github.com/Clleytonbraga/quanto-cobro-calculadora` |
| Branch de trabalho | `edicao`. Toda edição acontece aqui |
| Branch publicada | `main`. GitHub Pages publica a partir da `main` |
| Site | `https://fizaconta.com/` (QC-DEC-039). DNS na Cloudflare; arquivo `CNAME` na raiz do repo (não apagar) |
| Publicar | Levar a `edicao` para a `main` só com aprovação explícita do responsável. Aprovado em 09/11/2026 (Decision Log v2.3) |

## 5. Regra do cache: `fiz-vN` = `?v=N`

O nome do cache no `sw.js` é igual ao `?v=` dos arquivos CSS e JS nas 3 páginas (QC-DEC-038).

Ao mudar `styles.css`, `app.js`, `calc.js` ou `analytics.js`:

1. Escolha o próximo número N.
2. Em `sw.js`, mude `CACHE = 'fiz-vN'`.
3. Em `sw.js`, mude os itens `?v=N` da lista `FILES`.
4. Em `index.html`, mude `styles.css?v=N` e `app.js?v=N`.
5. Em `privacidade/index.html`, mude `?v=N`.
6. Em `guias/index.html` e em cada `guias/*/index.html`, mude `?v=N` (CSS, `guia.css` e `analytics.js`).
7. Confira com `grep -rn "?v=" --include=*.html .` e `grep -n "fiz-v" sw.js`.

Comportamento do `sw.js`:

- Instala e guarda as 3 páginas, CSS, JS, manifest e ícones.
- Apaga caches com outro nome ao ativar.
- Navegação: rede primeiro. Sem rede, usa a página guardada ou o app.
- Outros arquivos: cache primeiro.
- Pedidos para outro domínio (GA4, Brevo) **não** passam pelo cache: só rede.

## 6. Contrato de cálculo

```text
HORAS_REVISAO = RODADAS × HORAS_POR_RODADA
TOTAL_HORAS   = EXECUCAO + HORAS_REVISAO + HORAS_A_MAIS_PELO_PRAZO + HORAS_PARA_IMPREVISTOS
MAO_DE_OBRA   = TOTAL_HORAS × VALOR_POR_HORA
CUSTOS        = soma do valor de cada custo do projeto
VALOR_CALCULADO = MAO_DE_OBRA + CUSTOS
```

| Grandeza | Unidade inteira | Decisão |
| --- | --- | --- |
| Dinheiro | Centavos | QC-DEC-007 |
| Horas do orçamento | Minutos | QC-DEC-027 |
| Horas por semana e meta do Estimar | Centésimos | QC-DEC-027 |

Regras:

- Arredonde **uma vez**, no fim, metade para cima (`roundDiv`). `calculate()` calcula `round((horas × valor + custos × 60) ÷ 60)`.
- A data, o período e o escopo **não** entram na fórmula.
- Revisões entram uma vez.
- O valor da proposta não muda o valor calculado.
- Sem percentual de urgência, reserva ou margem.
- Estimar: `valor_hora = meta ÷ (horas_semana × 4,33)`, arredondado 1 vez para centavos (`hourlyReference`).
- Entrada de horas (`parseDuration`): aceita "1h30", "1 h 30 min", "12" e "1,5". Sem "h", o número vale horas. Minutos de 0 a 59.
- Tetos técnicos: `LIMITS` em `calc.js`. Mensagens: `MSG` em `calc.js` (`business-rules.md` §13).

Exemplo do canvas (conferido com `calc.js`): R$ 103/h · 12 h de execução · 2 rodadas × 1 h 30 min · 2 h de imprevistos · 2 custos (R$ 180) = 17 h, mão de obra R$ 1.751,00, **valor calculado R$ 1.931,00**.

## 7. Contrato de estado (`app.js`)

```js
st = {
  view: 'step1',        // step1..step5, a1..a3, proposalForm, preview
  maxStep: 0,           // maior etapa alcançada (trilha do desktop)
  fromResult: false,    // veio do resultado para editar: CTA vira "Ver resultado"
  shown: {},            // erros já mostrados por campo
  s: {                  // orçamento
    hourlyRate,               // centavos, obrigatório > 0
    executionHours,           // minutos, obrigatório > 0
    scopeDefinition,          // 'well_defined' | 'partial' | 'open' | null
    dateMode,                 // 'single' | 'range'
    deliveryDate, deliveryEnd, // 'YYYY-MM-DD' ou ''
    revisionCount,            // inteiro, começa em 0
    revisionHoursPerRound,    // minutos, começa em 0
    deadlineImpactHours,      // minutos, começa em 0
    reserveHours,             // minutos, começa em 0
    directCosts: [{ description, amount }], // amount em centavos, até 50 itens
    commercialValue, commercialEdited, refAtEdit, // valor da proposta (QC-DEC-008)
    errors, raw,              // erros e texto digitado por campo
  },
  p: { projectName, scopeSummary, notes, errors }, // proposta
  mini: { goal, week, rate, raw, errors },        // Estimar
}
```

- Valores derivados (`revisionHours`, `totalHours`, `costs`, `laborCents`, `referenceCents`) vêm de `calculate()`. Não os guarde como entrada.
- O rascunho vai para `sessionStorage` como `{ v: 3, st }`. Outro `v` é descartado.

## 8. Telas e modais

| View | Tela | Próxima |
| --- | --- | --- |
| `step1` | Valor por hora | `step2` (grava o valor por hora) |
| `step2` | Execução + escopo | `step3` |
| `step3` | Prazo e revisões | `step4` |
| `step4` | Ajustes | `step5` |
| `step5` | Resultado (cupom V1) | `proposalForm` |
| `a1`, `a2`, `a3` | Estimar: meta, horas por semana, resultado | `step1` com o valor sugerido |
| `proposalForm` | Prepare sua proposta | `preview` |
| `preview` | Confira sua proposta (Compartilhar V2) | |

Modais (`MODALS` em `app.js`): `calendar`, `hours`, `cost`, `costs`, `field`, `commercial`, `reset`, `survey`, `history`, `historyDone`. Todos usam o `<dialog id="modal">` nativo. Detalhes visuais: `design-system.md` §13.

Navegação:

- Voltar: botão do cabeçalho ou `Esc`. `step1` e `a1` não têm Voltar.
- Com o resultado já alcançado, a trilha do desktop e as edições voltam ao resultado.
- Edição no resultado abre modal. Não leva a pessoa de volta para a etapa.
- "Novo orçamento" pede confirmação. Recomeçar apaga o rascunho e mantém valor por hora e tema (QC-DEC-010).

## 9. Teclado (QC-DEC-017, QC-DEC-028)

- `keypad(ok, hrs)` gera a grade. Com `hrs`, a vírgula vira a tecla `h`.
- `pressKey()` edita o campo do visor (`#dv`) ou do modal (`#mdv`):
  - `del` apaga o último caractere; `clear` limpa;
  - `,` e `h` entram uma vez só;
  - depois do `h`, no máximo 2 dígitos.
- `bump()`: ↑ e ↓ no teclado físico somam ou subtraem 1 (nas horas, 60 minutos).
- `Enter` confirma. Em toque (`pointer: coarse`), o campo usa `inputmode="none"`.
- O campo continua um `<input>` real: aceita teclado físico e tecnologias assistivas.

## 10. Persistência (PRD §15)

| Dado | Onde | Chave |
| --- | --- | --- |
| Valor por hora | `localStorage` | `quantoCobro.hourlyRate` |
| Tema | `localStorage` | `quantoCobro.theme` |
| Escolha de privacidade (GA4) | `localStorage` | `quantoCobro.consent` (`granted` ou `denied`) |
| Estado da pesquisa de 5 estrelas | `localStorage` | `quantoCobro.survey` (`done`, `last`, `skipped`, `since`) |
| Orçamento em andamento | `sessionStorage` | `quantoCobro.currentEstimate.v1` (formato `v: 3`) |

Regras:

- Não grave em definitivo orçamento, histórico ou dados do cliente.
- O valor por hora é gravado ao confirmar a etapa 1 e ao aplicar no modal. "Apagar valor salvo" remove só essa chave (QC-DEC-009).
- "salvo neste dispositivo" aparece só depois da gravação real.
- Todo acesso a storage passa por `try/catch`. Sem storage, o app funciona na aba, em memória.
- O tema é aplicado por um script no `<head>`, antes do CSS, para não piscar.

## 11. GA4 (QC-DEC-036)

| Item | Valor |
| --- | --- |
| ID | `G-F2HS60LDV0` |
| Conta | Só a conta pessoal do responsável |
| Carga | Só depois de "Aceitar" no aviso de privacidade |
| Sem aceite | `track()` não envia nada |
| Dados | Nunca valores, horas ou textos do orçamento |

Eventos (PRD §21):

| Evento | Quando | Onde no código |
| --- | --- | --- |
| `step_viewed` | A pessoa vê uma tela (parâmetro `step`) | `go()` |
| `proposal_started` | Toca em "Criar proposta" | `TRACK.createProposal` |
| `proposal_whatsapp` | Toca em "Enviar pelo WhatsApp" | `data-track` |
| `proposal_shared` | Toca em "Mais" | `TRACK.share` |
| `proposal_copied` | Copia a proposta | `TRACK.copy` |
| `proposal_printed` | Salva o PDF | `TRACK.print`, `pdfReset` |
| `new_budget_started` | Confirma "Novo orçamento" | `resetYes` |
| `rating_submitted` | Envia a nota (parâmetro `rating`) | `surveySend` |
| `rating_skipped` | "Agora não" na pesquisa | `surveySkip` |
| `history_interest_clicked` | Toca em "Histórico" | `TRACK.historyModal` |
| `history_signup_submitted` | Envia o e-mail do Histórico | `historySend` |

Para adicionar um evento: registre no PRD §21 antes. Não envie valor do orçamento.

## 12. Brevo (QC-DEC-036, Fase 1)

| Item | Valor |
| --- | --- |
| Lista | #3 "Fiz a Conta · aviso de lançamento" |
| Conta | Só a conta pessoal do responsável |
| Formulário | URL `BREVO_FORM` em `app.js` (HTML simples do Brevo) |
| Envio | `fetch` `POST`, `mode: 'no-cors'`, campos `EMAIL`, `email_address_check`, `locale`, `html_type` |
| Resposta | Opaca (o Brevo não libera CORS). O app só detecta falha de rede |
| Validação | E-mail com formato válido e caixa de aceite marcada |

O histórico real não existe. O modal é um teste de interesse.

**Pendente:** dupla confirmação no Brevo (exige telefone verificado).

## 13. PWA e APK de teste (QC-DEC-038)

### PWA

- `manifest.webmanifest`: `display: standalone`, `start_url` e `scope` = `./`, cor `#111315`.
- Ícones: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`. iOS: `apple-touch-icon.png` e metas `apple-mobile-web-app-*`.
- Offline: `sw.js` (§5).

### APK Android de teste

| Item | Valor |
| --- | --- |
| Projeto | `~/Developer/fiz-a-conta-android` (local, fora do repositório) |
| Pacote | `com.cleyton.fizaconta`, `minSdk 33`, `targetSdk 37`, versão 0.1 |
| Tipo | WebView com `WebViewAssetLoader` (`https://appassets.androidplatform.net/assets/index.html`) |
| Conteúdo | A tarefa `syncWeb` copia o site de `~/Developer/quanto-cobro` para `app/src/main/assets` a cada build |
| Ponte nativa | Substitui `navigator.share` e `window.print` e desliga o service worker dentro do APK. Botão Voltar do Android fecha o modal ou volta uma tela |
| Saída | `app/build/outputs/apk/debug/app-debug.apk` |
| Loja | Não publicado |

Para gerar o APK:

1. Confira que a branch `edicao` do site está como você quer.
2. Use o JDK do Android Studio:

```bash
cd ~/Developer/fiz-a-conta-android
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" ./gradlew assembleDebug
```

3. Instale `app-debug.apk` no aparelho (por exemplo, `adb install -r`).

O APK usa o código do disco no momento do build. Gere de novo depois de cada mudança no site.

## 14. Tema e tokens

- Fonte única dos valores: `styles.css` (`:root` = claro, `[data-theme="dark"]` = escuro).
- Lista completa e uso: `design-system.md` §3.
- Não crie paleta paralela. Use as variáveis CSS (`--bg-canvas`, `--action`, `--accent-text` e outras).

## 15. Pontos de quebra

| Faixa | Layout |
| --- | --- |
| < 1024 px | Mobile, coluna única, até 560 px, uma tela por dobra |
| altura ≤ 720 px e largura < 1024 px | Mobile compacto |
| ≥ 1024 px | Desktop, Variante D (220 + 452 + 288 px, até 1040 px) |

## 16. Publicidade (QC-DEC-042)

Só implemente o anúncio depois da aprovação da conta AdSense e com o ID dela. Regras do PRD §17:

- lugar permitido: **tela de resultado** (mobile: abaixo de "Novo orçamento", depois do fim da tela; desktop: coluna da direita) e **guias** (1 bloco no meio do texto e 1 depois das dúvidas);
- nunca nas etapas 1 a 4, na prévia da proposta, no PDF ou no texto enviado ao cliente;
- rótulo "Publicidade", espaço fixo reservado e pelo menos 24 px de distância de botões;
- consentimento: um aviso; "Aceitar" libera GA4 e anúncios personalizados; "Recusar" bloqueia o GA4 e mostra só anúncios não personalizados; Europa e Reino Unido usam a ferramenta certificada do Google (AdSense, Privacidade e mensagens);
- rede: Google AdSense (site). O app funciona com bloqueador de anúncio.

## 17. Acessibilidade

- Navegação completa por teclado. `Esc` volta. `Enter` confirma.
- Foco visível (3 px, cor `focus`).
- Rótulo programático em todo campo. Teclas com `aria-label`.
- Erro com `role="alert"` e `aria-invalid` no campo.
- Status da proposta com `role="status"`.
- Alvo de toque ≥ 44 px.
- `prefers-reduced-motion` desliga as animações.
- Não depender só de cor.

## 18. Critérios de aceite

### Cálculo

- Sem extras: valor calculado = valor por hora × execução.
- 2 rodadas de 1 h 30 min = 3 h, somadas uma vez.
- Data, período e escopo não mudam o valor calculado.
- Custos: vários itens, somados em dinheiro, fora das horas.
- Exemplo do canvas dá R$ 1.931,00 (§6).

### Entrada

- "1h30", "1 h 30 min", "12" e "1,5" são aceitos. A tela mostra "1 h 30 min" (QC-DEC-027).
- Depois do h, só 0 a 59 minutos (QC-DEC-028).
- Sem valor por hora > 0 ou execução > 0, o ✓ mostra erro e não avança.
- Rodadas, horas por rodada, prazo e imprevistos começam em 0.

### Telas

- Teclado sem +1/−1. Tecla quadrada, raio 22 px. Só o ✓ é laranja (QC-DEC-017, QC-DEC-033).
- Etapa 3: data e horas por rodada abrem modais. Ícone à esquerda, valor à direita (QC-DEC-030).
- Período mostra "3 nov a 14 nov · 12 dias corridos" (QC-DEC-029).
- Escopo Parcial ou Aberto mostra a dica na etapa 4 (QC-DEC-031).
- Resultado mostra o cupom V1 sem a linha "Valor calculado" (QC-DEC-032).
- Valor da proposta acompanha o valor calculado até ser editado. Depois, aviso + "Usar valor calculado" (QC-DEC-008).
- Estimar: 3 telas com "Já sei / Estimar", balão "Por que 4,33?", sem Voltar na meta, sem "Cancelar" na meta e nas horas (QC-DEC-037).
- Prévia: "Enviar pelo WhatsApp" + Histórico, Copiar, PDF, Mais (QC-DEC-037).
- Proposta mostra "Feito com Fiz a Conta" (QC-DEC-036).
- Cupom ao vivo do desktop mostra "…" para valor não alcançado (QC-DEC-035).
- Nenhum texto com travessão (QC-DEC-035).
- Nenhum anúncio fora do resultado e dos guias (QC-DEC-042).

### Proposta

- Campos da proposta só depois de "Criar proposta".
- Nome e "O que será entregue" são obrigatórios. Custo sem descrição bloqueia (QC-DEC-011).
- A prévia usa o valor da proposta, não o valor calculado por engano.

### Medição e e-mail

- Sem "Aceitar", nenhum pedido vai para o Google.
- Nenhum evento leva valor, hora ou texto do orçamento.
- Pesquisa: no máximo 1 vez a cada 30 dias. "Agora não" volta depois de 3 propostas. Quem respondeu não vê mais.
- Histórico: e-mail inválido ou caixa desmarcada mostra erro e não envia.

### Persistência e app

- Nova sessão recupera valor por hora e tema.
- Atualizar a aba restaura o rascunho. Rascunho de formato antigo é descartado.
- Storage bloqueado não quebra o app.
- O app abre offline depois da primeira visita.
- O site pode ser instalado na tela inicial.
- `fiz-vN` igual ao `?v=N` nas 3 páginas.

## 19. Testes antes de publicar

1. `node test.mjs` imprime `ok`.
2. Fluxo completo no mobile (360 px) e no desktop (1440 px), nos 2 temas.
3. Tela baixa (iPhone SE): cada etapa cabe em uma dobra.
4. Estimar: ida, "Já sei", balão e volta para a etapa 1.
5. Modais: data única, período, horas por rodada, custo, custos, campo, valor da proposta, novo orçamento.
6. Prévia: WhatsApp, Copiar, PDF, Mais, Histórico.
7. Recusar e aceitar o aviso de privacidade. Conferir no DevTools que o GA4 só carrega depois do aceite.
8. Offline: desligar a rede e recarregar.
9. Teclado físico: números, h, ↑/↓, Enter, Esc, Backspace.
10. Busca por travessão nos textos: `grep -rn "$(printf '\342\200\224')" index.html app.js calc.js analytics.js styles.css privacidade guias` (busca o travessão, U+2014) não retorna nada.

## 20. Bugs bloqueadores

Não publique se existir:

- diferença entre o cupom e o valor calculado;
- hora contada 2 vezes;
- perda de estado ao voltar;
- valor da proposta mudando o valor calculado;
- campo obrigatório sem erro compreensível;
- GA4 carregando sem aceite;
- evento com valor do orçamento;
- cache `fiz-vN` diferente do `?v=N`;
- lógica diferente entre mobile e desktop.

## 21. Pendências (PRD §22)

| Pendência | Estado em 09/11/2026 |
| --- | --- |
| Domínio do Fiz a Conta | **Resolvido (QC-DEC-039):** `fizaconta.com`. Falta a propriedade no Search Console |
| E-mail de contato LGPD | **Resolvido (QC-DEC-039):** `contato@fizaconta.com` |
| Destino do texto da pesquisa de 5 estrelas | **Resolvido (QC-DEC-039):** Google Forms. `FEEDBACK_FORM` em `app.js`; campos `entry.1121698133` (nota) e `entry.1615756564` (comentário) |
| Cupom V1 no resultado desktop do canvas | **Pendente.** O app já usa o V1 |
| Dupla confirmação no Brevo | **Pendente.** Exige telefone verificado |
| Registrar o PWA e o APK no Decision Log | **Feito:** QC-DEC-038 |
| Publicar a `edicao` na `main` | **Aprovado** em 09/11/2026 (Decision Log v2.3) |
| Implementar o Briefing (`PRD-briefing.md`) | **Pendente.** Aprovado (QC-DEC-022 a QC-DEC-025), não implementado |
| Destino da rota antiga `/calculadora` | **Pendente.** Depende do inventário de URLs |
| Ressincronizar o DS do Claude Design com o código atual | **Pendente.** Ver `design-system.md` §20 |
| Teste com leitor de tela e em aparelhos reais | **Pendente** |

## 22. Fontes de verdade

| Fonte | Papel |
| --- | --- |
| `decision-log.md` v2.3 | Decisões. Vence em conflito |
| `business-rules.md` v2.0 | Validação, precisão, mensagens |
| `PRD.md` v2.0 | Produto, persistência (§15), eventos (§21), pendências (§22) |
| `architecture.md` v2.0 | Arquitetura e contrato de dados |
| `design-system.md` v2.0 | Tokens, componentes e mapa DS → app → canvas |
| Código (`edicao`) | Comportamento real |
| Canvas Claude Design | https://claude.ai/artifact/NxxNQcMVCfY6TFb7d4DL5Y |
| DS Claude Design | https://claude.ai/artifact/8sDrjN9VbUEgw3vRciSLCz |

Regra de trabalho: tela nova vai primeiro como prancheta no canvas para aprovação. Depois vai para o código.
