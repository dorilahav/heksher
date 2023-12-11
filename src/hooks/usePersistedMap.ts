import { useRef } from 'react';

export const usePersistedMap = <K, V, >(): Map<K, V> => {
  const mapRef = useRef<Map<K, V>>(null);

  if (!mapRef.current) {
    mapRef.current = new Map();
  }

  return mapRef.current;
}