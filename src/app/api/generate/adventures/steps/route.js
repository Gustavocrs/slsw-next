import {NextResponse} from "next/server";
import {GoogleGenerativeAI} from "@google/generative-ai";

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY não encontrada nas variáveis de ambiente.");
      return NextResponse.json(
        {error: "Chave da API do Gemini não configurada no servidor."},
        {status: 500},
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const body = await request.json();
    const {step, adventure} = body;

    if (!step || !adventure) {
      return NextResponse.json(
        {error: "Faltando parâmetros 'step' ou 'adventure'."},
        {status: 400},
      );
    }

    const modelName = process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({model: modelName});

    let prompt = "";

    switch (step) {
      case "narrative":
        prompt = `
Você é um Mestre de RPG profissional (Game Master). Baseado nos dados abaixo, crie uma introdução épica para a aventura.
Tema: ${adventure.theme}
Gancho: ${adventure.hook}
Objetivo: ${adventure.objective}
Localização: ${adventure.location}
Reviravolta: ${adventure.twist}

TAREFA:
1. Escreva 3 parágrafos narrativos em Português do Brasil descrevendo a cena inicial e a chegada dos jogadores.
2. Ao final, adicione um bloco chamado [PROMPT DE IMAGEM] contendo um prompt em INGLÊS otimizado para Midjourney/DALL-E descrevendo visualmente este cenário inicial.
`;
        break;

      case "encounters":
        prompt = `
Você é um Mestre de RPG. Desenvolva os desafios da masmorra baseando-se nestes dados:
Monstros: ${adventure.encounters?.map((e) => e.name).join(", ")}
Armadilhas: ${adventure.traps?.join(", ")}

TAREFA:
1. Descreva como são as salas onde essas armadilhas estão escondidas e como os monstros emboscam os jogadores (em Português).
2. Adicione um bloco chamado [PROMPT DE IMAGEM] com 1 a 2 prompts em INGLÊS descrevendo visualmente o monstro mais assustador ou a armadilha mais letal.
`;
        break;

      case "boss":
        prompt = `
Crie a cena climática do Chefe Final.
Chefe: ${adventure.antagonist?.name || "Desconhecido"} - ${adventure.antagonist?.description || ""}
Complicação durante a luta: ${adventure.complication}

TAREFA:
1. Descreva a aparência aterrorizante/imponente do Boss e suas táticas de combate na arena (em Português).
2. Adicione um bloco [PROMPT DE IMAGEM] com 1 prompt em INGLÊS extremamente detalhado focando no design de personagem deste Boss.
`;
        break;

      case "loot":
        prompt = `
Aja estritamente como um gerador de prompts de imagens para IA (Midjourney/Stable Diffusion).
Os jogadores derrotaram o Boss e encontraram os seguintes itens épicos:
Loot do Boss: ${adventure.bossLoot?.join(", ")}
Recompensa da Quest: ${adventure.reward}

TAREFA:
Não escreva texto narrativo. Retorne APENAS 3 a 4 prompts em INGLÊS, um para cada item de loot, focando em texturas, brilho mágico, tipo de item de RPG.
`;
        break;

      case "scenery":
        prompt = `
Aja estritamente como um gerador de prompts de imagens para IA.
Pistas encontradas na Dungeon: ${adventure.clues?.join(", ")}

TAREFA:
Não escreva texto narrativo. Retorne APENAS 2 prompts em INGLÊS descrevendo visualmente o cenário com essas pistas.
`;
        break;

      default:
        return NextResponse.json(
          {error: "Passo não reconhecido."},
          {status: 400},
        );
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      step: step,
      content: responseText,
    });
  } catch (error) {
    console.error(`Erro ao gerar passo com IA:`, error?.message || error);
    return NextResponse.json(
      {error: "Falha na comunicação com o provedor de IA."},
      {status: 500},
    );
  }
}
