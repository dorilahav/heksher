import { act, renderHook } from '@testing-library/react-hooks';
import * as usePersistedClassValue from '../usePersistedClassValue';
import { useSubscribeToFields } from '../useSubscribeToFields';

const injectFooBarCallbacks = () => {
  const fooCallback = jest.fn();
  const barCallback = jest.fn();
  const foobarCallback = jest.fn();

  jest.spyOn(usePersistedClassValue, 'usePersistedClassValue').mockReturnValue(new Map([
    [['foo'], fooCallback],
    [['bar'], barCallback],
    [['foo', 'bar'], foobarCallback]
  ]));

  return {
    fooCallback,
    barCallback,
    foobarCallback
  }
}

const injectCallbackMap = (): Map<string[], () => void> => {
  const callbackMap = new Map();

  jest.spyOn(usePersistedClassValue, 'usePersistedClassValue').mockReturnValue(callbackMap);

  return callbackMap;
}

describe('useSubscribeToFields', () => {
  describe('subscribe function', () => {
    it('adds callback to callbackMap', () => {
      const callbackMap = injectCallbackMap();
      const {result} = renderHook(() => useSubscribeToFields());

      const fooFieldsArray = ['foo'];
      const fooCallback = () => {};

      act(() => {
        result.current.subscribe(fooFieldsArray, fooCallback)
      });

      expect(callbackMap.size).toBe(1);
      expect(callbackMap.get(fooFieldsArray) === fooCallback).toBe(true);
    });

    it('removes callback from callbackMap on unsubscribe', () => {
      const callbackMap = injectCallbackMap();
      const {result} = renderHook(() => useSubscribeToFields());

      act(() => {
        const unsubscribe = result.current.subscribe(['foo'], () => {})
        unsubscribe();
      });

      expect(callbackMap.size).toBe(0);
    });

    it('accepts multiple callbacks subscribed to the same fields', () => {
      const callbackMap = injectCallbackMap();
      const {result} = renderHook(() => useSubscribeToFields());

      const fooFieldsArray = ['foo', 'bar'];

      act(() => {
        result.current.subscribe([...fooFieldsArray], () => {});
        result.current.subscribe([...fooFieldsArray], () => {});
      });

      expect(callbackMap.size).toBe(2);
    });

    it('unsubscribes the right callback when fields are the same - first callback unsubscribes', () => {
      const callbackMap = injectCallbackMap();
      const {result} = renderHook(() => useSubscribeToFields());

      const fooFieldsArray = ['foo', 'bar'];
      const unsubscribedCallback = () => {};

      act(() => {
        const unsubscribe = result.current.subscribe([...fooFieldsArray], unsubscribedCallback);
        result.current.subscribe([...fooFieldsArray], () => {});
        unsubscribe();
      });

      expect(callbackMap.size).toBe(1);
      expect([...callbackMap.values()].includes(unsubscribedCallback)).toBe(false);
    });

    it('unsubscribes the right callback when fields are the same - not first callback unsubscribes', () => {
      const callbackMap = injectCallbackMap();
      const {result} = renderHook(() => useSubscribeToFields());

      const fooFieldsArray = ['foo'];
      const unsubscribedCallback = () => {};

      act(() => {
        result.current.subscribe([...fooFieldsArray], () => {});
        const unsubscribe = result.current.subscribe([...fooFieldsArray], unsubscribedCallback);
        unsubscribe();
      });

      expect(callbackMap.size).toBe(1);
      expect([...callbackMap.values()].includes(unsubscribedCallback)).toBe(false);
    });
  });

  describe('dispatch.all function', () => {
    it('should dispatch all callbacks', () => {
      const {fooCallback, barCallback, foobarCallback} = injectFooBarCallbacks();
      const {result} = renderHook(() => useSubscribeToFields());

      act(() => {
        result.current.dispatch.all();
      });
      
      expect(fooCallback).toHaveBeenCalledTimes(1);
      expect(barCallback).toHaveBeenCalledTimes(1);
      expect(foobarCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('dispatch.field function', () => {
    it('should only dispatch callbacks subscribed to the provided field', () => {
      const {fooCallback, barCallback, foobarCallback} = injectFooBarCallbacks();
      const {result} = renderHook(() => useSubscribeToFields());

      act(() => {
        result.current.dispatch.field('foo');
      });
      
      expect(fooCallback).toHaveBeenCalledTimes(1);
      expect(barCallback).toHaveBeenCalledTimes(0);
      expect(foobarCallback).toHaveBeenCalledTimes(1);
    });
  });
});