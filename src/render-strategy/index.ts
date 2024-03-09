import { createArrayRenderStrategy } from './array-render-strategy';
import { createObjectRenderStrategy } from './object-render-strategy';

export { createArrayRenderStrategy } from './array-render-strategy';
export { isRenderStrategy } from './create-render-strategy';
export type { RenderStrategy } from './create-render-strategy';
export { createObjectRenderStrategy } from './object-render-strategy';

export const createDefaultRenderStrategy = <T>(value: T) => {
  return Array.isArray(value) ? createArrayRenderStrategy<T>(value) : createObjectRenderStrategy<T>(value);
}
