import {NextResponse} from "next/server";
import {readFile} from "fs/promises";
import path from "path";
import {existsSync} from "fs";

export async function GET(request, {params}) {
  const {filename} = await params;
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (!existsSync(filePath)) {
    return new NextResponse("Arquivo não encontrado", {status: 404});
  }

  try {
    const fileBuffer = await readFile(filePath);

    // Determinar Content-Type básico
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Erro ao ler arquivo:", error);
    return new NextResponse("Erro interno", {status: 500});
  }
}
