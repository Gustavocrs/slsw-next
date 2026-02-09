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
    description: "Permite acesso a Poderes e Pontos de Poder.",
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

  // SL Medieval Específicas
  {
    name: "Ataque Fantasma",
    rank: "Experiente",
    source: "SL",
    description: "Ataque ignora armadura física, atingindo a alma.",
  },
  {
    name: "Marca de Predador",
    rank: "Experiente",
    source: "SL",
    description: "+2 em rastrear e dano contra um alvo marcado.",
  },
  {
    name: "Sangue Frio (SL)",
    rank: "Experiente",
    source: "SL",
    description: "Imune a Medo e Intimidação sobrenatural.",
  },
  {
    name: "Corpo Disciplinado",
    rank: "Veterano",
    source: "SL",
    description: "+2 para resistir a fadiga e venenos.",
  },
  {
    name: "Portador da Centelha",
    rank: "Veterano",
    source: "SL",
    description: "Aumenta a regeneração de Mana natural.",
  },
  {
    name: "Velocidade Guiada pela Mana",
    rank: "Veterano",
    source: "SL",
    description: "Pode gastar Mana para ganhar ações extras.",
  },
  {
    name: "Instinto Arcano",
    rank: "Veterano",
    source: "SL",
    description: "Sente magia ativa a até 20m sem testes.",
  },
  {
    name: "Arremesso Perfeito",
    rank: "Heroico",
    source: "SL",
    description: "Dobra o alcance de armas de arremesso; +2 dano.",
  },
  {
    name: "Golpe Cortante",
    rank: "Heroico",
    source: "SL",
    description: "Ataques causam sangramento (dano contínuo).",
  },
  {
    name: "Reflexos de Caçador",
    rank: "Heroico",
    source: "SL",
    description: "Pode aparar projéteis mágicos.",
  },
  {
    name: "Sangue Arcano",
    rank: "Heroico",
    source: "SL",
    description: "Reduz custo de todas as magias em 1 PP.",
  },
  {
    name: "Compasso Sombrio",
    rank: "Heroico",
    source: "SL",
    description: "Teleporte curto (passo das sombras) como ação livre.",
  },
  {
    name: "Furor de Guerra",
    rank: "Lendário",
    source: "SL",
    description: "Ganha +1 dano a cada ferimento sofrido.",
  },
  {
    name: "Alma de Aço",
    rank: "Lendário",
    source: "SL",
    description: "Ignora todos os redutores de ferimento.",
  },
  {
    name: "Conduíte de Poder",
    rank: "Lendário",
    source: "SL",
    description: "Pode canalizar Mana ilimitada por 3 rodadas.",
  },
  {
    name: "Mestre da Batalha Interior",
    rank: "Lendário",
    source: "SL",
    description: "Recupera Bennes ao derrotar inimigos poderosos.",
  },
  {
    name: "Caminho do Caçador Alfa",
    rank: "Lendário",
    source: "SL",
    description: "Lidera matilha; aliados ganham bônus de ataque.",
  },
  {
    name: "Conjurador Rápido",
    rank: "Experiente",
    source: "SL",
    description: "Pode lançar duas magias por turno sem penalidade.",
  },
  {
    name: "Cura Abençoada",
    rank: "Novato",
    source: "SL",
    description: "Magias de cura curam +1 ferimento extra.",
  },
  {
    name: "Disparo Preciso",
    rank: "Novato",
    source: "SL",
    description: "+1 em ataques à distância; ignora cobertura leve.",
  },
  {
    name: "Domínio do Foco",
    rank: "Veterano",
    source: "SL",
    description: "Mantém magias ativas sem penalidade de concentração.",
  },
  {
    name: "Escudo de Ferro Vivo",
    rank: "Experiente",
    source: "SL",
    description: "Escudo concede cobertura total sob comando.",
  },
  {
    name: "Firmeza do Caçador",
    rank: "Novato",
    source: "SL",
    description: "+2 para resistir a empurrões e derrubadas.",
  },
  {
    name: "Fluxo Rúnico",
    rank: "Novato",
    source: "SL",
    description: "Pode trocar PP por bônus em perícias físicas.",
  },
  {
    name: "Fúria",
    rank: "Novato",
    source: "SL",
    description: "+2 Lutar e Dano, -2 Aparar (Berserk).",
  },
  {
    name: "Garras de Mana",
    rank: "Novato",
    source: "SL",
    description: "Mãos causam For+d6 dano mágico.",
  },
  {
    name: "Golpe Rúnico",
    rank: "Novato",
    source: "SL",
    description: "Adiciona dano elemental à arma (fogo/gelo/raio).",
  },
  {
    name: "Impacto Rúnico",
    rank: "Novato",
    source: "SL",
    description: "Ataque empurra inimigos 1d6 quadros.",
  },
  {
    name: "Invocador",
    rank: "Novato",
    source: "SL",
    description: "Pode invocar criatura auxiliar menor.",
  },
  {
    name: "Lutador",
    rank: "Novato",
    source: "SL",
    description: "+1 em Lutar e +1 em Aparar desarmado.",
  },
  {
    name: "Mestre das Runas",
    rank: "Veterano",
    source: "SL",
    description: "Pode ativar duas runas simultaneamente.",
  },
  {
    name: "Percepção Aguçada",
    rank: "Novato",
    source: "SL",
    description: "Reduz penalidades de escuridão e alcance.",
  },
  {
    name: "Rastejar nas Sombras",
    rank: "Novato",
    source: "SL",
    description: "+2 em Furtividade em áreas escuras.",
  },
  {
    name: "Resistente",
    rank: "Novato",
    source: "SL",
    description: "Considerado tamanho +1 para resistência.",
  },

  // Arquétipos
  {
    name: "Quebra-Defesas",
    rank: "Experiente",
    source: "SL",
    description: "Ataques reduzem o Aparar do alvo.",
  },
  {
    name: "Golpe Sísmico",
    rank: "Veterano",
    source: "SL",
    description: "Ataque em área que derruba oponentes.",
  },
  {
    name: "Corpo Indomável",
    rank: "Heroico",
    source: "SL",
    description: "Imune a atordoamento e paralisia.",
  },
  {
    name: "Avatar do Impacto",
    rank: "Lendário",
    source: "SL",
    description: "Dano máximo contra estruturas e objetos.",
  },
  {
    name: "Escrita Rúnica",
    rank: "Novato",
    source: "SL",
    description: "Pode inscrever runas em equipamentos.",
  },
  {
    name: "Amplificação Arcana",
    rank: "Experiente",
    source: "SL",
    description: "Aumenta o alcance e duração de magias.",
  },
  {
    name: "Campo Rúnico",
    rank: "Veterano",
    source: "SL",
    description: "Cria zona de proteção ou dano no chão.",
  },
  {
    name: "Catalisador Vivo",
    rank: "Heroico",
    source: "SL",
    description: "Corpo armazena mana extra (+10 PP).",
  },
  {
    name: "Arcano Absoluto",
    rank: "Lendário",
    source: "SL",
    description: "Reduz pela metade o custo de todos os poderes.",
  },
  {
    name: "Elo Sombrio",
    rank: "Novato",
    source: "SL",
    description: "Pode ver através dos olhos de suas invocações.",
  },
  {
    name: "Comando Duplo",
    rank: "Experiente",
    source: "SL",
    description: "Pode controlar duas invocações ativas.",
  },
  {
    name: "Horda Viva",
    rank: "Veterano",
    source: "SL",
    description: "Invocações custam metade dos PP.",
  },
  {
    name: "Entidade Maior",
    rank: "Heroico",
    source: "SL",
    description: "Pode invocar uma criatura de Rank superior.",
  },
  {
    name: "Senhor das Criaturas",
    rank: "Lendário",
    source: "SL",
    description: "Invocações ganham +2 em todas as rolagens.",
  },
  {
    name: "Luz Purificadora",
    rank: "Experiente",
    source: "SL",
    description: "Cura remove também doenças e venenos.",
  },
  {
    name: "Aura Restauradora",
    rank: "Veterano",
    source: "SL",
    description: "Cura passiva em aliados próximos.",
  },
  {
    name: "Milagre Menor",
    rank: "Heroico",
    source: "SL",
    description: "Pode reviver aliado morto recentemente (1/sessão).",
  },
  {
    name: "Avatar da Luz",
    rank: "Lendário",
    source: "SL",
    description: "Imune a dano necrótico/sombrio.",
  },
  {
    name: "Forma Animal",
    rank: "Novato",
    source: "SL",
    description: "Pode se transformar em animal pequeno/médio.",
  },
  {
    name: "Presas Naturais",
    rank: "Experiente",
    source: "SL",
    description: "Armas naturais causam dano aprimorado.",
  },
  {
    name: "Pele Espessa",
    rank: "Veterano",
    source: "SL",
    description: "+4 de Armadura natural.",
  },
  {
    name: "Fera Superior",
    rank: "Heroico",
    source: "SL",
    description: "Transformação em animal grande/gigante.",
  },
  {
    name: "Espírito Ancestral",
    rank: "Lendário",
    source: "SL",
    description: "Pode assumir forma híbrida poderosa.",
  },
  {
    name: "Postura Defensiva",
    rank: "Novato",
    source: "SL",
    description: "+2 Aparar se não se mover.",
  },
  {
    name: "Provocação Instintiva",
    rank: "Experiente",
    source: "SL",
    description: "Inimigos devem atacar você se falharem em Espírito.",
  },
  {
    name: "Muralha Viva",
    rank: "Veterano",
    source: "SL",
    description: "Concede cobertura a aliados adjacentes.",
  },
  {
    name: "Guardião Absoluto",
    rank: "Heroico",
    source: "SL",
    description: "Pode absorver dano destinado a um aliado.",
  },
  {
    name: "Bastilha Imortal",
    rank: "Lendário",
    source: "SL",
    description: "Não cai inconsciente enquanto tiver Mana.",
  },
].sort((a, b) => a.name.localeCompare(b.name));

export const HINDRANCES = [
  {name: "Analfabeto", type: "Menor", description: "Não sabe ler ou escrever."},
  {
    name: "Anêmico",
    type: "Menor",
    description: "-2 em testes de Vigor para resistir a fadiga/doença.",
  },
  {
    name: "Arrogante",
    type: "Maior",
    description: "Procura vencer o líder inimigo sozinho.",
  },
  {
    name: "Boca Grande",
    type: "Menor",
    description: "Não consegue guardar segredos.",
  },
  {
    name: "Cabeça-Quente",
    type: "Menor/Maior",
    description: "-1/-2 em testes de Provocar; irrita-se fácil.",
  },
  {
    name: "Cauteloso",
    type: "Menor",
    description: "Planeja demais, hesita em agir.",
  },
  {
    name: "Cego",
    type: "Maior",
    description: "-6 em tarefas visuais; ganha Vantagem extra.",
  },
  {
    name: "Código de Honra",
    type: "Maior",
    description: "Mantém a palavra, protege os fracos.",
  },
  {
    name: "Confiante Demais",
    type: "Maior",
    description: "Acredita que pode fazer qualquer coisa.",
  },
  {name: "Covarde", type: "Maior", description: "-2 em testes de Medo."},
  {
    name: "Curioso",
    type: "Maior",
    description: "Tem que investigar mistérios.",
  },
  {
    name: "Delirante",
    type: "Menor/Maior",
    description: "Acredita em algo que não é verdade.",
  },
  {name: "Desagradável", type: "Menor", description: "-2 em Persuadir."},
  {
    name: "Desastrado",
    type: "Menor",
    description: "-2 em Furtividade; faz barulho.",
  },
  {
    name: "Desajeitado",
    type: "Menor",
    description: "-2 em Consertar; quebra coisas mecânicas.",
  },
  {
    name: "Desejo de Morte",
    type: "Menor",
    description: "Quer morrer de forma heroica.",
  },
  {
    name: "Desleal",
    type: "Menor",
    description: "Trai o grupo se for vantajoso.",
  },
  {
    name: "Determinado",
    type: "Menor/Maior",
    description: "Não desiste de seus objetivos.",
  },
  {
    name: "Duro de Ouvido",
    type: "Menor/Maior",
    description: "-4 em Perceber auditivo; surdo se Maior.",
  },
  {
    name: "Feio",
    type: "Menor",
    description: "-2 em Persuadir; atraente para poucos.",
  },
  {
    name: "Forasteiro",
    type: "Menor",
    description: "-2 em Persuadir; não conhece costumes locais.",
  },
  {
    name: "Frágil",
    type: "Menor/Maior",
    description: "-1 Resistência (Menor) ou -2 (Maior).",
  },
  {
    name: "Fúria Incontrolável",
    type: "Maior",
    description: "Entra em frenesi ao sofrer dano ou falhar.",
  },
  {
    name: "Ganancioso",
    type: "Menor/Maior",
    description: "Obcecado por riqueza.",
  },
  {
    name: "Hábito",
    type: "Menor/Maior",
    description: "Vício ou mania que atrapalha.",
  },
  {name: "Heroico", type: "Maior", description: "Sempre ajuda quem precisa."},
  {
    name: "Hesitante",
    type: "Menor",
    description: "Compra duas cartas de iniciativa e fica com a pior.",
  },
  {
    name: "Idoso",
    type: "Maior",
    description: "-1 Força/Vigor, +5 pontos de perícia.",
  },
  {name: "Impulsivo", type: "Maior", description: "Age sem pensar."},
  {name: "Inimigo", type: "Menor/Maior", description: "Alguém quer te matar."},
  {
    name: "Invejoso",
    type: "Menor/Maior",
    description: "Cobiça o que os outros têm.",
  },
  {name: "Leal", type: "Menor", description: "Nunca abandona um amigo."},
  {
    name: "Ligação com a Natureza",
    type: "Maior",
    description: "Não usa tecnologia ou metal.",
  },
  {name: "Má Sorte", type: "Maior", description: "Menos 1 Benne por sessão."},
  {
    name: "Maneta",
    type: "Maior",
    description: "-4 em tarefas que exigem duas mãos.",
  },
  {
    name: "Mudo",
    type: "Maior",
    description: "Não pode falar; comunicação difícil.",
  },
  {name: "Não Nada", type: "Menor", description: "-2 em Atletismo para nadar."},
  {
    name: "Obcecado",
    type: "Menor/Maior",
    description: "Focado em um objetivo único.",
  },
  {
    name: "Obeso",
    type: "Menor",
    description: "+1 Resistência, -1 Movimentação.",
  },
  {
    name: "Olhos Ruins",
    type: "Menor/Maior",
    description: "-2 em testes visuais.",
  },
  {
    name: "Obrigação",
    type: "Menor/Maior",
    description: "Dever para com um grupo ou pessoa.",
  },
  {
    name: "Pacifista",
    type: "Menor/Maior",
    description: "Não luta (Menor) ou não fere (Maior).",
  },
  {
    name: "Peculiaridade",
    type: "Menor",
    description: "Hábito estranho, mas inofensivo.",
  },
  {
    name: "Pequeno",
    type: "Menor",
    description: "-1 Resistência, tamanho reduzido.",
  },
  {
    name: "Perneta",
    type: "Maior",
    description: "Movimentação reduzida, -2 em traços físicos.",
  },
  {
    name: "Pobreza",
    type: "Menor",
    description: "Começa com metade da riqueza.",
  },
  {
    name: "Procurado",
    type: "Menor/Maior",
    description: "Autoridades buscam você.",
  },
  {name: "Reservado", type: "Menor", description: "Não fala sobre si mesmo."},
  {name: "Sanguinário", type: "Maior", description: "Nunca faz prisioneiros."},
  {
    name: "Segredo",
    type: "Menor/Maior",
    description: "Informação que pode te destruir.",
  },
  {name: "Sem Noção", type: "Menor", description: "-2 em Conhecimento Comum."},
  {
    name: "Suscetível",
    type: "Menor",
    description: "-2 para resistir a magias/poderes.",
  },
  {name: "Solitário", type: "Menor", description: "Prefere trabalhar sozinho."},
  {name: "Teimoso", type: "Menor", description: "Sempre quer ter razão."},
  {
    name: "Vingativo",
    type: "Menor/Maior",
    description: "Procura retribuição por insultos.",
  },
].sort((a, b) => a.name.localeCompare(b.name));

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
    // Busca na lista oficial para saber o tipo, ou tenta inferir do nome antigo
    const ref = HINDRANCES.find((h) => h.name === name);
    const type = ref ? ref.type : name.includes("Maior") ? "Maior" : "Menor";

    if (type.toLowerCase().includes("maior")) return total - 2;
    if (type.toLowerCase().includes("menor")) return total - 1;
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
