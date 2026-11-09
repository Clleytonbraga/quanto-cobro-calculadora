# Fiz a Conta · Briefing · PRD

**Versão documental:** 1.1 · **Atualizado:** 09/11/2026 (v1.0 de 15/10/2026 preservada em `historico/versoes-anteriores/PRD-briefing_v1.0.md`)
**Decisões aprovadas:** QC-DEC-022 a QC-DEC-025, com o nome novo da QC-DEC-026 (ver `decision-log.md` v2.3).
**Relação com a calculadora:** recurso do mesmo produto (Fiz a Conta). Herda princípios, identidade visual, regras de publicidade, medição e persistência do `PRD.md` v2.0, salvo quando este documento disser o contrário.
**Estado:** aprovado e **ainda não implementado**. Fluxo, telas e regras de negócio ainda não desenhados.

## O que mudou da v1.0 para a v1.1

| Tema | v1.0 (15/10) | v1.1 (atual) | Decisão |
| --- | --- | --- | --- |
| Nome | Faz a Conta · Briefing | Fiz a Conta · Briefing | QC-DEC-026 |
| Monetização | 100% grátis, com publicidade | Freemium da calculadora. Sem publicidade por enquanto | QC-DEC-034, QC-DEC-036 |
| Medição | GA4 pendente | GA4 só depois do aceite, já no app | QC-DEC-036 |
| Prazo | Data única | Data única ou Período | QC-DEC-029 |
| Referência | PRD v1.3 | PRD v2.0 | |
| Textos | Com travessão | Sem travessão | QC-DEC-035 |

O conteúdo do recurso (QC-DEC-022 a QC-DEC-025) não mudou.

## 1. Visão do produto

**Fiz a Conta · Briefing** é um gerador gratuito de briefing para freelancers brasileiros em início de carreira. O foco inicial são designers.

O primeiro contato com o cliente costuma ser vago ("faz um logo pra mim?"). O Briefing transforma esse contato em um **escopo claro, organizado e consultável**. Depois, esse escopo alimenta a calculadora e vira proposta.

> **Saiba o que o cliente quer antes de dizer quanto custa.**

O modelo de negócio é o mesmo da calculadora: **freemium em fases** (`PRD.md` §16). O recurso é grátis e sem login. Hoje não existe publicidade (QC-DEC-034).

## 2. Problema

Quem está começando erra no preço. Mas o erro começa antes: a pessoa aceita o trabalho sem entender o pedido.

- **Escopo implícito:** o cliente imagina 3 peças. O freelancer orça 1.
- **Perguntas esquecidas:** prazo real, quem aprova, quantas revisões, o que já existe, onde a peça será usada.
- **Briefing disperso:** a informação fica em áudios, prints e mensagens, sem um registro único.
- **Insegurança:** o freelancer não sabe *o que* perguntar. Por isso, pergunta pouco.

Consequência: orçamento errado, retrabalho e revisões sem fim. É o mesmo problema que a calculadora ataca, só que mais cedo na jornada.

O produto organiza a **conversa inicial**. Ele não faz gestão do projeto.

## 3. Público inicial

### Primário

Freelancers autônomos brasileiros no começo da carreira, com foco inicial em designers. Eles não têm processo, ferramenta paga nem modelo próprio de briefing. É o mesmo público da calculadora.

### Secundário (usa uma tela, mas não é o usuário do produto)

O **cliente do freelancer**, que responde ao formulário. Ele não conhece o Fiz a Conta e não tem motivo para se cadastrar. Ele julga o freelancer pela qualidade do formulário.

### Casos de uso iniciais

- primeiro contato de um cliente novo;
- pedido vago que precisa ser detalhado antes do orçamento;
- cliente recorrente com uma demanda nova.

## 4. Objetivo do MVP

O freelancer envia um briefing com cara profissional em poucos minutos. Ele recebe de volta um resumo organizado. Tudo isso **sem login, sem backend e sem guardar dados do cliente**.

### Critério de sucesso do fluxo

No fim, o freelancer:

1. sabe o que o cliente quer, para quando e com quantas revisões;
2. vê claramente o que o cliente **não** respondeu;
3. abre a calculadora com escopo, prazo e revisões já preenchidos.

## 5. Não objetivos do MVP

- contas de usuário, login ou dashboard;
- armazenamento das respostas em servidor;
- histórico de briefings na nuvem;
- CRM ou gestão de clientes;
- contrato, assinatura digital ou pagamento;
- integração com e-mail;
- editor de modelos do zero ou modelos da comunidade;
- tipos de trabalho fora de design (dev, redação, vídeo).

## 6. Proposta de valor

- **Para o freelancer:** perguntas certas, prontas e organizadas por tipo de trabalho. Ele não precisa montar o próprio formulário.
- **Para o cliente:** um formulário curto, em linguagem simples, que passa confiança antes do orçamento.
- **Para o Fiz a Conta:** o briefing vira a porta de entrada da calculadora. O produto passa a cobrir a jornada **briefing, orçamento, proposta**.

## 7. Princípios de produto

### 7.1 Ferramenta, não SaaS

Herdado da calculadora. Sem login, sem dashboard, sem lista de clientes.

### 7.2 Uma decisão principal por etapa

Mesma progressão sequencial da calculadora.

### 7.3 Linguagem de cliente no formulário do cliente

Nada de jargão de design ("paleta", "manual de marca", "wireframe") sem explicação. O cliente responde sem ajuda.

### 7.4 O formulário do cliente é a vitrine do freelancer

O formulário mostra o nome ou a marca do freelancer em destaque. O Fiz a Conta aparece de forma discreta ("Feito com Fiz a Conta", QC-DEC-036). O formulário **nunca mostra anúncio** (QC-DEC-025, ver §15).

### 7.5 Lacuna é informação

Pergunta sem resposta não é erro. Ela aparece destacada no resumo, como ponto a confirmar com o cliente.

### 7.6 Nada fica guardado sem necessidade

As respostas viajam no próprio link. Elas nunca passam por servidor do Fiz a Conta (QC-DEC-022).

### 7.7 Textos sem travessão

Nenhum texto usa travessão (QC-DEC-035).

## 8. Modelo de envio e retorno (QC-DEC-022)

Sem backend. Todo o conteúdo viaja **no fragmento do link** (depois do `#`). O navegador não envia o fragmento ao servidor.

1. **Ida:** o freelancer monta o briefing. O app gera um link. O fragmento tem o modelo, as perguntas ativas e o nome ou a marca do freelancer.
2. **Volta:** o cliente responde. O app gera um **link de resposta** (perguntas e respostas no fragmento). O cliente devolve esse link pelo WhatsApp ou copiando o link. Alternativa: baixar ou imprimir em PDF.
3. **Leitura:** o freelancer abre o link de resposta e vê o resumo organizado.

**Consequências aceitas:**

- o freelancer não recebe aviso automático quando o cliente responde. Ele depende do cliente devolver o link;
- os links ficam longos. O tamanho máximo será definido na arquitetura;
- quem tem o link de resposta vê as respostas. Comunicar isso ao cliente (ver §16).

**Quando revisar (opção B, backend leve):** se a taxa de briefings respondidos e devolvidos ficar baixa por causa do retorno manual (ver §18).

## 9. Fluxo principal · freelancer (montagem)

### Entrada

O freelancer chega pela home do Fiz a Conta, pela calculadora ("Ainda não tem briefing? Monte um") ou por conteúdo editorial.

### Etapa 1 · Tipo de trabalho

Escolher um dos 4 tipos de lançamento (QC-DEC-024). Cada tipo traz um modelo de perguntas recomendado:

- Logo e identidade visual
- Posts para redes sociais
- Site ou landing page
- Peça avulsa (banner, convite, cardápio etc.)

### Etapa 2 · Perguntas

Lista do modelo, com perguntas que a pessoa liga ou desliga. O padrão funciona sem edição. As perguntas essenciais (ver §11) não podem ser desligadas.

### Etapa 3 · Sua identificação

Nome ou marca do freelancer (obrigatório). Mensagem curta de abertura (opcional, com texto padrão).

### Etapa 4 · Enviar

Prévia do formulário como o cliente verá. Ações: **Enviar pelo WhatsApp** e **Copiar link**.

## 10. Fluxo do cliente (resposta)

1. Abertura: nome ou marca do freelancer, mensagem de abertura, tempo estimado de preenchimento e aviso de privacidade.
2. Perguntas em sequência. Uma decisão principal por tela. Mobile-first.
3. Revisão das respostas.
4. **Enviar ao freelancer:** WhatsApp ou copiar o link de resposta. Alternativa: PDF.

Sem cadastro e sem anúncio. Não pedir dados pessoais além do necessário ao briefing.

## 11. Modelos de perguntas

Cada modelo combina **perguntas comuns** e **perguntas do tipo de trabalho**.

### Perguntas comuns essenciais (sempre ativas)

Elas alimentam a calculadora (ver §13):

- o que precisa ser entregue (escopo);
- para quando precisa (prazo);
- quantas rodadas de ajuste espera (revisões);
- nome do projeto ou da empresa.

### Perguntas comuns opcionais

- quem aprova o trabalho;
- o que já existe (logo, textos, fotos, referências);
- onde o material será usado;
- referências de que gosta e de que não gosta;
- faixa de investimento prevista.

### Perguntas por tipo

O conteúdo de cada modelo será definido em documento próprio de conteúdo e UX writing. Ele será aprovado antes do desenho das telas (pendência P1).

## 12. Resumo do briefing (freelancer)

Ao abrir o link de resposta, o freelancer vê:

- cabeçalho com tipo de trabalho, nome do projeto e prazo;
- respostas agrupadas por tema, em linguagem legível;
- **lacunas destacadas** ("Cliente não informou o prazo");
- ações: **Calcular orçamento deste briefing**, **Copiar resumo**, **Baixar PDF**.

## 13. Integração com a calculadora

**Calcular orçamento deste briefing** abre a calculadora com estes campos preenchidos:

| Briefing | Calculadora (estado do `app.js`) |
| --- | --- |
| Nome do projeto | `projectName` |
| O que precisa ser entregue | `scopeSummary` |
| Prazo (data única ou período) | `deliveryDate`, `deliveryEnd` e `dateMode` (QC-DEC-029) |
| Rodadas de ajuste | `revisionCount` |

- O briefing **não estima esforço**. Horas de execução, horas por rodada, custos e valor por hora continuam sendo decisão do freelancer.
- Os dados preenchidos seguem a persistência da calculadora: só na sessão da aba (QC-DEC-003, `PRD.md` §15).
- Resposta fora do formato aceito (ex.: prazo em texto livre) chega vazia, sem conversão automática. A regra exata fica para o Business Rules (pendência P2).

## 14. Navegação e marca (QC-DEC-023)

- Recurso do Fiz a Conta, no mesmo domínio e com a mesma identidade.
- Rotas propostas: `/briefing/` (montagem) e `/briefing/responder/` (cliente). Slugs finais pendentes (P3).
- Link cruzado nos 2 sentidos: calculadora para briefing e resumo para calculadora.

## 15. Publicidade

**Estado atual:** sem publicidade (QC-DEC-034).

Se a publicidade voltar, valem as regras do `PRD.md` §17, com uma regra a mais:

### Zona proibida adicional

- **Todo o fluxo do cliente** (abertura, perguntas, revisão, envio). É a vitrine do freelancer. Anúncio ali prejudica a credibilidade dele e a taxa de resposta (QC-DEC-025).

### Zonas permitidas

- depois da etapa de envio (telas do freelancer);
- no resumo do briefing, abaixo do conteúdo e das ações principais;
- conteúdo editorial de apoio ("como fazer um briefing de logo").

## 16. Privacidade e LGPD

- Nenhuma resposta passa por servidor do Fiz a Conta (QC-DEC-022).
- O formulário do cliente mostra um aviso curto: as respostas ficam no link gerado, e só quem recebe o link vê as respostas.
- Não pedir CPF, endereço ou dado sensível nas perguntas padrão.
- **Medição:** usar o GA4 da calculadora. Ele só carrega depois de "Aceitar" e nunca envia o conteúdo das respostas, só eventos (QC-DEC-036, `PRD.md` §16).
- Texto final do aviso pendente de revisão (P4). Revisar junto com a página `/privacidade/`.

## 17. UX e interface

- Mesma direção visual da calculadora: tokens, tema escuro e claro, cupom, mobile-first, coluna única no mobile.
- O formulário do cliente é ainda mais enxuto: sem menus do produto e sem links para outras ferramentas, só o crédito discreto.
- O resumo do briefing usa a gramática de cupom da calculadora.
- Fonte visual: Design System do Fiz a Conta (componentes `FazAConta`). As telas do Briefing ainda não foram desenhadas. Desenhar em página ou canvas novo, sem alterar as telas aprovadas.

## 18. Métricas do MVP

### Uso

- briefings montados;
- briefings enviados ao cliente ÷ montados;
- briefings respondidos e devolvidos ÷ enviados;
- **orçamentos iniciados a partir de um briefing ÷ briefings devolvidos**. É a métrica principal do ecossistema;
- tempo médio de preenchimento pelo cliente (meta: menos de 5 minutos);
- perguntas mais desligadas por modelo.

### Freemium

- impacto do briefing no uso da calculadora;
- impacto do briefing no interesse pelo Histórico (Fase 1, `PRD.md` §16).

### Qualidade

- abandono por pergunta no fluxo do cliente;
- quantidade média de lacunas por briefing devolvido.

## 19. Riscos

### Retorno manual

O cliente pode responder e não devolver o link.
**Resposta:** CTA de devolução forte e repetido no fim. Acompanhar a taxa de devolução. Revisar a opção B se ela ficar baixa.

### Link longo ou quebrado

Fragmentos longos podem ser cortados em alguns apps de mensagem.
**Resposta:** compressão do conteúdo e teto de tamanho definidos na arquitetura. PDF como alternativa.

### Virar mini-SaaS

Pressão por histórico, contas e notificações.
**Resposta:** manter os não objetivos (§5) até haver uso recorrente comprovado.

### Fluxo do cliente sem receita

O fluxo do cliente não monetiza.
**Resposta:** o briefing gera uso da calculadora e divulga a marca ("Feito com Fiz a Conta"). Se a publicidade voltar, ela fica só nas telas do freelancer e no conteúdo editorial.

## 20. Decisões pendentes

| ID | Pendência | Recomendação |
| --- | --- | --- |
| P1 | Perguntas de cada modelo e textos do formulário do cliente | Documento de conteúdo e UX writing aprovado antes das telas |
| P2 | Formato das respostas que viram campos da calculadora (prazo como data ou período? revisões como número?) | Campos estruturados (data ou período, e número) só nas perguntas essenciais. Demais em texto livre |
| P3 | Slugs finais das rotas | Decidir junto com o domínio do Fiz a Conta (`PRD.md` §22) |
| P4 | Texto do aviso de privacidade | Revisar junto com a página `/privacidade/` |
| P5 | Teto de tamanho do link e mensagem quando estourar | Definir na arquitetura, com teste no WhatsApp Web e no app |

## Fontes de verdade e rastreabilidade

- **Este PRD + `decision-log.md` (QC-DEC-022 a QC-DEC-025, QC-DEC-026):** contrato do recurso Briefing.
- **`PRD.md` v2.0:** princípios, freemium, publicidade, medição e persistência herdados.
- **`design-system.md`:** tokens e componentes reaproveitados.
- **Design System no Claude Design e página "Design · Fiz a Conta" no Notion:** referência visual. As telas do Briefing ainda serão criadas.
