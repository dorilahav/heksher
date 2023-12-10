import React, { PropsWithChildren, useDebugValue, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { useSubscribeToFields, useTrackObjectFieldsUsage } from './hooks';
import { SubscribeContext, createSubscribeContext, useSubscribeContext } from './subscribe-context';
import {dispatchChanges} from './utils';

export interface HeksherProviderProps<T> extends PropsWithChildren {
  value: T;
}

export interface Heksher<T> {
  Provider: (props: HeksherProviderProps<T>) => JSX.Element;
  use: () => T;
}

const ensureValidHeksherValue = (value: unknown) => {
  if (typeof value !== 'object') {
    throw new Error(
      'Invalid Usage! You passed a non-object value to an Heksher.Provider.'
    );
  }
}

const createHeksherProvider = <T extends object>(subscribeContext: SubscribeContext<T>) => (
  function HeksherProvider({children, value}: HeksherProviderProps<T>) {
    ensureValidHeksherValue(value);
    const currentValueRef = useRef(value);
    const {subscribe, dispatch} = useSubscribeToFields<T>();

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

const createUseHeksher = <T extends object>(subscribeContext: SubscribeContext<T>) => (
  function useHeksher() {
    const usedFieldsRef = useRef<Set<keyof T>>(new Set());
    const {subscribe, getValue} = useSubscribeContext(subscribeContext);

    const value = useSyncExternalStore((onValueChange) => subscribe([...usedFieldsRef.current], onValueChange), getValue);

    useDebugValue(value);

    return useTrackObjectFieldsUsage(value, usedFieldsRef);
  }
);

export const createHeksher = <T extends object>(): Heksher<T> => {
  const subscribeContext = createSubscribeContext<T>();

  return {
    Provider: createHeksherProvider(subscribeContext),
    use: createUseHeksher(subscribeContext)
  }
}