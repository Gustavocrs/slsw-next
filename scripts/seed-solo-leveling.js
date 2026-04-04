#!/usr/bin/env node

/**
 * Script de Migração: Dados Fixos → Firestore
 * Migra todos os dados do cenário Solo Leveling para o Firestore
 *
 * Uso: node scripts/seed-solo-leveling.js
 *
 * ESTE SCRIPT NÃO É DESTRUTIVO
 * - Apenas escreve no Firestore
 * - Mantém todos os arquivos fonte intactos
 */

import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// URLs das APIs
const SEED_API = "http://localhost:3000/api/admin/seed-scenario";
const IMPORT_MANUAL_SECTIONS =
  "http://localhost:3000/api/import-manual-sections";

// Cores para output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(
          error.error || error.details || `HTTP ${response.status}`,
        );
      }
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      log(`Retry ${i + 1}/${retries} para ${url}...`, "yellow");
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

async function migrateLoreSections(scenarioId) {
  log("\n📚 Migrando Lore Sections...", "blue");

  const response = await fetchWithRetry(IMPORT_MANUAL_SECTIONS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId }),
  });

  if (response.success) {
    log(`✅ Lore Sections migradas: ${response.data.length} seções`, "green");
    return true;
  } else {
    throw new Error(`Falha ao migrar Lore Sections: ${response.error}`);
  }
}

async function migrateEdges(scenarioId) {
  log("\n⚔️  Migrando Edges (Vantagens)...", "blue");

  // Importar edgesSL.js como módulo
  const edgesPath = join(__dirname, "..", "src", "data", "edgesSL.js");
  const edgesModule = await import(edgesPath);
  const edgesArray = edgesModule.EDGES_SL;

  const edges = edgesArray.map((edge) => ({
    name: edge.name,
    description: edge.description,
    rank: edge.rank,
    source: "SL",
  }));

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId, data: { edges } }),
  });

  if (response.success) {
    log(`✅ Edges migradas: ${edges.length} registros`, "green");
    return true;
  } else {
    throw new Error(`Falha ao migrar Edges: ${response.error}`);
  }
}

async function migrateHindrances(scenarioId) {
  log("\n🛡️  Migrando Hindrances (Complicações)...", "blue");

  const hindrancesPath = join(
    __dirname,
    "..",
    "src",
    "data",
    "hindrancesSL.js",
  );
  const hindrancesModule = await import(hindrancesPath);
  const hindrancesArray = hindrancesModule.HINDRANCES_SL;

  const hindrances = hindrancesArray.map((h) => ({
    name: h.name,
    description: h.description,
    rank: h.rank,
    severity: h.severity,
    source: "SL",
    effect: h.effect,
  }));

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId, data: { hindrances } }),
  });

  if (response.success) {
    log(`✅ Hindrances migradas: ${hindrances.length} registros`, "green");
    return true;
  } else {
    throw new Error(`Falha ao migrar Hindrances: ${response.error}`);
  }
}

async function migratePowers(scenarioId) {
  log("\n🔮 Migrando Powers...", "blue");

  const powersPath = join(__dirname, "..", "src", "data", "powersSL.js");
  const powersModule = await import(powersPath);
  const powersObj = powersModule.POWERS_SL;

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId, data: { powers: powersObj } }),
  });

  if (response.success) {
    const powersCount = Object.keys(powersObj).length;
    log(`✅ Powers migradas: ${powersCount} registros`, "green");
    return true;
  } else {
    throw new Error(`Falha ao migrar Powers: ${response.error}`);
  }
}

async function migrateAwakeningRules(scenarioId) {
  log("\n🌟 Migrando Awakening Rules...", "blue");

  const awakeningPath = join(
    __dirname,
    "..",
    "src",
    "scenarios",
    "solo-leveling",
    "data",
    "awakeningRules.js",
  );
  const awakeningModule = await import(awakeningPath);
  const awakeningArray = awakeningModule.awakeningRules;

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenarioId,
      data: { awakeningRules: awakeningArray },
    }),
  });

  if (response.success) {
    log(
      `✅ Awakening Rules migradas: ${awakeningArray.length} regras`,
      "green",
    );
    return true;
  } else {
    throw new Error(`Falha ao migrar Awakening Rules: ${response.error}`);
  }
}

async function migrateAdventureGenerator(scenarioId) {
  log("\n🗺️  Migrando Adventure Generator...", "blue");

  const adventurePath = join(
    __dirname,
    "..",
    "src",
    "scenarios",
    "solo-leveling",
    "data",
    "adventureGenerator.js",
  );
  const adventureModule = await import(adventurePath);
  const adventureObj = adventureModule.default;

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenarioId,
      data: { adventureGenerator: adventureObj },
    }),
  });

  if (response.success) {
    log(`✅ Adventure Generator migrado`, "green");
    return true;
  } else {
    throw new Error(`Falha ao migrar Adventure Generator: ${response.error}`);
  }
}

async function migrateSoloLeveling() {
  const scenarioId = "solo-leveling";

  log("\n" + "=".repeat(60), "blue");
  log(`🚀 Iniciando migração do cenário: ${scenarioId}`, "blue");
  log("=".repeat(60), "blue");

  try {
    // 1. Lore Sections (usando a API específica)
    await migrateLoreSections(scenarioId);

    // 2. Edges
    await migrateEdges(scenarioId);

    // 3. Hindrances
    await migrateHindrances(scenarioId);

    // 4. Powers
    await migratePowers(scenarioId);

    // 5. Awakening Rules
    await migrateAwakeningRules(scenarioId);

    // 6. Adventure Generator
    await migrateAdventureGenerator(scenarioId);

    log("\n" + "=".repeat(60), "green");
    log(`✅ Cenário ${scenarioId} migrado com sucesso!`, "green");
    log("=".repeat(60), "green");

    return true;
  } catch (error) {
    log(`\n❌ Erro na migração de ${scenarioId}: ${error.message}`, "red");
    return false;
  }
}

async function main() {
  log("\n🔧 Script de Migração: Dados Fixos → Firestore", "blue");
  log(
    "Este script migrará os dados do Solo Leveling para o Firestore",
    "yellow",
  );
  log(
    "Certifique-se de que o servidor está rodando em http://localhost:3000\n",
    "yellow",
  );

  // Verificar se servidor está acessível
  try {
    await fetch("http://localhost:3000/api/scenarios");
  } catch (error) {
    log("❌ Erro: Servidor não está rodando em http://localhost:3000", "red");
    log("Por favor, inicie o servidor com: npm run dev", "yellow");
    process.exit(1);
  }

  const success = await migrateSoloLeveling();

  if (success) {
    log("\n✨ Migração concluída! Próximos passos:", "green");
    log("1. Verifique no Firestore se os dados foram salvos", "reset");
    log("2. Teste o sistema (BookView, Admin, etc)", "reset");
    log("3. Atualize o registry para priorizar Firestore", "reset");
    log("4. Migre o Project Symbiosis se necessário\n", "reset");
  } else {
    log("\n⚠️  Migração falhou. Verifique os erros acima.", "red");
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, "red");
  process.exit(1);
});
