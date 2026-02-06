/**
 * RPG Engine - SWADE + Solo Leveling
 * Lógica de cálculo de dados, perícias, vantagens e complicações
 */

export const DICE = ["d4", "d6", "d8", "d10", "d12"];
export const RANKS = [
  "Novato",
  "Experiente",
  "Veterano",
  "Heroico",
  "Lendário",
];

export const SKILLS = {
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
  "Conhecimento (Mana)": "intelecto",
  Investigar: "intelecto",
  Jogo: "intelecto",
  Perceber: "intelecto",
  Sobrevivência: "intelecto",
  Consertar: "intelecto",
  "Ciência Estranha": "intelecto",
  Conjuraração: "intelecto",

  // ESPÍRITO
  Intimidar: "espirito",
  Persuadir: "espirito",
  Performance: "espirito",
  Fé: "espirito",
  Foco: "espirito",
};

export const EDGES = [
  // --- SWADE: ANTECEDENTES ---
  { name: "Alerta", rank: "Novato", source: "SWADE" },
  { name: "Ambidestro", rank: "Novato", source: "SWADE" },
  { name: "Antecedente Arcano", rank: "Novato", source: "SWADE" },
  { name: "Aristocrata", rank: "Novato", source: "SWADE" },
  { name: "Atraente", rank: "Novato", source: "SWADE" },
  { name: "Muito Atraente", rank: "Novato", source: "SWADE" },
  { name: "Brutamontes", rank: "Novato", source: "SWADE" },
  { name: "Carismático", rank: "Novato", source: "SWADE" },
  { name: "Corajoso", rank: "Novato", source: "SWADE" },
  { name: "Cura Rápida", rank: "Novato", source: "SWADE" },
  { name: "Fama", rank: "Novato", source: "SWADE" },
  { name: "Linguista", rank: "Novato", source: "SWADE" },
  { name: "Pés Ligeiros", rank: "Novato", source: "SWADE" },
  { name: "Podre de Rico", rank: "Novato", source: "SWADE" },
  { name: "Rápido", rank: "Novato", source: "SWADE" },
  { name: "Rico", rank: "Novato", source: "SWADE" },
  { name: "Sorte", rank: "Novato", source: "SWADE" },
  { name: "Sorte Grande", rank: "Novato", source: "SWADE" },
  { name: "Vigoroso", rank: "Novato", source: "SWADE" },

  // --- SWADE: COMBATE ---
  { name: "Arma de Estimação", rank: "Novato", source: "SWADE" },
  { name: "Arma de Estimação Aprimorada", rank: "Veterano", source: "SWADE" },
  { name: "Artista Marcial", rank: "Novato", source: "SWADE" },
  { name: "Atirador de Elite", rank: "Experiente", source: "SWADE" },
  { name: "Bloqueio", rank: "Experiente", source: "SWADE" },
  { name: "Bloqueio Aprimorado", rank: "Veterano", source: "SWADE" },
  { name: "Calculista", rank: "Novato", source: "SWADE" },
  { name: "Contra-Ataque", rank: "Experiente", source: "SWADE" },
  { name: "Contra-Ataque Aprimorado", rank: "Veterano", source: "SWADE" },
  { name: "Duas Armas", rank: "Novato", source: "SWADE" },
  { name: "Duro de Matar", rank: "Novato", source: "SWADE" },
  { name: "Muito Duro de Matar", rank: "Veterano", source: "SWADE" },
  { name: "Esquiva", rank: "Experiente", source: "SWADE" },
  { name: "Esquiva Aprimorada", rank: "Veterano", source: "SWADE" },
  { name: "Finta", rank: "Novato", source: "SWADE" },
  { name: "Fogo Rápido", rank: "Experiente", source: "SWADE" },
  { name: "Fogo Rápido Aprimorado", rank: "Veterano", source: "SWADE" },
  { name: "Frenesi", rank: "Experiente", source: "SWADE" },
  { name: "Frenesi Aprimorado", rank: "Veterano", source: "SWADE" },
  { name: "Improvisador", rank: "Experiente", source: "SWADE" },
  { name: "Instinto Assassino", rank: "Experiente", source: "SWADE" },
  { name: "Mãos Firmes", rank: "Novato", source: "SWADE" },
  { name: "Matador de Gigantes", rank: "Veterano", source: "SWADE" },
  { name: "Nervos de Aço", rank: "Novato", source: "SWADE" },
  { name: "Nervos de Aço Aprimorado", rank: "Veterano", source: "SWADE" },
  { name: "Primeiro Ataque", rank: "Novato", source: "SWADE" },
  { name: "Primeiro Ataque Aprimorado", rank: "Heroico", source: "SWADE" },
  { name: "Pugilista", rank: "Novato", source: "SWADE" },
  { name: "Queixo de Ferro", rank: "Novato", source: "SWADE" },
  { name: "Reflexos de Combate", rank: "Experiente", source: "SWADE" },
  { name: "Retirada", rank: "Novato", source: "SWADE" },
  { name: "Rock and Roll!", rank: "Experiente", source: "SWADE" },
  { name: "Sangue Frio", rank: "Experiente", source: "SWADE" },
  { name: "Sem Piedade", rank: "Experiente", source: "SWADE" },
  { name: "Tiro Duplo", rank: "Experiente", source: "SWADE" },
  { name: "Tiro Mortal", rank: "Heroico", source: "SWADE" },
  { name: "Varrida", rank: "Novato", source: "SWADE" },
  { name: "Varrida Aprimorada", rank: "Veterano", source: "SWADE" },

  // --- SWADE: LIDERANÇA ---
  { name: "Comando", rank: "Novato", source: "SWADE" },
  { name: "Fervor", rank: "Veterano", source: "SWADE" },
  { name: "Inspirar", rank: "Experiente", source: "SWADE" },
  { name: "Líder Nato", rank: "Novato", source: "SWADE" },
  { name: "Presença de Comando", rank: "Novato", source: "SWADE" },
  { name: "Segurar a Linha", rank: "Experiente", source: "SWADE" },
  { name: "Tático", rank: "Experiente", source: "SWADE" },

  // --- SWADE: PODER ---
  { name: "Artífice", rank: "Experiente", source: "SWADE" },
  { name: "Canalização", rank: "Experiente", source: "SWADE" },
  { name: "Concentração", rank: "Experiente", source: "SWADE" },
  { name: "Dreno de Alma", rank: "Veterano", source: "SWADE" },
  { name: "Engenhoqueiro", rank: "Novato", source: "SWADE" },
  { name: "Guerreiro Sagrado/Profano", rank: "Novato", source: "SWADE" },
  { name: "Mago", rank: "Novato", source: "SWADE" },
  { name: "Mentalista", rank: "Novato", source: "SWADE" },
  { name: "Novos Poderes", rank: "Novato", source: "SWADE" },
  { name: "Pontos de Poder", rank: "Novato", source: "SWADE" },
  { name: "Recarga Rápida", rank: "Experiente", source: "SWADE" },
  { name: "Recarga Aprimorada", rank: "Veterano", source: "SWADE" },
  { name: "Surto de Poder", rank: "Heroico", source: "SWADE" },

  // --- SWADE: PROFISSIONAL ---
  { name: "Acrobata", rank: "Novato", source: "SWADE" },
  { name: "Ás", rank: "Novato", source: "SWADE" },
  { name: "Consertar Tudo", rank: "Novato", source: "SWADE" },
  { name: "Erudito", rank: "Novato", source: "SWADE" },
  { name: "Faz-Tudo", rank: "Novato", source: "SWADE" },
  { name: "Investigador", rank: "Novato", source: "SWADE" },
  { name: "Ladino", rank: "Novato", source: "SWADE" },
  { name: "Mateiro", rank: "Novato", source: "SWADE" },
  { name: "McGyver", rank: "Novato", source: "SWADE" },

  // --- SWADE: SOCIAL ---
  { name: "Ameaçador", rank: "Novato", source: "SWADE" },
  { name: "Apoio", rank: "Novato", source: "SWADE" },
  { name: "Conexões", rank: "Novato", source: "SWADE" },
  { name: "Confiável", rank: "Novato", source: "SWADE" },
  { name: "Elo Comum", rank: "Heroico", source: "SWADE" },
  { name: "Humilhar", rank: "Novato", source: "SWADE" },
  { name: "Manha", rank: "Novato", source: "SWADE" },
  { name: "Provocar", rank: "Novato", source: "SWADE" },
  { name: "Retrucar", rank: "Novato", source: "SWADE" },
  { name: "Vontade de Ferro", rank: "Novato", source: "SWADE" },

  // --- SWADE: ESTRANHO ---
  { name: "Campeão", rank: "Novato", source: "SWADE" },
  { name: "Chi", rank: "Veterano", source: "SWADE" },
  { name: "Coragem Líquida", rank: "Novato", source: "SWADE" },
  { name: "Curandeiro", rank: "Novato", source: "SWADE" },
  { name: "Elo Animal", rank: "Novato", source: "SWADE" },
  { name: "Mestre das Feras", rank: "Novato", source: "SWADE" },
  { name: "Senso de Perigo", rank: "Novato", source: "SWADE" },
  { name: "Sucateiro", rank: "Novato", source: "SWADE" },

  // SL Medieval Específicas
  { name: "Ataque Fantasma", rank: "Experiente", source: "SL" },
  { name: "Marca de Predador", rank: "Experiente", source: "SL" },
  { name: "Sangue Frio (SL)", rank: "Experiente", source: "SL" },
  { name: "Corpo Disciplinado", rank: "Veterano", source: "SL" },
  { name: "Portador da Centelha", rank: "Veterano", source: "SL" },
  { name: "Velocidade Guiada pela Mana", rank: "Veterano", source: "SL" },
  { name: "Instinto Arcano", rank: "Veterano", source: "SL" },
  { name: "Arremesso Perfeito", rank: "Heroico", source: "SL" },
  { name: "Golpe Cortante", rank: "Heroico", source: "SL" },
  { name: "Reflexos de Caçador", rank: "Heroico", source: "SL" },
  { name: "Sangue Arcano", rank: "Heroico", source: "SL" },
  { name: "Compasso Sombrio", rank: "Heroico", source: "SL" },
  { name: "Furor de Guerra", rank: "Lendário", source: "SL" },
  { name: "Alma de Aço", rank: "Lendário", source: "SL" },
  { name: "Conduíte de Poder", rank: "Lendário", source: "SL" },
  { name: "Mestre da Batalha Interior", rank: "Lendário", source: "SL" },
  { name: "Caminho do Caçador Alfa", rank: "Lendário", source: "SL" },
  { name: "Conjurador Rápido", rank: "Experiente", source: "SL" },
  { name: "Cura Abençoada", rank: "Novato", source: "SL" },
  { name: "Disparo Preciso", rank: "Novato", source: "SL" },
  { name: "Domínio do Foco", rank: "Veterano", source: "SL" },
  { name: "Escudo de Ferro Vivo", rank: "Experiente", source: "SL" },
  { name: "Firmeza do Caçador", rank: "Novato", source: "SL" },
  { name: "Fluxo Rúnico", rank: "Novato", source: "SL" },
  { name: "Fúria", rank: "Novato", source: "SL" },
  { name: "Garras de Mana", rank: "Novato", source: "SL" },
  { name: "Golpe Rúnico", rank: "Novato", source: "SL" },
  { name: "Impacto Rúnico", rank: "Novato", source: "SL" },
  { name: "Invocador", rank: "Novato", source: "SL" },
  { name: "Lutador", rank: "Novato", source: "SL" },
  { name: "Mestre das Runas", rank: "Veterano", source: "SL" },
  { name: "Percepção Aguçada", rank: "Novato", source: "SL" },
  { name: "Rastejar nas Sombras", rank: "Novato", source: "SL" },
  { name: "Resistente", rank: "Novato", source: "SL" },

  // Arquétipos
  { name: "Quebra-Defesas", rank: "Experiente", source: "SL" },
  { name: "Golpe Sísmico", rank: "Veterano", source: "SL" },
  { name: "Corpo Indomável", rank: "Heroico", source: "SL" },
  { name: "Avatar do Impacto", rank: "Lendário", source: "SL" },
  { name: "Escrita Rúnica", rank: "Novato", source: "SL" },
  { name: "Amplificação Arcana", rank: "Experiente", source: "SL" },
  { name: "Campo Rúnico", rank: "Veterano", source: "SL" },
  { name: "Catalisador Vivo", rank: "Heroico", source: "SL" },
  { name: "Arcano Absoluto", rank: "Lendário", source: "SL" },
  { name: "Elo Sombrio", rank: "Novato", source: "SL" },
  { name: "Comando Duplo", rank: "Experiente", source: "SL" },
  { name: "Horda Viva", rank: "Veterano", source: "SL" },
  { name: "Entidade Maior", rank: "Heroico", source: "SL" },
  { name: "Senhor das Criaturas", rank: "Lendário", source: "SL" },
  { name: "Luz Purificadora", rank: "Experiente", source: "SL" },
  { name: "Aura Restauradora", rank: "Veterano", source: "SL" },
  { name: "Milagre Menor", rank: "Heroico", source: "SL" },
  { name: "Avatar da Luz", rank: "Lendário", source: "SL" },
  { name: "Forma Animal", rank: "Novato", source: "SL" },
  { name: "Presas Naturais", rank: "Experiente", source: "SL" },
  { name: "Pele Espessa", rank: "Veterano", source: "SL" },
  { name: "Fera Superior", rank: "Heroico", source: "SL" },
  { name: "Espírito Ancestral", rank: "Lendário", source: "SL" },
  { name: "Postura Defensiva", rank: "Novato", source: "SL" },
  { name: "Provocação Instintiva", rank: "Experiente", source: "SL" },
  { name: "Muralha Viva", rank: "Veterano", source: "SL" },
  { name: "Guardião Absoluto", rank: "Heroico", source: "SL" },
  { name: "Bastilha Imortal", rank: "Lendário", source: "SL" },
].sort((a, b) => a.name.localeCompare(b.name));

export const HINDRANCES = [
  "Analfabeto (Menor)",
  "Anêmico (Menor)",
  "Arrogante (Maior)",
  "Boca Grande (Menor)",
  "Cabeça-Quente (Menor/Maior)",
  "Cauteloso (Menor)",
  "Cego (Maior)",
  "Código de Honra (Maior)",
  "Confiante Demais (Maior)",
  "Covarde (Maior)",
  "Curto (Menor)",
  "Curioso (Maior)",
  "Delirante (Menor/Maior)",
  "Desagradável (Menor)",
  "Desastrado (Menor)",
  "Desajeitado (Menor)",
  "Desejo de Morte (Menor)",
  "Desleal (Menor)",
  "Determinado (Menor/Maior)",
  "Duro de Ouvido (Menor/Maior)",
  "Feio (Menor)",
  "Forasteiro (Menor)",
  "Frágil (Menor/Maior)",
  "Fúria Incontrolável (Maior)",
  "Ganancioso (Menor/Maior)",
  "Hábito (Menor/Maior)",
  "Heroico (Maior)",
  "Hesitante (Menor)",
  "Idoso (Maior)",
  "Impulsivo (Maior)",
  "Inimigo (Menor/Maior)",
  "Invejoso (Menor/Maior)",
  "Leal (Menor)",
  "Ligação com a Natureza (Maior)",
  "Má Sorte (Maior)",
  "Maneta (Maior)",
  "Mudo (Maior)",
  "Não Nada (Menor)",
  "Obcecado (Menor/Maior)",
  "Obeso (Menor)",
  "Olhos Ruins (Menor/Maior)",
  "Obrigação (Menor/Maior)",
  "Pacifista (Menor/Maior)",
  "Peculiaridade (Menor)",
  "Pequeno (Menor)",
  "Perneta (Maior)",
  "Pobreza (Menor)",
  "Procurado (Menor/Maior)",
  "Reservado (Menor)",
  "Sanguinário (Maior)",
  "Segredo (Menor/Maior)",
  "Sem Noção (Menor)",
  "Suscetível (Menor)",
  "Solitário (Menor)",
  "Teimoso (Menor)",
  "Vingativo (Menor/Maior)",
].sort();

export const POWERS = {
  Adivinhação: {
    pp: "1",
    range: "Pessoal",
    duration: "Instantânea",
    rank: "Novato",
  },
  "Amigo das Feras": {
    pp: "1+",
    range: "Astúcia x 18m",
    duration: "10 minutos",
    rank: "Novato",
  },
  "Andar nas Paredes": {
    pp: "2",
    range: "Toque",
    duration: "5 rodadas",
    rank: "Novato",
  },
  "Aprimorar/Reduzir Característica": {
    pp: "2",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Novato",
  },
  Armadura: {pp: "2", range: "Toque", duration: "5 rodadas", rank: "Novato"},
  Atordoar: {pp: "2", range: "Cone", duration: "Instantânea", rank: "Novato"},
  Barreira: {
    pp: "2",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Experiente",
  },
  Cavar: {pp: "3", range: "Astúcia", duration: "5 rodadas", rank: "Novato"},
  Cegueira: {
    pp: "2",
    range: "Astúcia",
    duration: "Instantânea",
    rank: "Novato",
  },
  Confusão: {
    pp: "1",
    range: "Astúcia",
    duration: "Instantânea",
    rank: "Novato",
  },
  "Crescimento/Encolhimento": {
    pp: "2+",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Experiente",
  },
  Cura: {pp: "3", range: "Toque", duration: "Instantânea", rank: "Novato"},
  "Dano em Campo": {
    pp: "2",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Experiente",
  },
  Deflexão: {pp: "2", range: "Toque", duration: "5 rodadas", rank: "Novato"},
  "Detectar/Ocultar Arcano": {
    pp: "2",
    range: "Visão",
    duration: "5 rodadas (Detectar) / 1 hora (Ocultar)",
    rank: "Novato",
  },
  Disfarce: {
    pp: "2",
    range: "Pessoal",
    duration: "10 minutos",
    rank: "Novato",
  },
  Dissipar: {
    pp: "1",
    range: "Astúcia",
    duration: "Instantânea",
    rank: "Experiente",
  },
  "Drenar Pontos de Poder": {
    pp: "2",
    range: "Astúcia",
    duration: "Instantânea",
    rank: "Veterano",
  },
  "Elemental (Manipular Elementos)": {
    pp: "1",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Novato",
  },
  Emaranhar: {
    pp: "2",
    range: "Astúcia",
    duration: "Instantânea",
    rank: "Novato",
  },
  Explosão: {
    pp: "2",
    range: "Astúcia x 2",
    duration: "Instantânea",
    rank: "Novato",
  },
  "Fala Mental": {
    pp: "1",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Novato",
  },
  Fantoche: {
    pp: "3",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Veterano",
  },
  "Falar Idiomas": {
    pp: "1",
    range: "Toque",
    duration: "10 minutos",
    rank: "Novato",
  },
  Ferir: {pp: "2", range: "Toque", duration: "Instantânea", rank: "Novato"},
  Golpe: {pp: "2", range: "Toque", duration: "5 rodadas", rank: "Novato"},
  Ilusão: {pp: "3", range: "Astúcia", duration: "5 rodadas", rank: "Novato"},
  Intangibilidade: {
    pp: "5",
    range: "Pessoal",
    duration: "5 rodadas",
    rank: "Heroico",
  },
  Invisibilidade: {
    pp: "5",
    range: "Pessoal",
    duration: "5 rodadas",
    rank: "Experiente",
  },
  "Invocar Aliado": {
    pp: "2+",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Novato",
  },
  "Leitura Mental": {
    pp: "2",
    range: "Astúcia",
    duration: "Instantânea",
    rank: "Novato",
  },
  "Luz/Escuridão": {
    pp: "2",
    range: "Astúcia",
    duration: "10 minutos",
    rank: "Novato",
  },
  Medo: {pp: "2", range: "Astúcia", duration: "Instantânea", rank: "Novato"},
  Proteção: {
    pp: "1",
    range: "Astúcia",
    duration: "5 rodadas",
    rank: "Novato",
  },
  Raio: {
    pp: "1",
    range: "Astúcia x 2",
    duration: "Instantânea",
    rank: "Novato",
  },
  Ressurreição: {
    pp: "30",
    range: "Toque",
    duration: "Instantânea",
    rank: "Heroico",
  },
  Som: {
    pp: "1",
    range: "Astúcia x 5",
    duration: "Instantânea",
    rank: "Novato",
  },
  Telecinesia: {
    pp: "5",
    range: "Astúcia x 2",
    duration: "5 rodadas",
    rank: "Experiente",
  },
  Teleporte: {
    pp: "2",
    range: "Astúcia x 2",
    duration: "Instantânea",
    rank: "Experiente",
  },
  Voo: {pp: "3", range: "Toque", duration: "5 rodadas", rank: "Veterano"},
  Zumbi: {pp: "3", range: "Astúcia", duration: "1 hora", rank: "Veterano"},
};

/**
 * Utilitários de cálculo
 */

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
  const vigorVal = parseInt(vigorDie.replace("d", "")) || 4;
  return 2 + Math.floor(vigorVal / 2) + armadura;
}

export function calculateParry(fightingDie, bonus = 0) {
  const fightingVal = parseInt(fightingDie.replace("d", "")) || 4;
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

export function getSkillAttribute(skillName) {
  return SKILLS[skillName] || "agilidade";
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
    .reduce((acc, [name, power]) => ({ ...acc, [name]: power }), {});
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

export function calculateTotalSkillPoints(skills, attributes) {
  return (skills || []).reduce((total, skill) => {
    const attrKey = getSkillAttribute(skill.name);
    const attrDie = attributes[attrKey] || "d4";
    return total + calculateSkillPointCost(skill.die || "d4", attrDie);
  }, 0);
}

export function calculateTotalEdgePoints(edges) {
  return (edges || []).length * 2;
}

export function calculateTotalHindrancePoints(hindrances) {
  return (hindrances || []).reduce((total, hind) => {
    const name = typeof hind === "string" ? hind : hind.name;
    if (name.toLowerCase().includes("maior")) return total - 2;
    if (name.toLowerCase().includes("menor")) return total - 1;
    return total;
  }, 0);
}

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
  getSkillAttribute,
  filterEdgesByRank,
  filterEdgesBySource,
  filterPowersByRank,
  calculateSkillPointCost,
  calculateTotalSkillPoints,
  calculateTotalEdgePoints,
  calculateTotalHindrancePoints,
};
