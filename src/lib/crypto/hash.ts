import { createHash } from "node:crypto";

export default function sha(str: string) {
  return createHash("sha256").update(str).digest("hex").slice(0, 16);
}
