import {NextResponse} from "next/server";
import {adventureData} from "@/lib/adventureGenerator";

// Função auxiliar para pegar item aleatório sem repetição no mesmo array
function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Função auxiliar para pegar múltiplos itens sem repetição
function getRandomUniqueItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function GET(request) {
  try {
    const {searchParams} = new URL(request.url);
    const players = searchParams.get("players") || "4"; // Fallback numérico seguro
    const swadeRank = searchParams.get("swadeRank") || "Desconhecido";
    const hunterRank = searchParams.get("hunterRank") || "Desconhecido";

    // Escolher um tema de missão aleatório para manter coesão
    const themesList = Object.keys(adventureData.themes);
    const selectedTheme = getRandomItem(themesList);
    const themeData = adventureData.themes[selectedTheme];

    // Cálculos de Estrutura da Dungeon
    const parsedPlayers = parseInt(players, 10);
    const roomsCount = isNaN(parsedPlayers) ? 5 : parsedPlayers + 1;

    // Constantes para nivelamento
    const SWADE_RANKS = [
      "Novato",
      "Experiente",
      "Veterano",
      "Heroico",
      "Lendário",
    ];
    const rankIndex =
      SWADE_RANKS.indexOf(swadeRank) !== -1
        ? SWADE_RANKS.indexOf(swadeRank)
        : 0;

    // Filtrar Monstros por Rank (Mesmo rank ou 1 rank abaixo para formar hordas. Se novato, só novato)
    let availableMonsters = adventureData.monsters.filter((m) => {
      const mIdx = SWADE_RANKS.indexOf(m.rank || "Novato");
      return mIdx === rankIndex || (rankIndex > 0 && mIdx === rankIndex - 1);
    });
    if (availableMonsters.length < 2)
      availableMonsters = adventureData.monsters; // Fallback

    const encountersCount = Math.floor(Math.random() * 2) + 2; // 2 a 3 encontros
    const chosenMonsters = getRandomUniqueItems(
      availableMonsters,
      encountersCount,
    );
    const encounters = chosenMonsters.map((monster) => ({
      ...monster,
      loot: getRandomItem(adventureData.monsterLoot),
    }));

    // Filtrar Armadilhas por Rank
    let availableTraps = adventureData.trapsAndPuzzles.filter((t) => {
      const tIdx = SWADE_RANKS.indexOf(t.rank || "Novato");
      return tIdx === rankIndex || (rankIndex > 0 && tIdx === rankIndex - 1);
    });
    if (availableTraps.length === 0)
      availableTraps = adventureData.trapsAndPuzzles; // Fallback

    const trapsCount = Math.floor(Math.random() * 2) + 1; // 1 a 2 armadilhas
    const traps = getRandomUniqueItems(availableTraps, trapsCount).map(
      (t) => t.text,
    );

    // Loot do Boss Principal
    const bLootCount = Math.floor(Math.random() * 2) + 2; // 2 a 3 itens épicos
    const bossLootList = getRandomUniqueItems(
      adventureData.bossLoot,
      bLootCount,
    );

    // Filtrar Bosses por Rank (Igual, 1 acima ou 1 abaixo)
    let availableBosses = adventureData.antagonists.filter((b) => {
      const bIdx = SWADE_RANKS.indexOf(b.rank || "Novato");
      return (
        bIdx === rankIndex ||
        (rankIndex > 0 && bIdx === rankIndex - 1) ||
        (rankIndex < 4 && bIdx === rankIndex + 1)
      );
    });
    if (availableBosses.length === 0)
      availableBosses = adventureData.antagonists;

    // Rola uma opção de cada array da base de dados e compõe um JSON de Quest
    const adventure = {
      id: `quest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // ID único para a quest
      title: "Missão Gerada",
      theme: selectedTheme,
      hook: getRandomItem(themeData.hooks),
      objective: getRandomItem(themeData.objectives),
      location: getRandomItem(adventureData.locations),
      antagonist: getRandomItem(availableBosses),
      complication: getRandomItem(adventureData.complications),
      twist: getRandomItem(themeData.twists),
      reward: getRandomItem(adventureData.rewards),
      players,
      swadeRank,
      hunterRank,
      rooms: roomsCount,
      encounters: encounters,
      traps: traps,
      bossLoot: bossLootList,
      createdAt: new Date().toISOString(),
    };

    // Você pode brincar gerando um Título Baseado no Antagonista ou Local se quiser no futuro
    const antagonistaCurto = adventure.antagonist.name; // "O Cavaleiro Corrompido"
    adventure.title = `Operação: ${antagonistaCurto}`;

    return NextResponse.json(adventure);
  } catch (error) {
    console.error("Erro ao gerar aventura:", error);
    return NextResponse.json(
      {error: "Falha ao processar o gerador de aventuras do sistema."},
      {status: 500},
    );
  }
}
