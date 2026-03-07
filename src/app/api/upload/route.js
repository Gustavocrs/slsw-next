import {NextResponse} from "next/server";
import {writeFile, mkdir} from "fs/promises";
import path from "path";

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
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const fileName = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const url = `/api/files/${fileName}`;

    return NextResponse.json({
      success: true,
      url,
      name: file.name,
      type: file.type,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      {error: "Erro interno no servidor"},
      {status: 500},
    );
  }
}
