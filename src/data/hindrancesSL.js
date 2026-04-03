/**
 * Complicações Solo Leveling (SL)
 *
 * ÍNDICE DE REGRAS E CONTEÚDO NESTE ARQUIVO:
 * - Complicações de Marca e Feridas (ex: Marca do Monarca, Ferida Aberta)
 * - Complicações de Corrupção (ex: Sombra Corrompida, Perda de Humanidade)
 * - Complicações de Caça e Recompensas (ex: Alvo de Recompensa)
 * - Complicações de Vícios (ex: Dependente de Essência)
 * - Complicações Psicológicas (ex: Trauma de Dungeon, Medo de Rank-Up)
 * 
 * Severity: Minor (menor) = -1, Major (maior) = -2 ou mais
 */

export const HINDRANCES_SL = [
  // ========================================================================
  // MARCAS E FERIDAS
  // ========================================================================
  {
    name: "Marca do Monarca",
    rank: "Heroico",
    source: "SL",
    severity: "Maior",
    description: "Um dos Reis Dragão marcou você como ameaça. Monstros de rank S+ podem localizá-lo.",
    effect: "-2 em testes para evitar ser rastreado por monstros de rank S ou superior.",
  },
  {
    name: "Ferida Aberta",
    rank: "Experiente",
    source: "SL",
    severity: "Maior",
    description: "Uma lesão profunda de dungeon que nunca cicatrizou completamente.",
    effect: "-1 em testes de Vigor. Não pode ser curado naturalmente; requer magia ou poção.",
  },
  {
    name: "Cicatriz Sombria",
    rank: "Veterano",
    source: "SL",
    severity: "Menor",
    description: "Uma marca negra permanece onde foi ferido por mana sombria.",
    effect: "-1 em Carisma quando visível. Sensível a magia das trevas.",
  },
  {
    name: "Membro Fantasma",
    rank: "Experiente",
    source: "SL",
    severity: "Maior",
    description: "Perda de membro em dungeon ainda afeta você no mundo real.",
    effect: "-2 em testes que exigem o membro (perna: Atletismo, braço: Luta/Atirar).",
  },
  {
    name: "Fratura de Dungeon",
    rank: "Novato",
    source: "SL",
    severity: "Menor",
    description: "Ferimentos graves de dungeon levam mais tempo para curar no mundo real.",
    effect: "Dobra o tempo de recuperação de ferimentos graves (4 dias → 8 dias).",
  },
  {
    name: "Ferida Infestada",
    rank: "Veterano",
    source: "SL",
    severity: "Maior",
    description: "Uma ferida crônica infestada por gases de dungeon.",
    effect: "-1 em testes de Vigor por dia em dungeons. Requer purificação.",
  },

  // ========================================================================
  // CORRUPÇÃO
  // ========================================================================
  {
    name: "Sombra Corrompida",
    rank: "Veterano",
    source: "SL",
    severity: "Maior",
    description: "Sua sombra foi corrompida por mana sombria. Age de forma independente e agressiva.",
    effect: "-2 em testes de Resistência a Magia das Trevas. Pode perder o controle em situações de stress.",
  },
  {
    name: "Perda de Humanidade",
    rank: "Lendário",
    source: "SL",
    severity: "Maior",
    description: "O uso excessivo de poder monárquico está consumindo sua humanidade.",
    effect: "-2 em testes de Interação Social. Aparência progressivamente mais sombria.",
  },
  {
    name: "Marca da Escuridão",
    rank: "Heroico",
    source: "SL",
    severity: "Maior",
    description: "Mana das trevas deixar uma marca em sua alma.",
    effect: "Detectado por magia de luz como alinhamento sombrio. -2 com organizações religiosas.",
  },
  {
    name: "Sangue Polluto",
    rank: "Experiente",
    source: "SL",
    severity: "Menor",
    description: "Seu sangue foi contaminado por veneno de dungeon de alto rank.",
    effect: "-1 em testes de Vigor. Veneno de dungeons afeta o dobro.",
  },
  {
    name: "Alma Dividida",
    rank: "Lendário",
    source: "SL",
    severity: "Maior",
    description: "Parte de sua alma foi dividida entre sua sombra/arma invocada.",
    effect: "-2 em testes de Força de Vontade. Sombra pode agir contra você se separada.",
  },

  // ========================================================================
  // CAÇA E RECOMPENSAS
  // ========================================================================
  {
    name: "Alvo de Recompensa",
    rank: "Experiente",
    source: "SL",
    severity: "Menor",
    description: "Sua cabeça tem preço. Caçadores de recompensas o perseguem.",
    effect: "-2 em testes de Persuasão em territórios hostis. Pode ser abordado por assassinos.",
  },
  {
    name: "Inimigo do Sistema",
    rank: "Heroico",
    source: "SL",
    severity: "Maior",
    description: "O Sistema o marcou como anomalia. Bônus de experiência reduzido.",
    effect: "-25% em bônus de XP por missão. Monstros podem ter informação sobre você.",
  },
  {
    name: "Procurado pela Guilda",
    rank: "Veterano",
    source: "SL",
    severity: "Menor",
    description: "A Guilda o declarou inimigo ou está investigando suas atividades.",
    effect: "-2 em testes de Influência com membros da Guilda. Acesso restrito a recursos.",
  },
  {
    name: "Marca de Traidor",
    rank: "Lendário",
    source: "SL",
    severity: "Maior",
    description: "Você traiu sua guilda ou alliance. É caçado ativamente.",
    effect: "-4 em testes de Reputação. Qualquer alliance pode ser inimiga. Recompensa alta.",
  },

  // ========================================================================
  // VÍCIOS
  // ========================================================================
  {
    name: "Dependente de Essência",
    rank: "Veterano",
    source: "SL",
    severity: "Maior",
    description: "Você desenvolveu dependência em essência de monstro para manter poder.",
    effect: "-2 em testes se não consumir essência diariamente. Abstinência causa -1 Fadiga.",
  },
  {
    name: "Vício em Poção",
    rank: "Novato",
    source: "SL",
    severity: "Menor",
    description: "Dependência em poções de cura para recuperação rápida.",
    effect: "-1 em testes de Cura Natural se não usar poção pelo menos uma vez por dia.",
  },
  {
    name: "Fluxo Insano",
    rank: "Heroico",
    source: "SL",
    severity: "Maior",
    description: "Seu corpo depende de fluxo constante de mana para funcionar.",
    effect: "-2 se não meditar/fluxuar mana diariamente. Cansaço extremo sem mana.",
  },
  {
    name: "Consumo Excessivo",
    rank: "Experiente",
    source: "SL",
    severity: "Menor",
    description: "Seu corpo drena mana mais rápido que o normal para manter habilidades.",
    effect: "-2 PP máximos (ou -20% se usar sistema de mana variável).",
  },
  {
    name: "Síndrome de Abstinência",
    rank: "Lendário",
    source: "SL",
    severity: "Maior",
    description: "Sem seu poder único ou essência, você enfraquece rapidamente.",
    effect: "-1 Ferimento por dia sem acesso ao seu poder. Morte se muito tempo sem usar.",
  },

  // ========================================================================
  // PSICOLÓGICOS
  // ========================================================================
  {
    name: "Trauma de Dungeon",
    rank: "Novato",
    source: "SL",
    severity: "Menor",
    description: "Você morreu (ou quase) dentro de uma dungeon. O trauma persiste.",
    effect: "-1 em testes de Moral dentro de dungeons. Flashbacks em situações similares.",
  },
  {
    name: "Medo de Rank-Up",
    rank: "Experiente",
    source: "SL",
    severity: "Menor",
    description: "Você teme o processo de evolução de rank. Ansiedade excessiva.",
    effect: "-2 em testes de rank-up (se aplicável). Pode atrasar progressão.",
  },
  {
    name: "Síndrome do Sobrevivente",
    rank: "Veterano",
    source: "SL",
    severity: "Menor",
    description: "Você é o único que sobreviveu. Culpa e solidão o consomem.",
    effect: "-2 em testes de Moral. Pode ter pesadelos. Dificuldade em trabalhar em grupo.",
  },
  {
    name: "Paranoia do Caçador",
    rank: "Heroico",
    source: "SL",
    severity: "Menor",
    description: "Você está sempre em alerta, esperando ataque a qualquer momento.",
    effect: "-1 em testes de Concentração. Dificuldade em descansar. Pode atacar primeiro.",
  },
  {
    name: "Esquizofrenia Mágica",
    rank: "Lendário",
    source: "SL",
    severity: "Maior",
    description: "Vozes do Sistema ou espíritos sussurram em sua mente constantemente.",
    effect: "-2 em testes de Concentração. Pode receber informações mas também distractors.",
  },
  {
    name: "Memória Fragmentada",
    rank: "Experiente",
    source: "SL",
    severity: "Menor",
    description: "Você perdeu memórias durante rank-ups ou morte em dungeon.",
    effect: "-1 em testes de Conhecimento. Pode esquecer informações importantes.",
  },
  {
    name: "Instinto de Matança",
    rank: "Heroico",
    source: "SL",
    severity: "Maior",
    description: "Seu instinto de caça está hiperativo. Você vê tudo como presa.",
    effect: "-2 em testes de empatia. Pode atacar aliados se provocador. Dificuldade em negociar.",
  },
  {
    name: "Fadiga Acumulada",
    rank: "Novato",
    source: "SL",
    severity: "Menor",
    description: "Exaustão crônica de raids constantes sem recuperação adequada.",
    effect: "-1 em todos os testes após 3 dias sem descanso adequado. Acumula.",
  },
];
