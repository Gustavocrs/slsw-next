import {NextResponse} from "next/server";

export async function POST(request) {
  try {
    const {character, context} = await request.json();

    // Prompt otimizado para o estilo Solo Leveling
    const prompt = `
      Anime Style, Solo Leveling Manhwa Art Style, High Quality, 8k resolution, Cinematic Lighting.
      Character Name: ${character.nome || "Unknown Hunter"}.
      Archetype/Class: ${character.arquetipo || "Hunter"}.
      Visual Description: ${character.aparencia || "A powerful modern fantasy hunter ready for battle"}.
      Concept: ${character.conceito || "Adventurer"}.
      Context/Background: ${context || "Dark fantasy dungeon with blue magical aura"}.
      Always in Portrait format.
      The character should look heroic, standing in a dynamic pose, with glowing magical effects if applicable.
    `;

    return NextResponse.json({prompt});
  } catch (error) {
    console.error("Erro ao gerar prompt:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
