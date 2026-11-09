# Fiz a Conta · Pacote de handoff

Atualizado em 09/11/2026 (v2.0). Versão anterior: `historico/versoes-anteriores/LEIA_PRIMEIRO_v1.5.md`.

Nomes anteriores: "Quanto Cobro?" e "Faz a Conta". O nome atual é **Fiz a Conta** (QC-DEC-026).

## Como usar

Leia nesta ordem:

1. `decision-log.md` v2.2: decisões QC-DEC-001 a QC-DEC-037. Comece pelas seções finais (v2.1 e v2.2).
2. `PRD.md` v2.0: produto atual, alinhado com o Decision Log v2.2 e com o código da branch `edicao` (commit `0e4c5c4`).
3. `PRD-briefing.md` v1.0: recurso Briefing (aprovado, ainda não implementado).
4. `business-rules.md` v1.1: validação, precisão, padrões e casos-teste.
5. `architecture.md` v1.2, `design-system.md` v1.5, `handoff_tecnico.md` v1.3.
6. `calc-reference.mjs`: implementação de referência dos números (`node calc-reference.mjs`). Usa horas em centésimos (regra antiga). O app usa minutos (QC-DEC-027).

**Atenção:** os documentos dos itens 4 e 5 ainda não incluem QC-DEC-017 a QC-DEC-037. Em conflito, vale o Decision Log e depois o PRD v2.0.

## Situação do produto

- Calculadora de orçamento grátis para freelancers e designers brasileiros. Sem login.
- Modelo freemium em fases (QC-DEC-036). Fase 0 (GA4 e pesquisa) e Fase 1 (teste do Histórico) estão no código.
- Sem publicidade por enquanto (QC-DEC-034).
- Horas em minutos, período de entrega, cupom V1, Compartilhar V2 (QC-DEC-027 a QC-DEC-037).
- App instalável (PWA) e offline na branch `edicao`. Não publicado.
- A `main` ainda está na versão de 14/10/2026. Publicar só com aprovação explícita.

## Referências

- Canvas de telas aprovadas: https://claude.ai/artifact/NxxNQcMVCfY6TFb7d4DL5Y
- Design System: https://claude.ai/artifact/8sDrjN9VbUEgw3vRciSLCz
- Figma: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3 (wordmark `125:72`, desktop Variante D `115:2`)
- FigJam: https://www.figma.com/board/LoGu3vG6gQtt9KEGnAJ9CA (histórico v1.4 e v1.5)
- Notion: página "Fiz a Conta · calculadora de orçamento para freelancers" (conta pessoal)

## Histórico

`historico/` guarda materiais antigos e `versoes-anteriores/` guarda as versões substituídas. `user-flow.md`, `roadmap.md` e `wireframes.svg` usam regras abandonadas (etapa "Situação", urgência +20%, faixa de preço). Não adotar.
