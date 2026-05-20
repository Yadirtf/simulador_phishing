import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campaignId = searchParams.get("id");

  try {
    await dbConnect();
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (campaign) {
        // Solo subimos el estado si no ha llegado a compromised
        if (campaign.status === "sent" || campaign.status === "opened") {
          campaign.status = "clicked";
          campaign.clickedAt = new Date();
          await campaign.save();
        }
      }
    }
  } catch (error) {
    console.error("Error al registrar clic:", error);
  }

  // Redirigir a la landing page simulada de Netflix
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUrl = campaignId
    ? `${baseUrl}/netflix-login?c=${campaignId}`
    : `${baseUrl}/netflix-login`;

  return NextResponse.redirect(redirectUrl);
}
