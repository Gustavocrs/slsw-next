/**
 * RPG Engine - Agregador (Facade)
 * Expõe funções unificadas do sistema core (SWADE) e de cenário ativo.
 * Use este arquivo para garantir compatibilidade nos componentes da UI.
 */

import {getActiveScenario} from "@/scenarios/index.js";
import * as SwadeEngine from "./swadeEngine.js";

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

// Getter dinâmico para dados do cenário (suporta hot-swap)
export function getEdges() {
  const scenario = getActiveScenario();
  return [...(scenario.edges || [])].sort((a, b) => a.name.localeCompare(b.name));
}

export function getHindrances() {
  const scenario = getActiveScenario();
  return [...(scenario.hindrances || [])].sort((a, b) => a.name.localeCompare(b.name));
}

export function getPowers() {
  const scenario = getActiveScenario();
  return scenario.powers || {};
}

// Re-exports e Mapeamentos do SWADE Engine
export const getRankIndex = SwadeEngine.getRankIndex;
export const diceCost = SwadeEngine.diceCost;
export const compareDice = SwadeEngine.compareDice;
export const validateAttributes = SwadeEngine.validateAttributes;
export const calculateDefense = SwadeEngine.calculateDefense;
export const calculateParry = SwadeEngine.calculateParry;
export const calculateStats = SwadeEngine.calculateStats;

// Re-exports do Cenário Ativo
export const calculateMaxMana = (() => {
  const scenario = getActiveScenario();
  return scenario.calculateMaxMana || null;
})();

export function getSkillAttribute(skillName) {
  return SKILLS[skillName] || "agilidade";
}

// Helpers Genéricos Integrados
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
export const calculateTotalHindrancePoints =
  SwadeEngine.calculateTotalHindrancePoints;

export default {
  DICE,
  RANKS,
  SKILLS,
  getEdges,
  getHindrances,
  getPowers,
  getRankIndex,
  diceCost,
  compareDice,
  validateAttributes,
  calculateDefense,
  calculateParry,
  calculateStats,
  calculateMaxMana,
  getSkillAttribute,
  filterEdgesByRank,
  filterEdgesBySource,
  filterPowersByRank,
  calculateSkillPointCost,
  calculateTotalSkillPoints,
  calculateTotalEdgePoints,
  calculateTotalHindrancePoints,
};