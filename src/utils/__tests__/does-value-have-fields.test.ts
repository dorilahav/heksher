import { doesValueHaveFields } from '../does-value-have-fields';

describe('doesValueHaveFields', () => {
  it('returns true on plain object', () => {
    expect(doesValueHaveFields({})).toBe(true);
  });

  it('returns false on arrays', () => {
    expect(doesValueHaveFields([])).toBe(false);
  });

  it('returns false on Date value', () => {
    expect(doesValueHaveFields(new Date())).toBe(false);
  });

  it('returns false on primitives', () => {
    expect(doesValueHaveFields(1)).toBe(false);
    expect(doesValueHaveFields('')).toBe(false);
    expect(doesValueHaveFields(false)).toBe(false);
    expect(doesValueHaveFields(undefined)).toBe(false);
    expect(doesValueHaveFields(null)).toBe(false);
  });
})