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
Aja estritamente como um gerador de prompts de imagens para IA (Midjourney/Stable Diffusion).
Cenário: ${adventure.location}. Tema: ${adventure.theme}.

TAREFA:
Não escreva texto narrativo. Retorne APENAS 1 prompt em INGLÊS otimizado para Midjourney/DALL-E. O prompt DEVE obrigatoriamente começar com a frase "A high quality image of..." descrevendo visualmente este cenário inicial.
RESTRIÇÃO: O ambiente da Dungeon é ESTRITAMENTE Fantasia Medieval. Adicione restrições contra elementos modernos (ex: "medieval fantasy setting, no firearms, no modern weapons, no sci-fi").
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
Aja estritamente como um gerador de prompts de imagens para IA.
Localização: ${adventure.location}. Tema: ${adventure.theme}. Estrutura: ${adventure.rooms} salas.

TAREFA:
Não escreva texto narrativo. Gere múltiplos prompts em INGLÊS, separando cada um por uma linha em branco:
1. O primeiro prompt DEVE ser para o mapa visual geral (começando com "Generate a top-down RPG battlemap image of...").
2. Em seguida, gere de 2 a 3 prompts adicionais, um para cada sala/área importante da dungeon (começando com "A high quality environment concept art of room...").
RESTRIÇÃO: Ambiente de fantasia medieval. Inclua restrições contra armas de fogo e tecnologia moderna (ex: "medieval fantasy, no firearms, no sci-fi").
`;
        break;

      case "encounters_image":
        prompt = `
Aja estritamente como um gerador de prompts de imagens para IA (Midjourney/Stable Diffusion).
Monstros: ${adventure.encounters?.map((e) => e.name).join(", ")}
Armadilhas: ${adventure.traps?.join(", ")}

TAREFA:
Não escreva texto narrativo. Retorne APENAS 1 prompt em INGLÊS. O prompt DEVE obrigatoriamente começar com "Generate an image of..." descrevendo visualmente o monstro mais assustador ou a armadilha mais letal descritos acima.
RESTRIÇÃO: Estilo Fantasia Medieval. Especifique que monstros/personagens na cena não devem ter armas modernas (ex: "medieval fantasy rpg style, no guns, no modern weapons").
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
Aja estritamente como um gerador de prompts de imagens para IA (Midjourney/Stable Diffusion).
Chefe: ${adventure.antagonist?.name || "Desconhecido"} - ${adventure.antagonist?.description || ""}

TAREFA:
Não escreva texto narrativo. Retorne APENAS 1 prompt em INGLÊS. O prompt DEVE obrigatoriamente começar com "A highly detailed cinematic image of..." focando no design aterrorizante deste Boss.
RESTRIÇÃO: Boss e ambiente de Fantasia Medieval. Adicione exclusões claras de armas modernas (ex: "medieval dark fantasy, no firearms, no guns, no modern elements").
`;
        break;

      case "loot_image":
        prompt = `
Aja estritamente como um gerador de prompts de imagens para IA (Midjourney/Stable Diffusion).
Os jogadores derrotaram o Boss e encontraram os seguintes itens épicos:
Loot do Boss: ${adventure.bossLoot?.join(", ")}

TAREFA:
Não escreva texto narrativo. Escolha 1 ou 2 dos loots acima e retorne os prompts em INGLÊS separados por linha. O prompt DEVE obrigatoriamente começar com "A high quality concept art image of an item..." focando em texturas e brilho mágico do item.
RESTRIÇÃO: Itens de Fantasia Medieval. Proibido armas de fogo ou tecnologia (ex: "medieval fantasy item, no modern technology, no firearms").
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
