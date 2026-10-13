# Quanto Cobro? — PRD

**Versão documental:** 1.2 · **Atualizado:** 12/10/2026 (v1.1 preservada em `historico_apoio/versoes-anteriores/`)  
**Decisões aprovadas:** QC-DEC-001 a QC-DEC-014 (ver `decision-log.md` v1.5).  
**Regras de validação, precisão e estados:** `business-rules.md` v1.0.  
**Estado:** contrato de produto sincronizado com Business Rules; Figma v1.4 aprovada como handoff (QC-DEC-016).

## 1. Visão do produto

**Quanto Cobro?** é uma calculadora web gratuita para freelancers brasileiros, com foco inicial em designers, criada para transformar uma demanda ainda pouco estruturada em uma **referência de cobrança explicável e rastreável**.

O produto não tenta dizer qual é o “preço certo”. Ele ajuda o usuário a organizar variáveis de esforço, escopo, prazo, revisões e custos para chegar a uma referência de cobrança e, depois, decidir seu valor comercial.

O modelo inicial de monetização é **100% gratuito para o usuário, financiado por publicidade**. A publicidade não deve interromper a tarefa principal.

## 2. Problema

Freelancers frequentemente precificam usando memória, comparação informal, “feeling” ou um valor/hora sem estrutura clara. Isso gera pelo menos quatro problemas:

- inconsistência entre orçamentos parecidos;
- esquecimento de tempo de revisão ou retrabalho;
- dificuldade de explicar como um valor foi formado;
- subprecificação quando escopo, urgência ou custos extras aparecem tarde.

O produto resolve a organização do raciocínio, não o mercado inteiro de precificação.

## 3. Público inicial

### Primário
Freelancers e designers brasileiros que precisam montar um orçamento rápido para um novo trabalho ou alteração de demanda.

### Casos de uso iniciais
- novo projeto;
- alteração de escopo;
- trabalho com impacto de prazo;
- revisão adicional;
- reabertura de trabalho já encerrado.

São **contextos de uso do mesmo motor de cálculo**, não calculadoras ou modos independentes.

## 4. Objetivo do MVP

Permitir que uma pessoa chegue a uma referência de cobrança confiável em poucos minutos, sem login, sem dashboard e sem precisar entender fórmulas complexas.

### Critério de sucesso do fluxo
Ao concluir a calculadora, o usuário deve entender:

1. qual valor foi calculado;
2. quais entradas formaram esse valor;
3. qual parte é estimativa e qual parte é decisão comercial;
4. como transformar o resultado em uma proposta simples para enviar ao cliente.

## 5. Não objetivos do MVP

- gestão de clientes;
- CRM;
- emissão fiscal;
- cálculo de impostos e taxas;
- cobrança ou pagamento;
- histórico em nuvem;
- conta de usuário;
- dashboard de projetos;
- benchmarking automático com “preço de mercado”;
- recomendação de multiplicadores arbitrários por nível de experiência;
- precificação automática como verdade objetiva.

## 6. Proposta de valor

A promessa correta é:

> Organize o esforço do trabalho e chegue a uma referência de cobrança que você consegue entender e explicar.

Evitar promessas como “descubra o preço certo” ou “saiba exatamente quanto cobrar”.

## 7. Princípios de produto

### 7.1 Calculadora, não SaaS
A experiência deve parecer uma ferramenta direta, não um sistema de gestão.

### 7.2 Uma decisão principal por etapa
Pergunta → resposta → próxima etapa.

### 7.3 O resultado precisa ser rastreável
Nenhum valor deve aparecer no resultado sem ter sido informado ou derivado de uma regra visível.

### 7.4 Sem percentuais mágicos
Impacto do prazo, reserva e revisões não entram como percentuais ou multiplicadores arbitrários.

### 7.5 Separar referência de valor comercial
O sistema calcula uma referência. O freelancer decide quanto realmente quer cobrar.

### 7.6 Ads fora da tarefa principal
Nenhum anúncio entre campo, CTA, navegação ou resultado principal.

## 8. Fluxo principal

**Rota de entrada:** `/` exibe a calculadora diretamente, sem uma página institucional intermediária (QC-DEC-004).

### Entrada
O usuário pode informar seu valor/hora ou abrir o mini-fluxo opcional **“Quero descobrir minha referência de valor/hora”**. Os dois caminhos retornam à mesma calculadora.

### Etapa 1 — Valor/hora
- Informar ou editar valor/hora (obrigatório, > 0; QC-DEC-005).
- Recuperar o valor/hora salvo no dispositivo, quando existir (QC-DEC-003). O valor é salvo automaticamente ao confirmar a etapa, com ação visível “Apagar valor salvo” (QC-DEC-009).
- Não pressupor que o valor/hora é preço de mercado ou recomendação universal.

### Etapa 2 — Execução e definição do escopo
- Informar horas estimadas de execução **sem revisões** (obrigatório, > 0; QC-DEC-005).
- Selecionar, opcionalmente, o nível de definição do escopo: **Bem definido**, **Parcialmente definido** ou **Aberto**.
- A classificação é escolhida pela própria pessoa. Não afeta a fórmula nem é atribuída por algoritmo.

### Etapa 3 — Prazo e revisões
- Informar, opcionalmente, **data de entrega** para contextualizar a demanda e compor a proposta. Data no passado gera aviso não bloqueante (QC-DEC-012).
- Informar **quantidade de rodadas de revisão** e **horas previstas por rodada**, ambas iniciando em **0** (QC-DEC-006).
- Derivar horas totais de revisão como `revisionCount × revisionHoursPerRound`, sem somá-las duas vezes.
- Se o prazo efetivamente exigir trabalho adicional, permitir informar **horas adicionais por impacto do prazo**. O campo começa em zero e não é preenchido automaticamente pela data.

**A data de entrega, sozinha, não modifica o preço.** Não há taxa percentual de urgência.

### Etapa 4 — Incerteza e custos
Estado inicial: **Nada extra**.

Entradas opcionais:
- horas de reserva para incerteza, inicialmente zero;
- **múltiplos custos diretos**, cada um com descrição e valor monetário (QC-DEC-001).

A pessoa pode adicionar, editar ou remover itens. Os custos são somados em dinheiro, fora da mão de obra. Não sugerir reserva ou percentual automático.

### Etapa 5 — Resultado
Ordem de informação:
1. **referência calculada** como valor numericamente dominante;
2. composição rastreável: execução, revisões totais, horas por impacto do prazo, reserva, valor/hora, soma dos custos diretos;
3. **valor comercial editável**, separado da referência calculada; começa igual à referência e a acompanha até ser editado (QC-DEC-008);
4. nível de definição informado e uma explicação curta da opção escolhida (“Não informado” quando vazio);
5. ações: editar etapas, **Criar proposta**, reiniciar (com confirmação; QC-DEC-010).

O usuário pode voltar e editar qualquer etapa preservando os dados. O CTA **“Criar proposta”** abre a coleta pós-cálculo definida na seção 12. Anúncios não podem intervir entre resultado e ações principais.

## 9. Fórmula do MVP

```text
horas_revisao = quantidade_rodadas × horas_por_rodada
horas_totais = horas_execucao + horas_revisao + horas_impacto_prazo + horas_reserva
mao_de_obra = valor_hora × horas_totais
custos_diretos_total = soma(valor de cada custo direto)
referencia_calculada = mao_de_obra + custos_diretos_total
```

- `horas_impacto_prazo`, `horas_reserva` e `custos_diretos_total` começam em **zero**.
- Horas de execução não devem incluir revisões, horas adicionais por prazo ou reserva já contadas em campos separados.
- Data de entrega e nível de definição do escopo são **informações não financeiras**.
- Não aplicar percentual de urgência, reserva ou experiência, nem arredondamento silencioso.
- `valor_comercial` é decisão editável do freelancer e **não altera** `referencia_calculada`.
- Precisão: dinheiro em centavos inteiros, horas com até 2 casas, arredondamento único no final, metade para cima (QC-DEC-007). Obrigatoriedade e tetos técnicos: QC-DEC-005 e QC-DEC-014. Detalhes em `business-rules.md` §2–§4 e §11.

## 10. Nível de definição da estimativa

A pessoa classifica o próprio escopo em uma destas categorias:

- **Bem definido** (`well_defined`): entregáveis e limites já estão claros;
- **Parcialmente definido** (`partial`): existem escolhas ou dependências em aberto;
- **Aberto** (`open`): escopo, dependências ou entregáveis ainda são pouco claros.

O sistema mostra **a opção informada e uma explicação genérica da categoria**, sem pontuação de confiança nem cálculo do nível. Não afirmar que o produto avaliou a qualidade do briefing.

## 11. Fluxo opcional — referência de valor/hora

Objetivo: oferecer uma **referência inicial** para quem ainda não tem valor/hora definido.

Entradas:
- meta desejada de faturamento mensal;
- horas efetivamente **faturáveis** por semana (não confundir com todas as horas trabalhadas).

```text
horas_faturaveis_mes_estimadas = horas_faturaveis_semana × 4,33
valor_hora_referencia = faturamento_mensal_desejado ÷ horas_faturaveis_mes_estimadas
```

`4,33` é uma aproximação de semanas por mês. A saída **não cobre automaticamente** impostos, ferramentas, férias, meses sem demanda, inadimplência ou margem. Não apresentá-la como preço adequado a um mercado ou profissão.

- Manter o mini-fluxo visual e funcional separado do orçamento.
- Permitir que a pessoa aceite ou edite a referência e retorne à etapa 1.
- O valor/hora escolhido pode ser persistido no dispositivo segundo QC-DEC-003.
- Resultado arredondado uma vez para centavos e editável antes de usar; horas/semana > 0 e ≤ 168 (`business-rules.md` §4.5 e §11).

## 12. Proposta para o cliente

**Ponto de entrada:** após concluir o cálculo, a pessoa clica em **“Criar proposta”**. Somente nesse momento o produto coleta (QC-DEC-002):

- nome do projeto;
- resumo do escopo;
- observações, opcionais.

Esses campos **não pertencem às cinco etapas de cálculo**. O conteúdo da prévia deve vir dos textos digitados e dos dados já existentes no orçamento:

- data de entrega;
- número de rodadas de revisão incluídas;
- custos diretos relevantes, quando houver;
- **valor comercial**, nunca substituído silenciosamente pela referência calculada.

Não preencher nome, escopo, observações ou dados do cliente com exemplos fictícios em produção. Não exibir toda a matemática interna na proposta destinada ao cliente.

### Saídas MVP
- copiar proposta em texto;
- imprimir / salvar como PDF usando a impressão do navegador.

PDF customizado, templates e identidade visual personalizada ficam fora do MVP. **Nome do projeto e resumo do escopo são obrigatórios para copiar/imprimir**; observações são opcionais; é possível voltar e editar após a prévia (QC-DEC-013). Custo sem descrição bloqueia a proposta até ser descrito ou removido (QC-DEC-011). Detalhes em `business-rules.md` §7–§8.

## 13. Estados de erro e validação

Bloquear avanço apenas quando uma entrada impedir um cálculo válido. Os casos abaixo estão especificados em `business-rules.md` §2–§8, §11 e §13 (QC-DEC-005 a 014):

- valor/hora vazio, zero, negativo ou inválido;
- horas de execução vazias, negativas ou inválidas;
- quantidade de rodadas e horas por rodada negativas ou inválidas;
- horas adicionais por impacto do prazo ou reserva negativas;
- custo direto com descrição ou valor incompleto, negativo ou inválido;
- data de entrega ausente ou inválida, conforme política de obrigatoriedade ainda a definir;
- valor comercial inválido quando editado manualmente;
- divisão por zero e entradas não numéricas no fluxo de referência de valor/hora.

Limites são apenas tetos técnicos (QC-DEC-014). Validar opcionais sem penalizar quem não os utiliza.

## 14. Navegação

- A rota canônica inicial é `/` (QC-DEC-004): a ferramenta aparece diretamente.
- **Voltar** fica disponível após a primeira etapa, e **Próximo** é a ação principal entre etapas.
- Preservar respostas ao voltar, editar ou avançar na mesma sessão.
- Permitir edição de qualquer etapa a partir do resultado, com atualização do valor calculado.
- **Criar proposta** é uma ramificação pós-resultado, não uma etapa obrigatória para obter a referência.
- Páginas de conteúdo podem ser acessadas separadamente. O comportamento da rota legada `/calculadora`, caso exista em produção, permanece pendente de verificação.

## 15. Persistência

**QC-DEC-003 — Contrato do MVP:**

- **Entre sessões, no dispositivo:** persistir `hourlyRate` e `theme` (implementação recomendada: `localStorage`).
- **Somente durante a sessão da aba:** persistir o orçamento em andamento, sem criar histórico permanente (implementação recomendada: `sessionStorage`).
- **Não persistir permanentemente:** orçamento completo, histórico de propostas ou dados de cliente.
- **Sem login e sem backend** para o cálculo principal.

Recarregar a mesma aba deve tentar restaurar o rascunho da sessão. Não prometer restauração após encerrar a sessão, limpar dados do navegador ou usar outro dispositivo. Se o armazenamento estiver indisponível, a calculadora deve continuar funcionando na aba sem gravação local, com comunicação honesta.

**Reiniciar** pede confirmação, apaga o rascunho da sessão (cálculo + textos da proposta) e mantém valor/hora e tema; textos da proposta ficam na sessão até reiniciar (QC-DEC-010). Valor/hora é salvo automaticamente, com ação “Apagar valor salvo” (QC-DEC-009). Indicar “salvo neste dispositivo” apenas após gravação efetiva.

## 16. Publicidade

### Zonas proibidas
- entre campos;
- entre pergunta e resposta;
- junto ao botão Próximo;
- junto ao botão Voltar;
- entre resultado e CTA principal;
- em posição que possa gerar clique acidental.

### Zonas permitidas
- depois do usuário concluir a tarefa principal;
- depois da explicação do resultado;
- em conteúdo editorial de apoio;
- rail lateral em desktop apenas se validado sem competir com a calculadora.

### Estratégia de monetização
O inventário principal de ads deve vir de:

1. pós-resultado;
2. conteúdo de apoio;
3. páginas editoriais orientadas a SEO.

A calculadora não deve ser sobrecarregada para compensar baixo volume de conteúdo.

## 17. Conteúdo e aquisição

A calculadora é o núcleo do produto, mas páginas de conteúdo ajudam em SEO e monetização.

Temas possíveis:

- como calcular valor/hora;
- como estimar horas de revisão;
- como cobrar urgência sem percentual arbitrário;
- exemplos de orçamento por tipo de projeto;
- como lidar com alteração de escopo;
- como apresentar orçamento ao cliente.

Conteúdo deve ser útil por si só e não existir apenas como suporte para anúncio.

## 18. UX e interface

- mobile-first;
- coluna única no mobile;
- calculadora estreita e centralizada no desktop;
- números grandes;
- baixa densidade visual;
- poucos cards;
- sem sidebar de navegação do produto;
- fluxo sequencial;
- dark e light mode;
- direção visual aprovada: **gramática de calculadora iOS**, reinterpretada para orçamento; não copiar operações, símbolos ou layout proprietário da Calculadora da Apple.

## 19. Métricas do MVP

### Uso
- início de cálculo;
- conclusão de cálculo;
- taxa de abandono por etapa;
- tempo para concluir;
- uso do fluxo de valor/hora;
- edição do valor comercial;
- geração/cópia de proposta.

### Monetização
- viewability do primeiro slot pós-resultado;
- RPM por superfície;
- receita por sessão concluída;
- impacto de ads na taxa de conclusão.

### Qualidade
- retorno à etapa anterior;
- erros de validação por campo;
- diferença entre valor calculado e valor comercial;
- taxa de usuários que entendem de onde veio o valor em teste qualitativo.

## 20. Riscos

### Monetização insuficiente
Se o tráfego da calculadora for pequeno, poucos slots não sustentam receita relevante.

**Resposta:** conteúdo de apoio e SEO precisam fazer parte da estratégia desde cedo.

### Falsa sensação de precisão
Uma fórmula simples pode parecer uma recomendação objetiva de mercado.

**Resposta:** linguagem de referência, rastreabilidade e nível de definição.

### Complexidade progressiva
Adicionar muitas variáveis pode transformar a calculadora em formulário longo.

**Resposta:** manter apenas entradas que alteram a decisão de cobrança.

### Duplicidade de horas
Execução, revisão, urgência e reserva podem se sobrepor.

**Resposta:** microcopy explícita e resultado detalhado.

## 21. Escopo do MVP e sequência de entrega

O **MVP Product Scope** define o que deve existir para o lançamento. A sequência **NOW/NEXT** do FigJam define apenas **ordem de implementação**, sem reduzir silenciosamente o escopo aprovado.

### Escopo do MVP
- valor/hora manual;
- fluxo opcional de referência de valor/hora;
- cálculo rastreável;
- revisões;
- impacto do prazo por horas adicionais reais;
- reserva opcional;
- custos diretos com múltiplos itens;
- valor comercial;
- proposta simples;
- persistência de valor/hora e tema, com orçamento da sessão;
- dark/light;
- ads pós-tarefa;
- mobile + desktop responsivo.

### Depois do MVP
- histórico;
- conta/sincronização;
- templates de proposta;
- PDF com identidade;
- favoritos/presets;
- dados comparativos agregados, apenas se houver base suficiente e metodologia clara.

## 22. Decisão final de produto

**Aprovar com escopo controlado.**

O produto funciona quando permanece uma calculadora curta e explicável. O maior risco não é técnico; é tentar monetizar demais a própria tarefa ou transformar a ferramenta em um mini-SaaS antes de provar uso recorrente e aquisição orgânica.


## Fontes de verdade e rastreabilidade

- **Decision Log + PRD + Architecture + Business Rules:** contrato funcional, decisões e validações.
- **Figma** (`87RIlysRO3vHEDm7Ghdzf3`): páginas `01 — FINAL · Mobile`, `02 — FINAL · Desktop`, `03 — FINAL · Publicidade`, `04 — FINAL · Valor-hora`. A faixa **v1.4** é a fonte visual aprovada (QC-DEC-016); v1.2 e v1.3 permanecem como histórico na mesma página.
- **FigJam** (`LoGu3vG6gQtt9KEGnAJ9CA`, índice `17:389`): jornada, fluxo, sitemap e sequência NOW/NEXT.
- **`design-system.md`:** tokens, componentes e estados.

Os nós `41:*` e a página extinta `03 — Visual Mobile v1` são apenas referência histórica. Data de entrega, nível de definição e mini-fluxo de valor/hora já existem nas telas (auditoria v1.3).

### Dependências que não são decisões de produto
- Destino da rota antiga `/calculadora`, após inventário de URLs publicadas.
- Slugs editoriais finais.
- Aprovação visual formal da faixa Figma v1.4.

### Regra de identidade

O usuário deve reconhecer a ferramenta como calculadora antes de percebê-la como formulário. Para isso, o número/visor permanece visualmente dominante durante todo o fluxo, inclusive nas etapas qualitativas. O keypad circular aparece somente quando ajuda uma entrada numérica real.

### Total em construção

Subtotais podem aparecer durante o fluxo para reforçar a sensação de cálculo contínuo, mas devem ser rotulados como parciais enquanto houver variáveis financeiras ainda não informadas. O produto não deve ancorar o usuário em um “preço final” prematuro.
