import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";

// Buffer del GIF transparente 1x1
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("id");

    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (campaign) {
        // Solo actualizamos el estado si no ha progresado a clicked o compromised
        if (campaign.status === "sent") {
          campaign.status = "opened";
          campaign.openedAt = new Date();
          await campaign.save();
        }
      }
    }
  } catch (error) {
    console.error("Error al registrar apertura:", error);
  }

  // Devolver el GIF transparente de todas formas para no romper el correo
  return new NextResponse(TRANSPARENT_GIF, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
