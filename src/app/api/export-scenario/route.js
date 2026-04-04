/**
 * Export API - Exporta cenário completo do Firestore
 * GET /api/export-scenario?id={scenarioId}
 */

import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scenarioId = searchParams.get("id");

    if (!scenarioId) {
      return NextResponse.json(
        { error: "ID do cenário é obrigatório" },
        { status: 400 },
      );
    }

    const scenarioRef = doc(db, "scenarios", scenarioId);
    const docSnap = await getDoc(scenarioRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Cenário não encontrado no Firestore" },
        { status: 404 },
      );
    }

    const scenarioData = docSnap.data();

    // Retornar dados completos
    return NextResponse.json({
      success: true,
      scenario: {
        id: docSnap.id,
        ...scenarioData,
      },
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao exportar cenário:", error);
    return NextResponse.json(
      { error: "Erro ao exportar cenário", details: error.message },
      { status: 500 },
    );
  }
}
