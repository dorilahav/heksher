export const useTrackObjectFieldsUsage = <T extends {}>(object: T, usedFieldsSet: Set<keyof T>): T => {
  usedFieldsSet.clear();

  return new Proxy(object, {
    get: (object, accessedKey) => {
      usedFieldsSet.add(accessedKey as keyof T);
      return object[accessedKey];
    }
  });
}