import React, { PropsWithChildren, useDebugValue, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { useSubscribeToFields } from './hooks';
import { SubscribeContext, createSubscribeContext, useSubscribeContext } from './subscribe-context';
import { dispatchChanges, doesValueHaveFields, fieldUsageDecorator } from './utils';

export interface HeksherProviderProps<T> extends PropsWithChildren {
  value: T;
}

export interface Heksher<T> {
  Provider: (props: HeksherProviderProps<T>) => JSX.Element;
  use: () => T;
}

const createHeksherProvider = <T,>(subscribeContext: SubscribeContext<T>) => (
  function HeksherProvider({children, value}: HeksherProviderProps<T>) {
    const currentValueRef = useRef(value);
    const {subscribe, dispatch} = useSubscribeToFields();

    useEffect(() => {
      const oldValue = currentValueRef.current;
      currentValueRef.current = value;

      dispatchChanges(oldValue, value, dispatch);
    }, [value]);

    const getValue = () => {
      return currentValueRef.current;
    }

    return (
      <subscribeContext.Provider value={useMemo(() => ({subscribe, getValue}), [])}>
        {children}
      </subscribeContext.Provider>
    )
  }
);

const createUseHeksher = <T,>(subscribeContext: SubscribeContext<T>) => (
  function useHeksher() {
    const usedFieldsRef = useRef<Set<string>>(new Set());
    const {subscribe, getValue} = useSubscribeContext(subscribeContext);

    const value = useSyncExternalStore((onValueChange) => subscribe([...usedFieldsRef.current], onValueChange), getValue);

    useDebugValue(value);

    return doesValueHaveFields(value) ? fieldUsageDecorator(value, usedFieldsRef.current) : value;
  }
);

export const createHeksher = <T,>(): Heksher<T> => {
  const subscribeContext = createSubscribeContext<T>();

  return {
    Provider: createHeksherProvider(subscribeContext),
    use: createUseHeksher(subscribeContext)
  }
}