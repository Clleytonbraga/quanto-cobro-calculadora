# Faz a Conta · Briefing — PRD

**Versão documental:** 1.0 · **Criado em:** 15/10/2026  
**Decisões aprovadas:** QC-DEC-022 a QC-DEC-025 (ver `decision-log.md` v2.1).  
**Relação com a calculadora:** recurso do mesmo produto (Faz a Conta). Herda princípios, identidade visual, regras de publicidade e persistência do `PRD.md` v1.3, salvo quando este documento disser o contrário.  
**Estado:** contrato de produto inicial. Fluxo, telas e regras de negócio ainda não desenhados.

## 1. Visão do produto

**Faz a Conta · Briefing** é um gerador gratuito de briefing para freelancers brasileiros em início de carreira, com foco inicial em designers. Ele transforma o primeiro contato com o cliente — normalmente vago ("faz um logo pra mim?") — em um **escopo claro, organizado e consultável**, que depois alimenta a calculadora e vira proposta.

> **Saiba o que o cliente quer antes de dizer quanto custa.**

O modelo de monetização é o mesmo da calculadora: **100% gratuito para o usuário, financiado por publicidade**, sem interromper a tarefa principal.

## 2. Problema

Quem está começando erra no preço, mas erra antes: aceita o trabalho sem entender o que foi pedido.

- **Escopo implícito:** o cliente imagina 3 peças; o freelancer orça 1.
- **Perguntas esquecidas:** prazo real, quem aprova, quantas revisões, o que já existe, onde a peça será usada.
- **Briefing disperso:** informação espalhada em áudios, prints e mensagens, sem um registro único.
- **Insegurança:** o freelancer não sabe *o que* perguntar e, por isso, pergunta pouco.

Consequência: orçamento errado, retrabalho e revisões sem fim — o mesmo problema que a calculadora ataca, só que mais cedo na jornada.

O produto resolve a **organização da conversa inicial**, não a gestão do projeto.

## 3. Público inicial

### Primário
Freelancers autônomos brasileiros no começo da carreira, com foco inicial em designers, sem processo, ferramenta paga ou modelo próprio de briefing. Mesmo público da calculadora.

### Secundário (não é o usuário do produto, mas usa uma tela)
O **cliente do freelancer**, que responde ao formulário. Não conhece o Faz a Conta, não tem motivo para se cadastrar e julga o freelancer pela qualidade do formulário.

### Casos de uso iniciais
- primeiro contato de um cliente novo;
- pedido vago que precisa ser destrinchado antes de orçar;
- cliente recorrente com uma demanda nova.

## 4. Objetivo do MVP

Permitir que o freelancer envie um briefing com cara profissional em poucos minutos e receba de volta um resumo organizado, **sem login, sem backend e sem guardar dados do cliente**.

### Critério de sucesso do fluxo
Ao concluir, o freelancer deve:

1. saber o que o cliente quer entregar, para quando e com quantas revisões;
2. ver claramente o que o cliente **não** respondeu;
3. conseguir abrir a calculadora já com escopo, prazo e revisões preenchidos.

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

- **Para o freelancer:** perguntas certas, prontas e organizadas por tipo de trabalho, sem precisar montar o próprio formulário.
- **Para o cliente:** um formulário curto, em linguagem simples, que passa confiança antes do orçamento.
- **Para o Faz a Conta:** o briefing vira a porta de entrada da calculadora, e o produto passa a cobrir a jornada **briefing → orçamento → proposta**.

## 7. Princípios de produto

### 7.1 Ferramenta, não SaaS
Herdado da calculadora. Sem login, sem dashboard, sem lista de clientes.

### 7.2 Uma decisão principal por etapa
Mesma progressão sequencial da calculadora.

### 7.3 Linguagem de cliente no formulário do cliente
Nada de jargão de design ("paleta", "manual de marca", "wireframe") sem explicação. O cliente deve conseguir responder sem ajuda.

### 7.4 O formulário do cliente é a vitrine do freelancer
Ele mostra o nome/marca do freelancer em destaque e o Faz a Conta discretamente. **Nunca exibe anúncio** (ver §15).

### 7.5 Lacuna é informação
Pergunta não respondida não é erro: aparece destacada no resumo como ponto a confirmar com o cliente.

### 7.6 Nada fica guardado sem necessidade
As respostas trafegam no próprio link e nunca passam por servidor do Faz a Conta (QC-DEC-022).

## 8. Modelo de envio e retorno (QC-DEC-022)

Sem backend. Todo o conteúdo viaja **no fragmento do link** (depois do `#`), que o navegador não envia ao servidor.

1. **Ida:** o freelancer monta o briefing; o app gera um link cujo fragmento contém o modelo, as perguntas ativas e o nome/marca do freelancer.
2. **Volta:** o cliente responde; o app gera um **link de resposta** (fragmento com perguntas + respostas) que o cliente devolve por WhatsApp ou copiando o link. Alternativa: baixar/imprimir em PDF.
3. **Leitura:** o freelancer abre o link de resposta e vê o resumo organizado.

**Consequências aceitas:**
- o freelancer não recebe aviso automático quando o cliente responde — depende do cliente devolver o link;
- links longos; tamanho máximo a definir na arquitetura;
- quem tiver o link de resposta vê as respostas (comunicar isso ao cliente; ver §16).

**Gatilho para revisar (opção B, backend leve):** se a taxa de briefings respondidos e devolvidos ficar baixa por causa do retorno manual (ver §18).

## 9. Fluxo principal — freelancer (montagem)

### Entrada
O freelancer chega pela home do Faz a Conta, pela calculadora ("Ainda não tem briefing? Monte um") ou por conteúdo editorial.

### Etapa 1 — Tipo de trabalho
Escolher um dos tipos de lançamento (QC-DEC-024). Cada tipo carrega um modelo de perguntas recomendado:

- Logo e identidade visual
- Posts para redes sociais
- Site ou landing page
- Peça avulsa (banner, convite, cardápio, etc.)

### Etapa 2 — Perguntas
Lista do modelo com perguntas ligáveis/desligáveis. O padrão funciona sem edição. Perguntas essenciais (ver §11) não podem ser desligadas.

### Etapa 3 — Sua identificação
Nome ou marca do freelancer (obrigatório) e mensagem curta de abertura (opcional, com texto padrão).

### Etapa 4 — Enviar
Prévia do formulário como o cliente verá + ações: **Enviar pelo WhatsApp**, **Copiar link**.

## 10. Fluxo do cliente (resposta)

1. Abertura com nome/marca do freelancer, mensagem de abertura, tempo estimado de preenchimento e aviso de privacidade.
2. Perguntas em sequência, uma decisão principal por tela, mobile-first.
3. Revisão das respostas.
4. **Enviar ao freelancer:** WhatsApp ou copiar link de resposta; alternativa PDF.

Sem cadastro, sem anúncio, sem pedir dados pessoais além do necessário ao briefing.

## 11. Modelos de perguntas

Cada modelo combina **perguntas comuns** e **perguntas do tipo de trabalho**.

### Perguntas comuns (essenciais — sempre ativas)
Alimentam a calculadora (ver §13):

- o que precisa ser entregue (escopo);
- para quando precisa (prazo);
- quantas rodadas de ajuste espera (revisões);
- nome do projeto ou da empresa.

### Perguntas comuns (opcionais)
- quem aprova o trabalho;
- o que já existe (logo, textos, fotos, referências);
- onde o material será usado;
- referências de que gosta e de que não gosta;
- faixa de investimento prevista.

### Perguntas por tipo
O conteúdo de cada modelo será definido em documento próprio de conteúdo/UX writing e aprovado antes do desenho das telas (pendência P1).

## 12. Resumo do briefing (freelancer)

Ao abrir o link de resposta, o freelancer vê:

- cabeçalho com tipo de trabalho, nome do projeto e prazo;
- respostas agrupadas por tema, em linguagem legível;
- **lacunas destacadas** ("Cliente não informou o prazo");
- ações: **Calcular orçamento deste briefing**, **Copiar resumo**, **Baixar PDF**.

## 13. Integração com a calculadora

**Calcular orçamento deste briefing** abre a calculadora com estes campos pré-preenchidos:

| Briefing | Calculadora |
| --- | --- |
| Nome do projeto | `projectName` |
| O que precisa ser entregue | `scopeSummary` |
| Prazo | `deliveryDate` |
| Rodadas de ajuste | `revisionCount` |

Horas de execução, horas por revisão, custos e valor por hora **continuam sendo decisão do freelancer** — o briefing não estima esforço. Dados pré-preenchidos seguem a persistência da calculadora (sessão da aba, QC-DEC-003). Respostas fora do formato aceito (ex.: prazo em texto livre) chegam vazias, sem conversão automática; regra exata a definir em Business Rules (pendência P2).

## 14. Navegação e marca (QC-DEC-023)

- Recurso do Faz a Conta, no mesmo domínio e com a mesma identidade.
- Rota proposta: `/briefing/` (montagem) e `/briefing/responder/` (cliente) — slugs finais pendentes (P3).
- Link cruzado nos dois sentidos: calculadora → briefing e resumo → calculadora.

## 15. Publicidade

Herda as zonas proibidas e permitidas do `PRD.md` §16, com uma regra adicional:

### Zona proibida adicional
- **todo o fluxo do cliente** (abertura, perguntas, revisão, envio). É a vitrine do freelancer; anúncio ali prejudica a credibilidade dele e a taxa de resposta.

### Zonas permitidas
- após a etapa de envio (freelancer);
- no resumo do briefing, abaixo do conteúdo e das ações principais;
- conteúdo editorial de apoio ("como fazer um briefing de logo").

## 16. Privacidade e LGPD

- Nenhuma resposta passa por servidor do Faz a Conta (QC-DEC-022).
- O formulário do cliente exibe aviso curto: as respostas ficam no link gerado e só quem receber o link pode vê-las.
- Não pedir CPF, endereço ou dado sensível nas perguntas padrão.
- Analytics, se houver, não captura conteúdo de respostas — só eventos (ver §18). Consentimento segue a pendência de GA4/LGPD da calculadora.
- Texto final do aviso pendente de revisão (P4).

## 17. UX e interface

- Mesma direção visual da calculadora: tokens, tema escuro/claro, cupom, mobile-first, coluna única, desktop centralizado.
- O formulário do cliente é ainda mais enxuto: sem menus do produto, sem links para outras ferramentas além de um crédito discreto.
- O resumo do briefing usa a gramática de cupom da calculadora.
- Fonte visual: a desenhar no Figma `87RIlysRO3vHEDm7Ghdzf3`, em página nova, sem alterar as páginas existentes.

## 18. Métricas do MVP

### Uso
- briefings montados;
- briefings enviados ao cliente / montados;
- briefings respondidos e devolvidos / enviados;
- **orçamentos iniciados a partir de um briefing / briefings devolvidos** — métrica principal do ecossistema;
- tempo médio de preenchimento pelo cliente (meta: menos de 5 minutos);
- perguntas mais desligadas por modelo.

### Monetização
- receita por briefing devolvido (telas do freelancer);
- impacto do briefing na receita da calculadora.

### Qualidade
- abandono por pergunta no fluxo do cliente;
- quantidade média de lacunas por briefing devolvido.

## 19. Riscos

### Retorno manual
O cliente pode responder e não devolver o link.  
**Resposta:** CTA de devolução forte e repetido no fim; acompanhar a taxa de devolução; revisar a opção B se ficar baixa.

### Link longo ou quebrado
Fragmentos extensos podem ser cortados em alguns apps de mensagem.  
**Resposta:** compressão do conteúdo e teto de tamanho definidos na arquitetura; PDF como alternativa.

### Virar mini-SaaS
Pressão por histórico, contas e notificações.  
**Resposta:** manter os não objetivos (§5) até haver uso recorrente comprovado.

### Pouco inventário de anúncios
O fluxo do cliente não monetiza.  
**Resposta:** monetizar nas telas do freelancer e em conteúdo editorial; o briefing também gera tráfego para a calculadora.

## 20. Decisões pendentes

| ID | Pendência | Recomendação |
| --- | --- | --- |
| P1 | Perguntas de cada modelo e textos do formulário do cliente | Documento de conteúdo/UX writing aprovado antes das telas |
| P2 | Formato das respostas que viram campos da calculadora (prazo como data? revisões como número?) | Campos estruturados (data e número) só nas perguntas essenciais; demais em texto livre |
| P3 | Slugs finais das rotas | Decidir junto com a pendência de rota/URL da calculadora |
| P4 | Texto do aviso de privacidade | Revisar junto com o aviso de consentimento de analytics |
| P5 | Teto de tamanho do link e mensagem quando estourar | Definir na arquitetura, com teste em WhatsApp Web e app |

## Fontes de verdade e rastreabilidade

- **Este PRD + `decision-log.md` (QC-DEC-022 a 025):** contrato do recurso Briefing.
- **`PRD.md` v1.3:** princípios, publicidade e persistência herdados.
- **`design-system.md`:** tokens e componentes reaproveitados.
- **Figma** (`87RIlysRO3vHEDm7Ghdzf3`): telas do Briefing a criar em página nova.
