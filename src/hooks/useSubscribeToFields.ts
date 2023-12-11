import { useCallback, useMemo } from 'react';
import { usePersistedMap } from './usePersistedMap';

type UnsubscribeFunction = () => void;
type Field<T> = keyof T;
type Fields<T> = Array<Field<T>>;
type CallbackFunction = () => void;
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
  const callbackMap = usePersistedMap<Fields<T>, CallbackFunction>();

  const subscribe = useCallback((fields: Fields<T>, callback: CallbackFunction) => {
    callbackMap.set(fields, callback);

    return () => {
      callbackMap.delete(fields);
    }
  }, []);

  const dispatch = useMemo<DispatchFunctions<T>>(() => ({
    field: (field: Field<T>) => {
      const fieldsToCall = [...callbackMap.keys()].filter((fields) => fields.includes(field));

      fieldsToCall.forEach((fields) => {
        const callback = callbackMap.get(fields);

        callback!();
      });
    },
    all: () => {
      [...callbackMap.values()].forEach(x => x());
    }
  }), []);

  return {
    subscribe,
    dispatch
  };
}