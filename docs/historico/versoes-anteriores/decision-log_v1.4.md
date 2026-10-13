# Quanto Cobro? — Decision Log

**Versão:** 1.4 (registro acumulado; decisões QC-DEC-001 a 004 inalteradas)  
**Atualizado em:** 12/10/2026  
**Fonte da aprovação:** confirmação explícita do responsável pelo produto nesta conversa, em 12/10/2026.  
**Escopo do registro:** decisões aprovadas e histórico acumulado de alterações. PRD, Architecture, Design System e Handoff já sincronizados na documentação; Figma tem versões candidatas v1.3 e FigJam dispõe do mapa organizado v1.4. Estados antigos mantidos abaixo são registros históricos, não status atual.

## Decisões aprovadas

### QC-DEC-001 — Custos diretos por itens

- **Status:** APROVADA
- **Data:** 12/10/2026
- **Decisão:** no MVP, o usuário pode cadastrar **vários custos diretos**, cada qual com **descrição e valor**.
- **Consequência funcional:** os valores monetários de custos diretos são somados entre si e adicionados à referência calculada **fora das horas de trabalho**. A seção permanece opcional no cálculo.
- **Racional apresentado antes da aprovação:** vários gastos podem compor o mesmo orçamento; um valor agregado esconderia itens úteis na proposta.
- **Impactos a sincronizar:** PRD (etapa de ajustes e resultado), Architecture (`directCosts[]`), Figma (adicionar/editar/remover itens), Design System (`CostRow`), Handoff (testes de soma e proposta).
- **Não decidido nesta aprovação:** limite de itens, tamanho máximo da descrição e tratamento de itens incompletos.

### QC-DEC-002 — Dados da proposta só depois de “Criar proposta”

- **Status:** APROVADA
- **Data:** 12/10/2026
- **Decisão:** **nome do projeto, resumo do escopo e observações** são coletados somente após o usuário acionar **“Criar proposta”**, a partir do resultado. Não devem ser acrescentados como campos obrigatórios ao cálculo.
- **Consequência funcional:** a prévia da proposta deve utilizar esses campos efetivamente digitados e os dados já existentes no cálculo: prazo, revisões incluídas, custos diretos aplicáveis e valor **comercial** final. Não preencher nome, descrição ou observações com fatos fictícios.
- **Racional:** manter o cálculo rápido para quem não precisa produzir proposta.
- **Impactos a sincronizar:** PRD (etapa pós-resultado), Architecture (estado de proposta separado do cálculo), Figma (formulário e prévia), FigJam (ramificação pós-resultado), Handoff (origem dos dados e exportação).
- **Não decidido nesta aprovação:** quais campos da proposta serão obrigatórios para copiar/imprimir, e se há regras específicas de edição após a prévia.

### QC-DEC-003 — Persistência local com sessão para orçamento corrente

- **Status:** APROVADA
- **Data:** 12/10/2026
- **Decisão:** **valor/hora e tema persistem localmente** entre sessões; **orçamento em andamento fica restrito à sessão**. Sem login ou armazenamento remoto no MVP.
- **Contrato técnico compatível com a escolha:** `localStorage` para `hourlyRate` e `theme`; `sessionStorage` para o rascunho corrente do orçamento. Tecnologia de armazenamento é concretização técnica recomendada; não é uma exigência de biblioteca/framework.
- **Consequência funcional:** atualizar a página na mesma aba pode restaurar o rascunho; uma nova sessão não deve depender da sobrevivência desse rascunho. Não prometer histórico de orçamentos.
- **Impactos a sincronizar:** PRD (remover persistência do último cálculo como “opcional”), Architecture (chaves e responsabilidades), Handoff (recuperação e limpeza do estado), testes e microcopy.
- **Não decidido nesta aprovação:** política de limpeza após “reiniciar”, dados de proposta no rascunho e eventual aviso de privacidade de dados locais.

### QC-DEC-004 — Rota / como calculadora

- **Status:** APROVADA
- **Data:** 12/10/2026
- **Decisão:** a **homepage `/` é diretamente a calculadora**. Não haverá landing institucional obrigatória antes da ferramenta no MVP.
- **Consequência funcional:** conteúdo explicativo e publicidade respeitam a prioridade da tarefa; páginas educativas podem ter rotas próprias.
- **Racional:** reduzir o caminho até o cálculo e preservar o formato de ferramenta direta.
- **Impactos a sincronizar:** Architecture (sitemap e rotas), FigJam (sitemap), PRD (navegação), Handoff (roteamento), SEO e analytics.
- **Não decidido nesta aprovação:** política de redirecionamento de `/calculadora` caso tenha sido publicada e slugs finais de páginas educativas.

## Consolidações previamente sustentadas pela auditoria (não são novas decisões)

- Produto: calculadora web gratuita, sem login no MVP; mobile e desktop compartilham regras.
- Valor de referência calculado e valor comercial são conceitos separados.
- Fórmula de esforço: horas de execução + horas de revisões + horas decorrentes do impacto do prazo + reserva opcional; multiplicar pela taxa/hora e adicionar custos diretos monetários. Sem percentuais automáticos.
- Revisões: **quantidade × horas por rodada = horas totais de revisão**; `revisionHours` isolado não descreve corretamente o modelo visual.
- Prazo: data de entrega e conteúdo da proposta; não encarece o trabalho por si só.
- Escopo: usuário informa nível qualitativo de definição (bem definido/parcialmente definido/aberto ou termo final equivalente); exibir no resultado sem pontuação ou coeficiente.
- Referência de valor/hora: fluxo separado e opcional, com base já trabalhada **faturamento mensal desejado ÷ (horas faturáveis por semana × 4,33)**; sem afirmar que impostos, ferramentas, férias, inadimplência e margem já foram incluídos. Confirmar/corrigir essa ressalva na especificação antes de codificar.
- Ads: nunca entre campos, ações ou resultado e CTA; primeiro slot depois da tarefa e das ações principais. Rail desktop é experimento, não obrigação.
- Figma FINAL orienta visual; FigJam orienta jornada, fluxo, sitemap e sequência de entrega.

## Correções exigidas antes de redigir o Business Rules definitivo

| ID | Prioridade | Fonte | Correção e evidência esperada |
| --- | --- | --- | --- |
| QC-FIX-01 | Bloqueante de especificação | PRD + Architecture + Handoff | Substituir modelo ambíguo de revisões por `revisionCount` e `revisionHoursPerRound`, total derivado. Eliminar possibilidade de dupla contagem; refletir no resultado. |
| QC-FIX-02 | Bloqueante de especificação | PRD + Architecture + Handoff | Normalizar `urgencyHours` para o conceito **horas adicionais por impacto do prazo**. Retirar “ou esforço adicional” quando não há entrada compatível. Preservar o fato de que a data por si só não altera o preço. |
| QC-FIX-03 | Bloqueante de especificação | PRD + Architecture + Handoff | Fixar `directCosts[]` com descrição, valor e soma externa às horas, conforme QC-DEC-001; representar inclusão e remoção de vários itens. |
| QC-FIX-04 | Bloqueante de especificação | PRD + Architecture + Handoff | Introduzir/alinhar origem dos campos de proposta acionados após o CTA (QC-DEC-002); proposta usa valor comercial e não fabrica conteúdos. |
| QC-FIX-05 | Bloqueante de especificação | PRD + Architecture + Handoff | Persistência: `hourlyRate` + `theme` locais, orçamento de sessão; retirar referência a `lastEstimate` persistido por tempo indeterminado como requisito opcional (QC-DEC-003). |
| QC-FIX-06 | Bloqueante de especificação | Architecture + PRD + FigJam | Definir `/` como ferramenta, eliminar sitemap duplo que trate `/calculadora` como entrada principal (QC-DEC-004). |
| QC-FIX-07 | Bloqueante de rastreabilidade | PRD + Design System + Handoff | Trocar referências à página extinta `03 — Visual Mobile v1` pelas páginas atuais: `01 — FINAL · Mobile`, `02 — FINAL · Desktop`, `03 — FINAL · Publicidade`. Confirmar os nós 41:* antes do handoff. |
| QC-FIX-08 | Bloqueante de cobertura visual | Figma FINAL Mobile + Desktop | Reintroduzir a escolha do nível de definição do escopo na etapa de execução e o nível + explicação no resultado; espelhar no desktop. |
| QC-FIX-09 | Bloqueante de cobertura visual | Figma FINAL Mobile + Desktop | Reintroduzir a data de entrega na etapa de prazo; mantê-la independente do cálculo financeiro. |
| QC-FIX-10 | Bloqueante de cobertura visual | Figma FINAL Mobile + Desktop | Reconciliar a interface de revisões com quantidade × horas por rodada, e custos diretos com itens descritos + valor. |
| QC-FIX-11 | Bloqueante de cobertura visual | Figma FINAL + FigJam | Restaurar o mini-fluxo “Descobrir referência de valor/hora” e o retorno à calculadora; não deixar link para tela ausente. |
| QC-FIX-12 | Bloqueante de cobertura visual | Figma FINAL + FigJam | Exibir coleta do nome, escopo e observações ao acionar “Criar proposta”; fazer a prévia resultar das entradas reais. |
| QC-FIX-13 | Alinhamento de hierarquia | Design System | Ajustar ordem do resultado para **referência calculada dominante → composição → valor comercial editável**, conforme Figma FINAL aprovado; mostrar nível de definição. |
| QC-FIX-14 | Alinhamento documental | PRD + FigJam + Handoff | Distinguir **escopo do MVP** de **sequência de implementação NOW/NEXT**; casos de uso são contextos do mesmo cálculo, não ferramentas separadas. |
| QC-FIX-15 | Alinhamento documental | PRD + Architecture | Inserir fórmula do fluxo de referência de valor/hora e ressalvas de limite, sem confundir com preço de mercado. |

## Não bloqueia a especificação do cálculo (acompanhar separadamente)

- Recuperação exata dos frames históricos anteriores à limpeza do Figma.
- Validação experimental do rail lateral de anúncios em desktop.
- Refinamentos de copy e hierarquia de conteúdo editorial que não alteram inputs ou fórmula.

## Checagem para liberar a redação do Business Rules

- [ ] Os quatro documentos existentes (PRD, Architecture, Design System e Handoff) citam explicitamente QC-DEC-001 a QC-DEC-004 sem contradições.
- [ ] Figma FINAL Mobile/Desktop e FigJam representam entradas, saída e navegação acordadas, sem telas inexistentes.
- [ ] Uma única especificação define revisões, impacto do prazo, reserva, custos e valor comercial; nenhuma dupla contagem.
- [ ] Campos da proposta possuem origem definida; obrigatoriedade e validações restantes são identificadas como regras a especificar, não como decisões já aprovadas.
- [ ] A fórmula da referência de valor/hora está documentada com limitações e possibilidade de editar o resultado.
- [ ] Um caso-teste completo e outro sem opcionais produzem os mesmos números no modelo de dados, interface e texto de proposta.

## Registro de sincronização — 12/10/2026

- **PRD.md v1.1:** sincronizado com QC-DEC-001 a QC-DEC-004 e contratos existentes de revisão, prazo, escopo, custos, proposta, valor/hora, rota e persistência. Foram especificadas as pendências ainda abertas; validações não foram inventadas.
- **architecture.md v1.1:** atualizado com `revisionCount`, `revisionHoursPerRound`, `deadlineImpactHours`, `directCosts[]`, `deliveryDate`, `scopeDefinition`, `ProposalDraft`, funções derivadas, política local/sessão e rota `/`.
- **Ainda pendentes:** Figma FINAL, FigJam, `design-system.md` e `handoff_tecnico.md`; conferir identificadores de frames atuais, alinhar hierarquia e testar os fluxos.
- **Business Rules:** não iniciado. O contrato numérico está melhor definido, mas os requisitos de entrada/validação e a reconciliação visual/técnica precisam ser encerrados antes da versão definitiva.

**Estado deste registro:** 4 decisões aprovadas; PRD e Architecture sincronizados; demais artefatos pendentes de execução.**

## Auditoria Figma / FigJam — 12/10/2026 (revisao v1.3)

**Politica de preservacao:** nao apagar, renomear nem sobrescrever paginas ou frames historicos, tampouco os frames FINAL aprovados. As novas alternativas ficam separadas e identificadas como revisao, ainda nao como versao FINAL.

**Figma inspecionado:** arquivo 87RIlysRO3vHEDm7Ghdzf3. Paginas verificadas: `01 — FINAL · Mobile` (`9:2`), `02 — FINAL · Desktop` (`49:2`), `03 — FINAL · Publicidade` (`52:2`) e `04 — FINAL · Valor-hora` (`70:25`). Historico mantido em `90 — HISTÓRICO · Wireframes` (`52:31`) e `91 — HISTÓRICO · Visual v1` (`52:41`).

**Correcao do diagnostico antigo:** as telas atuais JA incluem escolha de definicao do escopo em Execucao (`41:38`), data de entrega (`41:88`) e nivel de definicao no Resultado (`41:159`), alem de fluxo visual de valor/hora em tres etapas (`70:26`, `70:41`, `70:57`) e espelhos desktop. Nao duplicar nem recriar essas funcionalidades.

**Adicoes feitas, sem tocar em telas existentes:** dois painéis editaveis anexos na pagina Mobile, abaixo da sequencia atual: `84:2` (REVISAO v1.3 — Ajustes / custos expandidos) e `84:26` (REVISAO v1.3 — Criar proposta / coleta). Sao especificacoes visuais de estados complementares, nao telas finais nem aprovacao de novas regras. A primeira demonstra adicao de multiplos custos com descricao/valor; a segunda coleta nome, resumo do escopo e observacoes somente apos `Criar proposta`.

**Ainda pendente de aplicar nas telas oficiais:** substituir a interface agregada de custo direto nos frames `41:126` e desktop `70:215` por estrutura multi-item; incorporar coleta pos-CTA antes das propostas `41:190` e desktop `70:288`, e reconciliar FigJam com o estado de coleta antes de copiar/imprimir.

**Divergencias novas verificadas:** exemplo desktop de valor-hora `73:279` mostra `Persistencia: 0 h`, semanticamente errado; demonstracao de custos em `41:126` continua agregada; pagina Publicidade usa exemplos antigos de `Urgencia` em vez de `Impacto do prazo` e nao exibe nivel de definicao no exemplo de resultado. Verificar exemplos e nao usar esses mocks como contrato da calculadora.

**FigJam inspecionado:** board `LoGu3vG6gQtt9KEGnAJ9CA`, root `0:1`, com fluxo principal, excecoes, sitemap (`/` como raiz) e NOW/NEXT/LATER. O fluxo pula da acao `Gerar proposta` diretamente para `Copiar proposta ou salvar PDF`, sem coleta explicita dos textos da proposta. Nenhuma mutacao foi feita no FigJam nesta auditoria, preservando sua historia.

**Status Business Rules:** permanece bloqueado para versao definitiva ate terminar integracao dos complementos nos frames FINAL, reconciliar fluxo do FigJam e definir validacoes pendentes. A auditoria observou artefatos atuais, nao comprovou comportamento funcional em codigo.

## Implementação visual — continuação v1.3 (12/10/2026)

**Política de preservação:** nenhum frame original `FINAL`, página `90 — HISTÓRICO · Wireframes` ou página `91 — HISTÓRICO · Visual v1` foi removido ou modificado nesta rodada. Os incrementos foram construídos em cópias na mesma página, identificadas `v1.3`, com a revisão anterior íntegra para comparação. O novo material ainda não substitui automaticamente a fonte visual oficial.

### Figma — cópias versionadas

- Mobile: cópia integral das nove telas originais em uma faixa separada, y=4300, IDs `89:2`, `89:38`, `89:98`, `89:142`, `89:176`, `89:213`, `89:234`, `89:284`, `89:334`.
- Desktop: cópia integral das nove telas originais em uma faixa separada, y=1130, IDs `89:365`, `89:401`, `89:461`, `89:505`, `89:539`, `89:576`, `89:597`, `89:647`, `89:697`.
- Mobile ajuste de custos expandido: `89:142`, com painel `89:728`; dois itens ilustrativos, inclusão e remoção de itens, total somado externamente às horas.
- Desktop ajuste de custos expandido: `89:505`, com painel `89:770`; conteúdo equivalente.
- Mobile coleta de proposta após CTA: `89:213`, com painel `89:752`; nome do projeto, resumo de escopo, observações opcionais e ação de prévia.
- Desktop coleta de proposta após CTA: `89:576`, com painel `89:794`.
- Prévia de proposta preservada em telas v1.3 separadas: mobile `89:812` e desktop `89:833`, clonadas da tela anterior para não perder o estado de copiar/salvar.
- Originais continuam nos mesmos IDs, inclusive `41:126`, `41:190`, `70:215`, `70:288`. Foram ocultados elementos somente nas **cópias modificadas** para substituir o formulário antigo pela nova versão. Não apagar, ocultar ou substituir os originais.

### FigJam — fluxo incremental

Criada trilha adicional v1.3 no mesmo board, sem alterar os conectores antigos: resultado -> valor comercial -> criar proposta -> coletar nome/escopo/notas -> prévia com prazo, revisões, custos e valor -> copiar/salvar PDF. Nós: `13:365`, `13:369`, `13:373`, `13:377`, `13:381`, `13:385`, `13:389`, `13:393`, `13:397`, `13:401`, `13:405` (shapes e conectores).

### Correções ainda não resolvidas

- Validar visualmente o encaixe dos painéis v1.3 em tamanhos reais, sobretudo mobile pequeno e desktop, e os comportamentos dos estados vazio, único e múltiplos custos. Os campos inseridos são editáveis no Figma, não um protótipo funcional.
- Atualizar a prévia v1.3 para deixar ainda mais explícita a origem dos dados, sem mostrar nomes e escopos de exemplo como dados implícitos de cliente.
- Corrigir a inconsistência visual `Persistência: 0 h` na antiga tela de referência de valor/hora desktop, **somente em cópia**, mantendo a antiga como histórico.
- Atualizar exemplos na página `03 — FINAL · Publicidade` após a escolha da versão visual.
- Verificar se o fluxo antigo do FigJam tem ligações que contornam a coleta da proposta; a nova trilha documenta o fluxo aprovado e não apaga a anterior.
- Não alterar a condição de aprovação das decisões QC-DEC-001 a 004: permanecem aprovadas. Regras quantitativas ainda abertas devem ir para o Business Rules, não para correção silenciosa de Figma.

**Estado:** Figma e FigJam com versões candidatas v1.3 e histórico preservado; aprovação visual/QA e atualização de instruções de handoff continuam pendentes antes de liberar implementação e Business Rules definitivo.


---

## Atualização de organização do FigJam — mapa v1.4 (12/10/2026)

**Natureza:** organização visual e rastreabilidade, **não é uma nova decisão de produto**. Todos os conteúdos anteriores foram preservados. A versão organizada é a fonte de consulta recomendada para jornada, navegação e sequenciamento; os artefatos textuais continuam a fonte para regras de cálculo e contratos de dados.

**Board:** [Quanto Cobro — FigJam](https://www.figma.com/board/LoGu3vG6gQtt9KEGnAJ9CA?node-id=17-389)

### Áreas ativas organizadas

| Seção | ID | Conteúdo |
| --- | --- | --- |
| 00 — Começar aqui | `17:389` | Índice visual da versão atual e aviso sobre histórico |
| 01 — Fluxo principal | `18:404` | Entrada em `/`, valor/hora, execução, escopo, prazo, revisão, adicionais, custos, resultado, valor comercial; ramificação da referência de valor/hora |
| 02 — Proposta | `18:533` | Resultado → CTA → coleta pós-CTA → prévia → copiar ou imprimir; ramificação sem proposta |
| 03 — Estados | `19:517` | Entrada inválida, voltar/editar, restauração na sessão e novo orçamento; limpeza do rascunho marcada como pendente |
| 04 — Sitemap | `19:630` | `/` como calculadora; páginas educativas separadas; slugs editoriais ainda sujeitos a confirmação |
| 05 — Publicidade | `19:651` | Anúncio somente após conclusão das ações; falha sem bloquear; rail desktop como experimento |
| 06 — Roadmap | `19:680` | NOW, NEXT e LATER como **ordem de execução**, não como definição de MVP |

### Histórico conservado

- Nenhum nó ou conector anterior foi excluído, deslocado, renomeado ou substituído.
- Permanecem os grupos originais com as contagens auditadas: `1:*` (14), `2:*` (30), `3:*` (35), `4:*` (16), `11:*` (13), `12:*` (5) e `13:*` (11), totalizando 124 elementos de topo do legado.
- Foram acrescentadas sete etiquetas **HISTÓRICO**, de `20:626` a `20:650`, sem alteração nas estruturas existentes.
- O fluxo incremental v1.3 (`13:*`) continua recuperável para comparação.

### Validação executada

- Sete seções novas identificadas e conferidas, com conteúdo organizado.
- 36 conectores novos nas seções organizadas, com origem e destino preenchidos (13 + 6 + 12 + 1 + 2 + 2).
- Conferência visual de todas as sete seções, com ajuste de contraste no cabeçalho do índice (`17:393`).
- Exemplos em formas diagramáticas são **representações**, não telas de produção ou protótipos funcionais.

### Continua pendente, fora do escopo desta organização

- Conferência final visual das telas v1.3 no Figma em mobile e desktop.
- Correção da inconsistência de exemplo `Persistência: 0 h` nas cópias desktop, com histórico preservado.
- Revisão dos exemplos da página Publicidade e sincronização final do Handoff.
- Definições de Business Rules ainda abertas: obrigatoriedade, validação, arredondamento, política de limpeza do orçamento, limites de custo, entre outras.

**Estado atual:** FigJam v1.4 organizado e verificável; histórico preservado; as quatro decisões QC-DEC continuam aprovadas. **Não** significa aprovação automática das telas v1.3 nem conclusão do Business Rules.
