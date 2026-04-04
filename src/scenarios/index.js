/**
 * Scenario Registry
 * Gerencia metadados de cenários e busca dados do Firestore quando disponível
 */

import * as ScenarioService from "@/lib/scenarioService.js";
import projectSymbiosisScenario from "./project-symbiosis/index.js";
import soloLevelingScenario from "./solo-leveling/index.js";

const scenarios = {
  "solo-leveling": soloLevelingScenario,
  "project-symbiosis": projectSymbiosisScenario,
};

const DEFAULT_SCENARIO = "solo-leveling";

let currentScenario = null;
let currentScenarioId = DEFAULT_SCENARIO;
let firestoreCache = {}; // Cache de dados do Firestore

// ============================================================================
// FUNÇÕES SÍNCRONAS (retornam dados do registry + cache)
// ============================================================================

export function getScenario(id = null) {
  const scenarioId = id || currentScenarioId;

  if (!scenarios[scenarioId]) {
    console.warn(
      `Cenário "${scenarioId}" não encontrado. Usando padrão: "${DEFAULT_SCENARIO}".`,
    );
    return scenarios[DEFAULT_SCENARIO];
  }

  const baseScenario = scenarios[scenarioId];

  // Se temos dados no cache, fazer merge
  if (firestoreCache[scenarioId]) {
    return { ...baseScenario, ...firestoreCache[scenarioId] };
  }

  // Caso contrário, retornar apenas base (metadata)
  return baseScenario;
}

export function getScenarioIfExists(id) {
  if (!scenarios[id]) {
    return null;
  }
  return getScenario(id);
}

export function getActiveScenario(scenarioIdFromTable = null) {
  if (!currentScenario) {
    const envScenario = process.env.NEXT_PUBLIC_ACTIVE_SCENARIO;
    currentScenarioId = envScenario || DEFAULT_SCENARIO;
    currentScenario = getScenario(currentScenarioId);
  }

  if (scenarioIdFromTable && scenarios[scenarioIdFromTable]) {
    return getScenario(scenarioIdFromTable);
  }

  return currentScenario;
}

export function setActiveScenario(id) {
  if (!scenarios[id]) {
    throw new Error(
      `Cenário "${id}" não existe. Cenários disponíveis: ${Object.keys(scenarios).join(", ")}`,
    );
  }
  currentScenarioId = id;
  currentScenario = getScenario(id);
  return currentScenario;
}

export function getAvailableScenarios() {
  return Object.entries(scenarios).map(([id, scenario]) => ({
    id,
    name: scenario.metadata?.name || id,
    description: scenario.metadata?.description || "",
    metadata: scenario.metadata,
    _note:
      "Dados completos são carregados do Firestore (edges, hindrances, powers, loreSections, etc)",
  }));
}

// ============================================================================
// FUNÇÕES ASSÍNCRONAS (carregam dados do Firestore)
// ============================================================================

export async function loadScenarioFromFirestore(id) {
  try {
    const scenarioData = await ScenarioService.getScenarioById(id);
    if (scenarioData) {
      // Atualizar cache
      firestoreCache[id] = scenarioData;
      currentScenarioId = id;
      // Recalcular currentScenario com dados do cache
      currentScenario = getScenario(id);
      console.log(
        `[Registry] Cenário ${id} carregado do Firestore com sucesso`,
      );
      return currentScenario;
    }
    console.warn(`[Registry] Cenário ${id} não encontrado no Firestore`);
    return null;
  } catch (error) {
    console.error(
      `[Registry] Erro ao carregar cenário ${id} do Firestore:`,
      error,
    );
    return null;
  }
}

export async function refreshScenarioCache(id = null) {
  const scenarioId = id || currentScenarioId;
  if (id) {
    return await loadScenarioFromFirestore(id);
  }
  return await loadScenarioFromFirestore(scenarioId);
}

export function clearScenarioCache() {
  firestoreCache = {};
  currentScenario = null;
  currentScenarioId = DEFAULT_SCENARIO;
}

// ============================================================================
// FUNÇÕES HELPER (async com auto-load do Firestore se necessário)
// ============================================================================

export async function getScenarioSkills(scenarioId = null) {
  const scenario = getScenario(scenarioId);
  if (!scenario.skills && scenarioId) {
    await loadScenarioFromFirestore(scenarioId);
    const refreshedScenario = getScenario(scenarioId);
    return refreshedScenario?.skills || {};
  }
  return scenario?.skills || {};
}

export async function getScenarioPromptStyles(scenarioId = null) {
  const scenario = getScenario(scenarioId);
  if (!scenario.promptStyles && scenarioId) {
    await loadScenarioFromFirestore(scenarioId);
    const refreshedScenario = getScenario(scenarioId);
    return refreshedScenario?.promptStyles || {};
  }
  return scenario?.promptStyles || {};
}

export async function getScenarioExtraFields(scenarioId = null) {
  const scenario = getScenario(scenarioId);
  if (!scenario.extraFields && scenarioId) {
    await loadScenarioFromFirestore(scenarioId);
    const refreshedScenario = getScenario(scenarioId);
    return refreshedScenario?.extraFields || {};
  }
  return scenario?.extraFields || {};
}

export async function getScenarioCalculateMaxMana(scenarioId = null) {
  const scenario = getScenario(scenarioId);
  if (!scenario.calculateMaxMana && scenarioId) {
    await loadScenarioFromFirestore(scenarioId);
    const refreshedScenario = getScenario(scenarioId);
    return refreshedScenario?.calculateMaxMana || null;
  }
  return scenario?.calculateMaxMana || null;
}

export default {
  getScenario,
  getScenarioIfExists,
  getActiveScenario,
  setActiveScenario,
  getAvailableScenarios,
  getScenarioSkills,
  getScenarioPromptStyles,
  getScenarioExtraFields,
  getScenarioCalculateMaxMana,
  loadScenarioFromFirestore,
  refreshScenarioCache,
  clearScenarioCache,
  DEFAULT_SCENARIO,
};
