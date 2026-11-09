# Fiz a Conta · Pacote de handoff

Atualizado em 09/11/2026 (v2.1). Versões anteriores em `historico/versoes-anteriores/`.

Nomes anteriores: "Quanto Cobro?" e "Faz a Conta". O nome atual é **Fiz a Conta** (QC-DEC-026).

## Como usar

Leia nesta ordem:

1. `decision-log.md` v2.3: decisões QC-DEC-001 a QC-DEC-038. Comece pelas seções finais (v2.2 e v2.3).
2. `PRD.md` v2.1: produto atual, alinhado com o Decision Log v2.3 e com o código publicado.
3. `PRD-briefing.md` v1.1: recurso Briefing (aprovado, ainda não implementado).
4. `business-rules.md` v2.0: validação, precisão, padrões, casos-teste e pendências (§17).
5. `architecture.md` v2.0, `design-system.md` v2.0, `handoff_tecnico.md` v2.0.
6. `calc-reference.mjs`: implementação de referência dos números, em minutos (`node docs/calc-reference.mjs`).

Todos os documentos estão alinhados com QC-DEC-001 a QC-DEC-038. Em conflito, vale o Decision Log.

## Situação do produto

- Calculadora de orçamento grátis para freelancers e designers brasileiros. Sem login.
- Modelo freemium em fases (QC-DEC-036). Fase 0 (GA4 e pesquisa) e Fase 1 (teste do Histórico) estão no código.
- Sem publicidade por enquanto (QC-DEC-034).
- Horas em minutos, período de entrega, cupom V1, Compartilhar V2 (QC-DEC-027 a QC-DEC-037).
- App instalável (PWA) e offline (QC-DEC-038).
- Publicado na `main` (GitHub Pages) em 09/11/2026. O trabalho continua na `edicao`.

## Referências

- Canvas de telas aprovadas: https://claude.ai/artifact/NxxNQcMVCfY6TFb7d4DL5Y
- Design System: https://claude.ai/artifact/8sDrjN9VbUEgw3vRciSLCz
- Figma: https://www.figma.com/design/87RIlysRO3vHEDm7Ghdzf3 (wordmark `125:72`, desktop Variante D `115:2`)
- FigJam: https://www.figma.com/board/LoGu3vG6gQtt9KEGnAJ9CA (histórico v1.4 e v1.5)
- Notion: página "Fiz a Conta · calculadora de orçamento para freelancers" (conta pessoal)

## Histórico

`historico/` guarda materiais antigos e `versoes-anteriores/` guarda as versões substituídas. `user-flow.md`, `roadmap.md` e `wireframes.svg` usam regras abandonadas (etapa "Situação", urgência +20%, faixa de preço). Não adotar.
