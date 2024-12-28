export interface ImpressionOptions {
  // TODO: add options
}
export interface MountOptions {
  // TODO: add options
}

export interface LoggerConfig<
  Context extends Object = {},
  ClickParams extends Object = {},
  ImpressionParams extends Object = {},
  PageViewParams extends Object = {},
> {
  /**
   * @description Initialize the logger with the given context.
   * @param initialContext - The initial context to use for the logger.
   * @returns void
   */
  init?: (initialContext?: Context) => void;
  /**
   * @description The events to listen to.
   */
  events: {
    // TODO: add other events
    onClick?: (params?: ClickParams, context?: Context) => void;
  };
  /**
   * @description The impression event to listen to.
   */
  impression?: {
    onImpression: (params?: ImpressionParams, context?: Context) => void;
    /**
     * TODO: add options
     */
    // options?: ImpressionOptions;
  };
  /**
   * @description The page track event to listen to.
   */
  pageView?: {
    onView: (params?: PageViewParams, context?: Context) => void;
    /**
     * TODO: add options
     */
    // options?: MountOptions;
  };
  /**
   * @description The context setter.
   */
  setContext?: (context: Context) => Context;
}

export interface LoggerContextProps<
  Context extends Object = {},
  ClickParams extends Object = {},
  ImpressionParams extends Object = {},
  PageTrackParams extends Object = {},
> {
  logger: LoggerConfig<Context, ClickParams, ImpressionParams, PageTrackParams>;
}

export interface PrivateLoggerContextProps<Context extends Object = {}> {
  _getContext: () => Context | undefined;
  _setContext: (context?: Context) => void;
}
