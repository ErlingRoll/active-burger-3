import { z } from "zod";

export const ClientMsgSchema = z.discriminatedUnion("t", [
  z.object({ t: z.literal("hello"), name: z.string().min(1).max(32).optional() }),
  z.object({
    t: z.literal("action"),
    action: z.string().min(1).max(64),
    payload: z.unknown().optional()
  }),
  z.object({
    t: z.literal("dm"),
    to: z.string().min(1),
    kind: z.string().min(1).max(32).optional(),
    payload: z.unknown()
  }),
  z.object({ t: z.literal("ping"), ts: z.number().int() })
]);

export type ParsedClientMsg = z.infer<typeof ClientMsgSchema>;
