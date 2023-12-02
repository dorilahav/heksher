import React, { PropsWithChildren, useDebugValue, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { useSubscribeToFields, useTrackObjectFieldsUsage } from './hooks';
import { SubscribeContext, createSubscribeContext, useSubscribeContext } from './subscribe-context';

export interface OptimizedContextProviderProps<T> extends PropsWithChildren {
  value: T;
}

export interface OptimizedContext<T> {
  Provider: (props: OptimizedContextProviderProps<T>) => JSX.Element;
  use: () => T;
}

const getChangedFields = <T extends object>(oldValue: T, newValue: T): Array<keyof T> => {
  const keys = [...new Set(Object.keys(oldValue).concat(Object.keys(newValue)))] as Array<keyof T>;

  return keys.filter(key => oldValue[key] !== newValue[key]);
}

const ensureValidOptimizedContextValue = (value: unknown) => {
  if (typeof value !== 'object') {
    throw new Error(
      'Invalid Usage! You passed a non-object value to an OptimizedContext.Provider.'
    );
  }
}

const createOptimizedContextProvider = <T extends object>(context: SubscribeContext<T>) => (
  function OptimizedContextProvider({children, value}: OptimizedContextProviderProps<T>) {
    ensureValidOptimizedContextValue(value);

    const currentValueRef = useRef(value);
    const {subscribe, dispatch} = useSubscribeToFields<T>();

    useEffect(() => {
      const oldValue = currentValueRef.current;
      currentValueRef.current = value;
      getChangedFields(oldValue, value).forEach(dispatch);
    }, [value]);

    const getValue = () => {
      return currentValueRef.current;
    }
    
    return (
      <context.Provider value={useMemo(() => ({subscribe, getValue}), [])}>
        {children}
      </context.Provider>
    )
  }
);

const createUseOptimizedContext = <T extends object>(context: SubscribeContext<T>) => (
  function useOptimizedContext() {
    const usedFieldsRef = useRef<Set<keyof T>>(new Set());
    const {subscribe, getValue} = useSubscribeContext(context);

    const value = useSyncExternalStore((onValueChange) => subscribe([...usedFieldsRef.current], onValueChange), getValue);

    useDebugValue(value);

    return useTrackObjectFieldsUsage(value, usedFieldsRef);
  }
);

export const createOptimizedContext = <T extends object>(): OptimizedContext<T> => {
  const context = createSubscribeContext<T>();

  return {
    Provider: createOptimizedContextProvider(context),
    use: createUseOptimizedContext(context)
  }
}