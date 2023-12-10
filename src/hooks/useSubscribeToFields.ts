import { useCallback, useMemo } from 'react';
import { useInitializedRef } from './useInitializedRef';

type UnsubscribeFunction = () => void;
type Field<T> = keyof T;
type Fields<T> = Array<Field<T>>;
type CallbackFunction = () => void;
type CallbackMap<T> = Map<Fields<T>, CallbackFunction>;
export type SubscribeFunction<T> = (fields: Fields<T>, callback: CallbackFunction) => UnsubscribeFunction;

type DispatchFieldFunction<T> = (field: Field<T>) => void;
type DispatchAllFunction = () => void;
export interface DispatchFunctions<T> {
  field: DispatchFieldFunction<T>;
  all: DispatchAllFunction;
}

interface SubscribeToFieldsHook<T> {
  subscribe: SubscribeFunction<T>;
  dispatch: DispatchFunctions<T>;
}

export const useSubscribeToFields = <T>(): SubscribeToFieldsHook<T> => {
  const callbackMapRef = useInitializedRef<CallbackMap<T>>(() => new Map());

  const subscribe = useCallback((fields: Fields<T>, callback: CallbackFunction) => {
    callbackMapRef.current.set(fields, callback);

    return () => {
      callbackMapRef.current.delete(fields);
    }
  }, []);

  const dispatch = useMemo<DispatchFunctions<T>>(() => ({
    field: (field: Field<T>) => {
      const fieldsToCall = [...callbackMapRef.current.keys()].filter((fields) => fields.includes(field));

      fieldsToCall.forEach((fields) => {
        const callback = callbackMapRef.current.get(fields);

        callback!();
      });
    },
    all: () => {
      [...callbackMapRef.current.values()].forEach(x => x());
    }
  }), []);

  return {
    subscribe,
    dispatch
  };
}