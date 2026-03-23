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
    const {step, adventure, previousText, monster} = body;

    if (!step || (!adventure && !monster)) {
      return NextResponse.json(
        {error: "Faltando parâmetros 'step', 'adventure' ou 'monster'."},
        {status: 400},
      );
    }

    const modelName = process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({model: modelName});

    let prompt = "";

    switch (step) {
      case "narrative_text":
        prompt = `
Você é um Mestre de RPG profissional (Game Master). Baseado nos dados abaixo, crie uma introdução épica para a aventura.
Tema: ${adventure.theme}
Gancho: ${adventure.hook}
Objetivo: ${adventure.objective}
Localização: ${adventure.location}
Reviravolta: ${adventure.twist}

TAREFA:
Escreva 3 parágrafos narrativos em Português do Brasil descrevendo a cena inicial e a chegada dos jogadores. NÃO escreva prompts de imagem.
`;
        break;

      case "narrative_image":
        prompt = `
# SYSTEM CONTEXT
You are an expert AI Prompt Engineer for RPG visual assets (Midjourney/DALL-E).
Theme: ${adventure.theme}
Location: ${adventure.location}
${previousText ? `\n# NARRATIVE CONTEXT (Base your visual description exactly on this):\n${previousText}\n` : ""}

# OBJECTIVE
Create exactly 1 highly detailed image prompt in ENGLISH capturing the initial scene.

# CONSTRAINTS
- Strictly Medieval Fantasy. Include exclusions for modern elements (e.g., "medieval fantasy setting, no firearms, no modern weapons, no sci-fi").
- Start the prompt with: "A high quality image of..."
- Output ONLY the prompt. Do not include conversational text or markdown blocks.
`;
        break;

      case "map_text":
        prompt = `
Você é um Mestre de RPG profissional. Desenvolva o layout da masmorra baseando-se nestes dados:
Estrutura: A dungeon possui ${adventure.rooms} salas mapeadas.
Pistas e Segredos: ${adventure.clues?.join(", ")}
Local da Fenda: ${adventure.location}

TAREFA:
1. Descreva detalhadamente o mapa da dungeon, dividindo-o pelas ${adventure.rooms} salas ou áreas principais. Em qual sala as pistas estão escondidas?
2. Especifique quais testes de perícias de RPG (como Perceber, Investigar, Ocultismo ou Sobrevivência) os jogadores devem fazer para encontrar as pistas ou analisar o ambiente.

Escreva apenas o texto narrativo em Português. NÃO escreva prompts de imagem.
`;
        break;

      case "encounters_text":
        prompt = `
Você é um Mestre de RPG. Desenvolva os desafios da masmorra baseando-se nestes dados:
Monstros: ${adventure.encounters?.map((e) => e.name).join(", ")}
Armadilhas: ${adventure.traps?.join(", ")}

TAREFA:
Descreva como são as salas onde essas armadilhas estão escondidas e como os monstros emboscam os jogadores (em Português). NÃO escreva prompts de imagem.
`;
        break;

      case "map_image":
        prompt = `
# SYSTEM CONTEXT
You are an expert AI Prompt Engineer for RPG visual assets.
Theme: ${adventure.theme}
Location: ${adventure.location}
Total Rooms: ${adventure.rooms}
${previousText ? `\n# NARRATIVE CONTEXT (Base your visuals on this map description):\n${previousText}\n` : ""}

# OBJECTIVE
Generate exactly ${adventure.rooms + 1} image prompts in ENGLISH.
- Prompt 1: An overall top-down RPG battlemap showing all ${adventure.rooms} rooms interconnected.
- Prompts 2 to ${adventure.rooms + 1}: Individual environment concept arts for EACH of the ${adventure.rooms} individual rooms described.

# CONSTRAINTS
- Strictly Medieval Fantasy. NO firearms, NO modern technology (e.g., "medieval fantasy, no firearms, no sci-fi").
- The overall map prompt MUST start with: "Generate a top-down RPG battlemap image of..."
- Each individual room prompt MUST start with: "A high quality environment concept art of room..."
- Separate each prompt with a blank line. Output ONLY the prompts.
`;
        break;

      case "encounters_image":
        prompt = `
# SYSTEM CONTEXT
You are an expert AI Prompt Engineer for RPG visual assets.
Monsters: ${adventure.encounters?.map((e) => e.name).join(", ")}
Traps: ${adventure.traps?.join(", ")}
${previousText ? `\n# NARRATIVE CONTEXT (Base your visual description exactly on this):\n${previousText}\n` : ""}

# OBJECTIVE
Create exactly 1 highly detailed image prompt in ENGLISH capturing the most terrifying monster or deadliest trap from the narrative.

# CONSTRAINTS
- Strictly Medieval Fantasy. Exclude modern items (e.g., "medieval fantasy rpg style, no guns, no modern weapons").
- Start the prompt with: "Generate an image of..."
- Output ONLY the prompt. Do not include conversational text.
`;
        break;

      case "boss_text":
        prompt = `
Crie a cena climática do Chefe Final.
Chefe: ${adventure.antagonist?.name || "Desconhecido"} - ${adventure.antagonist?.description || ""}
Complicação durante a luta: ${adventure.complication}

TAREFA:
Descreva a aparência aterrorizante/imponente do Boss e suas táticas de combate na arena (em Português). NÃO escreva prompts de imagem.
`;
        break;

      case "boss_image":
        prompt = `
# SYSTEM CONTEXT
You are an expert AI Prompt Engineer for RPG visual assets.
Boss: ${adventure.antagonist?.name || "Unknown"} - ${adventure.antagonist?.description || ""}
${previousText ? `\n# NARRATIVE CONTEXT (Base your visual description exactly on this):\n${previousText}\n` : ""}

# OBJECTIVE
Create exactly 1 highly detailed image prompt in ENGLISH focusing on the terrifying character design of this Boss.

# CONSTRAINTS
- Strictly Medieval Fantasy. Exclude modern items (e.g., "medieval dark fantasy, no firearms, no guns, no modern elements").
- Start the prompt with: "A highly detailed cinematic image of..."
- Output ONLY the prompt. Do not include conversational text.
`;
        break;

      case "loot_image":
        prompt = `
# SYSTEM CONTEXT
You are an expert AI Prompt Engineer for RPG visual assets.
Boss Loot: ${adventure.bossLoot?.join(", ")}

# OBJECTIVE
Select 1 or 2 items from the loot list and generate individual image prompts in ENGLISH focusing on their textures and magical glow.

# CONSTRAINTS
- Strictly Medieval Fantasy. Exclude modern technology (e.g., "medieval fantasy item, no modern technology, no firearms").
- Start each prompt with: "A high quality concept art image of an item..."
- Separate prompts with a blank line. Output ONLY the prompts.
`;
        break;

      case "monster_image":
        prompt = `
# SYSTEM CONTEXT
You are an expert AI Prompt Engineer for RPG visual assets.
Monster: ${monster?.name || "Unknown"}
Stats/Features: ${JSON.stringify(monster?.attributes || monster?.toughness || "No details")}

# OBJECTIVE
Create exactly 1 highly detailed image prompt in ENGLISH focusing on the character design of this creature.

# CONSTRAINTS
- Strictly Medieval Fantasy. Exclude modern items (e.g., "medieval fantasy rpg style, no guns, no modern weapons").
- The image will be used in a small size (max 300px height). Focus on a clean, simple background and a clear portrait/token style of the monster's face/upper body. Avoid tiny cluttered details.
- Start the prompt with: "A high quality character portrait concept art of..."
- Output ONLY the prompt. Do not include conversational text.
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
