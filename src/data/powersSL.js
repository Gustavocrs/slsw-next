/**
 * Poderes e Magias Exclusivas - Solo Leveling (SL)
 *
 * ÍNDICE DE REGRAS E CONTEÚDO NESTE ARQUIVO:
 * - Invocações de Sombra (ex: Invocar Sombra Guardiã, Chamar Cavaleiro Sombrio)
 * - Poderes de Classe Rank S (ex: Cura Divina, Tiro Preciso, Forma Bestial)
 * - Magias de Mana (ex: Escudo de Mana, Regeneração Arcana)
 * - Habilidades Únicas (ex: Sentido de Ameaça, Rank-Up Awakened)
 * - Rituais (ex: Consumo de Essência, Ritual de Despertar)
 */

export const POWERS_SL = {
  // ========================================================================
  // INVOCAÇÕES DE SOMBRA
  // ========================================================================
  "Invocar Sombra Guardiã": {
    pp: "3",
    range: "Pessoal",
    duration: "3 rodadas",
    rank: "Experiente",
    description: "Invoca uma sombra guardiã que fight em seu lugar. +2 em Luta.",
  },
  "Chamada do Cavaleiro Sombrio": {
    pp: "5",
    range: "Longo (24m)",
    duration: "5 rodadas",
    rank: "Veterano",
    description: "Invoca um cavaleiro sombrio para fight por você. Pode usar equipamento.",
  },
  "Legião das Sombras": {
    pp: "8",
    range: "Médio (12m)",
    duration: "3 rodadas",
    rank: "Heroico",
    description: "Invoca 1d6+3 sombras soldier para fight por 3 rodadas.",
  },
  "Reino Sombrio": {
    pp: "6",
    range: "Curto (6m)",
    duration: "Concentração",
    rank: "Veterano",
    description: "Cria uma área de escuridão onde suas sombras tem vantagem.",
  },
  "Manto das Sombras": {
    pp: "2",
    range: "Pessoal",
    duration: "1 rodada",
    rank: "Novato",
    description: " envolve-se em sombras. +2 em Furtividade, imune a ataques à distância.",
  },
  "Garras Sombrias": {
    pp: "3",
    range: "Pessoal",
    duration: "3 rodadas",
    rank: "Experiente",
    description: "Armas de sombra aparecem em suas mãos. +2 dano, ignora 2 de armadura.",
  },
  "Dreno de Sombra": {
    pp: "4",
    range: "Curto (6m)",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Ataca alvo, curando 1 Ferimento e causando 1d6 de dano sombrio.",
  },
  "Sombra Expandida": {
    pp: "3",
    range: "Longo (24m)",
    duration: "3 rodadas",
    rank: "Veterano",
    description: "Sua sombra se estende para manipular objetos ou atacar à distância.",
  },
  "Fusão com Sombra": {
    pp: "5",
    range: "Pessoal",
    duration: "1 hora",
    rank: "Heroico",
    description: "Funde-se com sua sombra, podendo mover-se através de superfícies.",
  },
  "Sombra Monarca": {
    pp: "10",
    range: "Longo (24m)",
    duration: "10 rodadas",
    rank: "Lendário",
    description: "Invoca uma versão sombria de si mesmo com metade de seus stats.",
  },
  "Corrente das Trevas": {
    pp: "4",
    range: "Curto (6m)",
    duration: "2 rodadas",
    rank: "Experiente",
    description: "Grilhões sombrios prendem o alvo. -2 em testes para escapar.",
  },
  "Silhueta Fantasma": {
    pp: "2",
    range: "Pessoal",
    duration: "Instantânea",
    rank: "Novato",
    description: "Cria uma cópia sombria de si mesmo para desviar um ataque.",
  },

  // ========================================================================
  // PODERES DE CLASSE RANK S
  // ========================================================================
  "Cura Divina": {
    pp: "4",
    range: "Toque",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Cura 2d6+2 Ferimentos. Não pode ser usado em si mesmo.",
  },
  "Barreira de Luz": {
    pp: "5",
    range: "Curto (6m)",
    duration: "3 rodadas",
    rank: "Experiente",
    description: "Cria uma barreira luminosa que bloqueia ataques e monstros de rank A-.",
  },
  "Tiro Preciso": {
    pp: "3",
    range: "Longo (24m)",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Disparo que ignora armadura e pode atingir pontos fracos. +4 Dano.",
  },
  "Chuva de Flechas": {
    pp: "6",
    range: "Grande (48m)",
    duration: "Instantânea",
    rank: "Veterano",
    description: "Atira 1d6+1 flechas em área. Ataques contra todos os alvos na área.",
  },
  "Forma Bestial": {
    pp: "5",
    range: "Pessoal",
    duration: "5 rodadas",
    rank: "Experiente",
    description: "Transforma-se em besta. +2 Força, +2 Atletismo, garras como arma +2.",
  },
  "Rugido do Alfa": {
    pp: "4",
    range: "Médio (12m)",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Intimidação massiva. Todos os alvos devem testar Resistência ou fogem.",
  },
  "Espada do Vento": {
    pp: "4",
    range: "Médio (12m)",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Corte de vento que atinge todos em linha reta. 2d8+4 dano.",
  },
  "Escudo Divino": {
    pp: "3",
    range: "Toque",
    duration: "3 rodadas",
    rank: "Novato",
    description: "Aplicado em alvo. +4 Armadura até próximo turno.",
  },
  "Fúria do Dragão": {
    pp: "7",
    range: "Curto (6m)",
    duration: "Instantânea",
    rank: "Veterano",
    description: "Ataque devastador em área cônica. 3d10+6 dano, pode Queimar.",
  },
  "Ritual de Ressurreição": {
    pp: "10",
    range: "Toque",
    duration: "1 hora",
    rank: "Heroico",
    description: "Ressuscita um aliado morto dentro de 1 rodada. Custa 1 Essência Rank S.",
  },

  // ========================================================================
  // MAGIAS DE MANA
  // ========================================================================
  "Escudo de Mana": {
    pp: "2",
    range: "Pessoal",
    duration: "3 rodadas",
    rank: "Novato",
    description: "Barreira de mana. +4 Armadura contra ataques mágicos.",
  },
  "Regeneração Arcana": {
    pp: "3",
    range: "Pessoal",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Recupera 2d6 PP. Só pode usar uma vez por dia.",
  },
  "Raio de Mana": {
    pp: "3",
    range: "Longo (24m)",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Dispara um raio de mana concentrada. 2d8+4 dano mágico.",
  },
  "Explosão de Mana": {
    pp: "5",
    range: "Médio (12m)",
    duration: "Instantânea",
    rank: "Veterano",
    description: "Explosão de mana em área. 2d6+4 a todos na área.",
  },
  "Sentido de Mana": {
    pp: "1",
    range: "Pessoal",
    duration: "Concentração",
    rank: "Novato",
    description: "Percebe todas as fontes de mana em Longo alcance.",
  },
  "Armadura de Gelo": {
    pp: "3",
    range: "Pessoal",
    duration: "3 rodadas",
    rank: "Experiente",
    description: "Gelo envolve seu corpo. +4 Armadura, +2 Resistência a Fogo.",
  },
  "Caminho do Vento": {
    pp: "2",
    range: "Pessoal",
    duration: "1 rodada",
    rank: "Experiente",
    description: "Move-se double velocidade, ataques de oportunidade falham.",
  },
  "Toque de Gelo": {
    pp: "2",
    range: "Toque",
    duration: "Instantânea",
    rank: "Novato",
    description: "Toque congelante. 1d6+2 dano, alvo pode ficar Imobilizado por 1 rodada.",
  },
  "Véu de Mana": {
    pp: "4",
    range: "Pessoal",
    duration: "1 hora",
    rank: "Veterano",
    description: "Esconde sua presença mágica. -4 em testes para ser detectado por magia.",
  },
  "Transmutação Menor": {
    pp: "2",
    range: "Curto (6m)",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Transforma objeto simples em outro por short período.",
  },

  // ========================================================================
  // HABILIDADES ÚNICAS
  // ========================================================================
  "Sentido de Ameaça": {
    pp: "1",
    range: "Pessoal",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Percebe a strongest ameaça em Longo alcance. Ganha +2 em Initiative.",
  },
  "Rank-Up Awakened": {
    pp: "8",
    range: "Pessoal",
    duration: "10 rodadas",
    rank: "Heroico",
    description: "Força seu despertar. +2 em todos os testes por 10 rodadas. Exaustivo.",
  },
  "Olho do Caçador": {
    pp: "2",
    range: "Longo (24m)",
    duration: "Concentração",
    rank: "Veterano",
    description: "Pode ver stats e rank de qualquer monstro em Longo alcance.",
  },
  "Instinto de Sobrevivência": {
    pp: "2",
    range: "Pessoal",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Escape automático de armadilhas ou efeitos de área. Uma vez por cena.",
  },
  "Ressurreição do Dragão": {
    pp: "10",
    range: "Pessoal",
    duration: "Special",
    rank: "Lendário",
    description: "Quando morto, revive com 1 Ferimento após 3 rodadas. Raramente ativável.",
  },
  "Toque do Sistema": {
    pp: "3",
    range: "Toque",
    duration: "Instantânea",
    rank: "Experiente",
    description: "Analisa item ou monstro, revelando suas propriedades exatas.",
  },
  "Comando Real": {
    pp: "4",
    range: "Médio (12m)",
    duration: "Instantânea",
    rank: "Heroico",
    description: "Ordem que monstros de rank menor devem testar Resistência ou obedecer.",
  },
  "Aura de Rei": {
    pp: "5",
    range: "Médio (12m)",
    duration: "3 rodadas",
    rank: "Lendário",
    description: "Sua presença força respeito. -2 em testes de hostilidade contra você.",
  },

  // ========================================================================
  // RITUAIS
  // ========================================================================
  "Consumo de Essência": {
    pp: "6",
    range: "Toque",
    duration: "Instantânea",
    rank: "Veterano",
    description: "Consome essência de monstro. Recupera 3d6+3 PP ou 2 Ferimentos.",
  },
  "Ritual de Despertar": {
    pp: "10",
    range: "Pessoal",
    duration: "1 hora",
    rank: "Experiente",
    description: "Ritual de 1 hora para aumentar chance de Despertar de rank.",
  },
  "Ritual de Fusão de Arma": {
    pp: "8",
    range: "Toque",
    duration: "3 rodadas",
    rank: "Heroico",
    description: "Funde essência de monstro com arma. +1d6 dano por 3 rodadas.",
  },
  "Invocação de Portão": {
    pp: "12",
    range: "Special",
    duration: "Special",
    rank: "Lendário",
    description: "Abre portal para dungeon específica. Requer essência de boss.",
  },
  "Ritual de Bloqueio de Dungeon": {
    pp: "8",
    range: "Curto (6m)",
    duration: "1 hora",
    rank: "Heroico",
    description: "Bloqueia saída de dungeon por 1 hora. Requer 3 essências de rank A+.",
  },
  "Metamorfose Sanguínea": {
    pp: "5",
    range: "Pessoal",
    duration: "Instantânea",
    rank: "Veterano",
    description: "Transforma seu sangue em veneno. Proximo ataque causa 1d6+2 adicional.",
  },
  "Ritual de Comunicação Bestial": {
    pp: "3",
    range: "Curto (6m)",
    duration: "1 hora",
    rank: "Experiente",
    description: "Comunica-se com bestias. Pode negociar ou obter informações.",
  },
  "Ritual de Marca Sanguínea": {
    pp: "4",
    range: "Toque",
    duration: "Special",
    rank: "Heroico",
    description: "Marca aliado com seu poder. Pode rastrear ou comunicar à distância.",
  },
  "Ritual de Transferência de Mana": {
    pp: "5",
    range: "Toque",
    duration: "Instantânea",
    rank: "Veterano",
    description: "Transfere PP para outro personagem. Pode causar dano a si mesmo.",
  },
  "Ritual de Invocação Anciã": {
    pp: "15",
    range: "Special",
    duration: "1 dia",
    rank: "Lendário",
    description: "Ritual complexo de 1 dia para invocar boss de outra dungeon.",
  },
};
