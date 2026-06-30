export default function keys<T extends Record<string, unknown>>(obj: T): (keyof T & string)[] {
  return Object.keys(obj) as (keyof T & string)[];
}
