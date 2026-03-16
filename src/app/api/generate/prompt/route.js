import {NextResponse} from "next/server";

export async function POST(request) {
  try {
    const {character, context, artStyle} = await request.json();

    const weapons = (character.armas || []).map((w) => w.name).join(", ");
    const armor = (character.armaduras || []).map((a) => a.name).join(", ");
    const items = (character.itens || []).map((i) => i.name).join(", ");
    const advantages = (character.vantagens || [])
      .map((v) => v.name)
      .join(", ");
    const complications = (character.complicacoes || [])
      .map((c) => c.name)
      .join(", ");
    const awakeningResources = (character.recursos_despertar || [])
      .map((r) => `${r.name} (Nv ${r.nivel})`)
      .join(", ");

    const stylePrompts = {
      solo_leveling:
        "Anime Style, Solo Leveling Manhwa Art Style, High Quality, 8k resolution, Cinematic Lighting.",
      dark_fantasy:
        "Dark Fantasy, Grimdark, highly detailed, realistic digital painting, 8k resolution, dramatic shadows.",
      cyberpunk:
        "Cyberpunk anime style, neon lighting, futuristic, high quality, 8k resolution.",
      ghibli:
        "Studio Ghibli style, vibrant colors, magical, detailed anime background, soft lighting, 8k resolution.",
      comic_book:
        "American Comic Book style, heavy ink lines, dynamic shading, vibrant colors, 8k resolution.",
    };

    const selectedStylePrompt =
      stylePrompts[artStyle] || stylePrompts["solo_leveling"];

    const prompt = `
      ${selectedStylePrompt}
      Character Name: ${character.nome || "Unknown Hunter"}.
      Archetype/Class: ${character.arquetipo || "Hunter"}.
      Concept: ${character.conceito || "Adventurer"}.
      Physical Appearance: Age ${character.idade || "Unknown"}, Height ${character.altura || "Unknown"}, Weight ${character.peso || "Unknown"}, Hair ${character.cabelos || "Unknown"}, Eyes ${character.olhos || "Unknown"}, Skin ${character.pele || "Unknown"}.
      Visual Description/History: ${character.descricao || "A powerful modern fantasy hunter ready for battle"}.
      Awakening: Affinity ${character.despertar_afinidade || "Blue"}, Mark ${character.despertar_marca || "None"}.
      Unique Power: ${awakeningResources || "None"}.
      Equipment: Weapons (${weapons || "None"}), Armor (${armor || "Standard Hunter Gear"}), Items (${items || "None"}).
      Traits: Advantages (${advantages || "None"}), Complications (${complications || "None"}).
      Context/Background: ${context || "Dark fantasy dungeon with blue magical aura"}.
      CRITICAL: Always in Portrait format. The character must be perfectly centered (waist-up or full body). Do NOT crop the head, weapons, or limbs. Leave empty space around the character.
      The character should look heroic, standing in a dynamic pose, with glowing magical effects if applicable. Negative prompt: cropped, out of frame, close-up, cut off.
    `;

    return NextResponse.json({prompt});
  } catch (error) {
    console.error("Erro ao gerar prompt:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
