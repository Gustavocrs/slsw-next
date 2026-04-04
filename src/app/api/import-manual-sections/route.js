import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { manualSections } from "@/data/manualSections";
import { db } from "@/lib/firebase";

export async function GET(request) {
  try {
    return NextResponse.json({
      success: true,
      data: manualSections,
    });
  } catch (error) {
    console.error("Erro ao ler manualSections:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao ler manualSections" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { scenarioId } = body;

    if (!scenarioId) {
      return NextResponse.json(
        { success: false, error: "scenarioId é obrigatório" },
        { status: 400 },
      );
    }

    const scenarioRef = doc(db, "scenarios", scenarioId);
    await updateDoc(scenarioRef, {
      loreSections: manualSections,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Seções do manual importadas com sucesso para o cenário ${scenarioId}`,
      data: manualSections,
    });
  } catch (error) {
    console.error("Erro na importação:", error);
    return NextResponse.json(
      { success: false, error: "Erro na importação: " + error.message },
      { status: 500 },
    );
  }
}
