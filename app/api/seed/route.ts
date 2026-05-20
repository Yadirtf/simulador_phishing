import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Campaign from "@/models/Campaign";
import Capture from "@/models/Capture";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    // 1. Limpiar colecciones anteriores para evitar duplicados en la demo
    await Campaign.deleteMany({});
    await Capture.deleteMany({});

    // 2. Crear campañas semilla con diferentes estados e intervalos de tiempo
    const campaignData = [
      {
        _id: new mongoose.Types.ObjectId(),
        targetEmail: "juan.perez@universidad.edu.co",
        status: "compromised" as const,
        sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hace 24h
        openedAt: new Date(Date.now() - 23.8 * 60 * 60 * 1000),
        clickedAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000),
        compromisedAt: new Date(Date.now() - 23.4 * 60 * 60 * 1000),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        targetEmail: "maria.gomez@gmail.com",
        status: "clicked" as const,
        sentAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // Hace 12h
        openedAt: new Date(Date.now() - 11.5 * 60 * 60 * 1000),
        clickedAt: new Date(Date.now() - 11.2 * 60 * 60 * 1000),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        targetEmail: "carlos.restrepo@outlook.com",
        status: "opened" as const,
        sentAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // Hace 4h
        openedAt: new Date(Date.now() - 3.8 * 60 * 60 * 1000),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        targetEmail: "diana.uribe@empresas.com",
        status: "sent" as const,
        sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Hace 1h
      },
      {
        _id: new mongoose.Types.ObjectId(),
        targetEmail: "profesor.seguridad@u.edu.co",
        status: "compromised" as const,
        sentAt: new Date(Date.now() - 30 * 60 * 1000), // Hace 30 min
        openedAt: new Date(Date.now() - 28 * 60 * 1000),
        clickedAt: new Date(Date.now() - 25 * 60 * 1000),
        compromisedAt: new Date(Date.now() - 24 * 60 * 1000),
      },
    ];

    await Campaign.insertMany(campaignData);

    // 3. Crear capturas asociadas a las campañas marcadas como comprometidas
    const capturesData = [
      {
        campaignId: campaignData[0]._id,
        email: "juan.perez@universidad.edu.co",
        password: "JuanitoPerez123*",
        ip: "186.116.14.82",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        browser: "Chrome",
        os: "Windows",
        capturedAt: campaignData[0].compromisedAt,
      },
      {
        campaignId: campaignData[4]._id,
        email: "profesor.seguridad@u.edu.co",
        password: "SuperPasswordSeguro2026",
        ip: "190.26.115.109",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15",
        browser: "Safari",
        os: "macOS",
        capturedAt: campaignData[4].compromisedAt,
      },
    ];

    await Capture.insertMany(capturesData);

    return NextResponse.json({
      success: true,
      message: "Base de datos sembrada con datos de demostración con éxito.",
      seededCampaigns: campaignData.length,
      seededCaptures: capturesData.length,
    });
  } catch (error: any) {
    console.error("Error al sembrar la base de datos:", error);
    return NextResponse.json(
      { error: "Error al sembrar la base de datos.", details: error.message },
      { status: 500 }
    );
  }
}
