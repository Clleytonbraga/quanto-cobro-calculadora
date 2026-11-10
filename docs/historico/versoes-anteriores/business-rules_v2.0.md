# Fiz a Conta · Business Rules

**Versão:** 2.0 · **Data:** 09/11/2026
**Versão anterior:** v1.1 (12/10/2026), em `historico/versoes-anteriores/business-rules_v1.1.md`.
**Base:** QC-DEC-001 a QC-DEC-038 (`decision-log.md` v2.3) e `PRD.md` v2.0.
**Código de referência:** branch `edicao`, `calc.js` (regras puras) e `app.js` (telas e estado).
**Precedência:** este documento detalha validação, precisão, valores iniciais e estados. Em conflito, vale o Decision Log. Depois, este documento. Depois, PRD, Architecture, Design System e Handoff.

Nome anterior do produto: "Quanto Cobro?". O nome atual é **Fiz a Conta** (QC-DEC-026). As chaves técnicas `quantoCobro.*` não mudam.

Convenções:

- **[DEC-nnn]**: regra aprovada no Decision Log.
- **[TÉC]**: parâmetro técnico. Pode mudar sem decisão de produto (QC-DEC-014).
- **[CÓDIGO]**: comportamento do código atual sem decisão própria no Decision Log. Ver §17.
- **Pendente**: lacuna sem decisão. A pergunta está no texto e em §17.

## O que mudou da v1.1 para a v2.0

| Tema | Antes (v1.1) | Agora (v2.0) | Decisão |
| --- | --- | --- | --- |
| Nome | Quanto Cobro? | Fiz a Conta | QC-DEC-026 |
| Unidade das horas | Centésimos de hora | Minutos inteiros | QC-DEC-027 |
| Entrada de horas | Decimal ("1,5") | "1h30", "1 h 30 min", "12" ou "1,5". Tecla h | QC-DEC-027, 028 |
| Data de entrega | Data única | Data única ou Período, em dias corridos | QC-DEC-029 |
| Etapa 3 | Steppers | Data e Horas por rodada são campos que abrem modais | QC-DEC-030 |
| Escopo | Só informação | Com Parcial ou Aberto, a etapa 4 mostra uma dica | QC-DEC-031 |
| Resultado | Lista de composição | Cupom V1: blocos Tempo e Dinheiro | QC-DEC-032 |
| Termos | Referência, valor comercial | Valor calculado, Valor da proposta | QC-DEC-021, 032 |
| Custos | Linhas na etapa | Modal com "Aplicar". Excluir só na edição | QC-DEC-019 |
| Proposta | Copiar e imprimir | Compartilhar V2. Marca "Feito com Fiz a Conta" | QC-DEC-036, 037 |
| Publicidade | Slot no resultado | Removida | QC-DEC-034 (supera 020) |
| Medição | Não definida | GA4 só após aceite. Pesquisa de 5 estrelas | QC-DEC-036 |
| Persistência | 3 chaves | 5 chaves. Rascunho no formato v3 | QC-DEC-036 |
| App | Site | PWA instalável e offline. APK de teste | QC-DEC-038 |
| Textos | Com travessão | Sem travessão | QC-DEC-035 |

---

## 1. Fórmula

```text
horas_revisao       = rodadas_de_revisao × horas_por_rodada
horas_totais        = horas_de_execucao + horas_revisao + horas_a_mais_pelo_prazo + horas_para_imprevistos
mao_de_obra         = horas_totais × valor_por_hora
custos_do_projeto   = soma(valor de cada custo)
valor_calculado     = mao_de_obra + custos_do_projeto
```

- Data de entrega, período e escopo **nunca** entram na fórmula.
- Não existe percentual nem multiplicador.
- O Valor da proposta não altera o Valor calculado.
- A dica de escopo (§5) não altera o cálculo [DEC-031].

## 2. Campos obrigatórios e opcionais [DEC-005]

| Campo (estado) | Nome na tela | Obrigatório | Regra | Bloqueia |
| --- | --- | --- | --- | --- |
| `hourlyRate` | Valor por hora | Sim | > 0 | Etapa 1 |
| `executionHours` | Horas de execução | Sim | > 0 (minutos) | Etapa 2 |
| `scopeDefinition` | Escopo | Não | `well_defined`, `partial`, `open` ou vazio | Nunca |
| `deliveryDate`, `deliveryEnd`, `dateMode` | Data de entrega | Não | ver §6 | Nunca |
| `revisionCount` | Rodadas de revisão | Não (0) | inteiro ≥ 0 | Etapa 3, se inválido |
| `revisionHoursPerRound` | Horas por rodada | Não (0) | ≥ 0 (minutos) | Etapa 3, se inválido |
| `deadlineImpactHours` | Horas a mais pelo prazo | Não (0) | ≥ 0 (minutos) | Etapa 3, se inválido |
| `reserveHours` | Horas para imprevistos | Não (0) | ≥ 0 (minutos) | Etapa 4, se inválido |
| `directCosts[]` | Custos do projeto | Não (lista vazia) | ver §7 | Nunca na etapa (o modal valida) |

- Campo opcional vazio vale 0.
- Sem escopo, o Resultado mostra "Escopo: não informado (não altera o valor)".

## 3. Valores iniciais [DEC-006]

- Rodadas de revisão, Horas por rodada, Horas a mais pelo prazo e Horas para imprevistos começam em 0.
- Custos do projeto começa vazio.
- Nenhum campo vem com exemplo preenchido.
- Único pré-preenchimento: o Valor por hora salvo no aparelho (§11).
- Caso sem opcionais: Valor calculado = Valor por hora × Horas de execução.

## 4. Precisão e arredondamento [DEC-007, DEC-027]

### 4.1 Representação

| Grandeza | Unidade inteira | Exemplo |
| --- | --- | --- |
| Dinheiro | centavos | R$ 92,38 = `9238` |
| Horas do orçamento | **minutos** [DEC-027] | 1 h 30 min = `90` |
| Rodadas de revisão | inteiro | 2 |
| Horas por semana do Estimar | centésimos de hora | 20 h = `2000` |

- Não use ponto flutuante em valores de dinheiro.
- QC-DEC-027 supera QC-DEC-007 só para as horas do orçamento. Dinheiro continua em centavos. O Estimar continua em centésimos.

### 4.2 Entrada de dinheiro

- Aceite vírgula ou ponto como separador decimal.
- "2.400" (grupo de milhar com ponto) vale 2400.
- Aceite "R$" e espaços. O app ignora esses caracteres.
- Use no máximo **2 casas**. Mais casas é erro de campo: "Use no máximo 2 casas decimais."
- Sinal de menos é erro: "Use zero ou um valor positivo."
- Texto que não é número é erro: "Digite um número, por exemplo 12,5."

### 4.3 Entrada de horas [DEC-027, DEC-028]

Formatos aceitos:

| Entrada | Resultado |
| --- | --- |
| `1h30` | 90 min |
| `1 h 30 min` | 90 min |
| `1h` | 60 min |
| `2h5` | 125 min (2 h 5 min) |
| `12` | 720 min (sem h, o número vale horas) |
| `1,5` | 90 min |

- Depois do h, use de 0 a 59 minutos. Acima de 59 é erro: "Depois do h, use de 0 a 59 minutos."
- No teclado do app, o h aceita no máximo 2 dígitos depois dele [DEC-028].
- Número decimal de horas aceita até 2 casas. O app converte para minutos com arredondamento metade para cima. Exemplo: 1,33 h = 79,8 min = **80 min** [CÓDIGO]. Pendente: ver §17, item 1.
- Texto inválido é erro: "Digite as horas, por exemplo 12 ou 1h30."
- A tecla h substitui a vírgula na etapa 2 e no modal "Horas por rodada" [DEC-028].

### 4.4 Cálculo

```text
mao_de_obra_exata   = horas_totais_min × valor_por_hora_centavos       (unidade: 1/60 de centavo)
mao_de_obra         = arred(mao_de_obra_exata, 60)
valor_calculado     = arred(mao_de_obra_exata + custos_centavos × 60, 60)
arred(n, d)         = ⌊(2n + d) / (2d)⌋        (metade para cima, n e d ≥ 0)
```

- Faça **um único arredondamento**, no final, para centavos.
- Os subtotais do visor usam a mesma regra sobre os mesmos inteiros.
- Não arredonde a composição separadamente para "fechar" o total.

### 4.5 Exibição

- Dinheiro: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. Resultado e proposta mostram sempre 2 casas ("R$ 2.600,00").
- O visor pode omitir ",00" quando o valor é inteiro ("R$ 2.600").
- Horas na tela: "1 h 30 min", "12 h", "45 min".
- Horas no campo editável: "1h30", "12".

### 4.6 Valor por hora sugerido (Estimar) [DEC-037]

```text
valor_hora_sugerido_centavos = arred(meta_centavos × 10000, horas_semana_centesimos × 433)
```

- Equivale a `meta ÷ (horas_semana × 4,33)`, com um arredondamento para centavos.
- Exemplo: R$ 8.000 e 20 h por semana = 9237,875 = **R$ 92,38/h**.
- O valor sugerido é editável na tela 3 do Estimar. Ele precisa ser > 0.
- "Usar este valor" leva o valor para a etapa 1. O app grava no aparelho só quando a pessoa confirma a etapa 1 (§11).
- O balão "Por que 4,33?" explica: "Um mês tem, em média, 4,33 semanas (52 semanas do ano ÷ 12 meses)."
- As 3 telas têm o seletor "Já sei / Estimar". "Já sei" volta para a etapa 1.
- A tela da meta mensal não tem Voltar. As telas da meta e das horas por semana não têm "Cancelar". A tela 3 tem "Cancelar" [DEC-037].

## 5. Escopo [DEC-031]

- O menu de escopo fica na etapa 2. É opcional.
- Opções: **Bem definido**, **Parcialmente definido**, **Aberto**.
- Tocar de novo na opção escolhida limpa a escolha.
- Com **Parcialmente definido** ou **Aberto**, a etapa 4 mostra uma dica: "Considere horas para imprevistos. O valor só muda se você preencher."
- A dica não preenche nenhum campo. Ela não muda o cálculo.

## 6. Data de entrega e período [DEC-012, DEC-029, DEC-030]

### 6.1 Campo

- "Data de entrega (opcional)" é um campo na etapa 3. Ele abre o modal de calendário [DEC-030].
- Sem data, o campo mostra "Escolher".
- Formato interno: `YYYY-MM-DD` (data local).

### 6.2 Modos

| Modo (`dateMode`) | Nome na tela | Como escolher | Campo mostra |
| --- | --- | --- | --- |
| `single` | Data única | 1 toque no dia. O modal fecha | "18 out 2026" |
| `range` | Período | 1º toque = início, 2º toque = fim | "3 nov a 14 nov" e "12 dias corridos" |

- No Período, se o 2º dia vem antes do 1º, o app inverte os dois.
- "Hoje" conta como um toque.
- "Limpar" apaga início e fim e fecha o modal.
- Trocar de modo apaga a data de fim.
- Período com só o dia de início vale como data única [CÓDIGO].

### 6.3 Dias corridos [DEC-029]

```text
dias_corridos = (fim − início em dias) + 1        (conta os 2 dias)
```

Exemplo: 3 nov a 14 nov = **12 dias corridos**.

### 6.4 Avisos [DEC-012, DEC-015]

- Data de início no passado: aviso não bloqueante "Essa data já passou. Confira antes de enviar a proposta."
- Data malformada: aviso "Data inválida; ela não aparecerá na proposta." A data vale como não informada.
- O app não verifica se a data de fim está no passado [CÓDIGO].

### 6.5 Efeito

- A data e o período **nunca** mudam o valor.
- Proposta com período: "Período: 3 nov a 14 nov".
- Proposta com data única: "Entrega: 18 out 2026".
- Sem data válida, a proposta omite a linha.

## 7. Custos do projeto [DEC-001, DEC-011, DEC-019]

Cada item tem `description` (texto) e `amount` (centavos).

### 7.1 Modal "Adicionar custo" / "Editar custo"

| Situação | Resultado |
| --- | --- |
| Valor vazio | Erro no modal: "Informe o valor deste custo." |
| Valor negativo ou não numérico | Erro no modal. O item não entra |
| Valor zero | Aceito (`amount ≥ 0`) |
| Valor válido, descrição vazia | Aceito. Soma no cálculo. Bloqueia a proposta (§10) |
| Valor e descrição válidos | Aceito |

- "Aplicar" grava o item. "Cancelar" descarta a edição.
- "Excluir custo" existe só dentro de "Editar custo" [DEC-019]. Não pede confirmação.
- Como o modal só aceita itens com valor, não existe linha vazia na lista. A regra antiga "linha vazia é ignorada" não se aplica mais.
- Descrições iguais são permitidas.
- No máximo 50 itens. Com 50, o botão "+ Adicionar" some [TÉC].
- Na lista, item sem descrição aparece como "Sem descrição".

### 7.2 No resultado e na proposta

- O cupom do resultado mostra "Custos do projeto (N)" e o total. O ícone de editar abre o modal "Custos do projeto".
- A proposta lista cada item como descrição e valor, sob "Custos incluídos no valor" [DEC-015].

## 8. Valor da proposta [DEC-008, DEC-015, DEC-032]

Termos: **Valor calculado** = resultado da fórmula. **Valor da proposta** = valor que o cliente vê.

- Estado: `commercialValue` (centavos), `commercialEdited` (booleano) e `refAtEdit` (Valor calculado no momento da edição).
- **Início:** o Valor da proposta é igual ao Valor calculado.
- **Sem edição:** o Valor da proposta acompanha o Valor calculado.
- **Com edição:** o Valor da proposta fica fixo.
- Se o Valor calculado muda depois da edição, o cupom mostra: "O valor calculado mudou, mas o valor da proposta foi mantido." com a ação **"Usar valor calculado"**.
- "Usar valor calculado" volta a acompanhar o Valor calculado.
- **Campo vazio** ao aplicar: volta a acompanhar o Valor calculado [DEC-015].
- **Zero ou negativo:** erro "Informe um valor maior que zero." [DEC-015]
- O modal "Valor da proposta" mostra o Valor calculado como placeholder.
- A proposta usa sempre o Valor da proposta.

## 9. Resultado: cupom V1 [DEC-032]

Ordem na tela:

1. Visor: "Valor calculado", em destaque.
2. Bloco **Tempo**: total de horas e barra com Execução, Revisões, Prazo e Imprevistos. Cada item da legenda abre o modal de edição do campo.
3. Bloco **Dinheiro**: "N h × Valor por hora" com a mão de obra, e "Custos do projeto (N)" com o total.
4. **Valor da proposta** em marca-texto, com ícone de editar.
5. "Escopo: X (não altera o valor)".
6. Ações: **Criar proposta** e "Novo orçamento".

- O cupom não repete a linha "Valor calculado" [DEC-032].
- Os modais de edição do resultado validam com as mesmas regras das etapas.
- "Editar revisões" edita Rodadas de revisão e Horas por rodada juntas.

## 10. Proposta [DEC-002, DEC-013, DEC-015, DEC-036, DEC-037]

### 10.1 Dados

- O app pede os textos só depois de **Criar proposta** [DEC-002].
- "Nome do projeto (obrigatório)": `projectName`.
- "O que será entregue (obrigatório)": `scopeSummary`.
- "Condições e observações (opcional)": `notes`.
- Obrigatórios: não vazios depois de remover espaços.

### 10.2 Validação ao tocar em "Ver proposta"

- Nome vazio: "Informe o nome do projeto."
- Resumo vazio: "Descreva o escopo em poucas palavras."
- Custo sem descrição: "Há custo sem descrição." com a ação "Descrever custos".
- Com erro, o app não abre a prévia. O foco vai para o primeiro campo com erro.

### 10.3 Conteúdo da proposta

Linhas, nesta ordem:

1. Nome do projeto.
2. "Escopo: …".
3. "Período: …" ou "Entrega: …" (§6). Sem data, omitir.
4. "Revisões incluídas: N rodadas" ("1 rodada" no singular). Com 0, omitir [DEC-015].
5. "Custos incluídos no valor:" e um item por linha. Sem custos, omitir.
6. "Valor: R$ X" (Valor da proposta).
7. "Observações: …". Vazio, omitir.
8. "Feito com Fiz a Conta" e o link do site [DEC-036].

- A prévia usa sempre o estado atual. Nada de exemplo em produção.
- A proposta não mostra a matemática interna.
- O texto da proposta é texto puro. O app escapa HTML na tela.
- O texto da proposta nunca vai para o GA4.

### 10.4 Ações da prévia (Compartilhar V2) [DEC-037]

| Ação | Comportamento |
| --- | --- |
| Enviar pelo WhatsApp | Abre `wa.me` com o texto da proposta |
| Histórico | Abre o teste de interesse (§12) |
| Copiar | Copia o texto. Status: "Proposta copiada. Cole no aplicativo em que deseja enviar." |
| PDF | Abre a impressão do navegador |
| Mais | Compartilhamento nativo. Aparece só se o aparelho tem `navigator.share` |

- Falha ao copiar: "Não foi possível copiar. Tente compartilhar ou salvar em PDF." (sem "compartilhar" se não houver Mais).
- Falha ao compartilhar: "Não foi possível compartilhar. Tente copiar a proposta ou salvar em PDF."

### 10.5 Edição depois da prévia [DEC-013]

- Voltar da prévia leva ao formulário. Os textos ficam preservados.
- "Voltar ao resultado" leva ao Resultado. A prévia reflete as mudanças.

## 11. Persistência [DEC-003, DEC-009, DEC-010, DEC-036]

| Dado | Onde | Chave | Quando grava |
| --- | --- | --- | --- |
| Valor por hora | `localStorage` | `quantoCobro.hourlyRate` | Ao confirmar a etapa 1 com valor válido. Ao aplicar o Valor por hora no modal do resultado |
| Tema | `localStorage` | `quantoCobro.theme` | Ao alternar o tema |
| Escolha de privacidade | `localStorage` | `quantoCobro.consent` | Ao tocar em Aceitar (`granted`) ou Recusar (`denied`) |
| Pesquisa de 5 estrelas | `localStorage` | `quantoCobro.survey` | Ao gerar prévia, responder ou tocar em "Agora não" |
| Orçamento em andamento | `sessionStorage` | `quantoCobro.currentEstimate.v1` | A cada mudança de campo ou tela |

- As chaves `quantoCobro.*` não mudam com o nome novo [DEC-026].
- O rascunho guarda `{ v: 3, st }`. `st` tem tela atual, cálculo, textos da proposta e Estimar. No v3, as horas estão em minutos.
- Rascunho com outra versão: o app descarta sem aviso e começa vazio, com o Valor por hora salvo.
- Armazenamento bloqueado: o app funciona só na memória e não mostra "salvo".
- "salvo neste dispositivo" aparece só quando o valor do campo é igual ao valor gravado.
- **"Apagar valor salvo"** remove `quantoCobro.hourlyRate` **e limpa o campo** da etapa 1 [CÓDIGO]. A v1.1 dizia que o campo continuava preenchido. Pendente: ver §17, item 2.
- O app não grava em definitivo orçamento, histórico de propostas ou dados do cliente.
- Textos da proposta ficam só na sessão, nunca no `localStorage`.

## 12. Freemium [DEC-036]

### 12.1 Fase 0: medir

- GA4 carrega **só depois** de "Aceitar" no aviso de privacidade.
- Sem aceite, nenhum evento sai.
- Os eventos nunca levam valores, horas, nomes ou textos do orçamento. Lista em `architecture.md` §14.
- A página `/privacidade/` permite mudar a escolha.

### 12.2 Pesquisa de 5 estrelas

- Título: "O Fiz a Conta ajudou você?". Nota de 1 a 5.
- Aparece só depois de "Salvar PDF e recomeçar".
- Estado em `quantoCobro.survey`: `done`, `last`, `skipped`, `since`.
- Regra de exibição: `!done` e mais de 30 dias desde `last` e (`!skipped` ou `since ≥ 3`).
- Cada prévia gerada soma 1 em `since`.
- "Enviar" sem estrela: erro "Toque numa estrela para dar a nota."
- "Enviar": grava `done = true`. A pessoa não vê mais a pesquisa.
- "Agora não": grava `last = agora`, `skipped = true`, `since = 0`.
- Fechar o modal sem responder não grava nada [CÓDIGO]. Pendente: ver §17, item 4.

### 12.3 Fase 1: teste de interesse "Histórico"

- O botão Histórico abre o modal "Histórico de propostas".
- A pessoa informa o e-mail e marca a caixa de aceite.
- E-mail inválido: "Digite um e-mail válido, por exemplo voce@email.com."
- Caixa não marcada: "Marque a caixa para aceitar o e-mail de aviso."
- O app envia o e-mail para o Brevo, lista #3. Não existe login.
- Falha de rede: "Não foi possível salvar. Confira a internet e tente de novo."
- Sucesso: modal "Pronto".
- Contas GA4 e Brevo: só a conta pessoal do responsável.

### 12.4 Fase 2

Assinatura. Só com demanda comprovada. Não iniciada.

## 13. Novo orçamento [DEC-010]

- "Novo orçamento" aparece no Resultado e na prévia da proposta.
- O app sempre pede confirmação em modal: "Começar um novo orçamento?".
- No Resultado: "Os dados deste orçamento e da proposta serão apagados. Seu valor por hora e o tema continuam salvos." Ações: "Cancelar" e "Apagar e recomeçar".
- Na prévia: o texto avisa que o orçamento não fica salvo. Ações: "Salvar PDF e recomeçar", "Apagar e recomeçar" e "Cancelar".
- "Salvar PDF e recomeçar": abre a impressão, apaga o rascunho e, se a regra permitir, mostra a pesquisa (§12.2).
- Ao recomeçar: o app apaga `quantoCobro.currentEstimate.v1` e volta à etapa 1. Valor por hora e tema continuam.

## 14. Limites técnicos [DEC-014] [TÉC]

Os tetos evitam estouro numérico e quebra de layout. Eles **não** são regra de negócio. Valores em `calc.js` (`LIMITS`).

| Campo | Teto | Valor interno |
| --- | --- | --- |
| Valor por hora | R$ 99.999,99 | 9.999.999 centavos |
| Horas de execução, Horas a mais pelo prazo, Horas para imprevistos | 9.999 h 59 min cada | 599.999 min |
| Rodadas de revisão | 99 | 99 |
| Horas por rodada | 999 h 59 min | 59.999 min |
| Custos do projeto (itens) | 50 | 50 |
| Valor de cada custo | R$ 9.999.999,99 | 999.999.999 centavos |
| Descrição do custo | 120 caracteres | 120 |
| Valor da proposta | R$ 999.999.999,99 | 99.999.999.999 centavos |
| Meta mensal (Estimar) | R$ 9.999.999,99 | 999.999.999 centavos |
| Horas por semana (Estimar) | > 0 e ≤ 168 h | 16.800 centésimos |
| Nome do projeto | 120 caracteres | 120 |
| O que será entregue, Observações | 2.000 caracteres cada | 2000 |

- Número acima do teto: erro "Valor acima do limite aceito pela calculadora."
- Texto: o campo para de aceitar caracteres no limite (`maxlength`). Não há contador.
- Com esses tetos, todos os inteiros do §4.4 ficam abaixo de `Number.MAX_SAFE_INTEGER`. `test.mjs` e `docs/calc-reference.mjs` verificam isso.

## 15. Mensagens de erro e aviso

Textos de `calc.js` (`MSG`) e `app.js`.

| Caso | Mensagem |
| --- | --- |
| Valor por hora vazio ou ≤ 0 | "Informe um valor por hora maior que zero." |
| Horas de execução vazias ou ≤ 0 | "Informe as horas de execução para continuar." |
| Valor negativo | "Use zero ou um valor positivo." |
| Rodadas não inteiras | "Use um número inteiro de rodadas." |
| Mais de 2 casas | "Use no máximo 2 casas decimais." |
| Número inválido | "Digite um número, por exemplo 12,5." |
| Horas inválidas | "Digite as horas, por exemplo 12 ou 1h30." |
| Minutos acima de 59 | "Depois do h, use de 0 a 59 minutos." |
| Acima do teto | "Valor acima do limite aceito pela calculadora." |
| Custo sem valor | "Informe o valor deste custo." |
| Custo sem descrição (proposta) | "Adicione uma descrição para incluir este custo na proposta." |
| Nome do projeto vazio | "Informe o nome do projeto." |
| Resumo vazio | "Descreva o escopo em poucas palavras." |
| Horas por semana = 0 (Estimar) | "Informe quantas horas por semana você consegue cobrar de clientes." |
| Meta mensal = 0 ou Valor da proposta = 0 | "Informe um valor maior que zero." |
| Data no passado (aviso) | "Essa data já passou. Confira antes de enviar a proposta." |
| Data malformada (aviso) | "Data inválida; ela não aparecerá na proposta." |

- O app mostra o erro ao sair do campo (se o campo tem conteúdo) ou ao tocar em Continuar.
- O foco vai para o primeiro campo com erro.

## 16. Casos-teste contratuais

Horas em minutos. C1 a C6 e C8 estão em `test.mjs`. C1 a C7 estão em `docs/calc-reference.mjs`.

| Caso | Entrada | Resultado |
| --- | --- | --- |
| C1 completo | R$ 100/h; execução 10 h; 2 × 2 h; prazo 1 h; imprevistos 0; custos R$ 30 + R$ 20 | 15 h; mão de obra R$ 1.500,00; **Valor calculado R$ 1.550,00** |
| C2 sem opcionais | R$ 100/h; execução 10 h | **R$ 1.000,00** |
| C3 exemplo Figma v1.4 | R$ 100/h; execução 20 h; 2 × 2 h; custos R$ 120 + R$ 80 | 24 h; **R$ 2.600,00** |
| C4 arredondamento | R$ 92,38/h × 1 h 15 min (75 min) | 115,475 = **R$ 115,48** |
| C5 Estimar | R$ 8.000; 20 h por semana | **R$ 92,38/h** |
| C6 Valor da proposta | C1; editar para R$ 1.800; mudar execução para 12 h | Valor calculado R$ 1.750,00; Valor da proposta R$ 1.800,00; aviso; "Usar valor calculado" = R$ 1.750,00 |
| C7 entrada "1h30" | R$ 100/h; execução "1h30" | 90 min; **R$ 150,00** |
| C8 período | C1 com período 3 nov a 14 nov | 12 dias corridos; **R$ 1.550,00** (sem mudança); proposta "Período: 3 nov a 14 nov" |

Os mesmos números aparecem no modelo, no visor, no cupom e no texto da proposta.

## 17. Pendentes

Itens sem decisão no Decision Log. Cada um tem uma pergunta.

| # | Tema | Situação no código | Pergunta |
| --- | --- | --- | --- |
| 1 | Horas decimais viram minutos | "1,33" vira 80 min (arredonda) | Aceitar este arredondamento na entrada como exceção à regra "sem arredondamento silencioso" (QC-DEC-007)? |
| 2 | "Apagar valor salvo" | Apaga a chave e limpa o campo | Manter o campo limpo (código) ou manter o valor no orçamento atual (v1.1)? |
| 3 | Mais de 2 dígitos depois do h no teclado físico | "1h300" vira 1300 h (o teclado do app impede) | Tratar como erro "Depois do h, use de 0 a 59 minutos."? |
| 4 | Pesquisa fechada sem resposta | Não grava nada; pode voltar no próximo PDF | Fechar conta como "Agora não"? |
| 5 | Data de fim no passado | Sem aviso | Avisar também pela data de fim? |
| 6 | Domínio do Fiz a Conta | Site em `clleytonbraga.github.io/quanto-cobro-calculadora/` | Qual domínio final? (Decision Log v2.2) |
| 7 | E-mail de contato LGPD | Página de privacidade mostra "[E-MAIL DE CONTATO]" | Qual e-mail? (Decision Log v2.2) |
| 8 | Texto da pesquisa | Só a nota vai para o GA4 | Qual destino para o texto? Recomendado: Google Forms |
| 9 | Dupla confirmação no Brevo | Desligada | Ativar depois de verificar o telefone? |
| 10 | Rota antiga `/calculadora` | Sem tratamento | Depende do inventário de URLs |

## 18. Fora deste documento

- Briefing (QC-DEC-022 a 025): contrato em `PRD-briefing.md`.
- Visual, tokens e teclado (QC-DEC-017, 018, 033): `design-system.md`.
- Módulos, eventos, PWA e testes: `architecture.md` v2.0.
