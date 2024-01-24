interface RenderHookResult<TResult, TProps> {
  rerender: (props?: TProps) => void;
  result: {
    current: TResult;
  };
  unmount: () => void;
}

interface RenderHookOptions<TProps> {
  initialProps?: TProps;
  wrapper?: React.JSXElementConstructor<{children: React.ReactElement}>;
}

export type RenderHook = <TResult, TProps>(render: () => TResult, options?: RenderHookOptions<TProps>) => RenderHookResult<TResult, TProps>;
export type ActFunction = (callback: () => void) => void;