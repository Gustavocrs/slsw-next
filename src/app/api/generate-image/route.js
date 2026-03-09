import {NextResponse} from "next/server";
import OpenAI from "openai";
import path from "path";
import {writeFile, mkdir} from "fs/promises";
import {randomUUID} from "crypto";

export async function POST(request) {
  try {
    const {character, context} = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {error: "API Key da OpenAI não configurada no servidor."},
        {status: 500},
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prompt otimizado para o estilo Solo Leveling
    const prompt = `
      Anime Style, Solo Leveling Manhwa Art Style, High Quality, 8k resolution, Cinematic Lighting.
      Character Name: ${character.nome || "Unknown Hunter"}.
      Archetype/Class: ${character.arquetipo || "Hunter"}.
      Visual Description: ${character.aparencia || "A powerful modern fantasy hunter ready for battle"}.
      Concept: ${character.conceito || "Adventurer"}.
      Context/Background: ${context || "Dark fantasy dungeon with blue magical aura"}.
      The character should look heroic, standing in a dynamic pose, with glowing magical effects if applicable.
    `;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const imageBase64 = response.data[0].b64_json;
    const buffer = Buffer.from(imageBase64, "base64");

    // Salvar localmente na pasta public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, {recursive: true});

    const fileName = `AI-${randomUUID()}.png`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({url: `/uploads/${fileName}`});
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
