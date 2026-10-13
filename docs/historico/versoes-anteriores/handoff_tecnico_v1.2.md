# Quanto Cobro? — Handoff Técnico

**Versão documental:** 1.2 · **Atualizado:** 12/10/2026  
**Fontes funcionais:** PRD v1.1 + Architecture v1.1 + Decision Log QC-DEC-001 a QC-DEC-004.  
**Status:** especificação documental sincronizada; telas Figma e FigJam ainda não validadas nesta rodada.

## 1. Escopo de implementação

Construir calculadora web responsiva, sem login, com cinco etapas, mini-fluxo opcional de valor/hora, resultado rastreável, valor comercial editável, proposta gerada após CTA, dark/light e publicidade fora da tarefa. A rota `/` **abre diretamente** a calculadora (QC-DEC-004). Sem home intermediária.

O mesmo modelo de dados e as mesmas funções servem mobile e desktop. Custo direto admite vários itens (QC-DEC-001). Dados descritivos da proposta são solicitados somente após **Criar proposta** (QC-DEC-002). Valor/hora + tema persistem no dispositivo; rascunho do orçamento, na sessão (QC-DEC-003).

## 2. Ordem de implementação

1. modelo de dados;
2. função de cálculo;
3. validações;
4. wizard mobile;
5. resultado;
6. voltar/editar;
7. persistência local;
8. desktop responsivo;
9. fluxo de valor/hora;
10. proposta;
11. dark/light;
12. analytics;
13. ads pós-tarefa;
14. testes e acessibilidade.

## 3. Contrato de cálculo

```text
HORAS_REVISAO = QUANTIDADE_RODADAS × HORAS_POR_RODADA
TOTAL_HORAS = EXECUCAO + HORAS_REVISAO + IMPACTO_PRAZO_HORAS + RESERVA_HORAS
MAO_DE_OBRA = TOTAL_HORAS × VALOR_HORA
CUSTOS_DIRETOS_TOTAL = soma(valor de cada item de custo)
REFERENCIA_CALCULADA = MAO_DE_OBRA + CUSTOS_DIRETOS_TOTAL
```

- Impacto do prazo e reserva são **horas reais informadas**, ambas iniciam em zero.
- A data de entrega e a definição qualitativa do escopo **não** entram na fórmula.
- Revisiões entram **uma vez** e nunca devem estar incluídas em execução.
- Valor comercial é decisão separada e **não** recalcula a referência.
- Não usar percentuais de urgência, reserva, experiência ou arredondamento silencioso.
- O código ilustrativo no `architecture.md` expressa a álgebra, mas **precisão/centavos/arredondamento** ainda dependem do Business Rules.

## 4. Contrato de dados

Usar como fonte o `CalculatorState` e o `EstimateInput` documentados no `architecture.md` v1.1. Contrato resumido:

```ts
type CalculatorState = {
  hourlyRate: number | null
  executionHours: number | null
  scopeDefinition: 'well_defined' | 'partial' | 'open' | null
  deliveryDate: string | null                 // YYYY-MM-DD local
  revisionCount: number
  revisionHoursPerRound: number
  deadlineImpactHours: number                // inicia em 0
  reserveHours: number                       // inicia em 0
  directCosts: { id: string; description: string; amount: number }[]
  commercialValue: number | null
}
```

`totalRevisionHours`, `totalHours`, `directCostsTotal`, `laborValue` e `calculatedValue` são **valores derivados**. Não persisti-los como entradas editáveis paralelas. Não usar os campos antigos `revisionHours` ou `urgencyHours`. Proposta utiliza `ProposalDraft` e `ProposalViewModel` separados, com origem de dados documentada na Architecture.

## 5. Fluxo de telas

A rota `/` inicia a **calculadora**, não landing page. A proposta é uma ramificação posterior, e o mini-fluxo de valor/hora é opcional.

### 1 — Valor/hora
- entrada de moeda, recuperando `hourlyRate` salvo de modo editável;
- link **Descobrir referência** para mini-fluxo `meta mensal / (horas faturáveis por semana × 4,33)`;
- permitir ajustar o valor sugerido e voltar à etapa 1, sem confundir meta de faturamento com custo/hora completo.

### 2 — Execução e escopo
- horas de execução sem revisões;
- nível escolhido pelo usuário: Bem definido, Parcialmente definido ou Aberto (não calcular score).

### 3 — Prazo e revisões
- data de entrega (não altera valor sozinha);
- quantidade de rodadas e horas **por rodada**; apresentar total derivado;
- impacto do prazo: se houver horas adicionais reais, informá-las, sem percentual automático.

### 4 — Reserva e custos
- inicial: **Nada extra**;
- horas opcionais de reserva;
- `directCosts[]`: adicionar/editar/remover múltiplos itens de **descrição + valor**.

### 5 — Resultado
- referência calculada com maior destaque;
- breakdown consistente com a fórmula;
- valor comercial independente e editável;
- nível de definição escolhido + explicação;
- voltar/editar, criar proposta, reiniciar.

### Depois de “Criar proposta”
Coletar **nome do projeto**, **resumo do escopo** e **observações opcionais**, somente depois do CTA. A prévia usa textos digitados e dados do orçamento (prazo, revisões, custos, **valor comercial**), nunca exemplos fictícios.

## 6. Comportamento de navegação

- Manter estado ao voltar, editar ou avançar na mesma sessão.
- Não transformar uma entrada inválida em `NaN` no visor; detalhar bloqueios no Business Rules.
- Permitir editar qualquer etapa pelo Resultado e recomputar ao confirmar alteração.
- Ação **Criar proposta** não substitui o resultado nem exige os dados da proposta antecipadamente.
- Reiniciar orçamento é operação potencialmente destrutiva; limpeza/aviso final pertencem ao Business Rules.
- Se o mini-fluxo de valor/hora for cancelado, voltar à calculadora sem valores inventados.

## 7. Formatação pt-BR

### Moeda
Usar `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

### Decimal
Aceitar entrada com vírgula ou ponto, normalizando internamente.

### Horas
Armazenar como número decimal.

Exemplos:
- 1,5 h;
- 2 h;
- 0,5 h.

## 8. Persistência do MVP (QC-DEC-003)

```text
localStorage:
  quantoCobro.hourlyRate
  quantoCobro.theme

sessionStorage:
  quantoCobro.currentEstimate.v1
```

- `hourlyRate` e `theme` podem sobreviver a novas sessões no mesmo perfil de navegador.
- O orçamento em andamento é rascunho de sessão, restaurável ao atualizar a mesma aba quando o armazenamento permitir; **não** é histórico.
- Dados de proposta não são salvos permanentemente. Regra de retenção na sessão segue pendente.
- Não implementar `lastEstimate` em `localStorage`.
- Se o armazenamento estiver indisponível, usar estado em memória e não alegar que dados foram salvos.
- Versões incompatíveis do rascunho não podem travar a calculadora.

## 9. Tema

A fonte de verdade visual é a coleção Figma `Quanto Cobro / Theme`. Não criar paletas paralelas no código.

### Dark — principal
- `bg/canvas`: `#111315`;
- `bg/surface`: `#191C1F`;
- `bg/raised`: `#23272B`;
- `text/primary`: `#F5F5F2`;
- `text/secondary`: `#A7ADB3`;
- `border/default`: `#343A40`;
- `action/primary`: `#FF9F0A`.

### Light
- `bg/canvas`: `#F7F7F5`;
- `bg/surface`: `#FFFFFF`;
- `bg/raised`: `#F0F1F2`;
- `text/primary`: `#181A1D`;
- `text/secondary`: `#626970`;
- `border/default`: `#D7DADD`;
- `action/primary`: `#FF9500`.

Dark e light usam os mesmos componentes e a mesma hierarquia. Só os valores dos tokens mudam.

## 10. Design tokens

Mapear os tokens do Figma diretamente para CSS variables ou para a camada de tema escolhida. Exemplo:

```css
:root {
  --bg-canvas: #F7F7F5;
  --bg-surface: #FFFFFF;
  --bg-raised: #F0F1F2;
  --text-primary: #181A1D;
  --text-secondary: #626970;
  --border-default: #D7DADD;
  --action-primary: #FF9500;
}

[data-theme='dark'] {
  --bg-canvas: #111315;
  --bg-surface: #191C1F;
  --bg-raised: #23272B;
  --text-primary: #F5F5F2;
  --text-secondary: #A7ADB3;
  --border-default: #343A40;
  --action-primary: #FF9F0A;
}
```

Estados adicionais (`focus`, `error`, `success`, `warning`) estão definidos no `design-system.md` e na coleção de variables do Figma.

## 11. Breakpoints

Não há necessidade de muitos breakpoints.

Sugestão:

- mobile: < 768px;
- desktop: ≥ 768px.

A calculadora continua estreita mesmo em telas grandes.

## 12. Componentes e módulos

```text
AppShell / ThemeToggle / ProgressIndicator
CalculatorDisplay / CalculatorKey / CalculatorKeypad
CalculatorQuickAdjust / CalculatorWizard
StepHourlyRate / HourlyRateReferenceFlow
StepExecutionScope / StepDeadlineRevisions / StepExtras
DateInput / QuantityControl / HoursInput / MoneyInput
DirectCostList / CostRow / AddDirectCost
ResultView / CalculationBreakdown / EstimateDefinitionBadge
CommercialValueEditor
ProposalForm / ProposalPreview / ProposalPrintView
AdSlot / InlineError
```

O componente de revisões mostra `revisionCount` e `revisionHoursPerRound`, com total calculado apenas para leitura. Custos diretos formam uma lista; descrição e valor são entradas distintas. `ProposalForm` não integra o wizard inicial.

## 13. Resultado e composição

Ordem aprovada do Resultado: **referência calculada dominante → composição → valor comercial editável → escopo informado → CTAs**. Não inverter para mostrar valor comercial como o maior número.

Exemplo puramente hipotético, não hardcodar:

```text
Referência calculada: R$ 1.550,00
Execução:            10 h
Revisões:              2 rodadas x 2 h = 4 h
Impacto do prazo:       1 h
Reserva:                0 h
Mão de obra:           15 h x R$ 100 = R$ 1.500,00
Custos diretos:         R$ 30 + R$ 20 = R$ 50,00
Valor comercial:        editável (independente da referência)
Definição do escopo:  opção informada pela pessoa
```

Uma edição em qualquer etapa refaz o mesmo cálculo para visor, detalhamento e proposta. O valor comercial **não muda** ao clicar no breakdown por engano; seu comportamento de default e revisão ainda deve ser definido no Business Rules.

## 14. Nível de definição

Não derivar automaticamente de condições, risco ou prazo. O sistema exibe **exatamente a opção escolhida pelo usuário** (Bem definido, Parcialmente definido ou Aberto) e uma explicação fixa da categoria. Não atribuir “confiança” numérica, pontos ou coeficientes.

## 15. Proposta (QC-DEC-002)

**Gatilho:** o usuário conclui o resultado e clica em **Criar proposta**. Somente agora solicitar `projectName`, `scopeSummary` e `notes` (opcional).

**Origem da prévia:**
- nome/escopo/observações vindos do `ProposalDraft` digitado;
- data `deliveryDate`, revisões `revisionCount` e custos `directCosts[]` do orçamento;
- **valor comercial escolhido**, não `calculatedValue` por engano.

**Ações:** copiar texto e imprimir / Salvar como PDF via navegador. Não expor cálculo interno ao cliente por padrão.

Campo não preenchido não recebe nome/escopo fictício. Regras para campos obrigatórios, edição após prévia e retenção em sessão continuam **pendentes de Business Rules**. A proposta não precisa de PDF server-side.

## 16. Ads

### Implementar apenas depois da funcionalidade principal estar estável.

Primeiro slot:

```text
Resultado
→ ações principais
→ explicação curta
→ espaçamento
→ ad slot
```

Nunca:

```text
campo
→ ad
→ botão Próximo
```

### Requisitos
- slot com tamanho reservado;
- falha do anúncio não muda o layout essencial;
- calculadora funciona com ad blocker;
- nenhum CTA depende de carregar anúncio.

## 17. Analytics

Instrumentar eventos sem acoplar regra de negócio:

```text
calculator_started
calculator_step_viewed
calculator_step_completed
calculator_back_clicked
calculator_completed
hourly_rate_flow_started
hourly_rate_saved_local
commercial_value_edited
proposal_opened
proposal_copied
proposal_printed
ad_slot_viewable
```

Não enviar valores financeiros ou textos da proposta a analytics e provedores de ads por padrão. Não medir eventos dependentes de carregamento de publicidade para liberar a calculadora.

## 18. Acessibilidade

Checklist obrigatório:

- navegação completa por teclado;
- foco visível;
- labels programáticas;
- mensagens de erro associadas ao campo;
- contraste AA;
- target de toque ≥ 44px;
- `aria-live` para mudança de resultado quando necessário;
- ordem de leitura lógica;
- não depender de cor para estados.

## 19. Critérios de aceite por fluxo

- **Sem extras:** referência = `hourlyRate × executionHours`; sem valores inventados.
- **Revisões:** duas rodadas de 2h produzem **4h**; somadas apenas uma vez.
- **Data e escopo:** alterar data ou definição não muda a referência; nível informado aparece no Resultado.
- **Impacto do prazo:** somente horas adicionais informadas modificam mão de obra.
- **Reserva:** começa em zero e somente entra se preenchida.
- **Custos diretos:** vários itens com descrição/valor, adicionáveis, editáveis e removíveis; soma monetária fora de horas.
- **Valor comercial:** editável sem alterar `calculatedValue`.
- **Proposta:** coleta textos somente após o CTA e apresenta revisões, prazo, custos e **valor comercial** vindos da mesma origem.
- **Persistência:** nova sessão recupera tema/valor-hora; rascunho não constitui histórico permanente.
- **Navegação:** voltar/editar e atualizar a aba (onde permitido) não duplica entradas.
- **Publicidade:** nunca entre resultado e CTA; falha de ad não interrompe tarefa.

## 20. Testes mínimos antes de release

1. Unitário: cálculo sem extras e com todos os opcionais.
2. Unitário: `2 × 2h = 4h` e `directCosts[]` com ao menos dois itens; sem dupla contagem.
3. Unitário: mudar `deliveryDate`, `scopeDefinition` ou valor comercial **não** muda `calculatedValue`.
4. Valores não inteiros, moeda e formatação pt-BR; aplicar política de arredondamento aprovada no Business Rules.
5. Entradas inválidas, `NaN`, divisão por zero no fluxo de referência.
6. Navegação, editar, voltar, reiniciar e retorno do mini-fluxo.
7. `localStorage` para `hourlyRate` e `theme`; `sessionStorage` para rascunho; falha de storage.
8. Proposta com dados digitados somente após o CTA; copiar e imprimir.
9. Dark/light, mobile pequeno, desktop largo, teclado e leitor de tela.
10. Ad indisponível, primeiro slot abaixo de resultado/CTAs e sem sobreposição.

**Fixture contratual hipotética:** R$ 100/h × (10h execução + 2 × 2h revisão + 1h impacto + 0h reserva) + R$ 30 + R$ 20 = **R$ 1.550,00**. O teste da fórmula não substitui testes do aplicativo, que ainda não foi implementado nesta rodada.

## 21. Bugs bloqueadores

Não liberar se existir:

- diferença entre breakdown e total;
- duplicidade de horas;
- perda de estado ao voltar;
- anúncio sobrepondo CTA;
- resultado sem rastreabilidade;
- campo obrigatório sem erro compreensível;
- valor comercial alterando valor calculado;
- incompatibilidade entre mobile e desktop na lógica.

## 22. Dependências visuais: definidas x pendentes

**Direção consolidada**, ainda sujeita à verificação dos frames reais:
- coleção Figma `Quanto Cobro / Theme` para dark/light;
- stack tipográfica de sistema, visor numérico dominante e alinhado à direita;
- botões principais de referência 56px/raio 28px;
- teclas circulares 72×72px quando apropriadas e alvo de toque não menor que 44px;
- uma ação primária por estado, poucos cards;
- cinco etapas de cálculo, mini-fluxo opcional e proposta posterior.

**Pendente de validação/correção visual:** data de entrega, nível do escopo, quantidade × horas por rodada, lista de custos, formulário pós-CTA, fluxo de descobrir valor/hora, hierarquia mobile/desktop. Testar acessibilidade e responsividade em dispositivos reais. Não marcar Figma/UX como prontos apenas pela sincronização deste texto.

## 23. Contrato da experiência “calculadora iOS”

### Visor persistente
- Etapa 1: valor/hora ou estado de entrada ainda vazio;
- Etapa 2: subtotal da execução quando válido;
- Etapa 3: subtotal com revisões e impacto do prazo **somente se informados**;
- Etapa 4: subtotal com reserva e soma de custos, se existentes;
- Etapa 5: referência final dominante + breakdown, valor comercial e nível escolhido.

Antes da conclusão, exibir rótulo “parcial”/“subtotal”. Não fabricar um preço final enquanto faltarem dados.

### Keypad custom e acessibilidade
Keypad é apropriado apenas quando o campo dominante é numérico. Manter `input` semântico real para teclado físico, digitação nativa e acessibilidade; `inputmode` apropriado. Teclas circulares são `<button>` com nomes anunciáveis (`apagar`, `confirmar horas`, `adicionar uma hora`). Não forçar keypad em data, escopo, custos textuais e proposta.

### Movimento
Permitir microtransição sutil de número (referência 120–220ms) se não atrapalhar a entrada nem `prefers-reduced-motion`. Sem atraso para liberar avanço.

### Fonte visual e conferência obrigatória
Usar páginas atuais reportadas: `01 — FINAL · Mobile`, `02 — FINAL · Desktop` e `03 — FINAL · Publicidade`. **A página antiga de Visual Mobile v1 foi removida**. IDs antigos `41:*` não devem orientar handoff sem confirmar que ainda resolvem aos frames FINAL atuais.

Figma FINAL é fonte visual; FigJam, fonte de jornadas/fluxo/sitemap; PRD, Architecture e Decision Log prevalecem para regras, estados e aprovações.

## 24. CSS base recomendada

```css
:root {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
  font-variant-numeric: tabular-nums;
  --calc-key-size: 72px;
  --control-radius: 22px;
  --cta-height: 56px;
  --cta-radius: 28px;
}

.calculator-display {
  text-align: right;
}

.calculator-key {
  width: var(--calc-key-size);
  height: var(--calc-key-size);
  border-radius: 50%;
  touch-action: manipulation;
}
```

Em viewports menores, reduzir gap antes de reduzir target. Não descer abaixo de 44px de área de toque.

## 25. Regra de implementação e bloqueios antes de codificar

Não transformar a ferramenta em dashboard, não adicionar campos que não sustentem o orçamento e não produzir multiplicadores invisíveis.

**Em aberto para Business Rules:** obrigatoriedade/limites, tratamento de datas passadas, itens de custos incompletos, precisão e arredondamento em centavos, default/sincronização do valor comercial, limpeza ao reiniciar e persistência da proposta na sessão. A existência de campos de tipo `string` ou `number` **não aprova** essas regras.

**Em aberto para Figma/FigJam:** correspondência dos frames FINAL, cobertura dos campos restaurados e mini-fluxo de descoberta do valor/hora. Não marcar QA visual como concluído sem abrir os artefatos atualizados.

