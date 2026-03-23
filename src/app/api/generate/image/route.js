import {NextResponse} from "next/server";
import path from "path";
import {writeFile, mkdir} from "fs/promises";

export async function POST(request) {
  try {
    const {prompt} = await request.json();

    if (!prompt) {
      return NextResponse.json({error: "Prompt não fornecido"}, {status: 400});
    }

    // Usando a API gratuita Pollinations (não exige chave de API)
    // Ele transforma o prompt gerado pelo seu Gemini diretamente em uma imagem!
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}?width=512&height=512&nologo=true&seed=${Date.now()}`;

    // Faz a requisição, baixa a imagem e salva no servidor local
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok)
      throw new Error("Falha ao gerar a imagem no serviço gratuito.");

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, {recursive: true});

    const fileName = `IMG-AI-${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Retorna a URL correta do Next.js para arquivos estáticos na pasta public
    const localUrl = `/uploads/${fileName}`;
    return NextResponse.json({url: localUrl});
  } catch (error) {
    console.error("Erro ao processar imagem IA:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
