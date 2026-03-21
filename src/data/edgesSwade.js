/**
 * Vantagens Core - Savage Worlds (SWADE)
 *
 * ÍNDICE DE REGRAS E CONTEÚDO NESTE ARQUIVO:
 * - Antecedentes: Vantagens inatas e socioeconômicas (Ex: Atraente, Rico, Sorte, Antecedente Arcano)
 * - Combate: Vantagens táticas para Lutar e Atirar (Ex: Ambidestro, Frenesi, Esquiva, Primeiro Ataque)
 * - Liderança: Modificadores em área para aliados (Ex: Comando, Inspirar)
 * - Poder: Vantagens que afetam feitiços e Pontos de Poder (Ex: Canalização, Recarga Rápida)
 * - Profissional: Bônus massivos em perícias específicas (Ex: Acrobata, Erudito, Ladrão)
 * - Social e Estranho: Manipulação social e efeitos únicos (Ex: Provocar, Curandeiro, Senso de Perigo)
 */

export const EDGES_SWADE = [
  // --- SWADE: ANTECEDENTES ---
  {
    name: "Alerta",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Perceber.",
  },
  {
    name: "Ambidestro",
    rank: "Novato",
    source: "SWADE",
    description: "Ignora penalidade de -2 para a mão inábil.",
  },
  {
    name: "Antecedente Arcano",
    rank: "Novato",
    source: "SWADE",
    description: "Permite acesso a Magias e recebe +10 de Mana base.",
  },
  {
    name: "Aristocrata",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em Persuadir com a elite; +200% de Riqueza inicial.",
  },
  {
    name: "Atraente",
    rank: "Novato",
    source: "SWADE",
    description: "+1 em testes de Desempenho e Persuadir.",
  },
  {
    name: "Muito Atraente",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Desempenho e Persuadir.",
  },
  {
    name: "Brutamontes",
    rank: "Novato",
    source: "SWADE",
    description: "+1 em Resistência e dano desarmado.",
  },
  {
    name: "Carismático",
    rank: "Novato",
    source: "SWADE",
    description: "Rolagem livre em testes de Persuadir.",
  },
  {
    name: "Corajoso",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Medo.",
  },
  {
    name: "Cura Rápida",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Vigor para cura natural.",
  },
  {
    name: "Fama",
    rank: "Novato",
    source: "SWADE",
    description:
      "+1 em Persuadir; reconhecido publicamente; ganha mais dinheiro.",
  },
  {
    name: "Linguista",
    rank: "Novato",
    source: "SWADE",
    description: "Começa com Astúcia/2 idiomas; +2 em testes de idioma.",
  },
  {
    name: "Pés Ligeiros",
    rank: "Novato",
    source: "SWADE",
    description: "Movimentação +2; dado de corrida d10.",
  },
  {
    name: "Podre de Rico",
    rank: "Novato",
    source: "SWADE",
    description: "5x a Riqueza inicial ($2500).",
  },
  {
    name: "Rápido",
    rank: "Novato",
    source: "SWADE",
    description: "Descarta cartas de Iniciativa 5 ou menor e compra novas.",
  },
  {
    name: "Rico",
    rank: "Novato",
    source: "SWADE",
    description: "3x a Riqueza inicial ($1500).",
  },
  {
    name: "Sorte",
    rank: "Novato",
    source: "SWADE",
    description: "+1 Benne no início de cada sessão.",
  },
  {
    name: "Sorte Grande",
    rank: "Novato",
    source: "SWADE",
    description: "+2 Bennes no início de cada sessão.",
  },
  {
    name: "Vigoroso",
    rank: "Novato",
    source: "SWADE",
    description: "Ignora o primeiro ponto de penalidade de Ferimento.",
  },

  // --- SWADE: COMBATE ---
  {
    name: "Arma de Estimação",
    rank: "Novato",
    source: "SWADE",
    description: "+1 nas rolagens de Ataque e Aparar com uma arma específica.",
  },
  {
    name: "Arma de Estimação Aprimorada",
    rank: "Veterano",
    source: "SWADE",
    description: "+1 adicional em Ataque e Aparar com a arma escolhida.",
  },
  {
    name: "Artista Marcial",
    rank: "Novato",
    source: "SWADE",
    description: "Dano desarmado For+d4; conta como Arma Natural.",
  },
  {
    name: "Assassino",
    rank: "Novato",
    source: "SWADE",
    description: "+2 no dano se atacar inimigo com carta de Iniciativa menor.",
  },
  {
    name: "Atirador de Elite",
    rank: "Experiente",
    source: "SWADE",
    description:
      "Se não se mover, ignora penalidades de Alcance, Cobertura, etc.",
  },
  {
    name: "Bloqueio",
    rank: "Experiente",
    source: "SWADE",
    description: "+1 em Aparar.",
  },
  {
    name: "Bloqueio Aprimorado",
    rank: "Veterano",
    source: "SWADE",
    description: "+2 em Aparar.",
  },
  {
    name: "Calculista",
    rank: "Novato",
    source: "SWADE",
    description: "Ignora até 2 pontos de penalidade por Ações Múltiplas.",
  },
  {
    name: "Contra-Ataque",
    rank: "Experiente",
    source: "SWADE",
    description:
      "Recebe um ataque livre contra oponentes que falham em Lutar contra você.",
  },
  {
    name: "Contra-Ataque Aprimorado",
    rank: "Veterano",
    source: "SWADE",
    description: "Como Contra-Ataque, mas causa dano extra se acertar.",
  },
  {
    name: "Duas Armas",
    rank: "Novato",
    source: "SWADE",
    description: "Reduz penalidade de Ação Múltipla ao atacar com duas armas.",
  },
  {
    name: "Duro de Matar",
    rank: "Novato",
    source: "SWADE",
    description:
      "Ignora penalidades de Ferimento ao fazer testes de Vigor para não morrer.",
  },
  {
    name: "Muito Duro de Matar",
    rank: "Veterano",
    source: "SWADE",
    description: "50% de chance de sobreviver mesmo se 'morto'.",
  },
  {
    name: "Esquiva",
    rank: "Experiente",
    source: "SWADE",
    description: "-2 para ser atingido por ataques à distância.",
  },
  {
    name: "Esquiva Aprimorada",
    rank: "Veterano",
    source: "SWADE",
    description: "+2 em testes de Agilidade para evitar ataques de área.",
  },
  {
    name: "Finta",
    rank: "Novato",
    source: "SWADE",
    description: "+1 em testes de Truque (Agilidade ou Astúcia) em combate.",
  },
  {
    name: "Fogo Rápido",
    rank: "Experiente",
    source: "SWADE",
    description: "Aumenta a Cadência de Tiro (RoF) em 1.",
  },
  {
    name: "Fogo Rápido Aprimorado",
    rank: "Veterano",
    source: "SWADE",
    description: "Aumenta a Cadência de Tiro (RoF) em 2.",
  },
  {
    name: "Frenesi",
    rank: "Experiente",
    source: "SWADE",
    description: "Pode fazer um ataque extra de Lutar com -2.",
  },
  {
    name: "Frenesi Aprimorado",
    rank: "Veterano",
    source: "SWADE",
    description: "Ataque extra de Lutar sem penalidade.",
  },
  {
    name: "Improvisador",
    rank: "Experiente",
    source: "SWADE",
    description: "Ignora penalidade de -2 ao usar armas improvisadas.",
  },
  {
    name: "Instinto Assassino",
    rank: "Experiente",
    source: "SWADE",
    description:
      "Vence empates em testes opostos; pode rerolar testes opostos.",
  },
  {
    name: "Mãos Firmes",
    rank: "Novato",
    source: "SWADE",
    description:
      "Ignora penalidade de Plataforma Instável; reduz penalidade de corrida.",
  },
  {
    name: "Matador de Gigantes",
    rank: "Veterano",
    source: "SWADE",
    description: "+1d6 de dano contra criaturas 3 tamanhos maiores.",
  },
  {
    name: "Nervos de Aço",
    rank: "Novato",
    source: "SWADE",
    description: "Ignora 1 ponto de penalidade de Ferimento.",
  },
  {
    name: "Nervos de Aço Aprimorado",
    rank: "Veterano",
    source: "SWADE",
    description: "Ignora 2 pontos de penalidade de Ferimento.",
  },
  {
    name: "Primeiro Ataque",
    rank: "Novato",
    source: "SWADE",
    description: "Ataque livre contra um inimigo que entra no seu alcance.",
  },
  {
    name: "Primeiro Ataque Aprimorado",
    rank: "Heroico",
    source: "SWADE",
    description:
      "Ataque livre contra todos os inimigos que entram no seu alcance.",
  },
  {
    name: "Pugilista",
    rank: "Novato",
    source: "SWADE",
    description: "+1 dano desarmado; nunca considerado Desarmado.",
  },
  {
    name: "Queixo de Ferro",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Absorção.",
  },
  {
    name: "Reflexos de Combate",
    rank: "Experiente",
    source: "SWADE",
    description: "+2 para se recuperar de Abalado.",
  },
  {
    name: "Retirada",
    rank: "Novato",
    source: "SWADE",
    description:
      "Inimigos subtraem 2 de ataques quando você sai de combate corpo a corpo.",
  },
  {
    name: "Rock and Roll!",
    rank: "Experiente",
    source: "SWADE",
    description:
      "Ignora penalidade de recuo de arma automática se não se mover.",
  },
  {
    name: "Sangue Frio",
    rank: "Experiente",
    source: "SWADE",
    description: "Compra duas cartas de Iniciativa e escolhe a melhor.",
  },
  {
    name: "Sem Piedade",
    rank: "Experiente",
    source: "SWADE",
    description: "Pode gastar Bennes para rerolar dano.",
  },
  {
    name: "Tiro Duplo",
    rank: "Experiente",
    source: "SWADE",
    description: "+1 ataque e dano ao disparar dois tiros na mesma ação.",
  },
  {
    name: "Tiro Mortal",
    rank: "Heroico",
    source: "SWADE",
    description: "Dobra o dano total quando recebe uma carta Coringa.",
  },
  {
    name: "Varrida",
    rank: "Novato",
    source: "SWADE",
    description: "Ataca todos os inimigos adjacentes com -2.",
  },
  {
    name: "Varrida Aprimorada",
    rank: "Veterano",
    source: "SWADE",
    description: "Ataca todos os inimigos adjacentes sem penalidade.",
  },

  // --- SWADE: LIDERANÇA ---
  {
    name: "Comando",
    rank: "Novato",
    source: "SWADE",
    description: "+1 para aliados recuperarem de Abalado.",
  },
  {
    name: "Fervor",
    rank: "Veterano",
    source: "SWADE",
    description: "Aliados sob comando ganham +1 no Dano.",
  },
  {
    name: "Inspirar",
    rank: "Experiente",
    source: "SWADE",
    description: "Aliados sob comando ganham +1 em rolagens de perícia.",
  },
  {
    name: "Líder Nato",
    rank: "Novato",
    source: "SWADE",
    description: "Pode compartilhar Bennes com aliados.",
  },
  {
    name: "Presença de Comando",
    rank: "Novato",
    source: "SWADE",
    description: "Aumenta o alcance de comando para 10 quadros (20m).",
  },
  {
    name: "Segurar a Linha",
    rank: "Experiente",
    source: "SWADE",
    description: "Aliados sob comando ganham +1 em Resistência.",
  },
  {
    name: "Tático",
    rank: "Experiente",
    source: "SWADE",
    description: "Compra carta extra de iniciativa para aliados.",
  },

  // --- SWADE: PODER ---
  {
    name: "Artífice",
    rank: "Experiente",
    source: "SWADE",
    description: "Permite criar itens arcanos temporários.",
  },
  {
    name: "Canalização",
    rank: "Experiente",
    source: "SWADE",
    description: "Reduz custo de PP em 1 com uma ampliação na rolagem.",
  },
  {
    name: "Concentração",
    rank: "Experiente",
    source: "SWADE",
    description: "Dobra a duração de poderes não-instantâneos.",
  },
  {
    name: "Dreno de Alma",
    rank: "Veterano",
    source: "SWADE",
    description: "Pode recuperar PP drenando energia vital.",
  },
  {
    name: "Engenhoqueiro",
    rank: "Novato",
    source: "SWADE",
    description: "Permite criar dispositivos de Ciência Estranha.",
  },
  {
    name: "Guerreiro Sagrado/Profano",
    rank: "Novato",
    source: "SWADE",
    description: "Pode repelir mortos-vivos e demônios usando Fé.",
  },
  {
    name: "Mago",
    rank: "Novato",
    source: "SWADE",
    description: "Pode alterar a manifestação dos poderes.",
  },
  {
    name: "Mentalista",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes opostos de psiquismo.",
  },
  {
    name: "Novos Poderes",
    rank: "Novato",
    source: "SWADE",
    description: "Aprende 2 novos poderes.",
  },
  {
    name: "Pontos de Poder",
    rank: "Novato",
    source: "SWADE",
    description: "Ganha +5 Pontos de Poder.",
  },
  {
    name: "Recarga Rápida",
    rank: "Experiente",
    source: "SWADE",
    description: "Recupera PP mais rapidamente (1 a cada 30 min).",
  },
  {
    name: "Recarga Aprimorada",
    rank: "Veterano",
    source: "SWADE",
    description: "Recupera PP muito rapidamente (1 a cada 15 min).",
  },
  {
    name: "Surto de Poder",
    rank: "Heroico",
    source: "SWADE",
    description: "Recupera 10 PP ao sacar um Coringa.",
  },

  // --- SWADE: PROFISSIONAL ---
  {
    name: "Acrobata",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em Agilidade para manobras; +1 Aparar se sem armadura.",
  },
  {
    name: "Ás",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Pilotar e Dirigir; ignora penalidades.",
  },
  {
    name: "Consertar Tudo",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Consertar.",
  },
  {
    name: "Erudito",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em duas perícias de Conhecimento.",
  },
  {
    name: "Faz-Tudo",
    rank: "Novato",
    source: "SWADE",
    description:
      "Ignora a penalidade de -2 para testes não treinados de Astúcia.",
  },
  {
    name: "Investigador",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em Investigar e Perceber para encontrar pistas.",
  },
  {
    name: "Ladino",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em Ladinagem e Hackear.",
  },
  {
    name: "Mateiro",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em Sobrevivência e Rastrear.",
  },
  {
    name: "McGyver",
    rank: "Novato",
    source: "SWADE",
    description: "Cria itens improvisados sem penalidade.",
  },

  // --- SWADE: SOCIAL ---
  {
    name: "Ameaçador",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em Intimidar.",
  },
  {
    name: "Apoio",
    rank: "Novato",
    source: "SWADE",
    description: "Remove estados Distraído/Vulnerável de aliados.",
  },
  {
    name: "Conexões",
    rank: "Novato",
    source: "SWADE",
    description: "Pode pedir favores a uma organização ou grupo.",
  },
  {
    name: "Confiável",
    rank: "Novato",
    source: "SWADE",
    description: "+2 ao prestar suporte a aliados.",
  },
  {
    name: "Elo Comum",
    rank: "Heroico",
    source: "SWADE",
    description: "Pode dar seus Bennes para qualquer aliado.",
  },
  {
    name: "Humilhar",
    rank: "Novato",
    source: "SWADE",
    description: "Teste de Provocar livre contra inimigos.",
  },
  {
    name: "Manha",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de rede criminal e busca de informação.",
  },
  {
    name: "Provocar",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Provocar.",
  },
  {
    name: "Retrucar",
    rank: "Novato",
    source: "SWADE",
    description: "Bônus se resistir a Intimidar/Provocar com sucesso.",
  },
  {
    name: "Vontade de Ferro",
    rank: "Novato",
    source: "SWADE",
    description: "+2 para resistir a Intimidar e Provocar.",
  },

  // --- SWADE: ESTRANHO ---
  {
    name: "Campeão",
    rank: "Novato",
    source: "SWADE",
    description: "+2 dano e Resistência contra o mal sobrenatural.",
  },
  {
    name: "Chi",
    rank: "Veterano",
    source: "SWADE",
    description: "Ataque desarmado causa dano mágico e aprimorado.",
  },
  {
    name: "Coragem Líquida",
    rank: "Novato",
    source: "SWADE",
    description: "Álcool concede bônus de Vigor.",
  },
  {
    name: "Curandeiro",
    rank: "Novato",
    source: "SWADE",
    description: "+2 em testes de Cura.",
  },
  {
    name: "Elo Animal",
    rank: "Novato",
    source: "SWADE",
    description: "Possui um animal leal.",
  },
  {
    name: "Mestre das Feras",
    rank: "Novato",
    source: "SWADE",
    description: "Animais não o atacam; pode ter companheiro animal.",
  },
  {
    name: "Senso de Perigo",
    rank: "Novato",
    source: "SWADE",
    description: "Teste de Perceber para evitar surpresa.",
  },
  {
    name: "Sucateiro",
    rank: "Novato",
    source: "SWADE",
    description: "Encontra itens e peças com facilidade.",
  },
];
