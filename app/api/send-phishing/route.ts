import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import { transport, SENDER_EMAIL, SENDER_NAME } from "@/lib/mailer";
import { getNetflixEmailTemplate } from "@/lib/emailTemplate";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "El correo electrónico es requerido." },
        { status: 400 }
      );
    }

    // 1. Crear registro de la campaña en la base de datos
    const campaign = await Campaign.create({
      targetEmail: email,
      status: "sent",
    });

    const htmlContent = getNetflixEmailTemplate(campaign._id.toString());

    // 2. Enviar el correo usando Nodemailer + Mailtrap
    await transport.sendMail({
      from: {
        address: SENDER_EMAIL,
        name: SENDER_NAME,
      },
      to: email,
      subject: "⚠️ Actualización de facturación requerida",
      html: htmlContent,
      headers: {
        "X-Phishing-Simulation-Campaign-ID": campaign._id.toString(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Campaña de phishing simulada enviada con éxito.",
      campaignId: campaign._id,
    });
  } catch (error: any) {
    console.error("Error en send-phishing:", error);
    return NextResponse.json(
      { error: "Error al enviar el correo.", details: error.message },
      { status: 500 }
    );
  }
}
