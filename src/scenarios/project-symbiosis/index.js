/**
 * Project Symbiosis - Scenario
 * ATENÇÃO: Este arquivo agora contém apenas METADATA.
 * Todos os dados do cenário (edges, hindrances, powers, loreSections, etc)
 * devem ser carregados do Firestore.
 *
 * Migração: Dados movidos para Firestore via script seed-project-symbiosis.js
 */

// ============================================================================
// DEPRECATED - Mantido apenas para referência e rollback
// ============================================================================

/*
import { manualSections } from "@/data/manualSections";
import awakeningRules from "./awakeningRules.json";
import edges from "./edges.json";
import hindrances from "./hindrances.json";
import { loreSections } from "./loreSections.js";
import powers from "./powers.json";

const scenario = {
  id: "project-symbiosis",
  metadata: {
    id: "project-symbiosis",
    name: "Project Symbiosis",
    description:
      "Neo-Kanto Cyberpunk - S.Y.N.C. substitui Pokébolas. Captura por contrato neural. Escritório sombrio e Alta tecnologia.",
  },
  edges: edges.edges || edges,
  hindrances: hindrances.hindrances || hindrances,
  powers: powers.powers || powers,
  awakeningRules: awakeningRules.awakeningRules || awakeningRules,
  loreSections: loreSections || manualSections,
  extraFields: {},
  promptStyles: {
    system:
      "Você é um especialista em RPG, estilo cyberpunk com elementos Pokémon (S.Y.N.C. em vez de captura). Use termos como Operativo, Bio-Ativo, Créditos (NC$), S.Y.N.C., Neo-Kanto. Seja narrativo e tecnológico.",
    tone: "Cyberpunk escuro, neon, tenso",
    genre: "Ficção científica / Cyberpunk",
  },
  skills: {
    astucia: "Astúcia (Smarts) - Conhecimento tático e operação do SymbioDex",
    espirito:
      "Espírito (Spirit) - Força de vontade para manter Link Neural estável",
    agility: "Agilidade (Agility) - Movimentação urbana e reações",
    strength: "Força (Strength) - Combate corpo-a-corpo",
    fighting: "Lutar (Fighting) - Táticas de combate direto",
    shooting: "Atirar (Shooting) - Armas de fogo e ataques à distância",
    persuasion: "Persuasão (Persuasion) - Negociação e intimidação",
    stealth: "Furtividade (Stealth) - Se mover sem ser detectado",
    survival: "Sobrevivência (Survival) - Rastreamento e ambientação",
    tech: "Tecnologia (Tech) - Hacking e equipamentos",
    faith: "Fé (Faith) - Elementos psíquicos e espirituais",
    arcane: "Arcano (Arcane) - Manipulação de energias especiais",
  },
  calculateMaxMana: null,
};

export default scenario;
*/

// ============================================================================
// NOVO: Apenas metadata - dados completos vindos do Firestore
// ============================================================================

export const metadata = {
  id: "project-symbiosis",
  name: "Project Symbiosis",
  description:
    "Neo-Kanto Cyberpunk - S.Y.N.C. substitui Pokébolas. Captura por contrato neural. Escritório sombrio e Alta tecnologia.",
};

export default metadata;
