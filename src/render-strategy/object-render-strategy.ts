import { getChangedFields } from '../utils/dispatch-changes';
import { CallbackMap, RenderStrategy, RenderStrategyType, RenderStrategyTypeSymbol } from './create-render-strategy';

export const createObjectRenderStrategy = <T>(value: T): RenderStrategy<T> => {
  const type: RenderStrategyType = 'object';
  const render = (newStrategy: RenderStrategy<unknown>, callbackMap: CallbackMap) => {
    if (type !== newStrategy[RenderStrategyTypeSymbol]) {
      [...callbackMap.values()].forEach(x => x());

      return;
    }

    const changedFields = getChangedFields(value, newStrategy.value);
    const callbacks = [...callbackMap.entries()].filter(([fields]) => fields.some(x => changedFields.includes(x))).map(([, callback]) => callback);

    callbacks.forEach(x => x());
  }

  return {
    render,
    value,
    [RenderStrategyTypeSymbol]: type
  };
}