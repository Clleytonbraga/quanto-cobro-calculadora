# Quanto Cobro? — Architecture

**Versão documental:** 1.1 · **Atualizado:** 12/10/2026  
**Decisões aprovadas:** QC-DEC-001 a QC-DEC-004 (ver `decision-log.md`).  
**Estado:** modelo técnico sincronizado com o PRD; ver pendências ao final.

## 1. Objetivo da arquitetura

A arquitetura deve privilegiar:

- cálculo determinístico e testável;
- baixo custo de operação;
- carregamento rápido;
- SEO nas páginas públicas;
- nenhuma dependência de backend para o fluxo principal do MVP;
- facilidade de evoluir depois para histórico, conta e propostas avançadas.

## 2. Premissa principal

O MVP pode funcionar majoritariamente no cliente.

Isso é coerente porque:

- cálculo não exige dado secreto;
- não há login;
- não há histórico em nuvem;
- persistência inicial é local;
- proposta pode ser gerada no navegador;
- conteúdo editorial pode ser estático ou híbrido.

## 3. Arquitetura lógica

```text
Web App
├── /  (calculadora diretamente; QC-DEC-004)
│   ├── Hourly-rate step
│   ├── Scope / execution step
│   ├── Deadline / revisions step
│   ├── Uncertainty / direct-costs step
│   └── Result / commercial-value editor
├── Hourly-rate reference mini-flow (retorna à etapa 1)
├── Proposal flow (abre só depois de “Criar proposta”)
├── Conteúdo editorial / SEO (rotas secundárias)
├── Persistência local + de sessão
├── Analytics
└── Ad surfaces fora da tarefa
```

A mesma lógica e os mesmos estados servem mobile e desktop. Páginas informativas não criam um passo adicional para entrar na ferramenta.

## 4. Estado da calculadora

Separar **estado editável**, que pode conter campos ainda não preenchidos, do **input normalizado**, validado para execução da função pura.

```ts
type ScopeDefinition = 'well_defined' | 'partial' | 'open'

type DirectCost = {
  id: string
  description: string
  amount: number
}

type CalculatorState = {
  hourlyRate: number | null
  executionHours: number | null
  scopeDefinition: ScopeDefinition | null // escolha da pessoa, não derivada
  deliveryDate: string | null            // YYYY-MM-DD (data local)
  revisionCount: number
  revisionHoursPerRound: number
  deadlineImpactHours: number            // horas adicionais declaradas, default 0
  reserveHours: number                   // default 0
  directCosts: DirectCost[]              // QC-DEC-001
  commercialValue: number | null         // independente de calculatedValue
}

// Usado apenas depois de validação; não contém null nem campo de UI.
type EstimateInput = Omit<CalculatorState, 'hourlyRate' | 'executionHours' | 'scopeDefinition' | 'deliveryDate' | 'commercialValue'> & {
  hourlyRate: number
  executionHours: number
}
```

`revisionHours` sozinho foi removido para eliminar ambiguidade; `totalRevisionHours` é **derivado**. `scopeDefinition` e `deliveryDate` acompanham o orçamento mas não entram na fórmula. O valor comercial é decisão separada do usuário. Modelo de edição de campos texto da proposta fica fora de `CalculatorState`.

## 5. Função de cálculo

A regra central é uma **função pura** sobre entradas normalizadas, sem regra visual.

```ts
function calculateEstimate(input: EstimateInput) {
  const totalRevisionHours =
    input.revisionCount * input.revisionHoursPerRound

  const totalHours =
    input.executionHours +
    totalRevisionHours +
    input.deadlineImpactHours +
    input.reserveHours

  const laborValue = totalHours * input.hourlyRate
  const directCostsTotal = input.directCosts.reduce(
    (sum, item) => sum + item.amount, 0
  )

  return {
    totalRevisionHours,
    totalHours,
    laborValue,
    directCostsTotal,
    calculatedValue: laborValue + directCostsTotal,
  }
}
```

**Contrato:** `deadlineImpactHours` representa apenas horas adicionais **reais declaradas**. `deliveryDate` não gera acréscimo automático. Nenhum percentual oculto. Não adicionar custos diretos às horas.

O código acima descreve a álgebra do cálculo, **não** define a política de precisão monetária em JavaScript. Antes da implementação financeira, o Business Rules deve definir representação de centavos/decimais, formatação e arredondamento, evitando erros de ponto flutuante e arredondamentos silenciosos.

## 6. Rastreabilidade

O resultado deve ser montado a partir do mesmo objeto usado no cálculo.

Evitar:

- label calculada separadamente da fórmula;
- valores mockados no resultado;
- duplicação de regra entre mobile e desktop;
- transformação silenciosa de horas em percentual.

## 7. Validação

Separar **validação de domínio** da validação de formulário.

### Domínio — invariantes mínimas

```ts
hourlyRate > 0
executionHours >= 0
revisionCount >= 0 && Number.isInteger(revisionCount)
revisionHoursPerRound >= 0
deadlineImpactHours >= 0
reserveHours >= 0
directCosts.every(c => c.amount >= 0)
```

Verificar finitude dos números e consistência dos pares de entrada antes do cálculo. Campos obrigatórios, valor de execução igual a zero, limites máximos, descrição de custos, data de entrega e valor comercial editado serão formalizados no Business Rules; não preencher lacunas por suposição.

### Formulário
- entrada vazia e mensagens de erro compreensíveis;
- formato de moeda e separador decimal pt-BR;
- número de rodadas vs. horas por rodada sem dupla contagem;
- itens monetários com descrição e valor;
- entradas inválidas nunca propagam `NaN` para o visor.

## 8. Estado e navegação

O wizard mantém estado único compartilhado entre as cinco etapas. Um reducer ou state machine simples é preferível a múltiplos estados locais desconectados.

- Voltar/avançar sem perder dados.
- Editar uma etapa a partir do resultado e recalcular imediatamente.
- Retornar do mini-fluxo de referência de valor/hora à etapa 1.
- Abrir a proposta **somente** após o CTA pós-resultado (QC-DEC-002).
- Permitir reiniciar orçamento; política de limpeza do rascunho permanece a detalhar.
- A rota `/` abre diretamente a calculadora (QC-DEC-004).

## 9. Persistência local e sessão

**QC-DEC-003 — escopos distintos:**

```text
localStorage:
  quantoCobro.hourlyRate
  quantoCobro.theme

sessionStorage:
  quantoCobro.currentEstimate.v1   // estado do orçamento da sessão
```

- Restaurar `hourlyRate` e `theme` entre sessões **no mesmo perfil de navegador**, quando permitido.
- Restaurar o rascunho ao atualizar a **mesma aba/sessão**; não prometer histórico nem sincronização em outra aba/dispositivo. Alguns navegadores podem copiar estado inicial ao duplicar uma aba: não usar `sessionStorage` como garantia de isolamento de segurança.
- Não usar `quantoCobro.lastEstimate` persistido permanentemente no MVP.
- Versionar o schema do rascunho e descartar versões incompatíveis sem quebrar a calculadora.
- Caso armazenamento esteja bloqueado ou indisponível, continuar com estado apenas em memória.
- Não enviar detalhes financeiros a provedores de ads ou analytics.
- Limpeza exata ao reiniciar ou concluir proposta: definir no Business Rules.

## 10. Proposta

**QC-DEC-002:** separar o objeto de cálculo dos textos coletados **após** “Criar proposta”.

```ts
type ProposalDraft = {
  projectName: string     // digitado após o CTA; vazio até preenchimento
  scopeSummary: string    // digitado após o CTA
  notes: string           // texto opcional digitado após o CTA
}

type ProposalViewModel = {
  projectName: string
  scopeSummary: string
  notes: string
  deliveryDate: string | null       // vindo do CalculatorState
  includedRevisions: number        // revisionCount
  directCosts: DirectCost[]        // do orçamento, não inventados
  commercialValue: number         // confirmado pela pessoa
}
```

`ProposalViewModel` é uma projeção dos campos efetivamente fornecidos. Não armazenar uma segunda cópia divergente de data, revisão, custos ou valor comercial. A prévia de proposta não pode ter textos ou valores mockados em produção. Não mostrar matemática interna por padrão.

Obrigatoriedade de `projectName`, `scopeSummary`, limites de texto e permissões de edição da prévia ainda dependem do Business Rules; **não interpretar tipo `string` como validação de campo obrigatório**.

## 11. PDF

### MVP
Usar impressão do navegador / print stylesheet.

Vantagens:
- zero backend;
- baixo esforço;
- funciona como “Salvar em PDF”.

### Futuro
Biblioteca dedicada ou geração server-side se houver necessidade de:

- templates;
- branding;
- paginação controlada;
- anexos;
- histórico em nuvem.

## 12. Rotas e SEO

A rota **canônica do MVP é `/`**, que exibe diretamente a calculadora (QC-DEC-004). **Não** criar home institucional obrigatória em `/` com a calculadora em `/calculadora`.

Outras rotas abaixo são **ideias editoriais**, não slugs finais aprovados:

```text
/                            # calculadora
/como-calcular-valor-hora
/como-cobrar-urgencia
/como-cobrar-revisoes
/alteracao-de-escopo
/modelo-de-orcamento-freelancer
```

O destino de `/calculadora` se já houver URL publicada (redirect, alias ou descontinuação) depende de inventário de URLs reais. SEO não pode bloquear ou empurrar o usuário para longe da ferramenta principal.

## 13. Publicidade

Criar componente `AdSlot` desacoplado do layout da calculadora.

### Posicionamentos possíveis

```text
result.afterPrimaryTask
content.inArticle
content.desktopRail
```

Não criar slots por etapa do wizard.

### Requisitos técnicos
- reservar dimensões para evitar CLS;
- lazy load abaixo da dobra quando aplicável;
- consentimento e privacidade conforme stack de ads adotada;
- não bloquear cálculo em caso de falha da rede de anúncios.

## 14. Analytics

Eventos sugeridos:

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

Não enviar valores financeiros específicos para analytics sem necessidade e revisão de privacidade.

## 15. Performance

Metas práticas:

- JS inicial pequeno;
- nenhuma biblioteca pesada apenas para formatação;
- cálculo instantâneo no cliente;
- conteúdo editorial renderizado de forma amigável a SEO;
- evitar fontes excessivas;
- reservar altura de ads.

## 16. Segurança e privacidade

MVP não precisa armazenar orçamento no servidor.

Isso reduz risco operacional.

Princípios:

- não coletar nome de cliente sem necessidade;
- não enviar valores de orçamento para serviços de terceiros por padrão;
- não depender de ads para liberar resultado;
- sanitizar texto inserido na proposta;
- CSP e proteção contra XSS compatíveis com a stack escolhida.

## 17. Estado derivado do visor da calculadora

O visor é uma projeção do estado da calculadora, não um estado financeiro independente.

Não persistir subtotais duplicados se eles puderem ser derivados. Preferir selectors/funções puras:

```ts
type DisplayState = {
  label: string
  primaryValue: string
  formula?: string
  accentValue?: string
  status: 'partial' | 'final'
}

function getDisplayState(state: CalculatorState, step: Step): DisplayState
```

Isso evita divergência entre o número do visor, breakdown e resultado final.

### Regras
- atualizar de forma síncrona após entrada válida;
- entrada inválida não deve propagar `NaN`;
- opcional em branco equivale a zero apenas no domínio quando essa regra estiver explicitamente definida;
- o visor pode mostrar subtotal parcial, mas precisa rotulá-lo como parcial;
- `commercialValue` não altera `calculatedValue`;
- nível de definição do escopo é texto que reproduz a opção do usuário, não score calculado;
- a referência calculada domina o resultado, seguida de composição e valor comercial editável.

## 18. Camada de interação numérica

O keypad custom deve chamar as mesmas actions/reducer usadas por teclado físico e input nativo. Não criar uma segunda lógica de edição.

Exemplo:

```ts
dispatch({ type: 'SET_EXECUTION_HOURS', value })
dispatch({ type: 'ADJUST_EXECUTION_HOURS', delta: 1 })
```

O componente visual circular é apenas uma interface para essas ações.

## 19. Responsividade

Não manter dois aplicativos separados.

Mesmo estado, mesma regra e mesmos componentes devem responder ao viewport.

Diferença entre mobile e desktop é de layout, não de lógica.

## 20. Internacionalização

MVP em pt-BR.

Preparar utilitários de:

- moeda;
- número decimal;
- data;
- pluralização.

Não hardcodar `R$` dentro da regra de cálculo.

## 21. Testes

### Unitários
- `revisionCount × revisionHoursPerRound` entra **uma única vez** em `totalHours`;
- quantidade de custos diretos maior que um: soma correta fora da mão de obra;
- data de entrega e `scopeDefinition` não mudam `calculatedValue`;
- horas adicionais por impacto de prazo entram apenas quando informadas;
- todos os opcionais zerados produzem somente valor/hora × execução;
- editar valor comercial não altera a referência calculada;
- valores decimais e entradas inválidas não geram resultado inconsistente.

**Caso numérico hipotético de contrato** (não é dado de usuário): R$ 100/h × (10h execução + 2 rodadas × 2h + 1h impacto do prazo + 0h reserva) + R$ 30 e R$ 20 de custos = **R$ 1.550**. A data e o nível do escopo não alteram essa soma.

### Integração
- fluxo completo e voltar/editar;
- adicionar/editar/remover vários custos;
- resultado dominante + composição + valor comercial independente;
- persistência de valor/hora e tema entre sessões e rascunho durante a sessão;
- mini-fluxo de referência com meta mensal e horas faturáveis semanais;
- coleta de nome/escopo/observação apenas após “Criar proposta”;
- proposta deriva prazo, revisões, custos e valor comercial do orçamento;
- layout dark/light, resultado idêntico em mobile/desktop.

### E2E
- novo usuário e usuário com valor/hora salvo;
- cálculo sem extras e com todos os extras;
- atualizar página na mesma sessão e restaurar rascunho quando armazenamento permitido;
- não depender de histórico permanente ao abrir nova sessão;
- proposta em copiar/imprimir;
- anúncio falha e a calculadora continua operacional.

## 22. Evolução futura

Se houver conta/histórico:

```text
Client
  ↓
API
  ↓
Auth + Database
```

Adicionar backend apenas quando existir necessidade clara de sincronização, histórico ou colaboração.

## 23. Veredito técnico

Para o MVP, **frontend-first e local-first** é a melhor relação entre simplicidade, custo e velocidade. Um backend agora adicionaria manutenção sem resolver um problema real do fluxo aprovado.


## 24. Contrato com o design system

A aplicação deve consumir a mesma semântica de tema definida no Figma e no `design-system.md`. Light e dark compartilham estrutura e componentes. O código não deve duplicar lógica de layout por tema nem introduzir cores funcionais fora dos tokens aprovados.


## 25. Contrato com a direção visual aprovada

A interface de produção deve preservar a gramática das telas `FINAL —` do Figma: visor persistente, números alinhados à direita, controles numéricos circulares quando adequados e ação laranja única por contexto. Isso é uma restrição de arquitetura de apresentação, não uma mudança na regra de negócio.

O home indicator visto nos mocks é somente detalhe de apresentação do frame mobile e **não** faz parte do DOM da aplicação web.

## 26. Fontes visuais e dependências documentais

- **Figma FINAL:** `01 — FINAL · Mobile`, `02 — FINAL · Desktop`, `03 — FINAL · Publicidade`. A página legada `03 — Visual Mobile v1` não é fonte de implementação.
- **FigJam:** fluxo, sitemap e sequência de entrega NOW/NEXT.
- **PRD:** entradas, comportamento do produto e escopo do MVP.
- **Decision Log:** decisões QC-DEC-001 a QC-DEC-004 e pendências.

A auditoria anterior reportou os nós Figma `41:*` como referências históricas ainda compatíveis, mas a correspondência com os frames atuais deve ser confirmada antes do handoff. Corrigir os artefatos visuais para mostrar data de entrega, nível de definição, revisões por rodada, múltiplos custos e mini-fluxo do valor/hora. A hierarquia do Design System e o contrato do Handoff ainda exigem atualização.

### Fluxo opcional de valor/hora — fórmula de domínio

```text
horas_faturaveis_mes_estimadas = horas_faturaveis_semana × 4,33
valor_hora_referencia = faturamento_mensal_desejado / horas_faturaveis_mes_estimadas
```

É referência de faturamento, **não** custo/hora completo ou preço de mercado. Não inclui automaticamente impostos, ferramentas, férias, inadimplência ou margem. Permitir editar o valor final antes de persistir. Divisão por zero, limites e arredondamentos precisam de regra no Business Rules.

### Pendências do Business Rules

- Regras de obrigatoriedade e limites de campos numéricos e textuais.
- Precisão de dinheiro, arredondamento e tratamento de centavos.
- Data de entrega inválida e datas passadas.
- Itens de custo incompletos, duplicados ou removidos.
- Política de confirmação/reinício e descarte do rascunho.
- Validação da proposta e edição de dados depois da prévia.
- Destino de URLs antigas, caso existam, após inspeção do deploy.
