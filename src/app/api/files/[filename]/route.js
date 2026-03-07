import {NextResponse} from "next/server";
import path from "path";
import fs from "fs";

// Força a rota a ser dinâmica para evitar cache estático que causa loops em dev
export const dynamic = "force-dynamic";

export async function GET(request, {params}) {
  // Await params para compatibilidade com Next.js 15+
  const {filename} = await params;

  // Define o caminho absoluto para a pasta uploads na raiz do projeto
  const uploadDir = path.join(process.cwd(), "uploads");
  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadDir, safeFilename);

  // Logs para debug no terminal do servidor (ajuda a verificar se o caminho está correto)
  console.log(`[API FILE] Solicitado: ${safeFilename}`);
  console.log(`[API FILE] Caminho absoluto: ${filePath}`);

  try {
    // Verifica se a pasta uploads existe
    if (!fs.existsSync(uploadDir)) {
      console.error(
        `[API FILE] ERRO: Pasta 'uploads' não encontrada em ${uploadDir}`,
      );
      return NextResponse.json(
        {error: "Configuração de servidor: pasta uploads inexistente"},
        {status: 500},
      );
    }

    // Verifica se o arquivo existe
    if (!fs.existsSync(filePath)) {
      console.warn(`[API FILE] Arquivo não encontrado: ${filePath}`);
      return NextResponse.json(
        {error: "Arquivo não encontrado"},
        {status: 404},
      );
    }

    // Lê o arquivo de forma síncrona (Buffer) para garantir estabilidade e evitar loops de stream
    const fileBuffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);

    const ext = path.extname(safeFilename).toLowerCase();

    const mimeTypes = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".txt": "text/plain",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[API FILE] Erro crítico ao ler arquivo:", error);
    return NextResponse.json(
      {error: "Erro interno ao processar arquivo"},
      {status: 500},
    );
  }
}
