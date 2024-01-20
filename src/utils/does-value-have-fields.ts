export const doesValueHaveFields = (value: unknown): boolean =>
  typeof value === 'object' && value != null && !Array.isArray(value) && !(value instanceof Date);