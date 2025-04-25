
import * as z from "zod";

export const medicalFormSchema = z.object({
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  conditions: z.array(z.string()).default([]),
  medications: z.array(
    z.object({
      name: z.string().min(1, "Le nom est requis"),
      dosage: z.string().optional(),
      frequency: z.string().optional()
    })
  ).default([]),
  otherInfo: z.string().optional()
});

export type FormData = z.infer<typeof medicalFormSchema>;
