import {Resend} from "resend";
import {NextResponse} from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const {email, gmName, tableName, type, details} = await request.json();

    let subject = `Nova Mesa: ${tableName}`;
    let htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #667eea;">🏰 Nova Mesa: ${tableName}</h2>
          <p>O GM <strong>${gmName}</strong> convidou você para participar do jogo.</p>
          <p>Acesse o sistema Solo Leveling RPG para ver seus convites e vincular sua ficha.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;"><em>Solo Leveling System</em></p>
        </div>
      `;

    if (type === "update") {
      subject = `Atualização da Mesa: ${tableName}`;
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2196f3;">📢 Atualização da Mesa</h2>
          <p>O GM <strong>${gmName}</strong> atualizou as informações do jogo <strong>${tableName}</strong>.</p>
          ${details ? `<div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 15px 0;">${details}</div>` : ""}
          <p>Acesse o sistema para conferir os novos detalhes.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;"><em>Solo Leveling System</em></p>
        </div>
      `;
    }

    const {data, error} = await resend.emails.send({
      from: "Solo Leveling RPG <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      // BYPASS: Se for erro de limitação do plano gratuito (Modo Teste),
      // apenas loga no console e finge que enviou para não travar o fluxo.
      if (error.message && error.message.includes("only send testing emails")) {
        console.warn(
          `⚠️ [RESEND MOCK] Email para ${email} simulado (Domínio não verificado).`,
        );
        console.log(`📝 Assunto: ${subject}`);

        return NextResponse.json({
          id: "mock_id_123",
          message: "Email simulado com sucesso (Modo Teste)",
        });
      }

      console.error("Resend API Error:", error);
      return NextResponse.json(
        {message: error.message, name: error.name},
        {status: error.statusCode || 400},
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({message: error.message}, {status: 500});
  }
}
