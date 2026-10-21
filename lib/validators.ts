import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z.string().trim().min(6, "Invalid phone").max(20),
  ticketType: z.enum(["general", "student"]),
});
export type RegisterInput = z.infer<typeof registerSchema>;
