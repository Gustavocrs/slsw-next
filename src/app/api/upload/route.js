import {NextResponse} from "next/server";
import path from "path";
import {writeFile, mkdir} from "fs/promises";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json(
        {error: "Nenhum arquivo enviado"},
        {status: 400},
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Salvar em uploads na raiz (persistente e servido via API)
    const uploadDir = path.join(process.cwd(), "uploads");

    // Garantir que o diretório existe
    await mkdir(uploadDir, {recursive: true});

    // Nome único para evitar colisão
    const timestamp = Date.now();
    const ext = path.extname(file.name).toLowerCase();

    let prefix = "FILE";
    if ([".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp"].includes(ext)) {
      prefix = "IMG";
    }

    const fileName = `${prefix}-${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const url = `/api/files/${fileName}`;

    return NextResponse.json({
      fileName,
      url,
      fileUrl: url,
      downloadURL: url,
    });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      {error: "Erro interno no servidor"},
      {status: 500},
    );
  }
}
