import {NextResponse} from "next/server";
import {readFile} from "fs/promises";
import path from "path";

export async function GET(request, {params}) {
  // Await params para compatibilidade com Next.js 15+
  const {filename} = await params;

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    const fileBuffer = await readFile(filePath);

    let contentType = "application/octet-stream";
    const ext = filename.split(".").pop().toLowerCase();

    if (["jpg", "jpeg"].includes(ext)) contentType = "image/jpeg";
    else if (ext === "png") contentType = "image/png";
    else if (ext === "gif") contentType = "image/gif";
    else if (ext === "webp") contentType = "image/webp";
    else if (ext === "svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar o arquivo ${filename}:`, error);
    return new NextResponse("File not found", {status: 404});
  }
}
