# Rota de Importação de Manual Sections

## Endpoint

`POST /api/import-manual-sections`

## Descrição

Importa as seções padrão do manual (`src/data/manualSections.js`) para um cenário específico, sobrescrevendo o `loreSections` existente.

## Requisitos

- Autenticação required (NextAuth session)
- `scenarioId` no corpo da requisição

## Corpo da Requisição

```json
{
  "scenarioId": "solo-leveling"
}
```

## Resposta de Sucesso

```json
{
  "success": true,
  "message": "Seções do manual importadas com sucesso para o cenário solo-leveling",
  "data": [...]
}
```

## Como Usar

### Via cURL

```bash
curl -X POST http://localhost:3000/api/import-manual-sections \
  -H "Content-Type: application/json" \
  -d '{"scenarioId":"seu-cenario-id"}'
```

### Via JavaScript

```javascript
const response = await fetch('/api/import-manual-sections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenarioId: 'seu-cenario-id' })
});
const result = await response.json();
```

## Observação

Esta é uma rota **temporária** para facilitar a migração/restauração das seções padrão do manual. Ela **sobrescreve** completamente o `loreSections` do cenário.
