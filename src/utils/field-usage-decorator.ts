export const fieldUsageDecorator = <T extends {}>(object: T, usedFieldsSet: Set<string>): T => {
  usedFieldsSet.clear();

  return new Proxy(object, {
    get: (object, accessedKey) => {
      usedFieldsSet.add(accessedKey as string);
      return object[accessedKey];
    }
  });
}