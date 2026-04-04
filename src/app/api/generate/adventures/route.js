import { GoogleGenerativeAI } from "@google/generative-ai";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { getScenario, loadScenarioFromFirestore } from "@/scenarios/index.js";

export const dynamic = "force-dynamic";

/**
 * Algoritmo Fisher-Yates para embaralhamento de arrays in-place.
 * @param {Array} array
 * @returns {Array} Array embaralhado
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const players = parseInt(searchParams.get("players") || "4", 10);
  const swadeRank = searchParams.get("swadeRank") || "Novato";
  const hunterRank = searchParams.get("hunterRank") || "E";
  const rooms = players + 1;
  const encountersCount = Math.max(1, Math.floor(players / 2));

  const apiKey = process.env.GEMINI_API_KEY;
  const apiModel = process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    return NextResponse.json(
      { error: "Chave da API do Gemini não configurada no servidor." },
      { status: 500 },
    );
  }

  try {
    // 1. Buscar o Bestiário INTEIRO no Firestore
    let allMonsters = [];
    try {
      const monstersRef = collection(db, "monsters");
      const monstersSnap = await getDocs(monstersRef);
      allMonsters = monstersSnap.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        type: doc.data().type,
        rank: doc.data().rank,
        description: doc.data().description || "",
        stats:
          doc.data().stats ||
          `Resistência: ${doc.data().toughness || "?"} | Aparar: ${doc.data().parry || "?"}`,
        loot: doc.data().loot || "Nada",
      }));
    } catch (dbError) {
      console.error("Falha ao acessar Firestore na rota de aventura:", dbError);
      return NextResponse.json(
        { error: "Erro no banco de dados.", details: dbError.message },
        { status: 500 },
      );
    }

    // Adicionado um fallback de segurança para evitar erro fatal caso o bestiário esteja vazio.
    if (allMonsters.length === 0) {
      console.error("Bestiário vazio. Não é possível gerar aventura com IA.");
      return NextResponse.json(
        {
          error:
            "O bestiário está vazio. Adicione monstros antes de gerar uma aventura.",
        },
        { status: 500 },
      );
    }

    // 2. Prepara pools de monstros por Rank para enviar ao LLM (Contexto Lógico)
    const rankOrder = [
      "Novato",
      "Experiente",
      "Veterano",
      "Heroico",
      "Lendário",
    ];
    const rankIndex = rankOrder.includes(swadeRank)
      ? rankOrder.indexOf(swadeRank)
      : 0;

    // Bosses: Rank atual da mesa ou no máximo 1 rank acima (para desafio de Chefe)
    const allowedBossRanks = [swadeRank];
    if (rankIndex < rankOrder.length - 1) {
      allowedBossRanks.push(rankOrder[rankIndex + 1]);
    }

    // Minions (Lacaios): Rank atual da mesa ou inferiores
    const allowedMinionRanks = rankOrder.slice(0, rankIndex + 1);

    let possibleBosses = allMonsters.filter(
      (m) => allowedBossRanks.includes(m.rank) && m.type !== "Extra",
    );

    // Fallback: se não houver chefes (Cartas Selvagens) suficientes, aceita qualquer monstro dos ranks permitidos
    if (possibleBosses.length === 0) {
      possibleBosses = allMonsters.filter((m) =>
        allowedBossRanks.includes(m.rank),
      );
    }

    let possibleMonsters = allMonsters.filter(
      (m) => allowedMinionRanks.includes(m.rank) && m.type === "Extra",
    );

    // Fallback de Lacaios
    if (possibleMonsters.length === 0) {
      possibleMonsters = allMonsters.filter((m) =>
        allowedMinionRanks.includes(m.rank),
      );
    }

    // Fallbacks
    if (possibleBosses.length === 0) possibleBosses = allMonsters;
    if (possibleMonsters.length === 0) possibleMonsters = allMonsters;

    const bossContext = shuffleArray(possibleBosses)
      .slice(0, 40) // Limita a 40 para evitar estourar o limite de payload/tokens
      .map((m) => `{id: "${m.id}", name: "${m.name}", type: "${m.type}"}`)
      .join(", ");
    const minionsContext = shuffleArray(possibleMonsters)
      .slice(0, 80) // Limita a 80 para evitar estourar o limite de payload/tokens
      .map((m) => `{id: "${m.id}", name: "${m.name}", type: "${m.type}"}`)
      .join(", ");

    // 3. Configurar Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: apiModel,
      generationConfig: { responseMimeType: "application/json" },
    });

    // Garantir que o cenário está carregado (para configuracões específicas se necessário)
    const activeScenarioId =
      process.env.NEXT_PUBLIC_ACTIVE_SCENARIO || "solo-leveling";
    await loadScenarioFromFirestore(activeScenarioId);
    const scenario = getScenario(activeScenarioId);

    const prompt = `
      Você é um Mestre de RPG especialista em gerar missões coesas de Medieval High Fantasy para Caçadores de Fendas/Portais.
      Crie uma aventura garantindo que NENHUM elemento de tecnologia moderna exista dentro da masmorra.
      
      CRIE UMA MISSÃO COESA ONDE TUDO FAÇA SENTIDO JUNTO.
      - Título: Crie um nome ÉPICO e ÚNICO para a operação (Ex: "Operação: Névoa Sangrenta" ou "O Sepulcro Esquecido").
      - Tema: Uma breve descrição do bioma ou atmosfera (Ex: "Necrópole Congelada", "Ruínas Vulcânicas").
      - Local: Bioma medieval fantasia.
      - Gancho: Motivo da incursão.
      - Objetivo: Ligado estritamente ao gancho.
      - Reviravolta: Ligada estritamente ao objetivo.
      - Pistas: 2 pistas físicas/mágicas sobre a masmorra/monstros.
      - Armadilhas: 2 armadilhas lógicas para este ambiente.
      - Recompensa e Loot: Itens medievais de fantasia.
      
      BESTIÁRIO E ENCONTROS (CRÍTICO):
      A partir das listas abaixo, escolha 1 Boss e ${encountersCount} Minions DIFERENTES.
      O Boss e os Minions DEVEM fazer sentido com o "Local" escolhido (ex: não coloque lobo de gelo em vulcão).
      
      Opções de Bosses: [${bossContext}]
      Opções de Minions: [${minionsContext}]

      Responda EXATAMENTE com a seguinte estrutura JSON (nada de markdown ou texto fora do JSON):
      {
        "title": "...",
        "theme": "...",
        "hook": "...",
        "objective": "...",
        "location": "...",
        "twist": "...",
        "complication": "...",
        "reward": "...",
        "clues": ["...", "..."],
        "traps": ["...", "..."],
        "bossLoot": ["...", "..."],
        "selectedBossId": "ID do boss escolhido",
        "selectedMinionsIds": ["ID1", "ID2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let aiData;
    try {
      aiData = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "Falha ao parsear JSON da IA. Resposta recebida:",
        responseText,
      );
      throw new Error(`A resposta da IA não é um JSON válido.`);
    }

    // 4. Reidratar Dados dos Monstros a partir dos IDs selecionados pela IA
    const bossData =
      allMonsters.find((m) => m.id === aiData.selectedBossId) || allMonsters[0];

    const encounters = [];
    const selectedMinionIds = aiData.selectedMinionsIds || [];

    // Garante a quantidade de encontros correta caso a IA falhe na contagem
    for (let i = 0; i < encountersCount; i++) {
      const mId = selectedMinionIds[i] || selectedMinionIds[0];
      const mData =
        allMonsters.find((m) => m.id === mId) ||
        allMonsters[Math.floor(Math.random() * allMonsters.length)];

      encounters.push({
        id: mData.id,
        name: mData.name,
        type: mData.type,
        stats: mData.stats,
        loot: mData.loot || "Espólios comuns",
      });
    }

    // 5. Monta e retorna o objeto esperado pelo Frontend
    const adventure = {
      title: aiData.title || `Operação Fenda ${hunterRank}`,
      theme: aiData.theme,
      hook: aiData.hook,
      objective: aiData.objective,
      location: aiData.location,
      twist: aiData.twist,
      complication: aiData.complication,
      reward: aiData.reward,
      antagonist: {
        id: bossData.id,
        name: bossData.name,
        description: bossData.description || `Chefe (${bossData.type})`,
        stats: bossData.stats,
      },
      encounters,
      traps: aiData.traps,
      clues: aiData.clues,
      bossLoot: aiData.bossLoot,
      rooms,
      players,
      swadeRank,
      hunterRank,
    };

    return NextResponse.json(adventure);
  } catch (error) {
    console.error(
      "Erro CRÍTICO ao gerar aventura base:",
      error.message || error,
    );
    return NextResponse.json(
      {
        error: "Falha ao processar IA ou banco de dados.",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
