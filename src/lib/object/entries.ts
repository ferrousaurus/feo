export default function entries<T extends Record<string, unknown>>(obj: T): [keyof T & string, T[keyof T & string]][] {
  return Object.entries(obj) as [keyof T & string, T[keyof T & string]][];
}
