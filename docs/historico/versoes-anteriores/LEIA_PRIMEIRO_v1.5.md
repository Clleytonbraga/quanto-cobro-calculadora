# Quanto Cobro? - Pacote de handoff

Data de consolidacao: 2026-10-12 (revisao v1.5). Versao anterior deste arquivo: `historico_apoio/versoes-anteriores/LEIA_PRIMEIRO_2026-10-12.md`.

## Como usar

Leia os arquivos em `atuais/` nesta ordem:

1. `decision-log.md` - decisoes aprovadas QC-DEC-001 a 016 e historico acumulado (v1.6). Comece pelas secoes finais (v1.5 e v1.6).
2. `business-rules.md` - validacao, precisao, padroes, persistencia, reinicio, proposta e casos-teste (v1.1).
3. `PRD.md` - escopo funcional e jornadas (v1.2).
4. `architecture.md` - modelo e calculo (v1.2).
5. `design-system.md` - direcao visual e comportamento (v1.3).
6. `handoff_tecnico.md` - plano tecnico e criterios de aceite (v1.3).
7. `calc-reference.mjs` - implementacao de referencia dos numeros do Business Rules (`node calc-reference.mjs`).

## Situacao do produto

- Calculadora de orcamentos gratuita para freelancers e designers brasileiros, monetizada por publicidade fora da tarefa principal.
- Mobile-first, sem login; a rota `/` abre a calculadora.
- QC-DEC-001 a 004 inalteradas. QC-DEC-005 a 014 (aprovadas em 12/10/2026) definem obrigatorios, padroes, arredondamento, valor comercial, salvamento do valor/hora, reinicio, custos incompletos, datas, proposta e tetos tecnicos.
- Business Rules v1.1 concluido; derivacoes do §12 aprovadas (QC-DEC-015).
- Figma: faixa **v1.4 APROVADA** como fonte visual de handoff (QC-DEC-016): Mobile `100:2`, Desktop `101:2`, Publicidade `102:2`; v1.2 e v1.3 preservadas.
- Desenvolvimento: usar os skills `/ponytail:ponytail` e `/ui-ux-pro-max`.
- FigJam: mapa v1.4 intacto + secao `07 · ATUALIZACAO v1.5` (`26:639`) com as definicoes novas.
- Dependencia externa: destino de `/calculadora`, apos inventario de URLs publicadas.

## Figma e FigJam

Figma: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3
Mobile v1.4: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3?node-id=100-2
Desktop v1.4: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3?node-id=101-2
Publicidade v1.4: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3?node-id=102-2
Indice: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3?node-id=91-10
FigJam indice v1.4: https://www.figma.com/board/LoGu3vG6gQtt9KEGnAJ9CA?node-id=17-389
FigJam atualizacao v1.5: https://www.figma.com/board/LoGu3vG6gQtt9KEGnAJ9CA?node-id=26-639

## Historico

`historico_apoio/` contem materiais anteriores (`user-flow.md`, `roadmap.md`, `wireframes (1).svg`) e `versoes-anteriores/` com as versoes substituidas dos documentos. Os tres primeiros usam regras abandonadas (etapa "Situacao", urgencia +20%, faixa de preco, "Comparar proposta" no MVP): nao adotar. `roadmap.md` nao define o MVP; ver PRD §21 e FigJam 06.
