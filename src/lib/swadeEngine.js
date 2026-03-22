/**
 * Engine auxiliar para regras e conversões do sistema SWADE.
 */

// ============================================================================
// CONSTANTES CORE DO SISTEMA SWADE
// ============================================================================

export const DICE = ["d4", "d6", "d8", "d10", "d12"];

export const RANKS = [
  "Novato",
  "Experiente",
  "Veterano",
  "Heroico",
  "Lendário",
];

export const SKILLS_SWADE = {
  Academias: "intelecto",
  Atletismo: "agilidade",
  Atirar: "agilidade",
  Batalha: "intelecto",
  Cavalgar: "agilidade",
  Ciência: "intelecto",
  Cura: "intelecto",
  Dirigir: "agilidade",
  Eletrônica: "intelecto",
  Fé: "espirito",
  Foco: "espirito",
  Furtividade: "agilidade",
  Hackear: "intelecto",
  Idioma: "intelecto",
  Intimidar: "espirito",
  Lutar: "agilidade",
  Magia: "intelecto",
  Navegar: "agilidade",
  Ocultismo: "intelecto",
  Perceber: "intelecto",
  Performance: "espirito",
  Persuadir: "espirito",
  Pilotar: "agilidade",
  Pesquisar: "intelecto",
  Provocar: "intelecto",
  Reparar: "intelecto",
  Roubar: "agilidade",
  Sobrevivência: "intelecto",
};

// ============================================================================
// FUNÇÕES DE CÁLCULO E VALIDAÇÃO DA FICHA
// ============================================================================

export function getRankIndex(rank) {
  return RANKS.indexOf(rank);
}

export function diceCost(die) {
  const costs = {d4: 0, d6: 1, d8: 2, d10: 3, d12: 4};
  return costs[die] || 0;
}

export function compareDice(d1, d2) {
  return diceCost(d1) - diceCost(d2);
}

export function validateAttributes(attrs) {
  let spent = 0;
  for (const val of Object.values(attrs)) {
    spent += diceCost(val);
  }
  return {
    spent,
    max: 5,
    status: spent > 5 ? "error" : spent === 5 ? "warn" : "ok",
  };
}

export function calculateDefense(char) {
  return 2;
}
export function calculateParry(char) {
  return 2;
}
export function calculateStats(char) {
  return {parry: 2, toughness: 2};
}

export function filterEdgesByRank(rank, edges = []) {
  return edges;
}
export function filterEdgesBySource(source, edges = []) {
  return edges;
}
export function filterPowersByRank(rank, powers = []) {
  return powers;
}

export function calculateSkillPointCost(skillDie, attrDie) {
  const sCost = diceCost(skillDie);
  const aCost = diceCost(attrDie);
  if (sCost === 0) return 0;
  // 1 ponto por tipo de dado até igualar ao atributo. Acima disso, 2 pontos por dado.
  if (sCost <= aCost) return sCost;
  return aCost + (sCost - aCost) * 2;
}

export function calculateTotalEdgePoints(edges) {
  return (edges || []).length * 2;
}

export function calculateTotalHindrancePoints(hindrances) {
  return (hindrances || []).reduce((acc, h) => {
    const type = h.type?.toLowerCase() || "";
    return acc + (type === "maior" || type === "major" ? 2 : 1);
  }, 0);
}

// ============================================================================
// INTEGRAÇÃO COM PARSERS EXTERNOS (Ex: Zadmar)
// ============================================================================

/**
 * Extrai a Resistência (Toughness) e Armadura (Armor) de uma string.
 * Suporta o formato Zadmar. Exemplo: "5 (2)" -> { toughness: 5, armor: 2 }
 */
export function parseZadmarToughness(toughnessRaw) {
  if (!toughnessRaw) return {toughness: 2, armor: 0};

  const match = String(toughnessRaw).match(/(\d+)(?:\s*\(\s*(\d+)\s*\))?/);
  if (match) {
    return {
      toughness: parseInt(match[1], 10),
      armor: match[2] ? parseInt(match[2], 10) : 0,
    };
  }
  return {toughness: parseInt(toughnessRaw, 10) || 2, armor: 0};
}

/**
 * Mapeia atributos que vieram do parser externo para as chaves corretas e padronizadas.
 */
export function normalizeZadmarAttributes(attributes) {
  const defaultAttrs = {
    Agility: "d4",
    Smarts: "d4",
    Spirit: "d4",
    Strength: "d4",
    Vigor: "d4",
  };
  if (!attributes) return defaultAttrs;

  const normalized = {...defaultAttrs};
  for (const [key, value] of Object.entries(attributes)) {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes("agi")) normalized.Agility = value;
    else if (lowerKey.includes("sma") || lowerKey.includes("int"))
      normalized.Smarts = value;
    else if (lowerKey.includes("spi") || lowerKey.includes("esp"))
      normalized.Spirit = value;
    else if (lowerKey.includes("str") || lowerKey.includes("for"))
      normalized.Strength = value;
    else if (lowerKey.includes("vig")) normalized.Vigor = value;
    else normalized[key] = value;
  }

  return normalized;
}
