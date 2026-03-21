/**
 * Motor Core - Savage Worlds (SWADE)
 * Contém apenas as regras puras do sistema genérico (dados, status, atributos).
 */
import {EDGES} from "@/data/edges";
import {HINDRANCES} from "@/data/hindrances";
import {POWERS} from "@/data/powers";

export const DICE = ["d4", "d6", "d8", "d10", "d12"];
export const RANKS = [
  "Novato",
  "Experiente",
  "Veterano",
  "Heroico",
  "Lendário",
];

export const SKILLS_SWADE = {
  // AGILIDADE
  Atletismo: "agilidade",
  Atirar: "agilidade",
  Dirigir: "agilidade",
  Furtividade: "agilidade",
  Ladinagem: "agilidade",
  Lutar: "agilidade",
  Pilotar: "agilidade",
  Cavar: "agilidade",

  // INTELECTO
  Cura: "intelecto",
  "Conhecimento (Geral)": "intelecto",
  "Conhecimento (Batalha)": "intelecto",
  "Conhecimento (Ocultismo)": "intelecto",
  Investigar: "intelecto",
  Jogo: "intelecto",
  Perceber: "intelecto",
  Sobrevivência: "intelecto",
  Consertar: "intelecto",
  "Ciência Estranha": "intelecto",
  Conjuração: "intelecto",

  // ESPÍRITO
  Intimidar: "espirito",
  Persuadir: "espirito",
  Performance: "espirito",
  Fé: "espirito",
  Foco: "espirito",
};

export function getRankIndex(rankName) {
  const idx = RANKS.indexOf(rankName);
  return idx === -1 ? 0 : idx;
}

export function diceCost(die) {
  return Math.max(0, DICE.indexOf(die));
}

export function compareDice(dieA, dieB) {
  const idxA = DICE.indexOf(dieA);
  const idxB = DICE.indexOf(dieB);
  if (idxA > idxB) return 1;
  if (idxA < idxB) return -1;
  return 0;
}

export function validateAttributes(attrs) {
  const spent = Object.values(attrs).reduce((s, d) => s + diceCost(d), 0);
  const max = 5;
  return {
    spent,
    max,
    status: spent > max ? "error" : spent === max ? "warn" : "ok",
  };
}

export function calculateDefense(vigorDie, armadura = 0) {
  const vigorVal = parseInt((vigorDie || "d4").replace("d", "")) || 4;
  return 2 + Math.floor(vigorVal / 2) + armadura;
}

export function calculateParry(fightingDie, bonus = 0) {
  const fightingVal = parseInt((fightingDie || "d4").replace("d", "")) || 4;
  return 2 + Math.floor(fightingVal / 2) + bonus;
}

export function calculateStats(character) {
  const vigorDie = character.vigor || "d4";
  const fightingDie = character.lutar || "d4";

  const defense = calculateDefense(vigorDie, character.armadura_bonus || 0);
  const parry = calculateParry(fightingDie, character.aparar_bonus || 0);

  return {
    defesa: defense,
    aparar: parry,
    armadura: character.armadura_bonus || 0,
    wounds: character.wounds || 0,
    fatigue: character.fatigue || 0,
  };
}

export function filterEdgesByRank(rank) {
  const rankIdx = getRankIndex(rank);
  return EDGES.filter((e) => getRankIndex(e.rank) <= rankIdx);
}

export function filterEdgesBySource(source) {
  return EDGES.filter((e) => e.source === source);
}

export function filterPowersByRank(rank) {
  const rankIdx = getRankIndex(rank);
  return Object.entries(POWERS)
    .filter(([_, power]) => getRankIndex(power.rank) <= rankIdx)
    .reduce((acc, [name, power]) => ({...acc, [name]: power}), {});
}

export function calculateSkillPointCost(skillDie, attributeDie) {
  const skillIdx = DICE.indexOf(skillDie);
  const attrIdx = DICE.indexOf(attributeDie);

  if (skillIdx === -1 || attrIdx === -1) return 0;

  let cost = 0;
  for (let i = 0; i <= skillIdx; i++) {
    cost += i > attrIdx ? 2 : 1;
  }
  return cost;
}

export function calculateTotalEdgePoints(edges) {
  return (edges || []).length * 2;
}

export function calculateTotalHindrancePoints(hindrances) {
  return (hindrances || []).reduce((total, hind) => {
    const name = typeof hind === "string" ? hind : hind.name;
    const ref = HINDRANCES.find((h) => h.name === name);
    const type = ref ? ref.type : name.includes("Maior") ? "Maior" : "Menor";

    if (type.toLowerCase().includes("maior")) return total - 2;
    if (type.toLowerCase().includes("menor")) return total - 1;
    return total;
  }, 0);
}
