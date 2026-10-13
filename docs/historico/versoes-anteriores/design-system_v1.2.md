# Quanto Cobro? — Design System

**Versão documental:** 1.2 · **Atualizado:** 12/10/2026  
**Contrato funcional:** PRD v1.1, Architecture v1.1, QC-DEC-001 a QC-DEC-004.  
**Status:** sincronização documental; frames do Figma ainda dependem de verificação e correção.

## 1. Papel do sistema visual

O sistema visual deve reforçar uma ideia simples: **ferramenta de cálculo, não dashboard**.

As duas referências visuais atuais são úteis principalmente para **direção de cor e atmosfera**. Elas não devem substituir a estrutura de produto já definida.

## 2. Princípios

- números antes de ornamento;
- uma ação dominante por estado;
- poucos níveis de superfície;
- pouco uso de cards;
- contraste forte;
- leitura rápida;
- estados claros;
- componentes familiares;
- mobile-first;
- dark como direção principal;
- light como equivalente funcional, não como redesign separado.

## 3. Direção de cor

A paleta abaixo está consolidada no Figma na coleção `Quanto Cobro / Theme`, com modos `Light` e `Dark`. O laranja é a única cor forte de ação.

Estrutura 60/30/10 continua como orientação visual, não como regra matemática rígida.

### Dark — principal
- canvas: `#111315`;
- surface: `#191C1F`;
- raised: `#23272B`;
- texto principal: `#F5F5F2`;
- texto secundário: `#A7ADB3`;
- borda: `#343A40`;
- ação principal: `#FF9F0A`;
- texto/acento sobre ação: `#17191C`;
- focus/acento: `#FFB340`.

### Light
- canvas: `#F7F7F5`;
- surface: `#FFFFFF`;
- raised: `#F0F1F2`;
- texto principal: `#181A1D`;
- texto secundário: `#626970`;
- borda: `#D7DADD`;
- ação principal: `#FF9500`;
- texto sobre ação: `#17191C`;
- focus/acento: `#C65E00`.

## 4. Tokens semânticos

Os componentes devem consumir tokens semânticos, não hexadecimais soltos.

| Token | Light | Dark |
| --- | --- | --- |
| `color/bg/canvas` | `#F7F7F5` | `#111315` |
| `color/bg/surface` | `#FFFFFF` | `#191C1F` |
| `color/bg/raised` | `#F0F1F2` | `#23272B` |
| `color/text/primary` | `#181A1D` | `#F5F5F2` |
| `color/text/secondary` | `#626970` | `#A7ADB3` |
| `color/text/muted` | `#7A8188` | `#8F969D` |
| `color/border/default` | `#D7DADD` | `#343A40` |
| `color/border/strong` | `#B7BCC1` | `#4B535B` |
| `color/action/primary` | `#FF9500` | `#FF9F0A` |
| `color/action/on-primary` | `#17191C` | `#17191C` |
| `color/action/accent-text` | `#B84F00` | `#FFB340` |
| `color/focus/ring` | `#C65E00` | `#FFB340` |
| `color/state/error` | `#B42318` | `#FF6961` |
| `color/state/success` | `#137333` | `#30D158` |
| `color/state/warning` | `#8A5A00` | `#FFD60A` |

Contraste deve continuar sendo validado por componente e estado. A existência do token não substitui teste WCAG.

## 5. Tipografia

Objetivo: leitura imediata de pergunta, entrada e resultado.

### Escala sugerida

- Display numérico: 58–64px mobile em telas com espaço suficiente; adaptar responsivamente em viewports estreitos / 64–72px desktop;
- H1: 28–32px;
- H2: 22–24px;
- Body: 16–18px;
- Supporting: 14–16px;
- Label: 13–14px.

**Referência visual aprovada no Figma: SF Pro.**

Na implementação web, usar stack de sistema em vez de empacotar a fonte da Apple:

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif;
```

O objetivo é preservar métricas, ritmo e refinamento próximos ao iOS em dispositivos Apple, com fallback nativo e legível nas demais plataformas.

### Números

- tabular numbers quando suportado;
- peso forte apenas para valores principais;
- não usar monoespaçada como linguagem dominante se prejudicar leitura.

## 6. Espaçamento

Sistema base de 4px.

Tokens recomendados:

```text
4, 8, 12, 16, 24, 32, 40, 48, 64
```

O produto depende de respiro. Não reduzir vertical spacing para “caber mais coisa” no mobile.

## 7. Layout

### Mobile
- A rota `/` abre a calculadora diretamente (QC-DEC-004).
- coluna única;
- padding lateral de 20–24px;
- largura total do viewport;
- CTA principal facilmente alcançável;
- uma pergunta principal visível por vez.

### Desktop
- calculadora centralizada;
- largura útil estreita, aproximadamente 480–640px;
- área livre ao redor como respiro;
- sem sidebar de produto;
- publicidade lateral somente como experimento validado, nunca como requisito estrutural.

## 8. Superfícies

Usar no máximo três níveis principais:

1. canvas;
2. surface;
3. raised/interactive.

Não transformar cada bloco em card.

## 9. Botões

### Primary
Uso: **Próximo**, **Calcular**, **Criar proposta** (CTA do resultado). Apenas uma ação primária por estado.

- cor `color/action/primary` com texto `color/action/on-primary`;
- altura de referência **56px** e raio **28px** nos frames aprovados; respeitar alvo de toque de no mínimo 44×44px;
- texto descreve a ação, sem sugerir que gerar a proposta conclui obrigatoriamente o cálculo.

### Secondary
Uso: Voltar, Editar, Copiar. Ações secundárias não competem com a principal.

### Tertiary/text
Uso: remover item de custo, ajustes auxiliares e retorno de subfluxos; todas as ações devem ser acessíveis via teclado.

## 10. Campos

### Princípios
- label sempre visível; placeholder não é label;
- unidade próxima do valor (`h`, `R$`, `rodadas`);
- teclado apropriado em mobile sem bloquear teclado físico e tecnologias assistivas;
- erro textual próximo ao campo e foco preservado;
- não usar valor de exemplo como resposta informada.

### Tipos por etapa
- **Etapa 1:** moeda para valor/hora; ação para descobrir uma referência.
- **Etapa 2:** horas de execução; seleção qualitativa de definição do escopo.
- **Etapa 3:** data de entrega; quantidade de rodadas; horas **por rodada**; horas adicionais por impacto do prazo, opcionais.
- **Etapa 4 (QC-DEC-001):** horas opcionais de reserva; lista editável de custos diretos com **descrição e valor** por item.
- **Resultado:** editor de valor comercial, independente da referência calculada.
- **Pós-CTA Criar proposta (QC-DEC-002):** nome do projeto, resumo do escopo e observações opcionais.

Campos da proposta não aparecem durante a coleta de horas/custos. Data de entrega e definição do escopo não acionam acréscimo financeiro. Regras finais de obrigatoriedade e limites pertencem ao Business Rules.

## 11. Controle de quantidade

Rodadas de revisão usam controle de quantidade (por exemplo, `[-] 2 [+]`), associado a um campo independente de **horas por rodada**. O visor pode exibir o total derivado: `2 rodadas × 2 h/rodada = 4 h`.

Não expor um campo extra de horas totais editáveis, pois isso cria dupla fonte de verdade. Os controles devem preservar input acessível e estado claro para zero, erro e edição.

## 12. Progresso

Formato simples:

```text
2 de 5
```

ou barra discreta.

Não usar stepper visual pesado com cinco cards/ícones se isso aumentar ruído.

## 13. Resultado

O Figma FINAL aprovado orienta esta ordem, a ser mantida no mobile e desktop:

1. **Referência calculada dominante** (número principal, rotulado como estimativa).
2. **Composição:** horas de execução, revisões totais (quantidade × horas por rodada), impacto real do prazo, reserva, valor/hora e soma dos custos diretos.
3. **Valor comercial editável**, identificado como decisão do freelancer; alterá-lo não modifica a referência.
4. **Nível de definição informado**, com explicação curta, sem score calculado.
5. **Ações principais:** editar etapas, Criar proposta e reiniciar.
6. **Publicidade** somente depois do resultado, das explicações e CTAs; rail desktop não é obrigatório.

A ordem acima é contrato de conteúdo, não obriga a criar seis cards. O display persistente pode manter subtotal explicitamente rotulado como **parcial** antes da conclusão do cálculo.

## 14. Nível de definição do escopo

Escolha **feita pelo usuário**, nunca inferida ou pontuada automaticamente:

- **Bem definido** (`well_defined`): entregáveis e limites claros.
- **Parcialmente definido** (`partial`): escolhas ou dependências em aberto.
- **Aberto** (`open`): limites, dependências ou entregáveis ainda pouco claros.

A escolha aparece na etapa de Execução e no Resultado com texto explicativo. Não altera preço. O rótulo canônico é **Aberto**, conforme o PRD v1.1.

## 15. Estados

### Default
Entrada vazia ou valor inicial neutro.

### Focus
Ring visível e consistente.

### Filled
Valor persistente legível.

### Error
Texto objetivo. Ex.: “Informe um valor maior que zero.”

### Disabled
Usar apenas quando necessário. Evitar telas cheias de controles desabilitados.

### Loading
Pouco relevante para cálculo local. Não criar spinner onde a resposta é síncrona.

## 16. Dark, Light e persistência visual

A hierarquia deve ser idêntica nos dois temas. Dark não é “mais premium”; Light não é “mais simples”.

**QC-DEC-003:** a escolha do tema e o valor/hora persistem no dispositivo entre sessões (`localStorage` recomendado); o rascunho do orçamento pertence à sessão da aba (`sessionStorage` recomendado). Esses mecanismos não alteram tokens nem componentes. Exibir “salvo neste dispositivo” somente quando houver persistência efetiva. Se o armazenamento falhar, a interface deve continuar usável.

## 17. Acessibilidade

- contraste WCAG AA para texto normal;
- foco de teclado visível;
- targets de toque ≥ 44×44px;
- labels associadas semanticamente a inputs;
- mensagens de erro anunciáveis por leitor de tela;
- não depender apenas de cor;
- moeda e unidade lidas de forma compreensível;
- ordem de foco acompanha a ordem visual.

## 18. Publicidade no sistema visual

Anúncio deve ter separação clara de ações da calculadora.

Regras:

- nunca dentro de grupo de inputs;
- nunca colado ao botão principal;
- nunca estilizado como componente nativo da calculadora;
- reservar espaço para reduzir layout shift;
- rótulo de publicidade quando exigido pela plataforma;
- contraste e espaçamento suficientes para evitar clique acidental.

## 19. Componentes mínimos e coberturas

- **Estrutura:** `AppShell`, `ProgressIndicator`, `QuestionHeader`, `ThemeToggle`.
- **Calculadora:** `CalculatorDisplay`, `CalculatorKey`, `CalculatorKeypad`, `CalculatorQuickAdjust`, `CalculatorValueRow`.
- **Entrada:** `MoneyInput`, `HoursInput`, `DateInput`, `QuantityControl`, `SingleSelect`, `OptionalSection`, `InlineError`.
- **Custos:** `DirectCostList` com várias `CostRow` (descrição, valor e remover); ação Adicionar custo.
- **Resultado:** `CalculationBreakdown`, `EstimateDefinitionBadge`, `CommercialValueEditor`.
- **Fluxos auxiliares:** `HourlyRateReferenceFlow`, `ProposalForm` e `ProposalPreview`. Proposta coleta textos **somente** depois do CTA.
- **Ações e ads:** `PrimaryButton`, `SecondaryButton`, `AdSlot`.

São responsabilidades de interface; a lista não exige uma biblioteca de componentes separada nem cria rotas/telas não aprovadas. Campos opcionais e custos múltiplos devem usar revelação progressiva para preservar a baixa densidade visual.

## 20. O que evitar

- dashboards;
- KPIs decorativos;
- sidebar;
- glassmorphism;
- sombras pesadas;
- gradientes sem função;
- cards aninhados;
- excesso de chips;
- ícones para substituir texto claro;
- animações que atrasem o fluxo;
- múltiplas cores de destaque.

## 21. Gramática visual de calculadora iOS — fonte de verdade

A direção aprovada é **calculadora iOS reinterpretada para orçamento**, não um formulário com botões redondos.

### Estrutura de uma etapa numérica

1. cabeçalho discreto (`Quanto Cobro` + progresso);
2. visor dominante alinhado à direita;
3. valor principal em 58–64px no mobile;
4. fórmula/traço de cálculo imediatamente abaixo;
5. subtotal ou contexto financeiro em acento laranja quando já existe base suficiente;
6. pergunta contextual abaixo do visor;
7. controles numéricos grandes e circulares quando a entrada principal for quantitativa;
8. home indicator apenas como detalhe de apresentação no mockup — não deve ser implementado no site.

### Calculator Display

- largura: ocupa o conteúdo útil da calculadora;
- alinhamento: direita;
- label: 12–13px, discreta e em caixa alta;
- valor principal: 58–64px mobile;
- fórmula: 14–16px;
- subtotal/acento: 18–20px;
- sem card pesado ao redor;
- sem sombra;
- atualiza imediatamente quando uma entrada altera o cálculo;
- antes de haver dados suficientes, usar estado parcial explícito em vez de inventar total.

### Calculator Key

- target visual de referência: 72×72px no mobile aprovado;
- target de toque nunca abaixo de 44×44px;
- raio circular (`50%`);
- teclas neutras em `bg/raised`;
- ação/confirmar em `action/primary`;
- texto 24px nas teclas comuns e 28px na ação principal;
- espaçamento horizontal de referência: 18px;
- espaçamento vertical de referência: 10–12px.

### Onde usar teclado/calculadora

Usar quando a tarefa dominante for número:
- valor/hora;
- horas de execução;
- ajustes rápidos de horas;
- edição direta do valor comercial, se adotada como interação principal.

Não forçar teclado de calculadora em:
- data;
- escolha de escopo;
- descrição de custo;
- texto de proposta.

Nesses casos, manter o **visor persistente** e usar controles contextuais abaixo dele. É isso que preserva a identidade de calculadora sem prejudicar tarefas qualitativas.

### Atualização progressiva do total

O visor deve reforçar cálculo contínuo, mas não criar falsa precisão.

- etapa 1: mostrar valor/hora;
- etapa 2: mostrar subtotal de execução;
- etapa 3: incluir revisões e horas de impacto do prazo apenas quando declaradas;
- etapa 4: incluir reserva/custos apenas quando declarados;
- etapa 5: mostrar referência final + composição;
- proposta: mostrar apenas valor comercial e dados de cliente, sem expor a matemática interna.

### O que caracteriza “refinamento iOS” neste produto

- tipografia de sistema;
- números grandes e alinhados à direita;
- superfícies sem excesso de bordas;
- controles circulares de alto contraste;
- uso disciplinado de laranja para ação;
- ritmo vertical generoso;
- pouca ornamentação;
- transição visual contínua entre entrada e resultado.

### Não copiar literalmente o app Calculadora

O produto não deve replicar a matriz funcional de quatro operações, símbolos ou comportamento proprietário da Calculadora da Apple. A referência é de **gramática visual e interação**, adaptada às entradas reais de orçamento.

## 22. Fonte de verdade visual e pendências do Figma

Páginas atuais reportadas na auditoria:

- `01 — FINAL · Mobile`;
- `02 — FINAL · Desktop`;
- `03 — FINAL · Publicidade`.

A página antiga `03 — Visual Mobile v1` **não existe mais** e não deve ser indicada ao desenvolvimento. Os antigos IDs `41:2`, `41:38`, `41:88`, `41:126`, `41:159`, `41:190` **ainda exigem conferência no Figma atual**; não tratá-los como prova de que todos os frames foram corrigidos.

Antes do handoff de UI, verificar em **mobile e desktop**:
- escolha do nível de escopo na Execução e sua comunicação no Resultado;
- data de entrega na etapa de Prazo;
- quantidade × horas por rodada;
- impacto do prazo expresso em horas reais e opcionais;
- várias linhas de custo com descrição e valor;
- mini-fluxo de referência de valor/hora e retorno à calculadora;
- formulário de proposta aberto apenas após o CTA, com prévia derivada de dados reais.

**Figma FINAL é referência visual, PRD e Architecture são contratos funcionais, FigJam é fonte de fluxo.** Não reconstruir uma terceira versão arbitrária quando uma tela divergir de um requisito.

## 23. Critério de aprovação visual

Uma tela está alinhada ao sistema quando:

- pergunta principal e ação dominante são identificáveis sem procurar em vários cards;
- o visor permanece reconhecível nas etapas qualitativas;
- a referência calculada é o número principal no Resultado;
- quantidade de revisões, horas por rodada, custos e impacto do prazo possuem rótulos sem ambiguidade;
- campos da proposta não exigem preenchimento antes do CTA;
- controles de custo podem ser adicionados/removidos sem transformar a tela num dashboard;
- retorno, teclado e leitor de tela conseguem percorrer os campos na ordem visual;
- anúncio não compete com resultado nem CTA;
- Figma Mobile, Desktop e o contrato de dados descrevem as mesmas informações.

**Pendente:** validação real dos frames e dos estados de erro/foco, antes de marcar os requisitos visuais como concluídos.

