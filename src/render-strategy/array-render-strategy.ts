import { CallbackMap, RenderStrategy, RenderStrategyType, RenderStrategyTypeSymbol } from './create-render-strategy';

export const createArrayRenderStrategy = <T>(value: T): RenderStrategy<T> => {
  const type: RenderStrategyType = 'array';
  const render = (_newStrategy: RenderStrategy<unknown>, callbackMap: CallbackMap) => {
    [...callbackMap.values()].forEach(x => x());
  }

  return {
    render,
    value,
    [RenderStrategyTypeSymbol]: type
  };
}