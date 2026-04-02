/**
 * Scenarios Registry - Gerenciador de Cenários
 * Fornece acesso ao cenário ativo configurado no sistema.
 */

import soloLevelingScenario from "./solo-leveling/index.js";

const scenarios = {
  "solo-leveling": soloLevelingScenario,
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

export function getActiveScenario() {
  if (!currentScenario) {
    const envScenario = process.env.NEXT_PUBLIC_ACTIVE_SCENARIO;
    currentScenarioId = envScenario || DEFAULT_SCENARIO;
    currentScenario = getScenario(currentScenarioId);
  }
  return currentScenario;
}

export function setActiveScenario(id) {
  if (!scenarios[id]) {
    throw new Error(`Cenário "${id}" não existe. Cenários disponíveis: ${Object.keys(scenarios).join(", ")}`);
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
  }));
}

export function getScenarioSkills() {
  const scenario = getActiveScenario();
  return scenario.skills || {};
}

export function getScenarioPromptStyles() {
  const scenario = getActiveScenario();
  return scenario.promptStyles || {};
}

export function getScenarioExtraFields() {
  const scenario = getActiveScenario();
  return scenario.extraFields || {};
}

export function getScenarioCalculateMaxMana() {
  const scenario = getActiveScenario();
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
  DEFAULT_SCENARIO,
};