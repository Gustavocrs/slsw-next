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
import projectSymbiosisScenario from "@/scenarios/project-symbiosis";

export const dynamic = "force-dynamic";

const SCENARIOS_COLLECTION = "scenarios";

const DEFAULT_SOLO_LEVELING_DATA = {
  edges: [
    {
      name: "Ataque Fantasma",
      description: "Ataque ignora 4 pontos de armadura física.",
      rank: "Experiente",
      source: "SL",
    },
    {
      name: "Marca de Predador",
      description: "+2 em Rastrear e +1 no dano contra um alvo marcado.",
      rank: "Experiente",
      source: "SL",
    },
    {
      name: "Sangue Frio (SL)",
      description: "+4 para resistir a Medo e Intimidação sobrenatural.",
      rank: "Experiente",
      source: "SL",
    },
    {
      name: "Corpo Disciplinado",
      description: "+2 para resistir a fadiga e venenos.",
      rank: "Veterano",
      source: "SL",
    },
    {
      name: "Portador da Centelha",
      description: "Aumenta a regeneração de Mana natural.",
      rank: "Veterano",
      source: "SL",
    },
    {
      name: "Velocidade Guiada pela Mana",
      description:
        "Gasta 2 PP para ignorar 2 pontos de penalidade de Ação Múltipla.",
      rank: "Veterano",
      source: "SL",
    },
    {
      name: "Instinto Arcano",
      description:
        "Teste de Perceber gratuito para notar magia ativa a até 20m.",
      rank: "Veterano",
      source: "SL",
    },
    {
      name: "Arremesso Perfeito",
      description: "Dobra o alcance de armas de arremesso; +2 dano.",
      rank: "Heroico",
      source: "SL",
    },
    {
      name: "Golpe Cortante",
      description: "Ataques causam sangramento (dano contínuo).",
      rank: "Heroico",
      source: "SL",
    },
    {
      name: "Reflexos de Caçador",
      description: "Pode aparar projéteis mágicos.",
      rank: "Heroico",
      source: "SL",
    },
    {
      name: "Sangue Arcano",
      description: "Reduz custo de todas as magias em 1 PP (mínimo 1).",
      rank: "Heroico",
      source: "SL",
    },
    {
      name: "Compasso Sombrio",
      description: "Teleporte curto (passo das sombras) como ação livre.",
      rank: "Heroico",
      source: "SL",
    },
    {
      name: "Furor de Guerra",
      description: "Ganha +1 dano a cada ferimento sofrido.",
      rank: "Lendário",
      source: "SL",
    },
    {
      name: "Alma de Aço",
      description: "Ignora todos os redutores de ferimento.",
      rank: "Lendário",
      source: "SL",
    },
    {
      name: "Conduíte de Poder",
      description: "Pode canalizar Mana ilimitada por 3 rodadas.",
      rank: "Lendário",
      source: "SL",
    },
    {
      name: "Mestre da Batalha Interior",
      description: "Recupera Bennes ao defeating enemies poderosos.",
      rank: "Lendário",
      source: "SL",
    },
    {
      name: "Caminho do Caçador Alfa",
      description: "Lidera matilha; allies ganham bônus de ataque.",
      rank: "Lendário",
      source: "SL",
    },
  ],
  awakeningRules: [
    {
      name: "Origem do Despertar",
      dice: 6,
      values: [
        { d: 1, value: "Explosão de Mana ao abrir um Portal" },
        { d: 2, value: "Toque de uma criatura rúnica morrendo" },
        { d: 3, value: "Contato com artefato ou relíquia antiga" },
        { d: 4, value: "Participação em ritual arcano instável" },
        { d: 5, value: "Trauma físico extremo (quase-morte)" },
        { d: 6, value: "Chamado de uma entidade desconhecida" },
      ],
    },
    {
      name: "Sensação do Despertar",
      dice: 8,
      values: [
        { d: 1, value: "Calor intenso no peito" },
        { d: 2, value: "Clarão repentino e perda breve de sentidos" },
        { d: 3, value: "Sensação de leveza, como flutuar" },
        { d: 4, value: "Eco de uma voz ou memória estranha" },
        { d: 5, value: "Veias brilhando por segundos" },
        { d: 6, value: "Dor aguda seguida de calma profunda" },
        { d: 7, value: "Sombra movendo-se por conta própria" },
        { d: 8, value: "Percepção do tempo ficar lento" },
      ],
    },
    {
      name: "Afinidade de Mana",
      dice: 10,
      values: [
        { d: 1, value: "Fogosa - Força e impacto físico" },
        { d: 2, value: "Sombria - Furtividade e sombras" },
        { d: 3, value: "Luminosa - Cura e proteção" },
        { d: 4, value: "Instável - Poder alto, risco alto" },
        { d: 5, value: "Ancestral - Vínculo com Runas" },
        { d: 6, value: "Elemental - Fogo, vento, terra, gelo" },
        { d: 7, value: "Bestial - Força bruta e sentidos" },
        { d: 8, value: "Sábia - Controle mágico refinado" },
        { d: 9, value: "Pura - Interação com Portais" },
        { d: 10, value: "Corrompida - Mutações e riscos" },
      ],
    },
    {
      name: "Marca do Despertado",
      dice: 12,
      values: [
        {
          d: 1,
          value: "Veias brilhantes - Bônus em controle de Mana 1x/sessão",
        },
        { d: 2, value: "Olho alterado - Detecta magia fraca" },
        { d: 3, value: "Sombra viva - Bônus em Furtividade" },
        { d: 4, value: "Aura quente - Resistência temporária a frio" },
        { d: 5, value: "Aura fria - Resistência temporária a fogo" },
        { d: 6, value: "Runa no peito - Reduz dano mágico 1x/sessão" },
        { d: 7, value: "Respiração pesada - Bônus permanente em Vigor" },
        { d: 8, value: "Voz dupla - Bônus em Intimidação" },
        { d: 9, value: "Cabelo que muda - Bônus social" },
        { d: 10, value: "Cicatriz brilhante - Redução passiva de dano mágico" },
        { d: 11, value: "Mãos frias - Revela ilusões ao toque" },
        { d: 12, value: "Forma astral - Deslocamento curto 1x/sessão" },
      ],
    },
  ],
  loreSections: [
    {
      id: "introducao-como-usar",
      title: "Introdução & Como Usar o Guia",
      content:
        "<p><strong>Visão geral acessível, mesmo para quem nunca ouviu falar de Solo Leveling</strong></p><p>Este guia apresenta um novo estilo de aventura medieval inspirado no universo de Solo Leveling — mas não é necessário conhecer a obra original para jogar.</p>",
      contentHtml:
        "<p><strong>Visão geral acessível, mesmo para quem nunca ouviu falar de Solo Leveling</strong></p><p>Este guia apresenta um novo estilo de aventura medieval inspirado no universo de Solo Leveling — mas não é necessário conhecer a obra original para jogar.</p>",
    },
    {
      id: "o-despertar",
      title: "O Despertar",
      content:
        "<p><em>O coração do cenário — explicação clara, mecânica passo a passo e tabelas para jogadores iniciantes.</em></p>",
      contentHtml:
        "<p><em>O coração do cenário — explicação clara, mecânica passo a passo e tabelas para jogadores iniciantes.</em></p>",
    },
    {
      id: "poder-unico-despertar",
      title: "Poder Único do Despertar",
      content:
        "<p>Ao atravessar o <strong>Despertar</strong>, cada Caçador manifesta um <strong>Poder Único</strong> — uma habilidade singular que define sua existência dentro do sistema de Portais.</p>",
      contentHtml:
        "<p>Ao atravessar o <strong>Despertar</strong>, cada Caçador manifesta um <strong>Poder Único</strong> — uma habilidade singular que define sua existência dentro do sistema de Portais.</p>",
    },
  ],
};

const DEFAULT_PROJECT_SYMBIOSIS_DATA = {
  edges: projectSymbiosisScenario.edges || [],
  hindrances: projectSymbiosisScenario.hindrances || [],
  awakeningRules: projectSymbiosisScenario.awakeningRules || [],
  powers: projectSymbiosisScenario.powers || {},
  extraFields: projectSymbiosisScenario.extraFields || {},
  promptStyles: projectSymbiosisScenario.promptStyles || {},
  skills: projectSymbiosisScenario.skills || {},
  loreSections: projectSymbiosisScenario.loreSections || [],
  adventureGenerator: projectSymbiosisScenario.adventureGenerator || {},
};

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
        if (scenarioId === "solo-leveling") {
          return NextResponse.json({
            id: "solo-leveling",
            metadata: {
              id: "solo-leveling",
              name: "Solo Leveling Medieval",
              description:
                "Sistema de RPG inspirado em Solo Leveling com Portais, Dungeons e Despertar de poderes.",
            },
            ...DEFAULT_SOLO_LEVELING_DATA,
          });
        }
        if (scenarioId === "project-symbiosis") {
          return NextResponse.json({
            id: "project-symbiosis",
            metadata: projectSymbiosisScenario.metadata,
            ...DEFAULT_PROJECT_SYMBIOSIS_DATA,
          });
        }
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
