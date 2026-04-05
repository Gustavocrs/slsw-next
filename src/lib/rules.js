/**
 * Regras de Negócio e Cálculos - Solo Leveling
 * @module data/solo-leveling/rules
 */

export const SKILLS_SL = {
	"Conhecimento (Mana)": "intelecto",
};

/**
 * Calcula o Mana Máximo baseado nas regras de Solo Leveling
 * @param {Object} character - Objeto do personagem
 * @returns {number} Valor total de Mana
 */
export const calculateMaxManaSL = (character) => {
	const vigorDie = character.atributos?.vigor || "d4";
	const vigorVal = parseInt(vigorDie.replace("d", ""), 10) || 4;

	const advantages = character.vantagens || [];
	
	const hasArcaneBackground = advantages.some(v => v.name === "Antecedente Arcano");
	const hasRunicFlow = advantages.some(v => v.name === "Fluxo Rúnico");
	const hasLivingCatalyst = advantages.some(v => v.name === "Catalisador Vivo");
	const powerPointsCount = advantages.filter(v => v.name === "Pontos de Poder").length;

	let total = vigorVal;
	if (hasArcaneBackground) total += 10;
	if (hasRunicFlow) total += 5;
	if (hasLivingCatalyst) total += 10;
	total += (powerPointsCount * 5);
	
	const tempBonus = parseInt(character.mana_bonus || 0, 10);
	return total + tempBonus;
};
