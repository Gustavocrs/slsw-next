import {NextResponse} from "next/server";
import path from "path";
import {writeFile, mkdir} from "fs/promises";

export async function POST(request) {
  try {
    const {prompt} = await request.json();

    if (!prompt) {
      return NextResponse.json({error: "Prompt não fornecido"}, {status: 400});
    }

    // Limpa o prompt: remove quebras de linha e limita o tamanho
    // para evitar erros de URL muito longa (HTTP 414) na requisição GET.
    const cleanPrompt = prompt.replace(/\s+/g, " ").trim().substring(0, 900);

    // Usando a API gratuita Pollinations (não exige chave de API)
    // Ele transforma o prompt gerado pelo seu Gemini diretamente em uma imagem!
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      cleanPrompt,
    )}?width=512&height=512&nologo=true&seed=${Date.now()}`;

    // Faz a requisição, baixa a imagem e salva no servidor local
    const imageRes = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!imageRes.ok) {
      const errorText = await imageRes.text();
      console.error("Erro API Pollinations:", imageRes.status, errorText);
      throw new Error(
        `Falha ao gerar a imagem no serviço gratuito. Status: ${imageRes.status}`,
      );
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, {recursive: true});

    const fileName = `IMG-AI-${Date.now()}.png`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Usa a rota de API dedicada para contornar o cache de arquivos estáticos do Next.js standalone
    const localUrl = `/api/files/${fileName}`;
    return NextResponse.json({url: localUrl});
  } catch (error) {
    console.error("Erro ao processar imagem IA:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
