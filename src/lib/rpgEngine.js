/**
 * RPG Engine - Agregador (Facade)
 * Expõe funções unificadas do sistema core (SWADE) e de cenário (SL).
 * Use este arquivo para garantir compatibilidade nos componentes da UI.
 */

import {EDGES} from "@/data/edges";
import {HINDRANCES} from "@/data/hindrances";
import {POWERS} from "@/data/powers";
import * as SwadeEngine from "./swadeEngine";
import * as SLEngine from "./slEngine";

export const DICE = SwadeEngine.DICE;
export const RANKS = SwadeEngine.RANKS;

// Unifica as perícias base com as exclusivas do cenário
export const SKILLS = {
  ...SwadeEngine.SKILLS_SWADE,
  ...SLEngine.SKILLS_SL,
};

export {EDGES, HINDRANCES, POWERS};

// Re-exports e Mapeamentos do SWADE Engine
export const getRankIndex = SwadeEngine.getRankIndex;
export const diceCost = SwadeEngine.diceCost;
export const compareDice = SwadeEngine.compareDice;
export const validateAttributes = SwadeEngine.validateAttributes;
export const calculateDefense = SwadeEngine.calculateDefense;
export const calculateParry = SwadeEngine.calculateParry;
export const calculateStats = SwadeEngine.calculateStats;

// Re-exports e Mapeamentos do SL Engine
export const calculateMaxMana = SLEngine.calculateMaxMana;

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
  EDGES,
  HINDRANCES,
  POWERS,
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
