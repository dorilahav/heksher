import { useRef } from 'react';

interface ClassValueConstructor<TValue> {
  new (): TValue;
}

export const usePersistedClassValue = <TValue>(ctor: ClassValueConstructor<TValue>): TValue => {
  const mapRef = useRef<TValue>(null);

  if (!mapRef.current) {
    mapRef.current = new ctor();
  }

  return mapRef.current;
}