import { z } from "zod";

export const characterSchema = z.object({
  name: z.string().min(1).max(20),
});
