# 🎯 Como usar a restauração de manualSections

## Onde está

Na **TAB LORE** do admin de cenário, no topo da lista de seções (Sumário), há um botão **"Restaurar"**.

## Como usar

1. Abra o admin do cenário (ScenarioAdminModal)
2. Vá na **tab "Lore"** (ícone de livro)
3. No header "Sumário", clique no botão **"Restaurar"**
4. Confirme a restauração
5. Todas as seções serão substituídas pelas padrão do manual

## O que acontece

- As `loreSections` do cenário são substituídas pelo conteúdo de `src/data/manualSections.js`
- A mudança é **instantânea** para todos os jogadores (via `onSnapshot`)
-O botão **Add** continua funcionando para adicionar novas seções customizadas
- Você pode editar normalmente após restaurar

## API (para desenvolvedores)

```bash
POST /api/import-manual-sections
Content-Type: application/json

{
  "scenarioId": "id-do-cenario"
}
```

Resposta:
```json
{
  "success": true,
  "message": "Seções do manual importadas com sucesso",
  "data": [...]
}
```
