import { renderHook as originalRenderHook } from '@testing-library/react-hooks';
import { RenderHook } from './react-types';

export const renderHook: RenderHook = (render, options) => {
  const {result: {error, current}, rerender, unmount} = originalRenderHook(render, options as any);

  if (error) {
    throw error;
  }

  return {
    result: {current},
    rerender,
    unmount
  }
}

export { act } from '@testing-library/react-hooks';

