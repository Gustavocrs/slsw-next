/**
 * Base de dados estática de monstros importados/adaptados.
 * Estrutura baseada nos statblocks do sistema Savage Worlds (Zadmar).
 */
export const bestiaryData = [
  {
    id: "goblin-rastejante",
    name: "Goblin Rastejante",
    type: "Humanóide",
    rank: "Extra",
    description: "Uma criatura pequena e vil que vive em cavernas úmidas.",
    attributes: {agi: "d8", sma: "d4", spi: "d4", str: "d4", vig: "d6"},
    skills: "Lutar d6, Furtividade d8, Perceber d6",
    pace: 6,
    parry: 5,
    toughness: 4,
    loot: "Dentes de goblin, trapos",
    specialAbilities: [
      {name: "Tamanho -1", description: "Goblins são menores que humanos."},
      {
        name: "Infravisão",
        description:
          "Ignora penalidades de penumbra e escuridão contra alvos vivos.",
      },
    ],
  },
  {
    id: "espectro-gelo",
    name: "Espectro de Gelo",
    type: "Morto-Vivo / Elemental",
    rank: "Carta Selvagem",
    description:
      "Espíritos amaldiçoados de aventureiros que morreram congelados.",
    attributes: {agi: "d6", sma: "d6", spi: "d8", str: "d6", vig: "d8"},
    skills: "Lutar d8, Perceber d8, Furtividade d6",
    pace: 6,
    parry: 6,
    toughness: 6,
    loot: "Essência gélida, Ectoplasma",
    specialAbilities: [
      {
        name: "Morto-Vivo",
        description:
          "+2 em Resistência; +2 para se recuperar de Abalado; ignora modificadores de ferimento.",
      },
      {name: "Imunidade", description: "Frio e Gelo."},
      {name: "Fraqueza", description: "Leva dano em dobro para fogo."},
    ],
  },
];
