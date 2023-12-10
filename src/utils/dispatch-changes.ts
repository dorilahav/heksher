import {DispatchFunctions} from '../hooks';
const getChangedFields = <T extends object>(oldValue: T, newValue: T): Array<keyof T> => {
  const keys = [...new Set(Object.keys(oldValue).concat(Object.keys(newValue)))] as Array<keyof T>;

  return keys.filter(key => oldValue[key] !== newValue[key]);
}

export const dispatchChanges = <T extends object>(oldValue: T, newValue: T, dispatch: DispatchFunctions<T>) => {
  if (Array.isArray(newValue)) {
    dispatch.all();
  } else {
    getChangedFields(oldValue, newValue).forEach(dispatch.field);
  }
}