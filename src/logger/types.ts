import { DOMAttributes } from "react";

export interface ImpressionOptions {
  // TODO: add options
}
export interface MountOptions {
  // TODO: add options
}

type InitFunction<C> = (initialContext: C) => void;

type SendFunction<P, C> = (params: P, context: C) => void;

export type DOMEvents = Omit<DOMAttributes<HTMLDivElement>, "children" | "dangerouslySetInnerHTML">;
type Events<P, C> = Partial<Record<keyof DOMEvents, EventFunction<P, C>>>;
type EventFunction<P, C> = (params: P, context: C) => void;

type ImpressionFunction<P, C> = (params: P, context: C) => void;

type PageViewFunction<P, C> = (params: P, context: C) => void;

type SetContextFunction<C> = (context: C) => C;

export interface LoggerConfig<Context, SendParams, EventParams, ImpressionParams, PageViewParams> {
  /**
   * Initialize the logger with the given context.
   * @param initialContext - The initial context to use for the logger.
   * @returns void
   */
  init?: InitFunction<Context>;
  /**
   * The send function to send the event.
   */
  send?: SendFunction<SendParams, Context>;
  /**
   * The events to listen to.
   */
  events?: Events<EventParams, Context>;
  /**
   * The impression event to listen to.
   */
  impression?: {
    onImpression: ImpressionFunction<ImpressionParams, Context>;
    /**
     * TODO: add options
     */
    // options?: ImpressionOptions;
  };
  /**
   * The page track event to listen to.
   */
  pageView?: {
    onView: PageViewFunction<PageViewParams, Context>;
    /**
     * TODO: add options
     */
    // options?: MountOptions;
  };
  /**
   * The context setter.
   */
  setContext?: SetContextFunction<Context>;
}

export interface LoggerContextProps<Context, SendParams, EventParams, ImpressionParams, PageTrackParams> {
  logger: LoggerConfig<Context, SendParams, EventParams, ImpressionParams, PageTrackParams>;
}

export interface PrivateLoggerContextProps<Context = unknown> {
  _getContext: () => Context;
  _setContext: (context: Context) => void;
}
