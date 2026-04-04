#!/usr/bin/env node

/**
 * Script de Migração Completa: Dados Fixos → Firestore
 * Executa a migração de TODOS os cenários em sequência
 *
 * Uso: node scripts/migrate-all.js
 *
 * IMPORTANTE:
 * - Certifique-se de que o servidor está rodando em http://localhost:3000
 * - Faça backup do Firestore antes de executar
 * - Este script é NÃO-DESTRUTIVO (mantém arquivos fonte)
 */

const { spawn } = require("child_process");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runScript(scriptPath, scenarioName) {
  return new Promise((resolve, reject) => {
    log(`\n${"=".repeat(60)}`, "cyan");
    log(`🚀 Executando migração: ${scenarioName}`, "bold");
    log(`Script: ${scriptPath}`, "cyan");
    log(`${"=".repeat(60)}\n`, "cyan");

    const child = spawn("node", [scriptPath], {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        log(`✅ ${scenarioName} migrado com sucesso!\n`, "green");
        resolve(true);
      } else {
        log(`❌ ${scenarioName} falhou com código ${code}\n`, "red");
        reject(new Error(`${scenarioName} falhou`));
      }
    });

    child.on("error", (error) => {
      log(`❌ Erro ao executar ${scriptPath}: ${error.message}\n`, "red");
      reject(error);
    });
  });
}

async function checkServer() {
  try {
    const response = await fetch("http://localhost:3000/api/scenarios");
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    log("✅ Servidor detectado em http://localhost:3000\n", "green");
    return true;
  } catch (error) {
    log("❌ Erro: Servidor não está rodando em http://localhost:3000", "red");
    log("Por favor, inicie o servidor com: npm run dev\n", "yellow");
    return false;
  }
}

async function main() {
  log("\n" + "█".repeat(60), "blue");
  log("█" + " ".repeat(58) + "█", "blue");
  log(
    "█" + "  MIGRAÇÃO COMPLETA: Dados Fixos → Firestore".padEnd(58) + "█",
    "bold",
  );
  log("█" + " ".repeat(58) + "█", "blue");
  log("█".repeat(60) + "\n", "blue");

  log("⚠️  ATENÇÃO:", "yellow");
  log(
    "   - Este script irá migrar TODOS os cenários para o Firestore",
    "yellow",
  );
  log("   - Dados existentes no Firestore serão PRESERVADOS (merge)", "yellow");
  log("   - Arquivos fonte NÃO serão deletados (apenas deprecated)", "yellow");
  log("   - Faça backup do Firestore antes de continuar\n", "yellow");

  // Verificar se servidor está rodando
  const serverOk = await checkServer();
  if (!serverOk) {
    process.exit(1);
  }

  // Confirmar com o usuário
  log("Pressione CTRL+C para cancelar ou aguarde 5 segundos...\n", "cyan");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const scripts = [
    { path: "scripts/seed-solo-leveling.js", name: "Solo Leveling" },
    { path: "scripts/seed-project-symbiosis.js", name: "Project Symbiosis" },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const script of scripts) {
    try {
      await runScript(script.path, script.name);
      successCount++;
    } catch (error) {
      failCount++;
      log(`⚠️  Continuando com próximo script...\n`, "yellow");
    }
  }

  // Resumo final
  log("\n" + "█".repeat(60), "blue");
  log("█" + " ".repeat(58) + "█", "blue");
  log("█" + "  RESUMO DA MIGRAÇÃO".padEnd(58) + "█", "bold");
  log("█" + " ".repeat(58) + "█", "blue");
  log("█".repeat(60), "blue");

  log(`\n📊 Resultado final:`, "cyan");
  log(`   ✅ Sucesso: ${successCount} cenário(s)`, "green");
  if (failCount > 0) {
    log(`   ❌ Falhas: ${failCount} cenário(s)`, "red");
  }

  log("\n📋 Próximos passos:", "cyan");
  log("   1. Verifique o console para ver detalhes de cada migração", "reset");
  log("   2. Acesse o Firestore Console para confirmar os dados", "reset");
  log("   3. Teste a aplicação (BookView, Admin, GameModal)", "reset");
  log(
    "   4. Verifique se o cache foi preenchido (abrir console do navegador)",
    "reset",
  );
  log(
    "   5. Atualize componentes que importam dados diretamente (Sidebar, Home)",
    "reset",
  );
  log(
    "   6. Execute testes de funcionalidade (criar/editar cenários)",
    "reset",
  );
  log(
    "   7. Considere adicionar mais cenários à migração se houver\n",
    "reset",
  );

  if (failCount === 0) {
    log("🎉 Todos os cenários foram migrados com sucesso!\n", "green");
    process.exit(0);
  } else {
    log("⚠️  Alguns cenários falharam. Revise os erros acima.\n", "yellow");
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Erro fatal na migração: ${error.message}`, "red");
  process.exit(1);
});
