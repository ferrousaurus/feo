export default function values<T extends Record<string, unknown>>(obj: T): T[keyof T & string][] {
  return Object.values(obj) as T[keyof T & string][];
}
