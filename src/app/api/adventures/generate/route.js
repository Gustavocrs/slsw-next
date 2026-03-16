import {NextResponse} from "next/server";
import {adventureData} from "@/data/adventureGenerator";

// Função auxiliar para pegar item aleatório sem repetição no mesmo array
function getRandomItem(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export async function GET(request) {
  try {
    const {searchParams} = new URL(request.url);
    const players = searchParams.get("players") || "Desconhecido";
    const swadeRank = searchParams.get("swadeRank") || "Desconhecido";
    const hunterRank = searchParams.get("hunterRank") || "Desconhecido";

    // Rola uma opção de cada array da base de dados e compõe um JSON de Quest
    const adventure = {
      id: `quest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // ID único para a quest
      title: "Missão Gerada",
      hook: getRandomItem(adventureData.hooks),
      objective: getRandomItem(adventureData.objectives),
      location: getRandomItem(adventureData.locations),
      antagonist: getRandomItem(adventureData.antagonists),
      complication: getRandomItem(adventureData.complications),
      twist: getRandomItem(adventureData.twists),
      reward: getRandomItem(adventureData.rewards),
      players,
      swadeRank,
      hunterRank,
      createdAt: new Date().toISOString(),
    };

    // Você pode brincar gerando um Título Baseado no Antagonista ou Local se quiser no futuro
    const antagonistaCurto = adventure.antagonist.split(":")[0]; // "O Cavaleiro Corrompido"
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
