/**
 * RPG Engine - Agregador (Facade)
 * Expõe funções unificadas do sistema core (SWADE) e de cenário ativo.
 * Use este arquivo para garantir compatibilidade nos componentes da UI.
 *
 * ATENÇÃO: Este módulo requer inicialização async antes de usar dados de cenário.
 */

import { getScenario, loadScenarioFromFirestore } from "@/scenarios/index.js";
import * as SwadeEngine from "./swadeEngine.js";

// ============================================================================
// RE-EXPORTS DO SWADE ENGINE (sempre disponíveis)
// ============================================================================
export const DICE = SwadeEngine.DICE;
export const RANKS = SwadeEngine.RANKS;
export const SKILLS_SWADE = SwadeEngine.SKILLS_SWADE;
export const EDGES_SWADE = SwadeEngine.EDGES_SWADE;
export const HINDRANCES_SWADE = SwadeEngine.HINDRANCES_SWADE;
export const POWERS_SWADE = SwadeEngine.POWERS_SWADE;

export const getRankIndex = SwadeEngine.getRankIndex;
export const diceCost = SwadeEngine.diceCost;
export const compareDice = SwadeEngine.compareDice;
export const validateAttributes = SwadeEngine.validateAttributes;
export const calculateDefense = SwadeEngine.calculateDefense;
export const calculateParry = SwadeEngine.calculateParry;
export const calculateStats = SwadeEngine.calculateStats;
export const filterEdgesByRank = SwadeEngine.filterEdgesByRank;
export const filterEdgesBySource = SwadeEngine.filterEdgesBySource;
export const filterPowersByRank = SwadeEngine.filterPowersByRank;
export const calculateSkillPointCost = SwadeEngine.calculateSkillPointCost;
export const calculateTotalEdgePoints = SwadeEngine.calculateTotalEdgePoints;
export const calculateTotalHindrancePoints =
  SwadeEngine.calculateTotalHindrancePoints;
// calculateTotalSkillPoints must be computed from character skills (not static)
// It is provided as a utility function below (calculateTotalSkillPointsFromCharacter)
export const parseZadmarToughness = SwadeEngine.parseZadmarToughness;
export const normalizeZadmarAttributes = SwadeEngine.normalizeZadmarAttributes;

// ============================================================================
// SKILLS COMBINADAS (SWADE + CENÁRIO) - Mutável via initialize()
// ============================================================================

// Base de perícias (SWADE) - sempre disponível
const SKILLS_BASE = { ...SwadeEngine.SKILLS_SWADE };

// Objeto exportado que será enriquecido com skills do cenário após initialize()
// Componentes que usam `import { SKILLS }` verão este objeto (mutável)
export const SKILLS = SKILLS_BASE;

// Cache interno
let cachedSKILLS = null;
let cachedScenario = null;

/**
 * Inicializa o engine carregando o cenário ativo
 * Adiciona as skills do cenário ao objeto SKILLS exportado
 * @param {string} scenarioId - ID do cenário (opcional, usa ativo se não fornecido)
 */
export async function initialize(scenarioId) {
  if (scenarioId) {
    cachedScenario = await loadScenarioFromFirestore(scenarioId);
  } else {
    cachedScenario = await loadScenarioFromFirestore(
      process.env.NEXT_PUBLIC_ACTIVE_SCENARIO || "solo-leveling",
    );
  }

  // Mesclar skills no objeto SKILLS exportado (mutação controlada)
  const scenarioSkills = cachedScenario?.skills || {};
  Object.keys(scenarioSkills).forEach((key) => {
    SKILLS_BASE[key] = scenarioSkills[key];
  });

  cachedSKILLS = { ...SKILLS_BASE };

  return { scenario: cachedScenario, skills: cachedSKILLS };
}

/**
 * Retorna as perícias combinadas (SWADE + cenário)
 * Use para casos async onde initialize() ainda não foi chamado.
 */
export async function getSkills() {
  if (cachedSKILLS) {
    return cachedSKILLS;
  }
  // Auto-initialize se ainda não foi chamado
  const result = await initialize();
  return result.skills;
}

/**
 * Retorna edges combinados (SWADE + cenário)
 */
export function getEdges() {
  const scenario = getScenario();
  const scenarioEdges = scenario?.edges || [];

  return [...SwadeEngine.EDGES_SWADE, ...scenarioEdges].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/**
 * Retorna hindrances combinados (SWADE + cenário)
 */
export function getHindrances() {
  const scenario = getScenario();
  const scenarioHindrances = scenario?.hindrances || [];

  return [...SwadeEngine.HINDRANCES_SWADE, ...scenarioHindrances].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/**
 * Retorna powers combinados (SWADE + cenário)
 */
export function getPowers() {
  const scenario = getScenario();
  const scenarioPowers = scenario?.powers || {};

  return {
    ...SwadeEngine.POWERS_SWADE,
    ...scenarioPowers,
  };
}

/**
 * Retorna a função calculateMaxMana do cenário atual.
 * Se o cenário não has a função, retorna null.
 */
export function getCalculateMaxMana() {
  const scenario = getScenario();
  const fn = scenario?.calculateMaxMana;

  if (typeof fn === "function") {
    return fn;
  }

  // Se for string (armazenada no Firestore), tentar reconstruir
  if (typeof fn === "string") {
    try {
      // WARNING: eval é perigoso, mas necessário para reconstruir functions armazenadas
      // Como o cenário é de confiança (admin), aceitável
      return new Function("character", `return ${fn}`);
    } catch (e) {
      console.error("Erro ao reconstruir calculateMaxMana:", e);
      return null;
    }
  }

  return null;
}

/**
 * Calcula o mana máximo para um personagem usando a função do cenário atual.
 * @param {Object} character - Dados do personagem
 * @returns {number} Mana máximo
 */
export function calculateMaxMana(character) {
  const calculateFn = getCalculateMaxMana();
  if (calculateFn) {
    return calculateFn(character);
  }

  // Fallback: calcular baseado em Vigor se disponível
  const vigorDie = character.atributos?.vigor || "d6";
  const vigorValue = parseInt(vigorDie.replace("d", "")) || 6;
  return vigorValue;
}

/**
 * Retorna getSkillAttribute (paraSheetView)
 */
export function getSkillAttribute(skillName) {
  // Primeiro, verificar se a skill está nas skills combinadas
  const allSkills = { ...SKILLS_SWADE, ...SKILLS };
  const skill = allSkills[skillName];
  if (skill) {
    return skill;
  }

  // Fallback: calcular com base no nome da skill (heurística simples)
  if (
    skillName.includes("Intelecto") ||
    skillName.includes("Academia") ||
    skillName.includes("Ciência") ||
    skillName.includes("Magia") ||
    skillName.includes("Ocultismo")
  ) {
    return "intelecto";
  }
  if (
    skillName.includes("Agilidade") ||
    skillName.includes("Atirar") ||
    skillName.includes("Furtividade") ||
    skillName.includes("Lutar") ||
    skillName.includes("Atletismo")
  ) {
    return "agilidade";
  }
  if (
    skillName.includes("Espírito") ||
    skillName.includes("Fé") ||
    skillName.includes("Persuadir") ||
    skillName.includes("Intimidar")
  ) {
    return "espirito";
  }

  return "intelecto"; // default
}

/**
 * Calcula o custo total de pontos de perícias de um personagem
 * @param {Object} character - Dados do personagem
 * @returns {number} Total de pontos gastos em perícias
 */
export function calculateTotalSkillPoints(character) {
  const skills = character?.pericias || {};
  const attributes = character?.atributos || {};
  let total = 0;

  for (const [skillName, skillDie] of Object.entries(skills)) {
    const attrDie = attributes[getSkillAttribute(skillName)] || "d4";
    total += calculateSkillPointCost(skillDie, attrDie);
  }

  return total;
}

// ============================================================================
// RE-EXPORTS DO SCENARIO REGISTRY
// ============================================================================

export { getScenario, loadScenarioFromFirestore } from "@/scenarios/index.js";

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Retorna o cenário completo (com dados do Firestore se disponível)
 */
export function getActiveScenario() {
  return getScenario();
}

/**
 * Limpa cache interno do engine
 */
export function clearCache() {
  // Reset SKILLS para base apenas
  Object.keys(SKILLS).forEach((key) => {
    if (!SwadeEngine.SKILLS_SWADE[key]) {
      delete SKILLS[key];
    }
  });
  // Re-add base (garante que não perdemos)
  Object.assign(SKILLS, SKILLS_BASE);

  cachedSKILLS = null;
  cachedScenario = null;
}
