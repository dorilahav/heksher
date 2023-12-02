import { MutableRefObject, useRef } from 'react';

export const useInitializedRef = <T>(initializer: () => T) => {
  const hasInitializedRef = useRef(false);
  const callbackMapRef = useRef<T>();

  if (!hasInitializedRef.current) {
    callbackMapRef.current = initializer();
    hasInitializedRef.current = true;
  }

  return callbackMapRef as MutableRefObject<T>;
}