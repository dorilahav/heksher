import { useCallback, useMemo } from 'react';
import { usePersistedMap } from './usePersistedMap';

type UnsubscribeFunction = () => void;
type CallbackFunction = () => void;
export type SubscribeFunction = (fields: string[], callback: CallbackFunction) => UnsubscribeFunction;

type DispatchFieldFunction = (field: string) => void;
type DispatchAllFunction = () => void;
export interface DispatchFunctions {
  field: DispatchFieldFunction;
  all: DispatchAllFunction;
}

export interface SubscribeToFieldsHook {
  subscribe: SubscribeFunction;
  dispatch: DispatchFunctions;
}

export const useSubscribeToFields = (): SubscribeToFieldsHook => {
  const callbackMap = usePersistedMap<string[], CallbackFunction>();

  const subscribe = useCallback((fields: string[], callback: CallbackFunction) => {
    callbackMap.set(fields, callback);

    return () => {
      callbackMap.delete(fields);
    }
  }, []);

  const dispatch = useMemo<DispatchFunctions>(() => ({
    field: (field: string) => {
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