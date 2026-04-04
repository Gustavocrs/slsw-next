#!/usr/bin/env node

/**
 * Script de Migração: Project Symbiosis → Firestore
 * Migra todos os dados do cenário Project Symbiosis para o Firestore
 *
 * Uso: node scripts/seed-project-symbiosis.js
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

async function migrateProjectSymbiosis() {
  const scenarioId = "project-symbiosis";

  log("\n" + "=".repeat(60), "blue");
  log(`🚀 Iniciando migração do cenário: ${scenarioId}`, "blue");
  log("=".repeat(60), "blue");

  try {
    // 1. Edges
    await migrateEdges();

    // 2. Hindrances
    await migrateHindrances();

    // 3. Powers
    await migratePowers();

    // 4. Awakening Rules
    await migrateAwakeningRules();

    // 5. Lore Sections
    await migrateLoreSections();

    log("\n" + "=".repeat(60), "green");
    log(`✅ Cenário ${scenarioId} migrado com sucesso!`, "green");
    log("=".repeat(60), "green");

    return true;
  } catch (error) {
    log(`\n❌ Erro na migração de ${scenarioId}: ${error.message}`, "red");
    return false;
  }
}

async function migrateEdges() {
  log("\n⚔️  Migrando Edges (Vantagens)...", "blue");

  const edgesPath = join(
    __dirname,
    "..",
    "src",
    "scenarios",
    "project-symbiosis",
    "edges.json",
  );
  const edgesContent = await readFile(edgesPath, "utf-8");
  const edgesData = JSON.parse(edgesContent);

  const edges = edgesData.edges || edgesData;

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenarioId: "project-symbiosis",
      data: { edges },
    }),
  });

  if (response.success) {
    log(`✅ Edges migradas: ${edges.length} registros`, "green");
    return true;
  } else {
    throw new Error(`Falha ao migrar Edges: ${response.error}`);
  }
}

async function migrateHindrances() {
  log("\n🛡️  Migrando Hindrances (Complicações)...", "blue");

  const hindrancesPath = join(
    __dirname,
    "..",
    "src",
    "scenarios",
    "project-symbiosis",
    "hindrances.json",
  );
  const hindrancesContent = await readFile(hindrancesPath, "utf-8");
  const hindrancesData = JSON.parse(hindrancesContent);

  const hindrances = hindrancesData.hindrances || hindrancesData;

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenarioId: "project-symbiosis",
      data: { hindrances },
    }),
  });

  if (response.success) {
    log(`✅ Hindrances migradas: ${hindrances.length} registros`, "green");
    return true;
  } else {
    throw new Error(`Falha ao migrar Hindrances: ${response.error}`);
  }
}

async function migratePowers() {
  log("\n🔮 Migrando Powers...", "blue");

  const powersPath = join(
    __dirname,
    "..",
    "src",
    "scenarios",
    "project-symbiosis",
    "powers.json",
  );
  const powersContent = await readFile(powersPath, "utf-8");
  const powersData = JSON.parse(powersContent);

  const powers = powersData.powers || powersData;

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenarioId: "project-symbiosis",
      data: { powers },
    }),
  });

  if (response.success) {
    const powersCount = Object.keys(powers).length;
    log(`✅ Powers migradas: ${powersCount} registros`, "green");
    return true;
  } else {
    throw new Error(`Falha ao migrar Powers: ${response.error}`);
  }
}

async function migrateAwakeningRules() {
  log("\n🌟 Migrando Awakening Rules...", "blue");

  const awakeningPath = join(
    __dirname,
    "..",
    "src",
    "scenarios",
    "project-symbiosis",
    "awakeningRules.json",
  );
  const awakeningContent = await readFile(awakeningPath, "utf-8");
  const awakeningData = JSON.parse(awakeningContent);

  const awakeningRules = awakeningData.awakeningRules || awakeningData;

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenarioId: "project-symbiosis",
      data: { awakeningRules },
    }),
  });

  if (response.success) {
    log(
      `✅ Awakening Rules migradas: ${awakeningRules.length} regras`,
      "green",
    );
    return true;
  } else {
    throw new Error(`Falha ao migrar Awakening Rules: ${response.error}`);
  }
}

async function migrateLoreSections() {
  log("\n📚 Migrando Lore Sections...", "blue");

  const lorePath = join(
    __dirname,
    "..",
    "src",
    "scenarios",
    "project-symbiosis",
    "loreSections.js",
  );
  const loreModule = await import(lorePath);
  const loreSections = loreModule.loreSections;

  // Garantir que cada seção tem contentHtml (se não tiver, usar content)
  const sectionsWithHtml = loreSections.map((section) => ({
    ...section,
    contentHtml: section.contentHtml || section.content,
  }));

  const response = await fetchWithRetry(SEED_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scenarioId: "project-symbiosis",
      data: { loreSections: sectionsWithHtml },
    }),
  });

  if (response.success) {
    log(
      `✅ Lore Sections migradas: ${sectionsWithHtml.length} seções`,
      "green",
    );
    return true;
  } else {
    throw new Error(`Falha ao migrar Lore Sections: ${response.error}`);
  }
}

async function main() {
  log("\n🔧 Script de Migração: Project Symbiosis → Firestore", "blue");
  log(
    "Este script migrará os dados do Project Symbiosis para o Firestore",
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

  const success = await migrateProjectSymbiosis();

  if (success) {
    log("\n✨ Migração concluída! Próximos passos:", "green");
    log("1. Verifique no Firestore se os dados foram salvos", "reset");
    log("2. Teste o sistema (BookView, Admin, etc)", "reset");
    log("3. Atualize o registry se ainda não feito", "reset");
    log("4. Repita para outros cenários se houver\n", "reset");
  } else {
    log("\n⚠️  Migração falhou. Verifique os erros acima.", "red");
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, "red");
  process.exit(1);
});
