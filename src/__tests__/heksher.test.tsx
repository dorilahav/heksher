import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { HeksherProviderProps, createHeksher } from '../heksher';

describe('createHeksher', () => {
  it('returns a different heksher on every call', () => {
    const firstHeksher = createHeksher();
    const secondHeksher = createHeksher();

    expect(firstHeksher === secondHeksher).toBe(false);
  });

  it('doesnt allow using a heksher without a provider', () => {
    const heksher = createHeksher();
    const {result} = renderHook(() => heksher.use());

    expect(result.error).not.toBeUndefined();
    expect(result.error).toBeInstanceOf(Error);
  });

  it('returns primitive value of provider', () => {
    const heksher = createHeksher<number>();
    const value = 1;
    const {result} = renderHook(() => heksher.use(), {wrapper: heksher.Provider, initialProps: {value}});

    expect(result.current).toEqual(value);
  });

  it('returns object value of provider', () => {
    const heksher = createHeksher<{foo: number}>();
    const value = {foo: 1};
    const {result} = renderHook(() => heksher.use(), {wrapper: heksher.Provider, initialProps: {value}});

    expect(result.current).toEqual(value);
  });

  it('returns closest provider value', () => {
    const heksher = createHeksher<{foo: number}>();
    const value = {foo: 1};
    const {result} = renderHook<HeksherProviderProps<typeof value>, {}>(() => heksher.use(), {
      wrapper: ({children, value}) => (
        <heksher.Provider value={{foo: 3}}>
          <heksher.Provider value={value}>{children}</heksher.Provider>
        </heksher.Provider>
      ),
      initialProps: {value}
    });

    expect(result.current).toEqual(value);
  });
});