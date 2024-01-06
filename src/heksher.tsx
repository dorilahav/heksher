import React, { ReactNode, useDebugValue, useEffect, useMemo, useRef } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import { useSubscribeToFields } from './hooks';
import { SubscribeContext, createSubscribeContext, useSubscribeContext } from './subscribe-context';
import { dispatchChanges, doesValueHaveFields, fieldUsageDecorator } from './utils';

export interface HeksherProviderProps<THeksherValue> {
  /**
   * React's standard children prop. It's required because a Provider must wrap at least one component in order to be useful.
   */
  children: ReactNode;

  /**
   * The value to pass down to the child components.
   */
  value: THeksherValue;
}

/**
 * A Provider component is used to provide the value to pass down child components.
 * Usually this component will be wrapped with another component that will handle all the logic associated with providing the value.
 */
export type HeksherProviderComponent<THeksherValue> = (props: HeksherProviderProps<THeksherValue>) => JSX.Element

/**
 * A use hook is used to get the passed down value from the nearest parent Provider.
 * Usually this hook will be wrapped with another hook in order to be able to add additional logic if ever needed.
 */
export type HeksherUseHook<THeksherValue> = () => THeksherValue;

/**
 * The Heksher object containing everything to pass down values to child components.
 */
export interface Heksher<THeksherValue> {
  /**
   * {@inheritdoc HeksherProviderComponent}
   */
  Provider: HeksherProviderComponent<THeksherValue>;

  /**
   * {@inheritdoc HeksherUseHook}
   */
  use: HeksherUseHook<THeksherValue>;
}

const createHeksherProvider = <THeksherValue,>(subscribeContext: SubscribeContext<THeksherValue>) => (
  function HeksherProvider({children, value}: HeksherProviderProps<THeksherValue>) {
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

const createUseHeksher = <THeksherValue,>(subscribeContext: SubscribeContext<THeksherValue>) => (
  function useHeksher() {
    const usedFieldsRef = useRef<Set<string>>(new Set());
    const {subscribe, getValue} = useSubscribeContext(subscribeContext);

    const value = useSyncExternalStore((onValueChange) => subscribe([...usedFieldsRef.current], onValueChange), getValue);

    useDebugValue(value);

    return doesValueHaveFields(value) ? fieldUsageDecorator(value, usedFieldsRef.current) : value;
  }
);

/**
 * A function that is used to create a new Heksher.
 * @typeParam TValue - The value passed down by Heksher.
 * @returns a {@link Heksher} object with a {@link HeksherProvider} to provide a value and a {@link HeksherUseHook} to use it.
 * 
 * @remarks
 * A heksher is a more optimized version of a react context.
 * Instead of re-rendering every component that used the context, heksher is only re-rendering the components which are using fields that changed inside the value object.
 * Using heksher can reduce a lot of unneccessary renders without the need to learn a new api.
 * 
 * @example
 * ```typescript jsx
 * const NumberHeksher = createHeksher<number>();
 * 
 * const NumberDisplay = () => {
 *  const number = NumberHeksher.use();
 * 
 *  return <div>{number}</div>;
 * }
 * 
 * const App = () => (
 *  <NumberHeksher.Provider value={100}>
 *    <NumberDisplay/>
 *  </NumberHeksher.Provider>
 * );
 * ```
 */
export const createHeksher = <TValue,>(): Heksher<TValue> => {
  const subscribeContext = createSubscribeContext<TValue>();

  return {
    Provider: createHeksherProvider(subscribeContext),
    use: createUseHeksher(subscribeContext)
  }
}