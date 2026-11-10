# Fiz a Conta · PRD

**Versão documental:** 2.4 · **Atualizado:** 10/11/2026 (v2.3, v2.2, v2.1, v2.0 e v1.3 preservadas em `historico/versoes-anteriores/`)
**Decisões aprovadas:** QC-DEC-001 a QC-DEC-041 (ver `decision-log.md` v2.7).
**Código de referência:** commit `859474f` (09/11/2026), cache `fiz-v35`. Publicado na `main` em 09/11/2026.
**Regras de validação, precisão e estados:** `business-rules.md` v2.2. Quando houver conflito, vale o Decision Log (ver §23).
**Recurso Briefing:** contrato separado em `PRD-briefing.md` v1.1.

**v2.1:** registra a QC-DEC-038 (app no celular), a publicação na `main` e as versões 2.0 dos documentos técnicos.

Nomes anteriores do produto: "Quanto Cobro?" (até 13/10/2026) e "Faz a Conta" (13/10 a 28/10/2026). O nome atual é **Fiz a Conta** (QC-DEC-026).

## O que mudou da v1.3 para a v2.0

| Tema | v1.3 (12/10) | v2.0 (atual) | Decisão |
| --- | --- | --- | --- |
| Nome | Quanto Cobro? | Fiz a Conta | QC-DEC-026 |
| Monetização | 100% grátis, com publicidade | Freemium em fases. Publicidade removida por enquanto | QC-DEC-034, QC-DEC-036 |
| Unidade das horas | Centésimos de hora | Minutos inteiros. Entrada "1h30" | QC-DEC-027, QC-DEC-028 |
| Teclado | Keypad circular com +1/−1 | Teclado "maquininha" com tecla h. Tecla quadrada, raio 22 px | QC-DEC-017, QC-DEC-028, QC-DEC-033 |
| Data de entrega | Data única | Data única ou Período (dias corridos) | QC-DEC-029 |
| Etapa 3 | Steppers | Campos que abrem modais | QC-DEC-030 |
| Escopo | Só informação | Com Parcial ou Aberto, a etapa 4 mostra uma dica | QC-DEC-031 |
| Resultado | Lista de composição | Cupom V1 (blocos Tempo e Dinheiro) | QC-DEC-032 |
| Desktop | Faixa v1.4 | Variante D | QC-DEC-018 |
| Proposta | Copiar e PDF | Compartilhar V2 (WhatsApp, Histórico, Copiar, PDF, Mais) | QC-DEC-037 |
| Medição | Não definida | GA4 só após aceite. Pesquisa de 5 estrelas | QC-DEC-036 |
| Celular | Site responsivo | Site responsivo + app instalável (PWA) e offline | QC-DEC-038 |
| Textos | Com travessão | Sem travessão | QC-DEC-035 |

## 1. Visão do produto

**Fiz a Conta** é uma calculadora web gratuita para freelancers brasileiros. O foco inicial são designers.

A calculadora transforma uma demanda pouco estruturada em uma **referência de cobrança explicável e rastreável**.

O produto não diz qual é o "preço certo". Ele organiza esforço, escopo, prazo, revisões e custos. Depois, a pessoa decide o valor da proposta.

Assinatura da marca: "Seu trabalho tem um preço. Calcule."

O modelo de negócio é **freemium em fases** (QC-DEC-036, ver §16). A calculadora continua grátis e sem login.

## 2. Problema

Muitos freelancers definem preço pela memória, por comparação informal ou por um valor por hora sem estrutura. Isso causa 4 problemas:

- orçamentos parecidos com valores diferentes;
- tempo de revisão ou retrabalho esquecido;
- dificuldade para explicar como o valor foi formado;
- preço baixo quando escopo, urgência ou custos extras aparecem tarde.

O produto organiza o raciocínio. Ele não resolve o mercado de precificação inteiro.

## 3. Público inicial

### Primário

Freelancers e designers brasileiros que precisam montar um orçamento rápido para um trabalho novo ou para uma mudança de demanda.

### Casos de uso iniciais

- projeto novo;
- alteração de escopo;
- trabalho com impacto de prazo;
- revisão adicional;
- reabertura de trabalho encerrado.

Esses casos usam **o mesmo motor de cálculo**. Não são calculadoras separadas.

## 4. Objetivo do MVP

A pessoa chega a uma referência de cobrança confiável em poucos minutos. Ela não precisa de login, de dashboard nem de fórmulas complexas.

### Critério de sucesso do fluxo

No fim da calculadora, a pessoa entende:

1. qual valor foi calculado;
2. quais entradas formaram esse valor;
3. qual parte é estimativa e qual parte é decisão comercial;
4. como transformar o resultado em uma proposta simples para o cliente.

## 5. Não objetivos do MVP

- gestão de clientes;
- CRM;
- emissão fiscal;
- cálculo de impostos e taxas;
- cobrança ou pagamento;
- histórico em nuvem (a Fase 1 só testa o interesse, ver §16);
- conta de usuário e login;
- dashboard de projetos;
- comparação automática com "preço de mercado";
- multiplicadores arbitrários por nível de experiência;
- preço automático apresentado como verdade.

## 6. Proposta de valor

A promessa correta:

> Organize o esforço do trabalho e chegue a uma referência de cobrança que você consegue entender e explicar.

Não usar promessas como "descubra o preço certo" ou "saiba exatamente quanto cobrar".

## 7. Princípios de produto

### 7.1 Calculadora, não SaaS

A experiência parece uma ferramenta direta. Não parece um sistema de gestão.

### 7.2 Uma decisão principal por etapa

Pergunta, resposta, próxima etapa.

### 7.3 Resultado rastreável

Todo valor do resultado foi informado pela pessoa ou vem de uma regra visível.

### 7.4 Sem percentuais mágicos

Prazo, imprevistos e revisões entram em horas. Não entram como percentuais ou multiplicadores.

### 7.5 Referência separada do valor da proposta

O sistema calcula a referência. O freelancer decide quanto cobra.

### 7.6 Nada de anúncio na entrada de dados

Hoje o app não tem anúncio (QC-DEC-034). Se voltar, o anúncio fica só no resultado e na prévia da proposta (ver §17).

### 7.7 Textos sem travessão

Nenhum texto usa travessão (—): telas, documentos, títulos e comentários de código. Usar vírgula, dois-pontos, ponto ou "·" (QC-DEC-035).

## 8. Fluxo principal

**Rota de entrada:** `/` abre a calculadora direto, sem página institucional (QC-DEC-004).

Nomes das 5 etapas no app: **Valor por hora**, **Execução**, **Prazo e revisões**, **Ajustes**, **Resultado**.

### Entrada

A pessoa informa o valor por hora ou abre o mini-fluxo **"Descobrir valor por hora"** (§11). Os dois caminhos voltam para a mesma calculadora.

### Etapa 1 · Valor por hora

- Informar ou editar o valor por hora. É obrigatório e maior que zero (QC-DEC-005).
- O valor salvo no aparelho volta na próxima visita (QC-DEC-003).
- O valor é salvo ao confirmar a etapa. A ação "Apagar valor salvo" fica visível (QC-DEC-009).
- Não tratar o valor por hora como preço de mercado ou recomendação universal.

### Etapa 2 · Execução

- Informar as horas de execução **sem revisões**. É obrigatório e maior que zero (QC-DEC-005).
- As horas usam o teclado com a tecla **h** no lugar da vírgula (QC-DEC-028). Exemplos de entrada: "1h30", "1 h 30 min", "12", "1,5". Sem "h", o número vale horas (QC-DEC-027).
- Depois do h, a entrada aceita no máximo 2 dígitos de minutos (0 a 59).
- A tela mostra as horas no formato "1 h 30 min".
- O menu de escopo fica nesta etapa (QC-DEC-031). Opções: **Bem definido**, **Parcialmente definido**, **Aberto**. É opcional.
- A própria pessoa escolhe o escopo. O escopo não muda a fórmula.

### Etapa 3 · Prazo e revisões

- **Data de entrega** é um campo que abre o modal de calendário (QC-DEC-030). É opcional.
- O modal tem 2 modos: **Data única** ou **Período** (QC-DEC-029).
- No Período, a tela mostra a duração em dias corridos e conta os 2 dias. Exemplo: "3 nov a 14 nov · 12 dias corridos".
- Data no passado gera um aviso. O aviso não bloqueia (QC-DEC-012).
- **Rodadas de revisão** começa em 0 e usa − e + (QC-DEC-006).
- **Horas por rodada** é um campo que abre o modal "Horas por rodada", com teclado e tecla h (QC-DEC-028, QC-DEC-030). Começa em 0. Não tem mais − e +.
- Horas de revisão totais = rodadas × horas por rodada. O sistema não soma essas horas 2 vezes.
- **Horas a mais pelo prazo:** a pessoa informa o trabalho adicional real que o prazo exige. Começa em 0. A data não preenche esse campo.

**A data de entrega e o período não mudam o preço.** Não existe taxa percentual de urgência.

### Etapa 4 · Ajustes

Estado inicial: nada extra.

Entradas opcionais:

- **Horas para imprevistos.** Começa em 0.
- **Custos do projeto:** vários itens, cada um com descrição e valor em reais (QC-DEC-001). A pessoa adiciona e edita no modal com "Aplicar". A exclusão fica só dentro da edição (QC-DEC-019).

Com escopo **Parcialmente definido** ou **Aberto**, a etapa mostra uma dica: considere horas para imprevistos. A dica não muda o cálculo (QC-DEC-031).

Os custos somam em dinheiro, fora da mão de obra. O sistema não sugere reserva nem percentual automático.

### Etapa 5 · Resultado

O resultado usa o **cupom V1** (QC-DEC-032). Ordem:

1. **visor** com a referência calculada, o valor numérico dominante;
2. **bloco Tempo:** barra com a composição das horas (execução, revisões, prazo, imprevistos);
3. **bloco Dinheiro:** valor por hora e custos do projeto;
4. **valor da proposta** em marca-texto, com ícone de editar. Ele começa igual à referência e acompanha a referência até ser editado (QC-DEC-008). O cupom não repete a linha "Valor calculado", porque o visor já mostra esse valor;
5. escopo informado, com uma explicação curta ("Não informado" quando vazio);
6. ações: editar etapas (botão ✏️ discreto, QC-DEC-019), **Criar proposta**, Novo orçamento (com confirmação, QC-DEC-010).

A pessoa pode voltar e editar qualquer etapa. Os dados ficam preservados.

### Desktop

O layout desktop é a **Variante D** (QC-DEC-018):

- faixa de visor no topo (pergunta à esquerda, valor à direita);
- trilha de etapas à esquerda, com o acordeão "Atalhos do teclado";
- aparelho-calculadora no centro;
- orçamento impresso ao vivo à direita.

Valor vazio no cupom ao vivo: "…" (QC-DEC-035).

## 9. Fórmula

```text
horas_revisao = quantidade_rodadas × horas_por_rodada
horas_totais = horas_execucao + horas_revisao + horas_prazo + horas_imprevistos
mao_de_obra = valor_hora × horas_totais
custos_total = soma(valor de cada custo)
referencia_calculada = mao_de_obra + custos_total
```

- `horas_prazo`, `horas_imprevistos` e `custos_total` começam em **zero**.
- As horas de execução não incluem revisões, prazo ou imprevistos.
- Data de entrega, período e escopo são **informações não financeiras**.
- O sistema não aplica percentual de urgência, reserva ou experiência. Não arredonda em silêncio.
- `valor_proposta` é decisão do freelancer. Ele **não muda** `referencia_calculada`.

### Precisão

- **Dinheiro:** centavos inteiros (QC-DEC-007).
- **Horas do orçamento:** minutos inteiros (QC-DEC-027). Esta regra supera QC-DEC-007 só para as horas.
- **Mini-fluxo "Descobrir valor por hora":** as horas por semana continuam em centésimos (QC-DEC-027).
- Um único arredondamento no final, metade para cima (QC-DEC-007).
- Campos obrigatórios e tetos técnicos: QC-DEC-005 e QC-DEC-014. Detalhes em `business-rules.md` §2 a §4 e §11.

## 10. Escopo da estimativa

A pessoa classifica o próprio escopo:

- **Bem definido** (`well_defined`): entregáveis e limites já estão claros;
- **Parcialmente definido** (`partial`): existem escolhas ou dependências em aberto;
- **Aberto** (`open`): escopo e entregáveis ainda pouco claros.

O sistema mostra a opção escolhida e uma explicação genérica. Não mostra nota de confiança. Não diz que avaliou o briefing.

## 11. Mini-fluxo "Descobrir valor por hora"

Objetivo: dar uma **referência inicial** para quem não tem valor por hora.

Telas: meta mensal, horas faturáveis por semana e valor por hora sugerido. As 3 telas têm o seletor **"Já sei / Estimar"** (QC-DEC-037).

Entradas:

- meta de faturamento mensal;
- horas **faturáveis** por semana (não são todas as horas trabalhadas).

```text
horas_faturaveis_mes = horas_faturaveis_semana × 4,33
valor_hora_sugerido = meta_mensal ÷ horas_faturaveis_mes
```

- O balão **"Por que 4,33?"** explica: "Um mês tem, em média, 4,33 semanas (52 semanas do ano ÷ 12 meses)." (QC-DEC-037)
- A tela da meta mensal não tem "Voltar". As telas da meta e das horas por semana não têm "Cancelar" (QC-DEC-037).
- O resultado **não cobre** impostos, ferramentas, férias, meses sem trabalho, inadimplência ou margem. Não apresentar como preço de mercado.
- A pessoa aceita ou edita o valor sugerido e volta para a etapa 1.
- O resultado é arredondado 1 vez para centavos. Horas por semana: maior que 0 e no máximo 168 (`business-rules.md` §4.5 e §11).

## 12. Proposta para o cliente

**Entrada:** depois do cálculo, a pessoa toca em **"Criar proposta"**. Só neste momento o produto pede (QC-DEC-002):

- nome do projeto (obrigatório);
- resumo do escopo (obrigatório);
- observações (opcional).

Esses campos não fazem parte das 5 etapas de cálculo.

A prévia usa os textos digitados e os dados do orçamento:

- data de entrega ou período ("Período: 3 nov a 14 nov", QC-DEC-029);
- "Revisões incluídas: N rodadas" (omitido quando N = 0, QC-DEC-015);
- custos, listados como "incluídos no valor" (QC-DEC-015);
- **valor da proposta**. O sistema nunca troca esse valor pela referência em silêncio.

Regras:

- Não preencher campos com exemplos fictícios.
- Não mostrar a matemática interna para o cliente.
- Custo sem descrição bloqueia a proposta até ser descrito ou removido (QC-DEC-011).
- A pessoa pode voltar e editar depois da prévia (QC-DEC-013).
- A proposta mostra **"Feito com Fiz a Conta"** com o link do site (QC-DEC-036).

### Ações da prévia (Compartilhar V2, QC-DEC-037)

- botão principal **"Enviar pelo WhatsApp"**;
- barra com **Histórico**, **Copiar**, **PDF** e **Mais**;
- **Histórico** abre o teste de interesse da Fase 1 (§16);
- **PDF** usa a impressão do navegador;
- **Mais** usa o compartilhamento nativo do aparelho, quando existe.

PDF com identidade própria e templates ficam fora do MVP.

## 13. Estados de erro e validação

O sistema bloqueia o avanço só quando a entrada impede um cálculo válido. Detalhes em `business-rules.md` §2 a §8, §11 e §13 (QC-DEC-005 a QC-DEC-015):

- valor por hora vazio, zero, negativo ou inválido;
- horas de execução vazias, negativas ou inválidas;
- minutos acima de 59 depois do h;
- rodadas ou horas por rodada negativas ou inválidas;
- horas a mais pelo prazo ou horas para imprevistos negativas;
- custo com descrição ou valor incompleto, negativo ou inválido;
- data malformada (tratada como não informada, QC-DEC-015);
- valor da proposta zero ou negativo (erro). Vazio volta a acompanhar a referência (QC-DEC-015);
- divisão por zero e entradas não numéricas no mini-fluxo.

Os limites são só tetos técnicos (QC-DEC-014). Campos opcionais não penalizam quem não usa.

## 14. Navegação

- A rota inicial é `/` (QC-DEC-004).
- **Voltar** aparece depois da primeira etapa. **Próximo** é a ação principal entre etapas.
- As respostas ficam preservadas ao voltar, editar ou avançar.
- O resultado permite editar qualquer etapa e recalcula o valor.
- **Criar proposta** é um ramo depois do resultado. Não é etapa obrigatória.
- Cada tela cabe em uma dobra (QC-DEC-019).
- Páginas de conteúdo ficam fora do fluxo: `/guias/`, `/guias/como-fazer-orcamento-freelancer/`, `/guias/como-calcular-valor-hora-freelancer/`, `/guias/como-cobrar-revisoes-de-um-projeto/` e `/privacidade/`.

## 15. Persistência

Contrato da QC-DEC-003, com os itens novos da Fase 0:

| Dado | Onde | Chave técnica |
| --- | --- | --- |
| Valor por hora | Aparelho (`localStorage`) | `quantoCobro.hourlyRate` |
| Tema | Aparelho (`localStorage`) | `quantoCobro.theme` |
| Escolha de privacidade (GA4) | Aparelho (`localStorage`) | `quantoCobro.consent` |
| Estado da pesquisa de 5 estrelas | Aparelho (`localStorage`) | `quantoCobro.survey` |
| Orçamento em andamento | Só na aba (`sessionStorage`), formato v3 com horas em minutos | `quantoCobro.currentEstimate.v1` |

As chaves `quantoCobro.*` não mudam com o nome novo (QC-DEC-026).

Regras:

- O sistema não grava em definitivo o orçamento, o histórico de propostas ou os dados do cliente.
- O cálculo não usa login nem backend.
- Recarregar a aba tenta restaurar o rascunho. Rascunho de formato antigo é descartado.
- Sem armazenamento, a calculadora funciona na aba, sem gravar.
- **Novo orçamento** pede confirmação. Na prévia da proposta, o modal oferece "Salvar PDF e recomeçar". Recomeçar apaga o rascunho (cálculo e textos da proposta) e mantém valor por hora e tema (QC-DEC-010).
- "Salvo neste dispositivo" aparece só depois da gravação real.

## 16. Modelo de negócio: freemium (QC-DEC-036)

### Fase 0 · Medir (implementada)

- **GA4** (ID `G-F2HS60LDV0`, conta pessoal do responsável). Carrega só depois de "Aceitar" no aviso de privacidade.
- Os eventos **nunca** levam valores, horas ou textos do orçamento.
- **Pesquisa de 5 estrelas** "O Fiz a Conta ajudou você?":
  - aparece depois de "Salvar PDF e recomeçar";
  - no máximo 1 vez a cada 30 dias por aparelho;
  - "Agora não" volta só depois de 3 propostas;
  - quem respondeu não vê mais;
  - depois da estrela, mostra a pergunta "O que você mais gostou?" (4 ou 5) ou "O que faltou para ser 5?" (1 a 3) e um comentário opcional;
  - a nota vai para o GA4 (`rating_submitted`); a nota e o comentário vão para o Google Forms (QC-DEC-039).
- Página `/privacidade/`.

### Fase 1 · Testar interesse (implementada)

- O botão **Histórico** abre o modal "Histórico de propostas".
- A pessoa deixa o e-mail para receber o aviso de lançamento. Não existe login.
- O e-mail vai para o Brevo, lista #3 "Fiz a Conta · aviso de lançamento" (conta pessoal do responsável).
- O histórico real ainda não existe. Este é um teste de interesse.

### Fase 2 · Assinatura (não iniciada)

Só começa com demanda comprovada pela Fase 1.

### Regras de conta

GA4 e Brevo usam **só a conta pessoal** do responsável. Nunca usar a conta da empresa.

## 17. Publicidade

**Estado atual:** sem publicidade (QC-DEC-034). Não existe rede de anúncios contratada. QC-DEC-034 supera QC-DEC-020 e a extensão dela.

Se a publicidade voltar:

- lugar permitido: resultado e prévia da proposta;
- nunca na entrada de dados (campos, perguntas, teclado, Próximo, Voltar);
- nunca em posição que gere clique acidental;
- o produto é um site (GitHub Pages). A rede adequada é AdSense ou Ad Manager para web.

O formulário do cliente do Briefing **nunca** mostra anúncio (QC-DEC-025).

## 18. Conteúdo e aquisição

A calculadora é o núcleo. As páginas de conteúdo ajudam no SEO.

- Publicados: índice `/guias/` e 3 guias: "Como fazer orçamento freelancer", "Como calcular seu valor por hora como freelancer" e "Como cobrar revisões de um projeto" (QC-DEC-041).
- Search Console verificado.
- Imagem de compartilhamento (og:image 1200×630).

Temas possíveis para os próximos guias:

- como cobrar urgência sem percentual arbitrário;
- exemplos de orçamento por tipo de projeto;
- como lidar com alteração de escopo;
- como apresentar orçamento ao cliente.

O conteúdo precisa ser útil sozinho.

## 19. UX e interface

- mobile-first, coluna única no mobile;
- desktop na Variante D (§8);
- números grandes e baixa densidade visual;
- fluxo sequencial, sem sidebar de produto;
- tema escuro e claro;
- direção visual: **gramática de calculadora**, sem copiar layout, símbolos ou operações da Calculadora da Apple;
- o visor é o próprio campo, sem input duplicado (QC-DEC-019);
- teclado "maquininha" (QC-DEC-017): números 1 a 9, linha `00 · 0 · ,` (ou `00 · 0 · h` nas horas), coluna com `⌫`, `C` e `✓`. Só a tecla `✓` é laranja;
- tecla quadrada, raio de 22 px, relevo sutil de 2 px (QC-DEC-033);
- data, horas por rodada, custos e valor da proposta abrem em modal;
- textos de apoio discretos.

### Regra de identidade

A pessoa reconhece a ferramenta como calculadora antes de percebê-la como formulário. O visor fica dominante em todo o fluxo. O teclado aparece só em entradas numéricas reais.

### Total em construção

O cupom ao vivo mostra subtotais durante o fluxo. Enquanto faltam variáveis financeiras, os subtotais são parciais. O produto não mostra um "preço final" cedo demais.

## 20. App no celular

**Estado:** implementado (commit `0e4c5c4`) e publicado no site em 09/11/2026 (QC-DEC-038). O APK não é publicado em loja.

- **PWA:** o site é instalável na tela inicial (`manifest.webmanifest`, ícones 192, 512 e maskable).
- **Offline:** o service worker (`sw.js`, cache `fiz-v35`) guarda o app, a página de privacidade e o guia. GA4 e Brevo usam só a rede.
- O valor do cache segue o `?v=` dos arquivos CSS e JS nas 3 páginas.
- **APK Android de teste:** projeto local `fiz-a-conta-android` (WebView). Não publicado em loja.

## 21. Métricas

### Eventos GA4 implementados (Fase 0)

| Evento | Quando |
| --- | --- |
| `step_viewed` | A pessoa vê uma tela (parâmetro: nome da tela) |
| `proposal_started` | Toca em "Criar proposta" |
| `proposal_whatsapp` | Toca em "Enviar pelo WhatsApp" |
| `proposal_shared` | Toca em "Mais" (compartilhamento nativo) |
| `proposal_copied` | Copia a proposta |
| `proposal_printed` | Salva o PDF |
| `new_budget_started` | Confirma "Novo orçamento" |
| `rating_submitted` | Envia a nota da pesquisa |
| `rating_skipped` | Toca em "Agora não" na pesquisa |
| `history_interest_clicked` | Toca em "Histórico" |
| `history_signup_submitted` | Envia o e-mail no teste do Histórico |

### Uso

- início e conclusão do cálculo;
- abandono por etapa (`step_viewed`);
- uso do mini-fluxo;
- criação, cópia, compartilhamento e PDF da proposta.

### Freemium

- taxa de cliques em Histórico;
- taxa de e-mails enviados;
- nota média da pesquisa.

### Qualidade

- volta para a etapa anterior;
- erros de validação por campo;
- entendimento da origem do valor, em teste qualitativo.

## 22. Pendências (não decididas)

| Pendência | Recomendação atual |
| --- | --- |
| Domínio do Fiz a Conta | **Resolvido (QC-DEC-039):** `https://fizaconta.com/`. Falta a propriedade no Search Console |
| E-mail de contato LGPD na página de privacidade | **Resolvido (QC-DEC-039):** `contato@fizaconta.com` |
| Destino do texto da pesquisa de 5 estrelas | **Resolvido (QC-DEC-039):** Google Forms, implementado |
| Cupom V1 no resultado desktop do canvas | Aplicar no canvas |
| Dupla confirmação no Brevo (exige telefone verificado) | Ativar depois de verificar o telefone |
| Implementar o Briefing (`PRD-briefing.md`) | Aprovado (QC-DEC-022 a QC-DEC-025), ainda não implementado |
| Destino da rota antiga `/calculadora` | Depende do inventário de URLs |

## 23. Fontes de verdade e rastreabilidade

Ordem de precedência em caso de conflito:

1. `decision-log.md` v2.3;
2. `business-rules.md` v2.2;
3. este PRD v2.1;
4. `architecture.md` v2.0, `design-system.md` v2.0 e `handoff_tecnico.md` v2.0.

Todos os documentos acima incluem QC-DEC-001 a QC-DEC-038 (alinhados em 09/11/2026). Pontos em que o código e as regras divergem estão marcados como Pendente no `business-rules.md` §17 e no `design-system.md` §20.

Referências visuais:

- **Canvas Claude Design "Fiz a Conta · Telas"** (https://claude.ai/artifact/NxxNQcMVCfY6TFb7d4DL5Y): telas aprovadas em 28/10/2026 (QC-DEC-026 a QC-DEC-037).
- **Design System Claude Design** (https://claude.ai/artifact/8sDrjN9VbUEgw3vRciSLCz): componentes e tokens. O namespace `FazAConta` não muda.
- **Figma** (`87RIlysRO3vHEDm7Ghdzf3`): wordmark no nó `125:72`; desktop Variante D no nó `115:2`; faixa v1.4 como histórico de conteúdo e regras.
- **FigJam** (`LoGu3vG6gQtt9KEGnAJ9CA`): jornada, fluxo e sitemap (histórico v1.4 e v1.5).
- **Notion** (conta pessoal): página "Fiz a Conta · calculadora de orçamento para freelancers", com as subpáginas do PRD e do Design (handoff do Claude Design, com as 22 telas e o pacote-fonte).

## 24. Decisão de produto

**Aprovar com escopo controlado.**

O produto funciona quando continua uma calculadora curta e explicável. O maior risco não é técnico. O maior risco é monetizar a própria tarefa ou virar um mini-SaaS antes de provar uso e aquisição. Por isso, o freemium avança por fases e só com dados.
