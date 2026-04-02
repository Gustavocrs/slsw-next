/**
 * Cenário Solo Leveling - Bundle Export
 * Exporta todo o conteúdo específico do cenário para uso pelo núcleo do sistema.
 */

import EDGES from "./data/edges.js";
import HINDRANCES from "./data/hindrances.js";
import POWERS from "./data/powers.js";
import adventureData from "./data/adventureGenerator.js";
import * as SLEngine from "./lib/slEngine.js";

export const metadata = {
  id: "solo-leveling",
  name: "Solo Leveling",
  description: "Sistema de Caçadores de Portais com Despertar",
};

export const edges = EDGES;
export const hindrances = HINDRANCES;
export const powers = POWERS;
export const adventureGenerator = adventureData;

export const promptStyles = {
  solo_leveling:
    "Anime Style, Solo Leveling Manhwa Art Style, High Quality, Cinematic Lighting.",
  high_fantasy:
    "High Fantasy, Heroic Realism, vibrant colors, magical atmosphere, golden hour lighting, epic scale, detailed digital painting, clean lines, D&D art style, cinematic composition.",
  dark_fantasy:
    "Dark Fantasy, Grimdark, highly detailed, realistic digital painting, dramatic shadows.",
  cyberpunk:
    "Cyberpunk anime style, neon lighting, futuristic, high quality,",
  ghibli:
    "Studio Ghibli style, vibrant colors, magical, detailed anime background, soft lighting",
  comic_book:
    "American Comic Book style, heavy ink lines, dynamic shading, vibrant colors",
};

export const skills = SLEngine.SKILLS_SL;
export const calculateMaxMana = SLEngine.calculateMaxMana;

export const extraFields = {
  despertar_origem: { type: "string", label: "Origem do Despertar" },
  despertar_sensacao: { type: "string", label: "Sensação do Despertar" },
  despertar_afinidade: { type: "string", label: "Afinidade de Mana" },
  despertar_marca: { type: "string", label: "Marca do Despertar" },
  poder_unico_fonte: { type: "string", label: "Fonte do Poder Único" },
  poder_unico_expressao: { type: "string", label: "Expressão do Poder Único" },
  poder_unico_gatilho: { type: "string", label: "Gatilho do Poder Único" },
  mana_atual: { type: "number", label: "Mana Atual" },
  mana_bonus: { type: "number", label: "Bônus de Mana" },
};

export default {
  metadata,
  edges,
  hindrances,
  powers,
  adventureGenerator,
  promptStyles,
  skills,
  calculateMaxMana,
  extraFields,
};