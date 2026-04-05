/**
 * Definição do Cenário Solo Leveling Medieval
 * @module data/solo-leveling/scenario
 */
import { EDGES_SL } from "../edgesSL";
import { HINDRANCES_SL } from "../hindrancesSL";
import { POWERS_SL } from "../powersSL";
import { AWAKENING_RULES } from "./awakening";
import { LORE_SECTIONS } from "./lore";
import { SKILLS_SL, calculateMaxManaSL } from "./rules";

const soloLevelingScenario = {
	id: "solo-leveling",
	metadata: {
		id: "solo-leveling",
		name: "Solo Leveling Medieval",
		description: "Sistema de RPG inspirado em Solo Leveling com Portais e Dungeons.",
	},
	// Composição de Dados
	edges: EDGES_SL,
	hindrances: HINDRANCES_SL,
	powers: POWERS_SL,
	skills: SKILLS_SL,
	
	// Regras e Lore
	awakeningRules: AWAKENING_RULES,
	loreSections: LORE_SECTIONS,
	
	// Funções de Sistema (Injetadas para o rpgEngine)
	calculateMaxMana: calculateMaxManaSL,
	
	// Objetos de Expansão Futura
	extraFields: {},
	promptStyles: {},
	adventureGenerator: {},
};

export default soloLevelingScenario;
