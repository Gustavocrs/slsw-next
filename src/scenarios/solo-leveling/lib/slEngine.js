/**
 * Motor de Regras Específicas - Solo Leveling (SL)
 * Extensões, Homebrews e Regras exclusivas do cenário.
 */

export const SKILLS_SL = {
  "Conhecimento (Mana)": "intelecto",
};

export function calculateMaxMana(character) {
  const vigorDie = character.vigor || "d4";
  const vigorVal = parseInt(vigorDie.replace("d", ""), 10) || 4;

  const hasArcaneBackground = (character.vantagens || []).some(
    (v) => v.name === "Antecedente Arcano",
  );

  const hasRunicFlow = (character.vantagens || []).some(
    (v) => v.name === "Fluxo Rúnico",
  );

  const powerPointsEdges = (character.vantagens || []).filter(
    (v) => v.name === "Pontos de Poder",
  ).length;

  const hasLivingCatalyst = (character.vantagens || []).some(
    (v) => v.name === "Catalisador Vivo",
  );

  const base = vigorVal;
  const arcaneBonus = hasArcaneBackground ? 10 : 0;
  const runicFlowBonus = hasRunicFlow ? 5 : 0;
  const edgeBonus =
    powerPointsEdges * 5 + (hasLivingCatalyst ? 10 : 0) + runicFlowBonus;
  const tempBonus = parseInt(character.mana_bonus || 0, 10);

  return base + arcaneBonus + edgeBonus + tempBonus;
}

export default {
  SKILLS_SL,
  calculateMaxMana,
};