import {Resend} from "resend";
import {NextResponse} from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const {email, gmName, tableName} = await request.json();

    const {data, error} = await resend.emails.send({
      from: "Solo Leveling RPG <onboarding@resend.dev>", // Altere para seu domínio verificado em produção
      to: [email],
      subject: `Convite para Mesa: ${tableName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #667eea;">🏰 Você foi convidado!</h2>
          <p>O Mestre <strong>${gmName}</strong> convidou você para participar da mesa <strong>${tableName}</strong>.</p>
          <p>Acesse o sistema Solo Leveling RPG para ver seus convites e vincular sua ficha.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;"><em>Solo Leveling System</em></p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({error}, {status: 500});
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
