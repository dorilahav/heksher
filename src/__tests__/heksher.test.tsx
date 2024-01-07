import { renderHook } from '@testing-library/react-hooks';
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
    const {result} = renderHook(() => heksher.use(), {
      wrapper: ({children, value}) => (
        <heksher.Provider value={{foo: 3}}>
          <heksher.Provider value={value}>{children}</heksher.Provider>
        </heksher.Provider>
      ),
      initialProps: {value}
    });

    expect(result.current).toEqual(value);
  });

  // const renderHeksherHookWithCount = <T,>(heksher: Heksher<T>, initialValue: T) => {
  //   let count = 0
  //   const getRenderCount = () => count

  //   let rerenderWrapper: (newValue: T) => void;

  //   const result = renderHook(() => {
  //     count ++
  //     return heksher.use();
  //   }, {wrapper: ({value: defaultValue, children}) => {
  //     const [value, setValue] = useState(defaultValue);

  //     rerenderWrapper = setValue;

  //     return (
  //       <heksher.Provider value={value}>
  //         <div>
  //           {children}
  //         </div>
  //       </heksher.Provider>
  //     )
  //   }, initialProps: {value: initialValue}});

  //   return {getRenderCount, rerenderWrapper, ...result}
  // }

  // it('triggers render on primitive value change', async () => {
  //   const heksher = createHeksher<number>();
  //   const {result, rerenderWrapper, waitForValueToChange, getRenderCount} = renderHeksherHookWithCount(heksher, 1);

  //   expect(result.current).toBe(1);

  //   act(() => {
  //     result.current;
  //     rerenderWrapper(2);

  //     // await waitForNextUpdate();
  //   });

  //   await waitForValueToChange(() => result.current)

  //   // await waitForNextUpdate();

  //   expect(getRenderCount()).toBe(2);
  // });

  // it('doesnt triggers render on unchanged value', async () => {
  //   const heksher = createHeksher<{age: number}>();
  //   const {getRenderCount, rerenderWrapper, waitForNextUpdate} = renderHeksherHookWithCount(heksher, {age: 1});

  //   // rerenderWrapper({age: 2});

  //   // expect(result.current.age).toBe(1);
  //   expect(getRenderCount()).toBe(1);
  // });
});