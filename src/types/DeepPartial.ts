export type DeepPartial<T extends Record<string, unknown>> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};
