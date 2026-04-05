# Migração: Arquivos Fixos → Firebase Firestore

## 📋 Visão Geral

Este documento descreve a migração progressiva de dados estáticos (arquivos `.js` e `.json`) para o Firebase Firestore. O objetivo éCentralizar todos os dados dos cenários no banco de dados, permitindo edição via interface admin e eliminando a necessidade de alterar código para modificar conteúdo.

## ✅ Princípios

- **Não-Destrutivo**: Todos os arquivos fonte são preservados (apenas marcados como DEPRECATED)
- **Progressivo**: Migração por tipo de dado (lore → edges → powers → completo)
- **Backwards Compatible**: Sistema funciona tanto com Firestore quanto com fallback local
- **Exportável**: Possibilidade de exportar/importar cenários via API

## 📁 Estrutura Atual vs Futura

### ANTES (Arquivos Fixos)
```
src/
├── data/
│   ├── manualSections.js     (Lore/Manual)
│   ├── edgesSL.js            (Vantagens Solo Leveling)
│   ├── hindrancesSL.js       (Complicações Solo Leveling)
│   └── powersSL.js           (Poderes Solo Leveling)
├── scenarios/
│   ├── solo-leveling/
│   │   ├── index.js          (Importa tudo de data/)
│   │   └── data/
│   │       ├── edges.js
│   │       ├── hindrances.js
│   │       ├── powers.js
│   │       ├── awakeningRules.js
│   │       └── adventureGenerator.js
│   └── project-symbiosis/
│       ├── index.js          (Importa JSONs)
│       ├── edges.json
│       ├── hindrances.json
│       ├── powers.json
│       ├── awakeningRules.json
│       └── loreSections.js
```

### DEPOIS (Firestore Primário)
```
src/
├── data/                    (MANTIDOS mas DEPRECATED - apenas referência)
├── scenarios/
│   ├── solo-leveling/
│   │   └── index.js         (Metadata apenas)
│   └── project-symbiosis/
│       └── index.js         (Metadata apenas)
├── app/
│   ├── api/
│   │   ├── scenarios/       (CRUD existente)
│   │   ├── import-manual-sections/  (Corrigido: contentHtml)
│   │   ├── admin/
│   │   │   └── seed-scenario/       (NOVO: importar dados)
│   │   └── export-scenario/         (NOVO: exportar dados)
└── scripts/
    ├── seed-solo-leveling.js        (NOVO: migrar SL)
    ├── seed-project-symbiosis.js    (NOVO: migrar PS)
    └── migrate-all.js               (NOVO: migrar tudo)
```

## 🚀 Como Executar a Migração

### Pré-requisitos

1. **Backup do Firestore** (export completo via Firebase Console)
2. **Servidor rodando** em `http://localhost:3000`
3. **Commit atual** de todo o código (para rollback se necessário)
4. **Branch dedicada** (recomendado: `migration/firebase-primary`)

### Passos

#### 1. Aplicar mudanças de código

 Todas as alterações de código já estão implementadas:
- ✅ API `/api/admin/seed-scenario`
- ✅ API `/api/import-manual-sections` corrigida
- ✅ Registry atualizado para priorizar Firestore
- ✅ Hook `useActiveScenario` com auto-load
- ✅ Cenários marked como deprecated

#### 2. Testar servidor

```bash
npm run dev
# Verificar se servidor responde em http://localhost:3000
```

#### 3. Executar migração

```bash
# Migrar todos os cenários (recomendado)
node scripts/migrate-all.js

# OU migrar cenário específico
node scripts/seed-solo-leveling.js
node scripts/seed-project-symbiosis.js
```

#### 4. Verificar resultados

**No console do script:**
- ✅ mensagens de sucesso por seção/tipo
- ❌ erros detalhados se houver

**No Firebase Console:**
- Coleção `scenarios` deve ter documentos:
  - `solo-leveling` com todos os campos (edges, hindrances, powers, loreSections, etc)
  - `project-symbiosis` com todos os campos

**Na aplicação:**
- Abrir BookView → conteúdo da lore carrega?
- Abrir Admin → tabs Edges, Hindrances, Powers mostram dados?
- Botão "Restaurar" na LoreTab funciona?

#### 5. Testar fallback (opcional)

- Parar servidor
- Deletar cenário do Firestore (via Console)
- Reiniciar servidor
- Sistema deve usar dados do registry (apenas metadata, sem edges/powers)
- Isso confirma que o fallback funciona (com avisos no console)

## 📊 O Que Foi Migrado

### Solo Leveling

| Tipo | Origem | Destino Firestore | Status |
|------|--------|-------------------|--------|
| Lore Sections | `src/data/manualSections.js` | `loreSections` array | ✅ Via `import-manual-sections` |
| Edges | `src/data/edgesSL.js` | `edges` array | ✅ Via seed script |
| Hindrances | `src/data/hindrancesSL.js` | `hindrances` array | ✅ Via seed script |
| Powers | `src/data/powersSL.js` | `powers` objeto | ✅ Via seed script |
| Awakening Rules | `src/scenarios/solo-leveling/data/awakeningRules.js` | `awakeningRules` array | ✅ Via seed script |
| Adventure Generator | `src/scenarios/solo-leveling/data/adventureGenerator.js` | `adventureGenerator` objeto | ✅ Via seed script |
| Configs (extraFields, promptStyles, skills) | `src/scenarios/solo-leveling/index.js` | campos separados | ✅ Via seed script |
| calculateMaxMana | `src/scenarios/solo-leveling/lib/slEngine.js` | `calculateMaxMana` função | ⚠️ Será function string |

### Project Symbiosis

| Tipo | Origem | Destino Firestore | Status |
|------|--------|-------------------|--------|
| Lore Sections | `src/scenarios/project-symbiosis/loreSections.js` | `loreSections` array | ✅ Via seed script |
| Edges | `src/scenarios/project-symbiosis/edges.json` | `edges` array | ✅ Via seed script |
| Hindrances | `src/scenarios/project-symbiosis/hindrances.json` | `hindrances` array | ✅ Via seed script |
| Powers | `src/scenarios/project-symbiosis/powers.json` | `powers` objeto | ✅ Via seed script |
| Awakening Rules | `src/scenarios/project-symbiosis/awakeningRules.json` | `awakeningRules` array | ✅ Via seed script |
| Configs (extraFields, promptStyles, skills) | `src/scenarios/project-symbiosis/index.js` | campos separados | ✅ Via seed script |

## 🔧 Detalhes Técnicos

### Cache de Firestore

O registry (`src/scenarios/index.js`) agora possui um **cache em memória** (`firestoreCache`):

1. Primeira chamada a `getScenario(id)` retorna dados do registry (metadata)
2. Hook `useActiveScenario` automaticamente dispara `loadScenarioFromFirestore(id)`
3. Dados do Firestore são armazenados no cache e mergeados com registry
4. Chamadas subsequentes usam cache (sem requests adicionais)

### Funções Síncronas vs Assíncronas

- **Síncronas** (estáveis): `getScenario()`, `getActiveScenario()`, `getAvailableScenarios()`, `getScenarioIfExists()`
- **Assíncronas** (auto-load): `loadScenarioFromFirestore()`, `getScenarioSkills()`, `getScenarioPromptStyles()`, `getScenarioExtraFields()`, `getScenarioCalculateMaxMana()`

### Componentes Afetados

| Componente | Mudança | Status |
|------------|---------|--------|
| `useActiveScenario` (hook) | Agora auto-carrega do Firestore + loading state | ✅ Atualizado |
| `useScenario` | Agora carrega async individualmente | ✅ Atualizado |
| `Sidebar` | Buscar de `useActiveScenario` em vez de import direto | ⚠️ Ainda usa import? |
| `page.jsx` (Home) | Buscar de `useActiveScenario` ou API | ⚠️ Ainda usa import? |
| `BookView` | Já recebe via props, OK | ✅ |
| `GameModal` | Já tem listener Firestore, OK | ✅ |
| `ScenarioAdmin*` | Já usa API, OK | ✅ |

## 📝 API Reference

### Nova: `POST /api/admin/seed-scenario`

```json
{
  "scenarioId": "solo-leveling",
  "data": {
    "edges": [...],
    "hindrances": [...],
    "powers": {...},
    "loreSections": [...],
    "awakeningRules": [...],
    "adventureGenerator": {...},
    "extraFields": {...},
    "promptStyles": {...},
    "skills": {...},
    "calculateMaxMana": "function string"
  }
}
```

### Melhorada: `POST /api/import-manual-sections`

Agora retorna `contentHtml` além de `content`:

```json
{
  "success": true,
  "data": [
    {
      "id": "introducao-como-usar",
      "title": "...",
      "content": "HTML...",
      "contentHtml": "HTML..."  // ← NOVO
    }
  ]
}
```

### Nova: `GET /api/export-scenario?id={id}`

Exporta cenário completo do Firestore:

```json
{
  "success": true,
  "scenario": {
    "id": "solo-leveling",
    "edges": [...],
    "loreSections": [...],
    "updatedAt": "2025-01-01T00:00:00Z"
  },
  "exportedAt": "2025-01-01T00:00:00Z"
}
```

## ⚠️ Considerações

### Functions no Firestore

O campo `calculateMaxMana` é uma função JavaScript. No Firestore, funções são armazenadas como **strings**. A engine JavaScript do Firestore (Cloud Functions) consegue executar? **Não**.

**Solução**: Armazenar como string e usar `eval()` ou `new Function()` ao carregar? **Não seguro**.

**Abordagem atual**:
- Armazenar função como string no Firestore
- Ao carregar, reconstruir função: `scenario.calculateMaxMana = new Function('attr', 'return ' + functionString)`
- **Risco**: Apenas use em ambiente confiável (admin), nunca expor ao cliente

**Alternativa**: Remover `calculateMaxMana` dos cenários e usar uma implementação genérica no código. Avaliar se realmente necessário.

### Rollback

Para reverter a migração:

1. Parar de usar as APIs de seed
2. Remover ou desabilitar as mudanças no registry
3. Reverter arquivos modificados (commit anterior)
4. Dados no Firestore podem ser deletados (permanentes)

Como arquivos source foram mantidos, rollback é **simples**.

## 🎯 Próximos Passos (TODO)

### Imediato (Pós-Migração)

- [ ] Testar todos os componentes com dados do Firestore
- [ ] Verificar se `Sidebar` e `page.jsx` precisam ser atualizados (ainda usam imports?)
- [ ] Adicionar tratamento de erros em `useActiveScenario` (loading state)
- [ ] Validar que `calculateMaxMana` funciona corretamente
- [ ] Testar "Restaurar" button na LorentzTab

### Futuro

- [ ] Adicionar mais cenários à migração (se houver)
- [ ] Criar UI de admin para seed manual (botão "Populate Default Data")
- [ ] Adicionar validação de schema no `/api/admin/seed-scenario`
- [ ] Implementar sistema de versionamento de cenários
- [ ] Documentar formato JSON de exportação para compartilhamento
- [ ] Considerarremoção completa de arquivos deprecated após 2-3 releases

## 📚 Comandos Úteis

```bash
# Verificar estrutura de um cenário no Firestore (Firebase CLI)
firebase firestore:data:get scenarios/solo-leveling

# Exportar todos os cenários
curl http://localhost:3000/api/export-scenario?id=solo-leveling > solo-leveling.json
curl http://localhost:3000/api/export-scenario?id=project-symbiosis > project-symbiosis.json

# Deletar cenário do Firestore (rollback)
firebase firestore:data:delete scenarios/solo-leveling
```

## 🐛 Troubleshooting

### Erro: "Cenário não encontrado no Firestore"

- Normal na primeira execução
- Executar script de seed para o cenário específico

### Erro: "Cannot read property 'edges' of undefined"

- Componente tentando acessar `scenario.edges` antes do load
- Garantir que hook `useActiveScenario` está sendo usado
- Verificar `isLoading` state

### Dados duplicados no Firestore

- Scripts de seed usam `{ merge: true }` no `setDoc`
- Isso adiciona/atualiza campos, não substitui documento inteiro
- Para resetar, deletar documento primeiro

### Sidebar/Home ainda mostram conteúdo antigo

- Verificar seComponentes estão usando `manualSections` importado
- Substituir por `const { loreSections } = useActiveScenario()`
- Commit: atualizar esses componentes

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique logs do console (navegador + servidor)
2. Confirme que o Firestore está acessível (regras OK)
3. Teste com `curl` as APIs diretamente
4. Consulte o backup antes de mudanças drásticas

---

**Status da Migração**: ✅ Em Andamento (Fase 2.1-2.6)  
**Última Atualização**: 2025-01-01  
**Responsável**: Equipe de Desenvolvimento
