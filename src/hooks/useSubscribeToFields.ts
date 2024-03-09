import { useCallback, useMemo } from 'react';
import { usePersistedClassValue } from './usePersistedClassValue';

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
  const {subscribe, callbackMap} = useCallbackSubscription();

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

export const useCallbackSubscription = () => {
  const callbackMap = usePersistedClassValue(Map<string[], CallbackFunction>);

  const subscribe = useCallback((fields: string[], callback: CallbackFunction) => {
    callbackMap.set(fields, callback);

    return () => {
      callbackMap.delete(fields);
    }
  }, []);

  return {
    subscribe,
    callbackMap
  };
}