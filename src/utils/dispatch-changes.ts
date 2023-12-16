import { DispatchFunctions } from '../hooks';
import { doesValueHaveFields } from './does-value-have-fields';

const getChangedFields = (oldValue: unknown, newValue: unknown): Array<string> => {
  const keys = [...new Set(Object.keys(oldValue).concat(Object.keys(newValue)))];

  return keys.filter(key => oldValue[key] !== newValue[key]);
}

const shouldDispatchChangeForSpecificFields = (oldValue: unknown, newValue: unknown): boolean =>
  doesValueHaveFields(oldValue) && doesValueHaveFields(newValue);

export const dispatchChanges = (oldValue: unknown, newValue: unknown, dispatch: DispatchFunctions) => {
  if (shouldDispatchChangeForSpecificFields(oldValue, newValue)) {
    getChangedFields(oldValue, newValue).forEach(dispatch.field);
  } else {
    dispatch.all();
  }
}