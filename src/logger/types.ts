export interface ImpressionOptions {
  // TODO: add options
}
export interface MountOptions {
  // TODO: add options
}

type InitFunction<C> = (initialContext: C) => void;
type EventFunction<P, C> = (params: P, context?: C) => void;
type ImpressionFunction<P, C> = (params: P, context?: C) => void;
type PageViewFunction<P, C> = (params?: P, context?: C) => void;
type SetContextFunction<C> = (context: C) => C;

export interface LoggerConfig<Context, ClickParams, ImpressionParams, PageViewParams> {
  /**
   * @description Initialize the logger with the given context.
   * @param initialContext - The initial context to use for the logger.
   * @returns void
   */
  init?: InitFunction<Context>;
  /**
   * @description The events to listen to.
   */
  events: {
    // TODO: add other events
    onClick?: EventFunction<ClickParams, Context>;
  };
  /**
   * @description The impression event to listen to.
   */
  impression?: {
    onImpression: ImpressionFunction<ImpressionParams, Context>;
    /**
     * TODO: add options
     */
    // options?: ImpressionOptions;
  };
  /**
   * @description The page track event to listen to.
   */
  pageView?: {
    onView: PageViewFunction<PageViewParams, Context>;
    /**
     * TODO: add options
     */
    // options?: MountOptions;
  };
  /**
   * @description The context setter.
   */
  setContext?: SetContextFunction<Context>;
}

export interface LoggerContextProps<Context, ClickParams, ImpressionParams, PageTrackParams> {
  logger: LoggerConfig<Context, ClickParams, ImpressionParams, PageTrackParams>;
}

export interface PrivateLoggerContextProps<Context = unknown> {
  _getContext: () => Context | undefined;
  _setContext: (context?: Context) => void;
}
