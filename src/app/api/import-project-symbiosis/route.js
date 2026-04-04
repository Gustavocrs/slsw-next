/**
 * Import Project Symbiosis API
 * POST /api/import-project-symbiosis
 * Retorna os dados do cenário Project Symbiosis para importação
 */

import { NextResponse } from "next/server";
import projectSymbiosis from "@/scenarios/project-symbiosis";

export async function POST() {
  try {
    // Extrair dados reais do cenário
    const edges = Array.isArray(projectSymbiosis.edges)
      ? projectSymbiosis.edges
      : projectSymbiosis.edges?.edges || [];

    const hindrances = Array.isArray(projectSymbiosis.hindrances)
      ? projectSymbiosis.hindrances
      : projectSymbiosis.hindrances?.hindrances || [];

    const powers =
      typeof projectSymbiosis.powers === "object" &&
      projectSymbiosis.powers !== null
        ? projectSymbiosis.powers
        : projectSymbiosis.powers?.powers || {};

    const awakeningRules = Array.isArray(projectSymbiosis.awakeningRules)
      ? projectSymbiosis.awakeningRules
      : projectSymbiosis.awakeningRules?.awakeningRules || [];

    const scenarioData = {
      id: "project-symbiosis",
      metadata: projectSymbiosis.metadata,
      edges: edges,
      hindrances: hindrances,
      powers: powers,
      awakeningRules: awakeningRules,
      extraFields: projectSymbiosis.extraFields || {},
      promptStyles: projectSymbiosis.promptStyles || {},
      skills: projectSymbiosis.skills || {},
      loreSections: projectSymbiosis.loreSections || [],
      adventureGenerator: projectSymbiosis.adventureGenerator || {},
      importedAt: new Date().toISOString(),
      source: "code-import",
    };

    return NextResponse.json({
      success: true,
      message: "Dados do Project Symbiosis preparados!",
      data: scenarioData,
    });
  } catch (error) {
    console.error("Erro ao preparar Project Symbiosis:", error);
    return NextResponse.json(
      { error: "Erro ao preparar cenário", details: error.message },
      { status: 500 },
    );
  }
}
