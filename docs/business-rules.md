# Quanto Cobro? — Business Rules

**Versão:** 1.1 · **Data:** 12/10/2026
**Base:** QC-DEC-001 a QC-DEC-004 (inalteradas) + QC-DEC-005 a QC-DEC-016 (aprovadas em 12/10/2026, ver `decision-log.md`).
**Precedência:** este documento detalha validação, precisão, padrões e estados. Em conflito com PRD/Architecture/Design System/Handoff, vale o Decision Log e, em seguida, este documento.

Convenções: **[DEC-nnn]** = regra aprovada; **[TÉC]** = parâmetro técnico ajustável sem decisão de produto (QC-DEC-014); **[DERIVADA]** = consequência de regras aprovadas, confirmada em QC-DEC-015.

---

## 1. Fórmula (inalterada)

```text
horas_revisao        = rodadas × horas_por_rodada
horas_totais         = execucao + horas_revisao + impacto_prazo + reserva
mao_de_obra          = horas_totais × valor_hora
custos_diretos_total = soma(valor de cada custo)
referencia_calculada = mao_de_obra + custos_diretos_total
```

Data de entrega e nível de definição do escopo nunca entram na fórmula. Nenhum percentual ou multiplicador. Valor comercial não altera a referência.

## 2. Campos obrigatórios para chegar ao resultado — [DEC-005]

| Campo | Obrigatório | Regra | Bloqueia avanço |
| --- | --- | --- | --- |
| `hourlyRate` | Sim | > 0 | Etapa 1 |
| `executionHours` | Sim | > 0 | Etapa 2 |
| `scopeDefinition` | Não | `well_defined` \| `partial` \| `open` \| vazio | Nunca |
| `deliveryDate` | Não | ver §6 | Nunca |
| `revisionCount` | Não (padrão 0) | inteiro ≥ 0 | Só se inválido |
| `revisionHoursPerRound` | Não (padrão 0) | ≥ 0 | Só se inválido |
| `deadlineImpactHours` | Não (padrão 0) | ≥ 0 | Só se inválido |
| `reserveHours` | Não (padrão 0) | ≥ 0 | Só se inválido |
| `directCosts[]` | Não (lista vazia) | ver §7 | Só se item inválido |

Sem nível de escopo informado, o Resultado mostra "Não informado" e não exibe explicação de categoria.

## 3. Valores iniciais — [DEC-006]

- `revisionCount = 0`, `revisionHoursPerRound = 0`, `deadlineImpactHours = 0`, `reserveHours = 0`, `directCosts = []`.
- Nenhum campo financeiro ou de horas vem pré-preenchido com exemplo. Único pré-preenchimento permitido: `hourlyRate` salvo no dispositivo (§9).
- Caso sem opcionais: `referencia = hourlyRate × executionHours`.

## 4. Precisão e arredondamento — [DEC-007]

### 4.1 Representação
- **Dinheiro:** inteiro em centavos (`R$ 92,38` → `9238`).
- **Horas:** inteiro em centésimos de hora (`1,5 h` → `150`).
- **Rodadas:** inteiro.
- Não usar ponto flutuante para valores monetários em nenhuma etapa do cálculo.

### 4.2 Entrada
- Aceitar vírgula ou ponto como separador decimal; até **2 casas** em dinheiro e em horas.
- Entrada com mais de 2 casas decimais é **erro de campo**, não arredondamento silencioso. Mensagem: "Use no máximo 2 casas decimais."

### 4.3 Cálculo
- `mao_de_obra_exata = horas_totais_centesimos × valor_hora_centavos` (unidade: 1/100 de centavo, exato).
- `referencia_centavos = arred(mao_de_obra_exata + custos_centavos × 100, 100)`.
- **Um único arredondamento**, no final, para centavos, **metade para cima** (`arred(n, d) = ⌊(2n + d) / (2d)⌋`, valores não negativos).
- Subtotais exibidos no visor usam a mesma regra sobre os mesmos inteiros; a composição nunca é arredondada separadamente para "fechar" o total.

### 4.4 Exibição
- Dinheiro: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`, sempre 2 casas no Resultado e na proposta (`R$ 2.600,00`). O visor pode omitir `,00` quando o valor for inteiro.
- Horas: até 2 casas, sem zeros à direita (`1,5 h`, `2 h`, `0,25 h`).

### 4.5 Referência de valor/hora (mini-fluxo)
```text
valor_hora_ref_centavos = arred(meta_centavos × 10000, horas_semana_centesimos × 433)
```
Equivale a `meta ÷ (horas_semana × 4,33)` arredondado uma vez para centavos, metade para cima. Exemplo: R$ 8.000 e 20 h/semana → `9237,875…` → **R$ 92,38/h**. O valor resultante é **editável** antes de ser usado; depois de aceito vira `hourlyRate` comum.

## 5. Valor comercial — [DEC-008]

- Estado: `commercialValue` (centavos) + `commercialValueEdited: boolean`.
- **Inicial:** igual à referência calculada; `commercialValueEdited = false`.
- **Enquanto não editado:** acompanha automaticamente a referência quando qualquer etapa muda.
- **Depois de editado:** fica fixo. Se a referência mudar depois disso, exibir aviso não bloqueante junto ao campo: "A referência mudou para R$ X. Seu valor comercial foi mantido." com ação secundária **"Usar a referência"** (volta a acompanhar; `commercialValueEdited = false`).
- **Campo apagado (vazio):** volta a acompanhar a referência. [DERIVADA]
- **Validação:** número com até 2 casas, > 0, até o teto técnico. Zero ou negativo é erro de campo. [DERIVADA]
- A proposta usa sempre `commercialValue`, nunca `calculatedValue` diretamente.

## 6. Data de entrega — [DEC-012]

- Opcional; formato `YYYY-MM-DD` (data local).
- **Data no passado** (anterior a hoje no fuso local): aviso não bloqueante "Essa data já passou. Confira antes de enviar a proposta." O cálculo e a proposta seguem.
- **Data malformada** (só possível fora do seletor nativo): tratada como não informada, com o mesmo tipo de aviso não bloqueante.
- Data vazia: a proposta omite a linha de entrega.
- Nunca altera valores.

## 7. Custos diretos — [DEC-011] + QC-DEC-001

Cada item: `description` (texto) + `amount` (centavos).

| Situação do item | Cálculo | Proposta |
| --- | --- | --- |
| Descrição + valor válido | Soma | Listado |
| Valor válido, descrição vazia | Soma | **Bloqueia** copiar/imprimir até descrever ou remover |
| Descrição preenchida, valor vazio | **Erro de campo**, bloqueia avançar da etapa 4 ("Informe o valor deste custo.") | — |
| Valor negativo ou não numérico | Erro de campo, bloqueia | — |
| Valor zero | Aceito (invariante `amount ≥ 0`) | Listado |
| Linha totalmente vazia | Ignorada e descartada ao avançar | — |

- Adicionar, editar e remover itens a qualquer momento antes ou depois do Resultado. Remover não pede confirmação (ação reversível pela edição).
- Itens com descrições iguais são permitidos (não há deduplicação).
- Na proposta, cada item aparece como descrição + valor sob o rótulo "Custos incluídos no valor". O valor da proposta continua sendo o valor comercial.

## 8. Proposta — [DEC-013] + QC-DEC-002

- Coleta somente após **Criar proposta**: `projectName`, `scopeSummary`, `notes`.
- **Obrigatórios para copiar/imprimir:** `projectName` e `scopeSummary` (não vazios após remover espaços). `notes` opcional.
- Também bloqueia copiar/imprimir: custo com descrição vazia (§7).
- "Visualizar proposta" pode ser acionado com campos vazios? **Não:** o botão valida os obrigatórios e mostra erro no campo.
- **Edição após a prévia:** permitida. "Editar dados" volta ao formulário com os textos preservados; "Editar cálculo" volta ao Resultado/etapas e a prévia reflete as mudanças.
- A prévia deriva sempre do estado atual: textos digitados + `deliveryDate` + `revisionCount` + `directCosts[]` + `commercialValue`. Nada de exemplo em produção; campos vazios do formulário usam placeholder visualmente distinto de valor preenchido.
- Linhas omitidas: entrega (sem data), revisões (quando 0 → omitir), custos (lista vazia), observações (vazias).
- Texto da proposta é sanitizado (sem HTML) e não é enviado a analytics.

## 9. Persistência — [DEC-009] + QC-DEC-003

- `hourlyRate`: salvo **automaticamente** em `localStorage` ao confirmar a etapa 1 com valor válido (inclusive quando vindo do mini-fluxo). Rótulo "salvo neste dispositivo" só aparece após gravação bem-sucedida.
- Ação visível **"Apagar valor salvo"** na etapa 1 (e onde o rótulo aparecer): remove `quantoCobro.hourlyRate` do armazenamento sem limpar o campo do orçamento atual.
- `theme`: salvo automaticamente ao alternar.
- Rascunho (`quantoCobro.currentEstimate.v1` em `sessionStorage`): todo o `CalculatorState` + `ProposalDraft` [DEC-010], gravado a cada alteração válida.
- Armazenamento indisponível: funcionar em memória, sem exibir "salvo".
- Schema de rascunho incompatível: descartar silenciosamente e iniciar vazio (com `hourlyRate` local, se houver).
- O mini-fluxo de referência não grava nada até "Usar na calculadora"; cancelar volta à etapa 1 sem alterar o valor.

## 10. Reiniciar — [DEC-010]

- Ação "Reiniciar" disponível no Resultado e na proposta.
- Pede **confirmação** em linha (sem `confirm()` nativo): "Começar um novo orçamento? Os dados deste orçamento e da proposta serão apagados. Seu valor/hora e tema continuam salvos." → **Apagar e recomeçar** / **Cancelar**.
- Ao confirmar: remove `quantoCobro.currentEstimate.v1` (cálculo + textos da proposta), volta à etapa 1 com `hourlyRate` local pré-preenchido e tema mantido.
- Textos da proposta permanecem na sessão até reiniciar ou a sessão acabar; nunca em `localStorage`.

## 11. Limites técnicos — [DEC-014] [TÉC]

Tetos existem apenas para evitar estouro numérico e abuso de layout; **não** são limites de negócio e podem ser ajustados sem nova decisão de produto. Com estes tetos, todos os intermediários inteiros de §4.3 ficam abaixo de `Number.MAX_SAFE_INTEGER` (verificar em teste).

| Campo | Teto |
| --- | --- |
| `hourlyRate` | R$ 99.999,99 |
| `executionHours`, `deadlineImpactHours`, `reserveHours` | 9.999,99 h cada |
| `revisionCount` | 99 |
| `revisionHoursPerRound` | 999,99 h |
| `directCosts` (itens) | 50 |
| `amount` (por item) | R$ 9.999.999,99 |
| `description` | 120 caracteres |
| `commercialValue` | R$ 999.999.999,99 |
| Meta mensal (mini-fluxo) | R$ 9.999.999,99 |
| Horas faturáveis/semana (mini-fluxo) | > 0 e ≤ 168 h |
| `projectName` | 120 caracteres |
| `scopeSummary`, `notes` | 2.000 caracteres cada |

Acima do teto: erro de campo "Valor acima do limite aceito pela calculadora." Contador de caracteres visível só a partir de 80% do limite.

## 12. Itens derivados — APROVADOS (QC-DEC-015)

1. Valor comercial vazio volta a acompanhar a referência; zero/negativo é erro (§5).
2. Revisões = 0 omitem a linha na proposta (§8).
3. Custos aparecem na proposta como descrição + valor, "incluídos no valor" (§7).
4. Data malformada tratada como não informada (§6).

## 13. Mensagens de erro (copy proposta)

| Caso | Mensagem |
| --- | --- |
| Valor/hora vazio ou ≤ 0 | "Informe um valor por hora maior que zero." |
| Execução vazia ou ≤ 0 | "Informe quantas horas de execução o trabalho leva." |
| Negativo em campo opcional | "Use zero ou um valor positivo." |
| Rodadas não inteiras | "Use um número inteiro de rodadas." |
| Mais de 2 casas | "Use no máximo 2 casas decimais." |
| Custo sem valor | "Informe o valor deste custo." |
| Custo sem descrição (proposta) | "Descreva este custo para incluí-lo na proposta." |
| Nome do projeto vazio | "Informe o nome do projeto." |
| Resumo vazio | "Descreva o escopo em poucas palavras." |
| Horas/semana = 0 | "Informe quantas horas por semana você consegue faturar." |
| Acima do teto | "Valor acima do limite aceito pela calculadora." |

## 14. Casos-teste contratuais

**C1 — completo (fixture do Handoff):** R$ 100/h; execução 10 h; 2 × 2 h; impacto 1 h; reserva 0; custos R$ 30 + R$ 20 → horas 15 h; mão de obra R$ 1.500,00; **referência R$ 1.550,00**.

**C2 — sem opcionais:** R$ 100/h; execução 10 h; demais padrões → **R$ 1.000,00**.

**C3 — exemplo do Figma v1.4:** R$ 100/h; execução 20 h; 2 × 2 h; impacto 0; reserva 0; custos R$ 120 + R$ 80 → horas 24 h; mão de obra R$ 2.400,00; **referência R$ 2.600,00**.

**C4 — arredondamento:** R$ 92,38/h × 1,25 h = 115,475 → **R$ 115,48** (metade para cima, uma vez).

**C5 — mini-fluxo:** R$ 8.000; 20 h/semana → **R$ 92,38/h**.

**C6 — valor comercial:** C1, editar comercial para R$ 1.800; depois mudar execução para 12 h → referência R$ 1.750,00, comercial continua R$ 1.800,00, aviso exibido; "Usar a referência" → R$ 1.750,00.

Os mesmos números devem aparecer no modelo, no visor, na composição e no texto da proposta.

## 15. Fora deste documento

- Destino da rota legada `/calculadora`: depende de inventário de URLs publicadas (não há decisão a tomar antes disso).
- Slugs editoriais finais.
