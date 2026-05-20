import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICapture extends Document {
  campaignId?: mongoose.Types.ObjectId;
  email: string;
  password?: string; // Haremos opcional por si solo entran a la página pero no completan
  ip: string;
  userAgent: string;
  browser: string;
  os: string;
  capturedAt: Date;
}

const CaptureSchema: Schema = new Schema<ICapture>({
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: false,
  },
  email: {
    type: String,
    required: [true, "El correo introducido es requerido"],
    trim: true,
  },
  password: {
    type: String,
    required: false,
  },
  ip: {
    type: String,
    default: "Unknown",
  },
  userAgent: {
    type: String,
    default: "Unknown",
  },
  browser: {
    type: String,
    default: "Unknown",
  },
  os: {
    type: String,
    default: "Unknown",
  },
  capturedAt: {
    type: Date,
    default: Date.now,
  },
});

const Capture: Model<ICapture> =
  mongoose.models.Capture || mongoose.model<ICapture>("Capture", CaptureSchema);

export default Capture;
