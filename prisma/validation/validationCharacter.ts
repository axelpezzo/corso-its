import { z } from "zod";

export const characterSchema = z.object({
  name: z.string().min(1).max(20),
  key: z.string().refine((value) => /^[a-z0-9_]+$/.test(value), {
    message: "Invalid macchine name format",
  }),
  history: z.string().optional(),
  age: z.number().int().optional(),
  health: z.number().int().optional(),
  stamina: z.number().int().optional(),
  mana: z.number().int().optional(),
});

export const classSchema = z.object({
    name: z.string().min(1).max(20),
    key: z.string().refine((value) => /^[a-z0-9_]+$/.test(value), {
        message: "Invalid macchine name format",
    }),
    description: z.string().optional(),
});