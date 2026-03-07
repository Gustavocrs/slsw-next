import {NextResponse} from "next/server";

export async function GET(request, {params}) {
  // Await params para compatibilidade com Next.js 15+
  const {filename} = await params;

  // Redireciona para o arquivo estático em /public/uploads
  return NextResponse.redirect(new URL(`/uploads/${filename}`, request.url));
}
