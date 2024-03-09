export type CallbackMap = Map<string[], CallbackFunction>;

export type CallbackFunction = () => void;

export type RenderStrategyType = 'object' | 'array';

export const RenderStrategyTypeSymbol = Symbol('RenderStrategyType');

export interface RenderStrategy<T> {
  render: (strategy: RenderStrategy<unknown>, callbackMap: CallbackMap) => void;
  value: T;
  [RenderStrategyTypeSymbol]: RenderStrategyType;
}

export const isRenderStrategy = (value: unknown): value is RenderStrategy<unknown> => {
  return !!value[RenderStrategyTypeSymbol];
}