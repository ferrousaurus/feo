import { z } from "zod";

export const serializableValidator = z.record(z.string(), z.json());

export type Serializable = z.infer<typeof serializableValidator>;
