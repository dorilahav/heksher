import { version } from 'react';
import { ActFunction, RenderHook } from './react-types';

const setup = () => {
  if (version.startsWith('16.') || version.startsWith('17.')) {
    Object.assign(global, {...require('./testing-library-react-hooks')});
  } else {
    Object.assign(global, {...require('./testing-library-react')});
  }
}

declare global {
  const renderHook: RenderHook;
  const act: ActFunction;
}

setup();