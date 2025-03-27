import { z } from "zod";

export const characterSchema = z.object({
  name: z.string().min(1).max(20),
  history: z.string().optional(),
  age: z.number().int().optional(),
  health: z.number().int().optional(),
  stamina: z.number().int().optional(),
  mana: z.number().int().optional(),
});

export const raceSchema = z.object({
  key: z.string().refine((value) => /^[a-z0-9_]+$/.test(value),{
    message: 'Invalid machine name format',
  }),
  name: z.string().min(1).max(20),
  modHealth: z.number().int(),
  modStamina: z.number().int(),
  modMana: z.number().int(),
});
