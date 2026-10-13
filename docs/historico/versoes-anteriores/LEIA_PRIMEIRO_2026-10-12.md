# Quanto Cobro? - Pacote de handoff para Claude

Data de consolidacao: 2026-10-12.

## Como usar

Leia os cinco arquivos em `atuais/` nesta ordem:

1. `decision-log.md` - decisoes explicitamente aprovadas e historico acumulado (v1.4).
2. `PRD.md` - escopo funcional e jornadas (v1.1).
3. `architecture.md` - modelo e calculo (v1.1).
4. `design-system.md` - direcao visual e comportamento (v1.2).
5. `handoff_tecnico.md` - plano tecnico e criterios previstos (v1.2).

## Situacao do produto

- Calculadora de orcamentos gratuita para freelancers e designers brasileiros, monetizada por publicidade fora da tarefa principal.
- Fluxo mobile-first, sem login; a rota `/` abre a calculadora.
- Decisoes aprovadas QC-DEC-001 a 004: multiplos custos diretos; dados da proposta apenas apos o CTA; valor/hora e tema no armazenamento local, orcamento na sessao; pagina raiz e a calculadora.
- Figma possui telas candidatas v1.3, ainda sem aprovacao formal final de QA/handoff.
- FigJam possui mapa organizado v1.4; historicos foram preservados.
- Business Rules definitivo NAO esta concluido: faltam limites, campos obrigatorios, arredondamento monetario, datas invalidas e reinicio/limpeza da sessao.
- Cabecalhos de status de PRD, arquitetura, design system ou handoff podem registrar etapas anteriores da auditoria visual. Para o estado do projeto, prevalece o registro mais recente no `decision-log.md`; para regras aprovadas, prevalecem as decisoes QC-DEC.

## Figma e FigJam (links online, nao exportacoes .fig)

Figma: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3

Mobile v1.3 custos: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3?node-id=89-142

Desktop v1.3 custos: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3?node-id=89-505

Figma - indice: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3?node-id=91-10

FigJam - indice organizado v1.4: https://www.figma.com/board/LoGu3vG6gQtt9KEGnAJ9CA?node-id=17-389

## Historico

Os arquivos da pasta `historico_apoio/` sao materiais anteriores. Podem conter caminhos, features e monetizacao incompatíveis com o escopo atual. NAO adotar suas regras como fonte de verdade sem conferir PRD e Decision Log. Eles foram incluidos apenas para rastreabilidade.

O arquivo ZIP nao contem uma exportacao editavel nativa do Figma. Para recuperar as telas, use os links ou a integracao Figma.
