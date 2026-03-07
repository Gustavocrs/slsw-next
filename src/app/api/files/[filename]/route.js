import {NextResponse} from "next/server";
import path from "path";
import {readFile, stat} from "fs/promises";
import {existsSync} from "fs";

// Força a rota a ser dinâmica para evitar cache estático que causa loops em dev
export const dynamic = "force-dynamic";

export async function GET(request, {params}) {
  // Await params para compatibilidade com Next.js 15+
  const {filename} = await params;

  // Sanitiza o nome do arquivo para evitar navegação de diretório (segurança)
  const safeFilename = path.basename(filename);
  const uploadDir = path.join(process.cwd(), "uploads");
  const filePath = path.join(uploadDir, safeFilename);

  if (!existsSync(filePath)) {
    return NextResponse.json({error: "Arquivo não encontrado"}, {status: 404});
  }

  try {
    // Verifica se é um arquivo mesmo
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      return NextResponse.json({error: "Caminho inválido"}, {status: 400});
    }

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(safeFilename).toLowerCase();

    // Define o Content-Type correto
    let contentType = "application/octet-stream";
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

    if (mimeTypes[ext]) contentType = mimeTypes[ext];

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Erro ao ler arquivo:", error);
    return NextResponse.json({error: "Erro ao ler arquivo"}, {status: 500});
  }
}
