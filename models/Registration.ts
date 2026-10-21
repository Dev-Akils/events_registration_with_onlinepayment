import mongoose, { Schema, InferSchemaType } from "mongoose";

const RegistrationSchema = new Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    ticketType: { type: String, enum: ["general", "student"], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["pending", "paid", "failed", "expired"], default: "pending", index: true },
    stripeSessionId: { type: String, index: true },
    paymentIntentId: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export type RegistrationDoc = InferSchemaType<typeof RegistrationSchema>;
export const Registration =
  (mongoose.models.Registration as mongoose.Model<RegistrationDoc>) ||
  mongoose.model<RegistrationDoc>("Registration", RegistrationSchema);
