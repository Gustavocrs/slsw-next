import {NextResponse} from "next/server";
import {adventureData} from "@/data/adventureGenerator";

// Função auxiliar para pegar um item aleatório de um array
function pickRandom(array) {
  if (!array || array.length === 0) return "Desconhecido";
  return array[Math.floor(Math.random() * array.length)];
}

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const players = parseInt(searchParams.get("players") || "4", 10);
  const swadeRank = searchParams.get("swadeRank") || "Novato";
  const hunterRank = searchParams.get("hunterRank") || "E";

  try {
    // 1. Sorteia o Tema e seus respectivos Ganchos/Objetivos
    const themes = Object.keys(adventureData.themes);
    const selectedTheme = pickRandom(themes);
    const themeObj = adventureData.themes[selectedTheme];

    // 2. Filtra Bosses pelo Rank (se não achar do rank, pega qualquer um)
    let possibleBosses = adventureData.antagonists.filter(
      (b) => b.rank === swadeRank,
    );
    if (possibleBosses.length === 0) possibleBosses = adventureData.antagonists;
    const antagonist = pickRandom(possibleBosses);

    // 3. Filtra Monstros (Rank do grupo ou Novato) para encontros aleatórios
    let possibleMonsters = adventureData.monsters.filter(
      (m) => m.rank === swadeRank || m.rank === "Novato",
    );
    if (possibleMonsters.length === 0)
      possibleMonsters = adventureData.monsters;

    // Monta o array de encontros com base no número de jogadores (ex: 4 jogadores = 2 encontros)
    const encountersCount = Math.max(1, Math.floor(players / 2));
    const encounters = Array.from({length: encountersCount}).map(() => {
      const m = pickRandom(possibleMonsters);
      return {
        name: m.name,
        type: m.type,
        stats: m.stats,
        loot: pickRandom(adventureData.monsterLoot),
      };
    });

    // 4. Sorteia Armadilhas e Pistas
    let possibleTraps = adventureData.trapsAndPuzzles.filter(
      (t) => t.rank === swadeRank || t.rank === "Novato",
    );
    if (possibleTraps.length === 0)
      possibleTraps = adventureData.trapsAndPuzzles;

    const traps = [
      pickRandom(possibleTraps).text,
      pickRandom(possibleTraps).text,
    ];

    const genericClues = [
      "Manchas suspeitas de sangue nas paredes e arranhões profundos.",
      "Ecos de batalha antigos e restos de equipamento quebrado de outros caçadores.",
      "Um cristal de mana exaurido pisca de forma intermitente no chão.",
    ];
    const clues = [pickRandom(genericClues), pickRandom(genericClues)];

    // 5. Monta o objeto final da aventura
    const adventure = {
      title: `Operação Fenda ${hunterRank} - ${selectedTheme.split("/")[0].trim()}`,
      theme: selectedTheme,
      hook: pickRandom(themeObj.hooks),
      objective: pickRandom(themeObj.objectives),
      location: pickRandom(adventureData.locations),
      twist: pickRandom(themeObj.twists),
      complication: pickRandom(adventureData.complications),
      reward: pickRandom(adventureData.rewards),
      antagonist,
      encounters,
      traps,
      clues,
      bossLoot: [
        pickRandom(adventureData.bossLoot),
        pickRandom(adventureData.monsterLoot),
      ],
      rooms: Math.floor(Math.random() * 5) + 3, // Entre 3 e 7 salas
      players,
      swadeRank,
      hunterRank,
    };

    return NextResponse.json(adventure);
  } catch (error) {
    console.error("Erro ao gerar aventura base:", error);
    return NextResponse.json(
      {error: "Falha ao gerar os dados da aventura base."},
      {status: 500},
    );
  }
}
