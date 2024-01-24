import React from 'react';
import { createHeksher } from '../heksher';

describe('createHeksher', () => {
  it('returns a different heksher on every call', () => {
    const firstHeksher = createHeksher();
    const secondHeksher = createHeksher();

    expect(firstHeksher === secondHeksher).toBe(false);
  });

  it('doesnt allow using a heksher without a provider', () => {
    const heksher = createHeksher();
    
    expect(() => {
      renderHook(() => heksher.use())
    }).toThrow(Error);
  });

  it('returns primitive value of provider', () => {
    const heksher = createHeksher<number>();
    const value = 1;
    const {result} = renderHook(() => heksher.use(), {wrapper: props => <heksher.Provider value={value} {...props}/>});

    expect(result.current).toEqual(value);
  });

  it('returns object value of provider', () => {
    const heksher = createHeksher<{foo: number}>();
    const value = {foo: 1};
    const {result} = renderHook(() => heksher.use(), {wrapper: props => <heksher.Provider value={value} {...props}/>});

    expect(result.current).toEqual(value);
  });

  it('returns closest provider value', () => {
    const heksher = createHeksher<{foo: number}>();
    const value = {foo: 1};
    const {result} = renderHook(() => heksher.use(), {
      wrapper: ({children}) => (
        <heksher.Provider value={{foo: 3}}>
          <heksher.Provider value={value}>{children}</heksher.Provider>
        </heksher.Provider>
      )
    });

    expect(result.current).toEqual(value);
  });
});