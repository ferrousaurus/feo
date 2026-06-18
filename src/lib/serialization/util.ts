import { z } from "zod/mini";

export const serializableValidator = z.record(z.string(), z.unknown());

export type Serializable = Record<string, unknown>;
