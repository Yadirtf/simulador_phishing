import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaign extends Document {
  targetEmail: string;
  status: "sent" | "opened" | "clicked" | "compromised";
  sentAt: Date;
  openedAt?: Date;
  clickedAt?: Date;
  compromisedAt?: Date;
}

const CampaignSchema: Schema = new Schema<ICampaign>({
  targetEmail: {
    type: String,
    required: [true, "El correo electrónico de la víctima es requerido"],
    trim: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ["sent", "opened", "clicked", "compromised"],
    default: "sent",
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  openedAt: {
    type: Date,
  },
  clickedAt: {
    type: Date,
  },
  compromisedAt: {
    type: Date,
  },
});

// Evitar la recreación del modelo durante el desarrollo en caliente de Next.js
const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default Campaign;
