# Fiz a Conta · Design System

**Versão documental:** 2.0 · **Atualizado:** 09/11/2026
**Versão anterior:** v1.5 (13/10/2026) em `docs/historico/versoes-anteriores/design-system_v1.5.md`.
**Base:** QC-DEC-001 a QC-DEC-038 (`decision-log.md` v2.3) e `PRD.md` v2.0.
**Código de referência:** branch `edicao`, cache `fiz-v30` (`styles.css`, `app.js`, `index.html`).
**Design System publicado (Claude Design):** https://claude.ai/artifact/8sDrjN9VbUEgw3vRciSLCz (namespace `FazAConta`, 20 componentes).
**Canvas de telas aprovadas:** https://claude.ai/artifact/NxxNQcMVCfY6TFb7d4DL5Y ("Fiz a Conta · Telas", 28/10/2026).
**Regra de conflito:** o Decision Log vence. Registros novos superam os antigos.

Nomes anteriores do produto: "Quanto Cobro?" (até 13/10/2026) e "Faz a Conta" (13/10 a 28/10/2026). O nome atual é **Fiz a Conta** (QC-DEC-026).

## O que mudou da v1.5 para a v2.0

| Tema | Antes (v1.5) | Agora (v2.0) | Decisão |
| --- | --- | --- | --- |
| Nome e marca | Quanto Cobro? com selo provisório "VH" | Fiz a Conta. Ícone "a" e wordmark do Figma `125:72` | QC-DEC-026 |
| Teclado | Teclas circulares de 72 px com +1/−1 | Teclado "maquininha" sem ±1. Tecla quadrada, raio 22 px, relevo 2 px | QC-DEC-017, QC-DEC-033 |
| Horas | Vírgula decimal | Tecla **h** nas horas ("1h30") | QC-DEC-027, QC-DEC-028 |
| Desktop | Coluna estreita de 480 a 640 px (faixa v1.4) | Variante D: faixa do visor, trilha, aparelho e cupom ao vivo | QC-DEC-018 |
| Visor e dobra | Visor mais campo | O visor é o campo. Cada tela em uma dobra | QC-DEC-019 |
| Etapa 3 | Steppers para data e horas por rodada | Campos que abrem modais 3a e 3b | QC-DEC-029, QC-DEC-030 |
| Escopo | Só informação | Dica na etapa 4 com Parcial ou Aberto | QC-DEC-031 |
| Resultado | Lista de composição | Cupom V1: blocos Tempo e Dinheiro, valor em marca-texto | QC-DEC-032 |
| Publicidade | Slot no resultado e na prévia | Sem publicidade. `AdSlot` só reservado | QC-DEC-034 |
| Textos | Com travessão | Sem travessão. Valor vazio no cupom ao vivo: "…" | QC-DEC-035 |
| Freemium | Não existia | "Feito com Fiz a Conta", modal Histórico, pesquisa 5 estrelas, aviso de consentimento | QC-DEC-036 |
| Proposta | Copiar e PDF | Compartilhar V2: WhatsApp + Histórico, Copiar, PDF, Mais | QC-DEC-037 |
| Estimar | Link "Descobrir referência" | Seletor "Já sei / Estimar" e balão "Por que 4,33?" | QC-DEC-037 |
| App no celular | Não existia | PWA instalável com ícones 192, 512 e maskable | QC-DEC-038 |
| Referência visual | Figma FINAL v1.4 | Canvas Claude Design + DS `FazAConta`. Figma fica para marca e Variante D | QC-DEC-018, QC-DEC-026 |

## 1. Papel e princípios

O sistema visual reforça uma ideia: **ferramenta de cálculo, não dashboard**.

A interface usa 3 metáforas. Use estas antes de inventar outra:

1. **Visor:** número grande, alinhado à direita.
2. **Teclado "maquininha":** entrada numérica.
3. **Cupom de bobina:** imprime a conta e a proposta.

Princípios:

- números antes de ornamento;
- uma ação dominante por tela;
- 3 níveis de superfície, sem sombra para separar níveis;
- contraste forte;
- mobile-first, uma tela por dobra;
- tema escuro é o padrão; tema claro é completo, com a mesma hierarquia;
- gramática de calculadora, sem copiar a Calculadora da Apple (sem 4 operações, sem símbolos dela).

## 2. Marca

| Item | Valor | Fonte |
| --- | --- | --- |
| Nome | Fiz a Conta | QC-DEC-026 |
| Assinatura | "Seu trabalho tem um preço. Calcule." | `index.html` (meta description) |
| Wordmark | Figma `87RIlysRO3vHEDm7Ghdzf3`, nó `125:72` | QC-DEC-026 |
| Ícone | Letra "a". Não mudou com o nome novo | QC-DEC-026 |
| Arquivos | `assets/icon-light.svg`, `assets/icon-dark.svg`, `assets/logo-light.svg`, `assets/logo-dark.svg` | código |
| Sufixos | `-dark` = versão para o tema escuro (tinta clara). `-light` = tema claro | README do DS |
| Ícones PWA | `assets/icon-192.png`, `assets/icon-512.png`, `assets/icon-maskable-512.png`, `assets/apple-touch-icon.png` | QC-DEC-038 |
| Imagem social | `assets/og-image.png` (1200×630) | código |
| Chaves técnicas | `quantoCobro.*` e namespace `FazAConta` não mudam | QC-DEC-026 |

Regras:

- No mobile, o cabeçalho mostra o **ícone** (`.mark`, 30×30 px).
- No desktop (≥ 1024 px), o cabeçalho mostra o **wordmark** (`.wordmark`, 22 px de altura).
- O app troca a versão clara e escura pelo atributo `data-theme` (classes `.th-light` e `.th-dark`).
- Não recolorir a marca.
- A marca usa `brand-orange` `#FE8903` (wordmark) e `brand-orange-icon` `#FC9017` (ícone). Esses laranjas **não** são o laranja de ação. Não use o laranja da marca na interface.
- A proposta mostra a linha **"Feito com Fiz a Conta"** (QC-DEC-036). Ver §14.

**Pendente:** unificar ou não `brand-orange` com `action`.

## 3. Cor

### 3.1 Tokens do app

Valores conferidos em `styles.css`. O tema claro fica em `:root`. O tema escuro fica em `[data-theme="dark"]`. `index.html` abre com `data-theme="dark"`.

| Variável CSS | Token do DS | Claro | Escuro | Uso |
| --- | --- | --- | --- | --- |
| `--bg-canvas` | `bg-canvas` | `#F7F7F5` | `#111315` | Fundo da página |
| `--bg-surface` | `bg-surface` | `#FFFFFF` | `#191C1F` | Folha de modal, faixa e aparelho do desktop, opção do acordeão |
| `--bg-raised` | `bg-raised` | `#F0F1F2` | `#23272B` | Cartão, tecla, campo, acordeão, segmentado, botão secundário |
| `--text-primary` | `text-primary` | `#181A1D` | `#F5F5F2` | Conteúdo |
| `--text-secondary` | `text-secondary` | `#626970` | `#A7ADB3` | Fórmula do visor, ícones, links neutros, rótulos de campo |
| `--text-muted` | `text-muted` | `#7A8188` | `#8F969D` | Apoio, dicas, caixa-alta, placeholder |
| `--border` | `border` | `#D7DADD` | `#343A40` | Divisórias, borda de campo, trilho da barra |
| `--border-strong` | `border-strong` | `#B7BCC1` | `#4B535B` | Alça da folha, anel do dia de hoje, estrela apagada |
| `--action` | `action` | `#FF9500` | `#FF9F0A` | Fundo laranja: CTA, tecla ✓, progresso, opção marcada |
| `--on-action` | `on-action` | `#17191C` | `#17191C` | Texto sobre `action` |
| `--accent-text` | `accent-text` | `#B84F00` | `#FFB340` | Texto de destaque: acento do visor, totais, "+ Adicionar", tecla h |
| `--focus` | `focus` | `#C65E00` | `#FFB340` | Anel de foco |
| `--error` | `error` | `#B42318` | `#FF6961` | Erro, borda inválida, ação destrutiva |
| `--on-error` | `on-error` | `#FFFFFF` | `#17191C` | Texto sobre `error` |
| `--warning` | `warning` | `#8A5A00` | `#FFD60A` | Aviso de data no passado |

### 3.2 Tokens do cupom

O papel do cupom fica claro nos 2 temas.

| Variável CSS | Claro | Escuro | Uso |
| --- | --- | --- | --- |
| `--paper` | `#FFFFFF` | `#F5F5F2` | Papel |
| `--paper-line` | `#E2E4E6` | `#D9DBDD` | Pontilhado, tracejado, cor "Imprevistos" na barra |
| `--ink` | `#181A1D` | `#17191C` | Texto, cor "Execução" na barra |
| `--ink-soft` | `#6B7075` | `#6B7075` | Data, linhas futuras, cor "Prazo" na barra |
| `--hl` | `#FFE3B8` | `#FFE3B8` | Marca-texto (linha atual, valor da proposta) |

### 3.3 Valores fixos no CSS

Estes valores estão escritos direto no `styles.css`. O DS dá nome a eles.

| Valor | Token do DS | Uso |
| --- | --- | --- |
| `rgba(184, 79, 0, .12)` | `note-bg` | Fundo do aviso dentro do cupom |
| `#7A3300` | `note-text` | Texto do aviso dentro do cupom |
| `rgba(0, 0, 0, .55)` | `scrim` | Fundo atrás do modal |
| `rgba(127, 127, 127, .15)` | `hover-tint` | Hover do botão ✏️ |

### 3.4 Regras de cor

- `action` é sempre **fundo**. Para texto laranja, use `accent-text`.
- Só a tecla ✓ é laranja no teclado.
- Use `error` só para erro e ação destrutiva.
- Use `warning` só para o aviso de data.
- O verde do WhatsApp (`#25D366` no DS) fica só no ícone. **Divergência:** o app usa `currentColor` no ícone (ver §20).
- Contraste no tema claro: `text-muted` fica entre 3,5:1 e 3,9:1. `accent-text` sobre `bg-raised` fica em 4,47:1. Não use `text-muted` para informação essencial. **Pendente:** correção de contraste.

## 4. Tipografia

Uma família: a fonte do sistema. Não há arquivo de fonte.

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
font-variant-numeric: tabular-nums;
```

| Estilo | Tamanho e peso | Onde |
| --- | --- | --- |
| Visor (mobile) | `clamp(44px, 9.6dvh, 80px)`, 400 | `.value` |
| Visor (resultado e proposta, mobile) | `clamp(40px, 8dvh, 64px)` | `.calc.wide .value` |
| Visor (tela baixa ≤ 720 px) | 38 px | media query |
| Visor (desktop) | 68 px | `.value` ≥ 1024 px |
| Unidade do visor | 0,48 em, 500, opacidade 0,72 | `.value .unit` |
| Acento do visor | 16 px, 600, `accent-text` | `.display .accent` |
| Fórmula do visor | 14 px, `text-secondary` | `.display .formula` |
| Pergunta (mobile) | 19 px, 600 | `h1` |
| Pergunta (desktop) | 28 px, 600 | `h1` ≥ 1024 px |
| Título de modal | 18 px | `dialog h2` |
| CTA | 17 px, 600 | `.cta` |
| Texto base e campos | 16 px, altura de linha 1,45 | `body`, `.input` |
| Linha de cartão | 15 px | `.txt`, `.costs li` |
| Apoio | 13 px, `text-muted` (14 px no desktop) | `.support` |
| Dica | 12 px, `text-muted` | `.hint`, `small` |
| Caixa-alta | 12 px, 600, espaçamento 0,08 em | `.eyebrow`, rótulo do visor |
| Cupom | 13 px | `.ticket` |
| Cabeçalho do cupom | 12 px, 700, espaçamento 0,14 em | `.ticket h2` |
| Total do cupom | rótulo 15 px, valor 20 px 800 | `.ln.total` |
| Valor da proposta (cupom V1) | 22 px, 800 | `.v1 .prop button` |

Regras:

- O número do visor é o maior elemento da tela.
- O visor encolhe pelo número de caracteres (`--chars`, calculado no JS). O número nunca é cortado.
- Hierarquia por peso (400, 600, 700, 800). Não use itálico, exceto em "Sem descrição".

## 5. Espaço, forma e raios

| Token | Valor | Uso |
| --- | --- | --- |
| `--pad` | 16 px | Margem lateral no mobile e padding da folha |
| `--gap` | 12 px | Espaço entre blocos da tela |
| `--kgap` | 12 px | Espaço entre teclas no mobile |
| `--cta` | 56 px | Altura do CTA |
| Alvo mínimo | 44 px | Botão-ícone, link, dia do calendário |

| Elemento | Raio | Classe |
| --- | --- | --- |
| Tecla | 22 px | `.key` |
| CTA | 28 px (pílula) | `.cta` |
| Botão secundário | 26 px (52 px de altura) | `.secondary` |
| Cartão | 20 px | `.card` |
| Acordeão | 16 px | `.acc` |
| Campo e opção | 14 px | `.input`, `.opt` |
| Segmentado | trilho 18 px, botão 14 px | `.segmented` |
| Folha de modal | 24 px (só em cima no mobile) | `dialog` |
| Faixa do visor (desktop) | 28 px | `.band` |
| Aparelho (desktop) | 44 px | `.device` |
| Cupom | 6 px em cima, serrilha de 7 px embaixo | `.ticket` |
| Aviso de privacidade | 20 px | `.consent` |

Regras:

- Bordas de 1 px em `border`, só para dividir linhas e contornar campos.
- Estado aberto ou marcado: anel de 1,5 a 2 px em `action`.
- Sem sombra para separar superfícies. A exceção é o relevo da tecla (§7).

## 6. Layout

### 6.1 Mobile (até 1023 px)

- A rota `/` abre a calculadora direto (QC-DEC-004).
- Coluna única, largura máxima de 560 px, margem lateral de 16 px.
- **Cada tela cabe em uma dobra** (QC-DEC-019). Altura mínima `100dvh`.
- Ordem da tela: cabeçalho → faixa (visor e pergunta) → aparelho (teclado ou cartões) → CTA embaixo.
- No mobile, o visor fica **acima** da pergunta (`.band .q { order: 2 }`).
- O teclado fica no fim da tela (`.pad { margin-top: auto }`).
- Tela baixa (altura ≤ 720 px): o app reduz o visor para 38 px, esconde o apoio e compacta linhas e cupom.

### 6.2 Desktop: Variante D (≥ 1024 px, QC-DEC-018)

| Área | Medida | Conteúdo |
| --- | --- | --- |
| Página | até 1040 px | `.calc` |
| Faixa do visor | `bg-surface`, borda, raio 28 px, padding 18×36 px | Pergunta à esquerda, valor à direita |
| Coluna 1 | 220 px | Trilha de etapas (`StepRail`) + acordeão "Atalhos do teclado" |
| Coluna 2 | 452 px | Aparelho-calculadora (`.device`, raio 44 px) |
| Coluna 3 | 288 px | Cupom ao vivo "Seu orçamento" (fixo ao rolar) |

Regras:

- No desktop, o progresso do cabeçalho some. A trilha assume.
- O escopo fica em acordeão dentro do aparelho. Fechado, mostra a opção escolhida em `accent-text`.
- Texto de apoio do escopo: 12 px (o frame do Figma tem 8 px, abaixo do legível).
- Modal: centralizado, 420 px, raio 24 px.
- No resultado e na proposta, a coluna 3 fica vazia (sem cupom ao vivo e sem anúncio).

### 6.3 Pontos de quebra

| Faixa | Regra |
| --- | --- |
| < 1024 px | Mobile |
| ≥ 1024 px | Desktop, Variante D |
| altura ≤ 720 px e largura < 1024 px | Mobile compacto |

## 7. Teclado "maquininha" (QC-DEC-017, QC-DEC-028, QC-DEC-033)

Grade 4×4:

```text
1   2   3   ⌫
4   5   6   C
7   8   9   ✓
00  0   ,   ✓
```

- Nas horas, a vírgula vira **h**: etapa 2 e modal "Horas por rodada" (QC-DEC-028).
- Depois do h, aceite no máximo 2 dígitos de minutos (0 a 59).
- Exemplo: 1, h, 3, 0 = "1 h 30 min". Sem h, o número vale horas (QC-DEC-027).
- Sem teclas +1/−1. ↑ e ↓ no teclado físico somam ou subtraem 1 (nas horas, 1 h).

| Propriedade | Valor | Fonte |
| --- | --- | --- |
| Forma | Quadrada, raio 22 px | QC-DEC-033 |
| Relevo | Sombra de 2 px embaixo + brilho de 1 px no topo | QC-DEC-033 |
| Ao tocar | A tecla desce 2 px e perde a sombra | `styles.css` |
| Tamanho (mobile) | `clamp(48px, ..., 88px)`: as teclas ocupam a largura | `--key` |
| Tamanho (desktop) | 64 px, espaço 10×32 px | `--key` ≥ 1024 px |
| Fundo | `bg-raised` | `.key` |
| ⌫ e C | `text-secondary` | `.key.fn` |
| ✓ | `action`/`on-action`, 2 linhas de altura, única tecla laranja | `.key.ok` |
| h | `accent-text`, peso 700 | `.key.hkey` |
| Texto | 0,36 × tecla (✓: 0,5 × tecla) | `.key` |

Acessibilidade:

- Teclas são `<button>` com nome: "Corrigir", "Limpar", "Confirmar", "Vírgula", "Separar horas e minutos".
- O grupo tem `role="group"` e `aria-label="Teclado numérico"`.
- Em toque (`pointer: coarse`), o campo usa `inputmode="none"` para não abrir o teclado do sistema.

Use o teclado só em entradas numéricas: valor por hora, horas de execução, meta mensal, horas por semana e horas por rodada. Não use em data, escopo, custos ou textos.

## 8. Visor (QC-DEC-019)

- **O visor é o próprio campo.** Não existe input duplicado.
- Alinhado à direita. Rótulo em caixa-alta acima. Fórmula e acento abaixo.
- No foco, o campo ganha borda inferior de 2 px em `action`.
- Fora das etapas numéricas, o visor mostra um valor calculado (`<output>`).

| Tela | Rótulo | Valor | Fórmula | Acento |
| --- | --- | --- | --- | --- |
| Etapa 1 | Valor por hora | campo R$ | | "salvo neste dispositivo" |
| Etapa 2 | Horas de execução | campo h | 12 h × R$ 103/h | R$ 1.236 até aqui |
| Etapa 3 | Tempo previsto | horas | execução + revisão + prazo | valor até aqui |
| Etapa 4 | Subtotal parcial | R$ | horas × valor/h + custos | com ou sem custos do projeto |
| Resultado | Valor calculado | R$ | horas × valor/h + custos | horas previstas |
| Estimar 1 | Meta mensal | campo R$ | faturamento bruto desejado | impostos não são descontados |
| Estimar 2 | Horas faturáveis / semana | campo h | h × 4,33 = h/mês | 52 ÷ 12 ≈ 4,33 semanas/mês + balão |
| Estimar 3 | Valor por hora estimado | campo R$/h | meta ÷ (h × 4,33) | base inicial, não é preço de mercado |
| Proposta | Valor da proposta | R$ | nome · data ou período | rodadas de revisão |

Nunca mostre um "preço final" antes do resultado. Antes dele, o visor diz "parcial" ou "até aqui".

## 9. Telas

Nomes das etapas no app: **Valor por hora**, **Execução**, **Prazo e revisões**, **Ajustes**, **Resultado**.

| Tela | Título | Corpo | CTA |
| --- | --- | --- | --- |
| Etapa 1 | Quanto você cobra por hora? | Segmentado "Já sei / Estimar", "Apagar valor salvo", teclado | ✓ |
| Etapa 2 | Quantas horas para executar? | Teclado com h, acordeão de escopo (opcional) | ✓ |
| Etapa 3 | Prazo e revisões | Campo "Data de entrega", rodadas (stepper), campo "Horas por rodada", horas a mais pelo prazo (stepper) | Continuar |
| Etapa 4 | Faltou algum custo ou tempo? | Horas para imprevistos (stepper), dica de escopo, custos do projeto | Calcular |
| Resultado | Sua estimativa está pronta | Cupom V1 | Criar proposta + "Novo orçamento" |
| Estimar 1 | Quanto você quer faturar por mês? | Segmentado, teclado | ✓ |
| Estimar 2 | Quantas horas por semana você consegue cobrar? | Segmentado, teclado, balão "Por que 4,33?" | ✓ |
| Estimar 3 | Sua estimativa de valor por hora | Segmentado, cartão com meta, horas e 4,33 + balão | Usar este valor + "Cancelar" |
| Proposta | Prepare sua proposta | Nome do projeto, o que será entregue, condições | Ver proposta + "Voltar ao resultado" |
| Prévia | Confira sua proposta | Cupom "Proposta" + Compartilhar V2 | Enviar pelo WhatsApp + "Novo orçamento" |

Ao voltar do resultado para editar uma etapa, o CTA da etapa vira **"Ver resultado"**.

### 9.1 Estimar (QC-DEC-037)

- As 3 telas mostram o segmentado **"Já sei / Estimar"**. "Já sei" volta para a etapa 1.
- A meta mensal (Estimar 1) não tem Voltar.
- A meta mensal e as horas por semana não têm "Cancelar".
- O balão **"Por que 4,33?"** usa o componente `Info`. Texto: "Um mês tem, em média, 4,33 semanas (52 semanas do ano ÷ 12 meses)."
- O balão: 248 px, `bg-raised`, borda `border-strong`, 13 px. Área de toque de 44 px. Aberto, o "i" fica em `accent-text`.

### 9.2 Compartilhar V2 (QC-DEC-037)

- Botão principal **"Enviar pelo WhatsApp"** (`.cta.wa`, link `wa.me` com o texto da proposta).
- Barra `.shr` com 4 ações: **Histórico**, **Copiar**, **PDF**, **Mais**.
- Cada ação: ícone de 22 px num quadrado de 48 px, raio 16 px, `bg-raised`, rótulo 12 px/600.
- "Mais" só aparece quando o aparelho tem compartilhamento nativo (`navigator.share`).
- Mensagens de estado aparecem em `.status` (`role="status"`), em `accent-text`.

## 10. Campos que abrem modais (QC-DEC-030)

Na etapa 3, "Data de entrega" e "Horas por rodada" são **campos** (`.pick`), não steppers.

- Rótulo em cima (15 px). Botão-campo embaixo, em `bg-surface`.
- **Ícone à esquerda, valor à direita.** Calendário para a data, relógio para as horas.
- Valor vazio: "Escolher" em `text-muted`.
- Período: "3 nov a 14 nov" + "12 dias corridos" em `text-muted` (QC-DEC-029).
- Dica abaixo, 12 px: "Uma data ou um período. Não altera o valor." / "Tempo de cada rodada. Exemplo: 1h30."
- "Horas por rodada" não tem mais − e +.
- O rodapé do cartão mostra "Total em revisões: 2 × 1 h 30 min = 3 h".

Steppers (`StepperRow`) ficam em: rodadas de revisão, horas a mais pelo prazo e horas para imprevistos.

## 11. Dica de escopo (QC-DEC-031)

- O menu de escopo fica na etapa 2, em acordeão: "O escopo já está definido? (opcional)".
- Opções: **Bem definido**, **Parcialmente definido**, **Aberto**. Não abrevie.
- Escolher fecha o acordeão. Tocar de novo na opção marcada limpa a escolha.
- Com Parcial ou Aberto, a etapa 4 mostra a dica `.scope-tip` (`role="note"`):
  - "**Escopo aberto.** Considere horas para imprevistos. O valor só muda se você preencher."
  - "**Escopo parcialmente definido.** Considere horas para imprevistos. O valor só muda se você preencher."
- Estilo: `bg-surface`, raio 14 px, 13 px, título em `accent-text`.
- A dica não muda o cálculo.

## 12. Cupom

Base comum (`.ticket`): papel claro, texto 13 px, cabeçalho em caixa-alta, serrilha embaixo, separador tracejado.

Linha (`.ln`): rótulo · pontilhado · valor, e ✏️ quando editável.

| Variante | Classe | Uso |
| --- | --- | --- |
| `bold` | `.ln.bold` | Subtotal |
| `total` | `.ln.total` | Valor final da proposta |
| `dim` | `.ln.dim` | Etapa futura (`ink-soft`) |
| `cur` | `.ln.cur` | Etapa atual (marca-texto `hl`) |

### 12.1 Cupom do resultado V1 (QC-DEC-032)

Ordem dentro de `.ticket.v1`:

1. Cabeçalho "Orçamento" à esquerda e data à direita.
2. **Bloco Tempo:** rótulo "Tempo · 17 h", barra de 10 px (raio 5 px) e legenda.
   - Cores da barra: Execução `ink`, Revisões `action`, Prazo `ink-soft`, Imprevistos `paper-line`.
   - Cada item da legenda é um botão que abre o modal de edição do campo.
3. **Bloco Dinheiro:** "17 h × R$ 103,00" (✏️ valor por hora) e "Custos do projeto (2)" (✏️ custos).
4. **Valor da proposta** em marca-texto (`hl`, raio 10 px), 22 px/800, com ícone de editar.
5. Aviso, quando o valor calculado muda depois da edição: "O valor calculado mudou, mas o valor da proposta foi mantido." + "Usar valor calculado".
6. Rodapé: "Escopo: Parcialmente definido (não altera o valor)".

Sem a linha "Valor calculado" no cupom. O visor já mostra esse valor.

### 12.2 Cupom da proposta

- Cabeçalho "Proposta" + data.
- Nome do projeto (16 px/700) e texto do escopo.
- "Entrega" ou "Período", "Revisões incluídas: N rodadas", "Custos incluídos no valor".
- Total "Valor" com o valor da proposta.
- "Obs.:" quando há observações.
- Linha final: **"Feito com Fiz a Conta"** (QC-DEC-036).
- Sem ✏️. O cliente não vê a matemática interna.
- É a área de impressão (`.print-area`) do PDF.

### 12.3 Cupom ao vivo (desktop)

- Título "Seu orçamento", subtítulo "atualiza a cada etapa".
- Linhas: valor por hora, execução, revisões, a mais pelo prazo, imprevistos, custos do projeto.
- Prefixo "✓ " na etapa feita e "● " na etapa atual.
- **Valor ainda não alcançado: "…"** (QC-DEC-035).
- Última linha: "Subtotal parcial" (`bold`).
- Aparece nas etapas 1 a 4 e em Estimar 1 e 2.

## 13. Modais

Todos usam o `<dialog id="modal">` nativo. No mobile, a folha sobe de baixo (raio 24 px em cima, alça de 40×4 px). No desktop, fica centralizada com 420 px. Clique no fundo fecha.

Estrutura: título (h2 18 px) → dica → campos → `.split` com Cancelar (secundário) e ação (CTA).

| Modal | Título | Abre a partir de | Ação |
| --- | --- | --- | --- |
| `calendar` (3a) | Data de entrega | Campo da etapa 3 | Segmentado "Data única / Período", calendário, Limpar · Hoje · Fechar |
| `hours` (3b) | Horas por rodada | Campo da etapa 3 | Visor + teclado com h |
| `cost` | Adicionar custo / Editar custo | "+ Adicionar", ✏️ | Aplicar. "Excluir custo" só na edição |
| `costs` | Custos do projeto | ✏️ no resultado | Lista + "+ Adicionar" + Concluir |
| `field` | Editar … / Editar revisões | Legenda do cupom V1, ✏️ | Aplicar |
| `commercial` | Valor da proposta | Marca-texto do cupom V1 | Aplicar. Vazio volta ao valor calculado |
| `reset` | Começar um novo orçamento? | "Novo orçamento" | "Apagar e recomeçar". Na prévia: "Salvar PDF e recomeçar" |
| `survey` | O Fiz a Conta ajudou você? | Depois de "Salvar PDF e recomeçar" | Enviar · Agora não |
| `history` | Histórico de propostas | "Histórico" na prévia | Quero ser avisado · Agora não |
| `historyDone` | Pronto | Envio do e-mail | Fechar |

Calendário: semana começa no domingo. Hoje: anel `border-strong`. Passado: `text-muted` (aceito, com aviso). Escolhido: círculo `action`. Dias do período: faixa `action` a 22%, raio 12 px.

## 14. Freemium na interface (QC-DEC-036)

| Peça | Classe | Regra |
| --- | --- | --- |
| Marca na proposta | `.ticket .brandline` | "Feito com Fiz a Conta" no cupom. O texto compartilhado termina com "Feito com Fiz a Conta: <link do site>" |
| Modal Histórico | `history` | Campo e-mail + caixa de aceite `.optin` ("Aceito receber 1 e-mail do Fiz a Conta sobre o lançamento. Posso cancelar quando quiser."). Sem login |
| Pesquisa 5 estrelas | `.stars` | 5 botões de 60 px, estrela de 52 px. Marcada: `action`. Apagada: `border-strong`. No máximo 1 vez a cada 30 dias. "Agora não" volta depois de 3 propostas. Quem respondeu não vê mais |
| Aviso de consentimento | `.consent` | Barra fixa embaixo no mobile. No desktop, cartão de 420 px no canto inferior direito. Botões "Recusar" (secundário) e "Aceitar" (CTA, 44 px). Link "Privacidade" |

O GA4 só carrega depois de "Aceitar". O aviso aparece só na primeira visita.

## 15. Publicidade (QC-DEC-034)

- **Estado atual: sem publicidade.** Não existe rede de anúncios.
- QC-DEC-034 supera QC-DEC-020 e a extensão dela.
- O componente `AdSlot` do DS fica **só como reserva** para o futuro. O app não renderiza anúncio.
- Lugar futuro permitido: resultado e prévia da proposta.
- Nunca na entrada de dados: campos, perguntas, teclado, Próximo, Voltar.
- Nunca no formulário do cliente do Briefing (QC-DEC-025).
- Se voltar: reservar espaço, rotular como publicidade, não imitar componente do app, manter distância do CTA.

## 16. Estados e acessibilidade

| Estado | Regra visual |
| --- | --- |
| Foco | Contorno de 3 px em `focus`, offset 2 px, em todo elemento interativo |
| Vazio | Placeholder "0" ou "Ex.: …" em `text-muted`. Não usar exemplo como valor |
| Erro | Texto 13 px em `error` perto do campo. Borda `error` (`aria-invalid="true"`). Foco volta ao campo |
| Aviso | Data no passado, 13 px em `warning`. Não bloqueia |
| Destrutivo | `.cta.danger` (`error`/`on-error`). Só em confirmação |
| Salvo | "salvo neste dispositivo" + "Apagar valor salvo", só depois da gravação real |

Checklist:

- contraste AA para texto normal (ver pendência de `text-muted`, §3.4);
- alvo de toque ≥ 44×44 px;
- rótulo programático em todo campo;
- erro com `role="alert"`;
- não depender só de cor;
- ordem de foco igual à ordem visual;
- `Esc` volta uma tela; `Enter` confirma.

## 17. Movimento

- Modal sobe 20 px em 0,2 s.
- Tecla desce 2 px ao tocar.
- Chevron do acordeão gira 180°.
- Barra de progresso muda de cor em 0,25 s.
- Com `prefers-reduced-motion: reduce`, nada anima.

## 18. Escrita de interface

- Português do Brasil, falando com "você". Frases curtas, voz ativa.
- **Sem travessão** em nenhum texto: telas, documentos, títulos e comentários de código (QC-DEC-035). Use vírgula, dois-pontos, ponto ou "·".
- Botões com o verbo da ação: "Continuar", "Calcular", "Criar proposta", "Ver proposta", "Aplicar", "Apagar e recomeçar".
- Diga o que é opcional: "(opcional)", "(obrigatório)", "Não altera o valor".
- Números em pt-BR: `R$ 1.236,00`. Horas: "1 h 30 min". Datas: "27 out 2026".
- Não use emoji. O ✏️ é o ícone de linha `edit`. O ✓ é texto.

| Conceito | Termo na interface |
| --- | --- |
| Total da conta | Valor calculado |
| Valor que o cliente vê | Valor da proposta |
| `hourlyRate` | Valor por hora (cupom: "Valor/hora") |
| `deadlineImpactHours` | Horas a mais pelo prazo (cupom ao vivo: "A mais pelo prazo") |
| `reserveHours` | Horas para imprevistos (cupom: "Imprevistos") |
| `directCosts` | Custos do projeto |
| Mini-fluxo | Estimar (seletor "Já sei / Estimar") |

Nunca use "Valor calculado" e "Valor da proposta" como sinônimos.

## 19. Mapa de componentes: DS → app → canvas

DS `FazAConta` (20 componentes). Classe ou função do app (`styles.css`, `app.js`). Telas do canvas que usam o componente.

| Componente DS | Markup no app | Telas do canvas |
| --- | --- | --- |
| `Brand` | `.brand-mark` com `.mark` (ícone) e `.wordmark`, `.th-light`/`.th-dark` | Todas com `AppHeader` |
| `Icon` | Objeto `ICON` em `app.js` (SVG inline, `currentColor`) | Resultado, PropostaPrevia, HoraV5 |
| `AppHeader` | `header()` → `header.top`, `.lead`, `.icon-btn.back`, `.progress .bar`, `.icon-btn.theme` | Main, Etapa2, Etapa3, Etapa4, Resultado, Proposta, PropostaPrevia, Estimar1 a 3, Desktop* |
| `Display` | `.display` com `label.value` + `input#dv` (campo) ou `output.value`; `.label`, `.formula`, `.accent` | Todas as telas de etapa, Estimar e Proposta; HoraV5 |
| `Keypad` | `keypad(ok, hrs)` → `.pad .keypad .key` (`.fn`, `.ok`, `.hkey`) | Main, Etapa2, Estimar1, Estimar2, DesktopEtapa1; HoraV5 (teclado desenhado à mão, com h) |
| `Segmented` | `.segmented` com `button[aria-pressed]` | Main, Estimar1 a 3, ModalData, DesktopEtapa1 |
| `Card` | `.card` | Etapa3, Etapa4, DesktopEtapa3 |
| `StepperRow` | `stepperRow()` → `.row` + `.stepper` | Etapa3, Etapa4, DesktopEtapa3 |
| `CardFoot` | `.foot` | Etapa3, Etapa4, ModalCustos, DesktopEtapa3 |
| `Accordion` | `details.acc` + `.opts .opt` (escopo); `details.acc.shortcuts` (atalhos) | Etapa2; trilha do desktop |
| `Button` | `.cta`, `.cta.danger`, `.cta.wa`, `.secondary`, `.link`, `.link.accent`, `.link.danger-text`, `.split`, `.actions` | Etapa3, Etapa4, Resultado, Proposta, PropostaPrevia, Estimar3, todos os modais, Desktop* |
| `Field` | `.field` + `.input` ou `textarea` | Proposta, ModalCusto, ModalCampo, ModalValor, ModalHistorico, ModalAvaliacao |
| `Ticket` | `article.ticket`; `.ticket.v1` (resultado); `.ticket.print-area` (proposta) | PropostaPrevia, DesktopEtapa1, DesktopEtapa3, DesktopResultado |
| `TicketLine` | `ln()` → `.ln` (`.bold`, `.total`, `.dim`, `.cur`) + `.emoji` | Resultado, PropostaPrevia, Desktop* |
| `CostList` | `ul.costs` | Etapa4, ModalCustos |
| `Sheet` | `dialog#modal` + `.grab` + `form` | Todos os Modal*, ModalData, HoraV5 |
| `Calendar` | `MODALS.calendar` → `.cal-head`, `.cal`, `.range-sum` | ModalData |
| `StepRail` | `rail()` → `nav.rail .stepbtn` (`.done`, `.todo`, `aria-current`) | DesktopEtapa1, DesktopEtapa3, DesktopResultado |
| `AdSlot` | Sem markup. Reservado (QC-DEC-034) | Nenhuma. Só a nota "Publicidade" do canvas |
| `Info` | `tip()` → `.tipwrap .tipbtn .info` + `.tip`; `.info` também no acordeão de atalhos | Estimar2 (no visor), Estimar3 |

Peças do app **sem componente próprio no DS** (montadas com classes):

| Peça | Classe | Decisão | Tela do canvas |
| --- | --- | --- | --- |
| Campo que abre modal | `.pick` | QC-DEC-030 | Etapa3, DesktopEtapa3 |
| Dica de escopo | `.scope-tip` | QC-DEC-031 | Etapa4 |
| Blocos do cupom V1 | `.v1 .bar`, `.v1 .lg`, `.v1 .prop` | QC-DEC-032 | Resultado |
| Barra Compartilhar V2 | `.shr` | QC-DEC-037 | PropostaPrevia |
| Estrelas da pesquisa | `.stars` | QC-DEC-036 | ModalAvaliacao |
| Aviso de consentimento | `.consent` | QC-DEC-036 | Nenhuma |
| Aceite de e-mail | `.optin` | QC-DEC-036 | ModalHistorico |
| Valor salvo | `.saved` | QC-DEC-009 | Main |
| Rodapé do site | `.site-foot` | Guia de SEO | DesktopResultado |

Lista de telas do canvas (22): Main (1 · Valor por hora), Etapa2, Etapa3, ModalData (3a), HoraV5 (3b), Etapa4, Resultado, Proposta, PropostaPrevia, ModalHistorico, Estimar1, Estimar2, Estimar3, ModalCusto, ModalCampo, ModalCustos, ModalValor, ModalNovo, ModalAvaliacao, DesktopEtapa1, DesktopEtapa3, DesktopResultado.

## 20. Divergências conhecidas

Estado em 09/11/2026. O Decision Log vence. O código atual é a referência de valores.

| # | Onde | Divergência | O que vale |
| --- | --- | --- | --- |
| 1 | Canvas `DesktopResultado` | Usa o cupom antigo ("Fiz a Conta · Orçamento", com "Valor calculado" e "Mão de obra"). O app já usa o cupom V1 no desktop | Cupom V1 (QC-DEC-032). **Pendente:** aplicar no canvas |
| 2 | Canvas `ModalAvaliacao` | Tem campo de texto depois da nota ("Não inclua nomes nem dados de clientes."). O app só envia a nota | App. **Pendente:** destino do texto (recomendado Google Forms) |
| 3 | README do DS e `AdSlot` | Falam de anúncios no resultado e na prévia (QC-DEC-020) | Sem publicidade (QC-DEC-034) |
| 4 | README do DS e token `ticket-head` | Usam "Faz a Conta" ("FAZ A CONTA · ORÇAMENTO") | Fiz a Conta (QC-DEC-026). O cupom do app diz "Orçamento" |
| 5 | DS `Keypad` (README) | Diz que o app publicado usa teclas redondas | O app usa tecla quadrada, raio 22 px (QC-DEC-033) |
| 6 | README do DS (movimento) | Diz que a tecla escala para 0,96 | App e `Keypad` README: a tecla desce 2 px |
| 7 | DS `TicketLine` (README) | Valor não alcançado = travessão | "…" (QC-DEC-035) |
| 8 | DS `Field` (README) | Textarea de 76 px | App: 96 px (3 linhas inteiras) |
| 9 | DS `Icon` | 7 ícones | App tem 13: mais `history`, `printer`, `calendar`, `clock`, `more`, `star` |
| 10 | DS `Sheet` (README) | Lista 6 modais | App tem 10 (§13) |
| 11 | Token `whatsapp` do DS | Verde `#25D366` no ícone | App usa `currentColor` (sem verde) |
| 12 | DS `meta` | Sincronizado em 27/10/2026 com `edicao@00179ba` | Código atual é posterior (`55ffe5e`, `0e4c5c4`). **Pendente:** ressincronizar o DS |
| 13 | DS, pasta `components/Cover` | Existe na exportação, mas fora do namespace e sem README | Não usar até documentar |
| 14 | `styles.css` | Classes órfãs `.ad-slot`, `.band .ad-top`, `.rail-ad` e comentário de QC-DEC-020 | Sem efeito visual. Limpar numa rodada de código |
| 15 | `styles.css` (1ª linha) | Comentário cita "design-system.md v1.4 §4" | Este documento, §3 |
| 16 | `analytics.js` | Botão "Recusar" usa a classe `.secondary.sm`, que não existe no CSS (fica com 52 px) | DS: `secondary-sm` com 44 px. Corrigir no código |
| 17 | Acordeão "Atalhos do teclado" | Lista "0 a 9, vírgula e 00", sem a tecla h | Incluir "h" numa rodada de código |
| 18 | Canvas `Estimar3` e app | Têm "Cancelar" na tela do resultado do Estimar | Permitido: QC-DEC-037 só proíbe "Cancelar" na meta mensal e nas horas por semana |

## 21. Fontes de verdade visual

| Fonte | Papel |
| --- | --- |
| `decision-log.md` v2.3 | Decisões. Vence em conflito |
| `PRD.md` v2.0 | Contrato do produto e termos |
| `styles.css` e `app.js` | Valores reais (cor, raio, tamanho) e markup |
| DS Claude Design `FazAConta` (8sDrjN9…) | Componentes e tokens nomeados |
| Canvas Claude Design (NxxNQcM…) | Telas aprovadas em 28/10/2026 |
| Figma `87RIlysRO3vHEDm7Ghdzf3` | Wordmark (`125:72`), Variante D (`115:2`, Playground `107:2`). Faixa v1.4 é histórico de conteúdo |
| FigJam `LoGu3vG6gQtt9KEGnAJ9CA` | Jornada, fluxo e sitemap (histórico v1.4 e v1.5) |

Tela nova vai primeiro como prancheta no canvas do Claude Design para aprovação. Depois vai para o código.

## 22. Critério de aprovação visual

Uma tela está alinhada quando:

- a pergunta e a ação dominante aparecem sem procurar;
- a tela cabe em uma dobra no mobile;
- o visor fica reconhecível em todas as etapas;
- no resultado, o valor calculado é o número principal do visor;
- o teclado tem tecla quadrada e só o ✓ é laranja;
- a etapa 3 usa campos para data e horas por rodada;
- o cupom V1 mostra Tempo, Dinheiro e o valor da proposta em marca-texto;
- nenhum texto tem travessão;
- nenhum anúncio aparece;
- mobile, desktop e cálculo mostram a mesma informação.

**Pendente:** teste com leitor de tela e em aparelhos reais.

## 23. O que evitar

- dashboards e KPIs decorativos;
- sidebar de produto (a trilha do desktop não é sidebar de produto);
- glassmorphism, sombras pesadas, gradientes sem função;
- cards dentro de cards;
- excesso de chips;
- ícone no lugar de texto claro;
- animação que atrasa o fluxo;
- mais de uma cor de destaque;
- laranja da marca na interface;
- travessão em qualquer texto.
