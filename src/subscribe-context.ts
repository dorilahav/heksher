import { createContext, useContext } from 'react';
import { SubscribeFunction } from './hooks';

interface SubscribeContextValue<T> {
  subscribe: SubscribeFunction<T>;
  getValue: () => T;
}

export type SubscribeContext<T> = React.Context<SubscribeContextValue<T> | null>;

export const createSubscribeContext = <T,>() => createContext<SubscribeContextValue<T> | null>(null);

export const useSubscribeContext = <T,>(context: SubscribeContext<T>) => {
  const value = useContext(context);

  if (!value) {
    throw new Error(
      'Invalid Usage! You called Heksher.use without wrapping it with an Heksher.Provider.'
    );
  }

  return value;
}