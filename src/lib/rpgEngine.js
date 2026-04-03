/**
 * RPG Engine - Agregador (Facade)
 * Expõe funções unificadas do sistema core (SWADE) e de cenário ativo.
 * Use este arquivo para garantir compatibilidade nos componentes da UI.
 */

import * as SwadeEngine from "./swadeEngine.js";
import {getActiveScenario} from "@/scenarios/index.js";

export const DICE = SwadeEngine.DICE;
export const RANKS = SwadeEngine.RANKS;

// Unifica as perícias base com as exclusivas do cenário ativo
export const SKILLS = (() => {
  const scenario = getActiveScenario();
  return {
    ...SwadeEngine.SKILLS_SWADE,
    ...(scenario.skills || {}),
  };
})();

// ============================================================================
// COMBINA SWADE + CENÁRIO (para UI da ficha)
// ============================================================================

export function getEdges() {
  const scenario = getActiveScenario();
  return [...SwadeEngine.EDGES_SWADE, ...(scenario.edges || [])].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getHindrances() {
  const scenario = getActiveScenario();
  return [...SwadeEngine.HINDRANCES_SWADE, ...(scenario.hindrances || [])].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getPowers() {
  const scenario = getActiveScenario();
  return {
    ...SwadeEngine.POWERS_SWADE,
    ...(scenario.powers || {}),
  };
}

// ============================================================================
// APENAS CENÁRIO (para Admin de Cenários)
// ============================================================================

export function getScenarioEdges() {
  const scenario = getActiveScenario();
  return scenario.edges || [];
}

export function getScenarioHindrances() {
  const scenario = getActiveScenario();
  return scenario.hindrances || [];
}

export function getScenarioPowers() {
  const scenario = getActiveScenario();
  return scenario.powers || {};
}

// ============================================================================
// RE-EXPORTS E MAPEAMENTOS DO SWADE ENGINE
// ============================================================================

export const getRankIndex = SwadeEngine.getRankIndex;
export const diceCost = SwadeEngine.diceCost;
export const compareDice = SwadeEngine.compareDice;
export const validateAttributes = SwadeEngine.validateAttributes;
export const calculateDefense = SwadeEngine.calculateDefense;
export const calculateParry = SwadeEngine.calculateParry;
export const calculateStats = SwadeEngine.calculateStats;

// ============================================================================
// ============================================================================
// ENGINE DO CENÁRIO ATIVO
// ============================================================================

// Função que retorna a função de cálculo de Mana do cenário ativo
// Retorna null se o cenário não tiver essa função (ex: cenários sem Mana)
export function getCalculateMaxMana() {
  const scenario = getActiveScenario();
  return scenario.calculateMaxMana || null;
}

// Função utility que executa o cálculo se a função existir
export function calculateMaxMana(character) {
  const calcFn = getCalculateMaxMana();
  if (!calcFn) return null;
  return calcFn(character);
}

export function getSkillAttribute(skillName) {
  return SKILLS[skillName] || "agilidade";
}

// ============================================================================
// HELPERS GENÉRICOS INTEGRADOS
// ============================================================================

export const filterEdgesByRank = SwadeEngine.filterEdgesByRank;
export const filterEdgesBySource = SwadeEngine.filterEdgesBySource;
export const filterPowersByRank = SwadeEngine.filterPowersByRank;
export const calculateSkillPointCost = SwadeEngine.calculateSkillPointCost;

export function calculateTotalSkillPoints(skills, attributes) {
  return (skills || []).reduce((total, skill) => {
    const attrKey = getSkillAttribute(skill.name);
    const attrDie = attributes[attrKey] || "d4";
    return (
      total + SwadeEngine.calculateSkillPointCost(skill.die || "d4", attrDie)
    );
  }, 0);
}

export const calculateTotalEdgePoints = SwadeEngine.calculateTotalEdgePoints;
export const calculateTotalHindrancePoints = SwadeEngine.calculateTotalHindrancePoints;

// ============================================================================
// EXPORTS PADRÃO
// ============================================================================

export default {
  DICE,
  RANKS,
  SKILLS,
  getEdges,
  getHindrances,
  getPowers,
  getScenarioEdges,
  getScenarioHindrances,
  getScenarioPowers,
  getRankIndex,
  diceCost,
  compareDice,
  validateAttributes,
  calculateDefense,
  calculateParry,
  calculateStats,
  calculateMaxMana,
  getCalculateMaxMana,
  getSkillAttribute,
  filterEdgesByRank,
  filterEdgesBySource,
  filterPowersByRank,
  calculateSkillPointCost,
  calculateTotalSkillPoints,
  calculateTotalEdgePoints,
  calculateTotalHindrancePoints,
};