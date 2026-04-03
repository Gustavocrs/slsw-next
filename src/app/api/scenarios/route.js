/**
 * Scenarios API Route
 * CRUD completo para cenários no Firestore
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

const SCENARIOS_COLLECTION = "scenarios";

function sanitizeScenarioData(data) {
  const sanitized = {};
  const allowedFields = [
    "metadata",
    "edges",
    "hindrances",
    "powers",
    "awakeningRules",
    "extraFields",
    "promptStyles",
    "skills",
    "adventureGenerator",
    "loreSections",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      sanitized[field] = data[field];
    }
  });

  return sanitized;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scenarioId = searchParams.get("id");

    if (scenarioId) {
      const docRef = doc(db, SCENARIOS_COLLECTION, scenarioId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return NextResponse.json(
          { error: "Cenário não encontrado" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        id: docSnap.id,
        ...docSnap.data(),
      });
    }

    const querySnapshot = await getDocs(collection(db, SCENARIOS_COLLECTION));
    const scenarios = [];

    querySnapshot.forEach((doc) => {
      scenarios.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json(scenarios);
  } catch (error) {
    console.error("Erro ao buscar cenários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cenários", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do cenário é obrigatório" },
        { status: 400 },
      );
    }

    const sanitizedData = sanitizeScenarioData(data);
    const docRef = doc(db, SCENARIOS_COLLECTION, id);

    await setDoc(docRef, {
      ...sanitizedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id,
      message: "Cenário criado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar cenário:", error);
    return NextResponse.json(
      { error: "Erro ao criar cenário", details: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scenarioId = searchParams.get("id");

    if (!scenarioId) {
      return NextResponse.json(
        { error: "ID do cenário é obrigatório" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const sanitizedData = sanitizeScenarioData(body);

    const docRef = doc(db, SCENARIOS_COLLECTION, scenarioId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Cenário não encontrado" },
        { status: 404 },
      );
    }

    await updateDoc(docRef, {
      ...sanitizedData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      id: scenarioId,
      message: "Cenário atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar cenário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cenário", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scenarioId = searchParams.get("id");

    if (!scenarioId) {
      return NextResponse.json(
        { error: "ID do cenário é obrigatório" },
        { status: 400 },
      );
    }

    const docRef = doc(db, SCENARIOS_COLLECTION, scenarioId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Cenário não encontrado" },
        { status: 404 },
      );
    }

    await deleteDoc(docRef);

    return NextResponse.json({
      id: scenarioId,
      message: "Cenário excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir cenário:", error);
    return NextResponse.json(
      { error: "Erro ao excluir cenário", details: error.message },
      { status: 500 },
    );
  }
}
