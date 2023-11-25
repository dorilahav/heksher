import { useCallback } from 'react';
import { useInitializedRef } from './useInitializedRef';

type UnsubscribeFunction = () => void;
type Field<T> = keyof T;
type Fields<T> = Array<Field<T>>;
type CallbackFunction = () => void;
type CallbackMap<T> = Map<Fields<T>, CallbackFunction>;

interface SubscribeToFieldsHook<T> {
  subscribe: (fields: Fields<T>, callback: CallbackFunction) => UnsubscribeFunction;
  dispatch: (field: Field<T>) => void;
}

export const useSubscribeToFields = <T>(): SubscribeToFieldsHook<T> => {
  const callbackMapRef = useInitializedRef<CallbackMap<T>>(() => new Map());

  const subscribe = useCallback((fields: Fields<T>, callback: CallbackFunction) => {
    callbackMapRef.current.set(fields, callback);

    return () => {
      callbackMapRef.current.delete(fields);
    }
  }, []);

  const dispatch = useCallback((field: Field<T>) => {
    const fieldsToCall = [...callbackMapRef.current.keys()].filter((fields) => fields.includes(field));

    fieldsToCall.forEach((fields) => {
      const callback = callbackMapRef.current.get(fields);

      callback!();
    });
  }, []);

  return {
    subscribe,
    dispatch
  };
}