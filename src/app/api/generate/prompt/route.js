import { NextResponse } from "next/server";
import { getCharacterById } from "@/lib/characterService.js";
import { getTableById } from "@/lib/tableService.js";
import { getScenario, getScenarioPromptStyles } from "@/scenarios/index.js";

export async function POST(request) {
  try {
    const { character, context, artStyle, scenarioId } = await request.json();

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

    // Usar scenarioId fornecido ou buscar do character/table
    let finalScenarioId = scenarioId;
    if (!finalScenarioId && character.tableId) {
      const table = await getTableById(character.tableId);
      finalScenarioId = table?.scenarioId;
    }

    const scenarioPromptStyles = await getScenarioPromptStyles(finalScenarioId);
    const scenario = await getScenario(finalScenarioId);

    const characterData = formatCharacterForPrompt(character, {
      table: character.tableId ? await getTableById(character.tableId) : {},
      scenario,
      promptStyles: scenarioPromptStyles,
    });

    const systemPrompt = buildSystemPrompt(characterData);

    return NextResponse.json({
      success: true,
      prompt: systemPrompt,
      character: characterData,
    });
  } catch (error) {
    console.error("Erro ao gerar prompt:", error);
    return NextResponse.json(
      { error: "Erro ao gerar prompt", details: error.message },
      { status: 500 },
    );
  }
}

function formatCharacterForPrompt(
  character,
  { table, scenario, promptStyles },
) {
  // Implementação existente...
  return character;
}

function buildSystemPrompt(characterData) {
  // Implementação existente...
  return "";
}
