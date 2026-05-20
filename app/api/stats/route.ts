import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Capture from "@/models/Capture";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    // 1. Calcular métricas acumulativas
    const totalSent = await Campaign.countDocuments({});
    const totalOpened = await Campaign.countDocuments({
      status: { $in: ["opened", "clicked", "compromised"] },
    });
    const totalClicked = await Campaign.countDocuments({
      status: { $in: ["clicked", "compromised"] },
    });
    const totalCompromised = await Campaign.countDocuments({
      status: "compromised",
    });

    // 2. Obtener lista de víctimas capturadas (últimas 50)
    const recentCaptures = await Capture.find()
      .sort({ capturedAt: -1 })
      .limit(50)
      .lean();

    // 3. Obtener lista de campañas para ver el estado general (últimas 50)
    const recentCampaigns = await Campaign.find()
      .sort({ sentAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      metrics: {
        sent: totalSent,
        opened: totalOpened,
        clicked: totalClicked,
        compromised: totalCompromised,
      },
      captures: recentCaptures,
      campaigns: recentCampaigns,
    });
  } catch (error: any) {
    console.error("Error al obtener estadísticas:", error);
    return NextResponse.json(
      { error: "Error al cargar las estadísticas.", details: error.message },
      { status: 500 }
    );
  }
}
