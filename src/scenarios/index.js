/**
 * Scenarios Registry - Gerenciador de Cenários
 * Fornece acesso ao cenário ativo configurado no sistema.
 * Suporta cenário por mesa (via scenarioId) ou global (via env var).
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

export function getScenario(id = null) {
  const scenarioId = id || currentScenarioId;

  if (!scenarios[scenarioId]) {
    console.warn(
      `Cenário "${scenarioId}" não encontrado. Usando padrão: "${DEFAULT_SCENARIO}".`,
    );
    return scenarios[DEFAULT_SCENARIO];
  }

  return scenarios[scenarioId];
}

export function getScenarioIfExists(id) {
  // Retorna o cenário exato do registry, sem fallback
  return scenarios[id] || null;
}

export async function loadScenarioFromFirestore(id) {
  try {
    const scenarioData = await ScenarioService.getScenarioById(id);
    if (scenarioData) {
      currentScenarioId = id;
      currentScenario = { ...scenarios[id], ...scenarioData };
      return currentScenario;
    }
    return null;
  } catch (error) {
    console.error("Erro ao carregar cenário do Firestore:", error);
    return null;
  }
}

export function clearScenarioCache() {
  currentScenario = null;
  currentScenarioId = DEFAULT_SCENARIO;
}

export function getActiveScenario(scenarioIdFromTable = null) {
  if (!currentScenario) {
    const envScenario = process.env.NEXT_PUBLIC_ACTIVE_SCENARIO;
    currentScenarioId = envScenario || DEFAULT_SCENARIO;
    currentScenario = getScenario(currentScenarioId);
  }

  if (scenarioIdFromTable && scenarios[scenarioIdFromTable]) {
    return scenarios[scenarioIdFromTable];
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
  currentScenario = scenarios[id];
  return currentScenario;
}

export function getAvailableScenarios() {
  return Object.entries(scenarios).map(([id, scenario]) => ({
    id,
    name: scenario.metadata?.name || id,
    description: scenario.metadata?.description || "",
    metadata: scenario.metadata,
    edges: scenario.edges || [],
    hindrances: scenario.hindrances || [],
    powers: scenario.powers || {},
    awakeningRules: scenario.awakeningRules || [],
    extraFields: scenario.extraFields || {},
    promptStyles: scenario.promptStyles || {},
    skills: scenario.skills || {},
    loreSections: scenario.loreSections || [],
    adventureGenerator: scenario.adventureGenerator || {},
  }));
}

export function getScenarioSkills(scenarioId = null) {
  const scenario = getScenario(scenarioId);
  return scenario.skills || {};
}

export function getScenarioPromptStyles(scenarioId = null) {
  const scenario = getScenario(scenarioId);
  return scenario.promptStyles || {};
}

export function getScenarioExtraFields(scenarioId = null) {
  const scenario = getScenario(scenarioId);
  return scenario.extraFields || {};
}

export function getScenarioCalculateMaxMana(scenarioId = null) {
  const scenario = getScenario(scenarioId);
  return scenario.calculateMaxMana || null;
}

export default {
  getScenario,
  getActiveScenario,
  setActiveScenario,
  getAvailableScenarios,
  getScenarioSkills,
  getScenarioPromptStyles,
  getScenarioExtraFields,
  getScenarioCalculateMaxMana,
  loadScenarioFromFirestore,
  clearScenarioCache,
  DEFAULT_SCENARIO,
};
