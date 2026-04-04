/**
 * Admin Seed API - Importar dados de cenários para Firestore
 * USO: Para migrar dados de arquivos fixos para Firestore
 */

import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

const SCENARIOS_COLLECTION = "scenarios";

/**
 * POST /api/admin/seed-scenario
 * Body: { scenarioId: string, data: object }
 * Descrição: Cria/atualiza um cenário completo no Firestore
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { scenarioId, data } = body;

    if (!scenarioId) {
      return NextResponse.json(
        { error: "scenarioId é obrigatório" },
        { status: 400 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "data é obrigatório" },
        { status: 400 },
      );
    }

    const scenarioRef = doc(db, SCENARIOS_COLLECTION, scenarioId);

    // Adicionar metadados de migração
    const seedData = {
      ...data,
      migratedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(scenarioRef, seedData, { merge: true });

    return NextResponse.json({
      success: true,
      message: `Cenário ${scenarioId} seedado com sucesso`,
      data: {
        id: scenarioId,
        ...seedData,
      },
    });
  } catch (error) {
    console.error("Erro no seed de cenário:", error);
    return NextResponse.json(
      { error: "Erro no seed", details: error.message },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
