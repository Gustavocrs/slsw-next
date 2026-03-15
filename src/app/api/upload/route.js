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

    // Salvar em public/uploads (servido estaticamente pelo Next.js/Nginx)
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Garantir que o diretório existe
    await mkdir(uploadDir, {recursive: true});

    // Nome único para evitar colisão
    const timestamp = Date.now();
    const originalName = file.name || "arquivo";
    const ext = path.extname(originalName).toLowerCase() || ".bin";

    let prefix = "FILE";
    if (
      [".png", ".jpg", ".jpeg", ".bmp", ".gif", ".webp", ".svg"].includes(ext)
    ) {
      prefix = "IMG";
    }

    const fileName = `${prefix}-${timestamp}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Utiliza NEXT_PUBLIC_APP_URL para garantir o HTTPS através do Nginx
    const requestUrl = new URL(request.url);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;
    // Usa a rota de API de arquivos para evitar o erro 404 do Next.js Standalone
    const url = new URL(`/api/files/${fileName}`, baseUrl).toString();

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
