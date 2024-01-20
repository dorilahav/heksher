import { renderHook } from '@testing-library/react-hooks';
import { usePersistedClassValue } from '../usePersistedClassValue';

describe('usePersistedClassValue', () => {
  it('should be the same value between renders', () => {
    const {result, rerender} = renderHook(() => usePersistedClassValue(Map));

    const firstRenderMap = result.current;
    rerender();
    const secondRenderMap = result.current;

    expect(firstRenderMap === secondRenderMap).toBe(true);
  });
});