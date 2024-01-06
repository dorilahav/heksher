import { renderHook } from '@testing-library/react-hooks';
import { usePersistedMap } from '../usePersistedMap';

describe('usePersistedMap', () => {
  it('should be the same map between renders', () => {
    const {result, rerender} = renderHook(() => usePersistedMap());

    const firstRenderMap = result.current;
    rerender();
    const secondRenderMap = result.current;

    expect(firstRenderMap === secondRenderMap).toBe(true);
  });
});