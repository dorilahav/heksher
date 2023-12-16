export const doesValueHaveFields = (value: unknown): boolean =>
  typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);