import { MutableRefObject } from 'react';

export const useTrackObjectFieldsUsage = <T extends {}>(object: T, usedFieldsRef: MutableRefObject<Set<keyof T>>): T => {
  usedFieldsRef.current.clear();

  return new Proxy(object, {
    get: (object, accessedKey) => {
      usedFieldsRef.current.add(accessedKey as keyof T);
      return object[accessedKey];
    }
  });
}