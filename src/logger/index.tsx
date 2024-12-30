"use client";

import type { ReactNode } from "react";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import { useMergeRefs } from "./hooks/useMergeRefs";
import type { DOMEvents, LoggerConfig, LoggerContextProps, PrivateLoggerContextProps } from "./types";

export function createLogger<Context, SendParams, EventParams, ImpressionParams, PageViewParams>(
  config: LoggerConfig<Context, SendParams, EventParams, ImpressionParams, PageViewParams>,
) {
  const PrivateLoggerContext = createContext<null | PrivateLoggerContextProps<Context>>(null);
  const LoggerContext = createContext<null | LoggerContextProps<
    Context,
    SendParams,
    EventParams,
    ImpressionParams,
    PageViewParams
  >>(null);

  const usePrivateContext = () => {
    const context = useContext(PrivateLoggerContext);
    if (context === null) {
      throw new Error("usePrivateContext must be used within a PrivateLoggerProvider");
    }
    return context;
  };

  const useLogger = () => {
    const context = useContext(LoggerContext);
    if (context === null) {
      throw new Error("useLogger must be used within a LoggerProvider");
    }
    return context;
  };

  const PrivateProvider = ({ children, initialContext }: { children: ReactNode; initialContext: Context }) => {
    const contextRef = useRef<Context>(initialContext);

    const _getContext = useCallback(() => {
      return contextRef.current;
    }, [contextRef]);

    const _setContext = useCallback(
      (context: Context) => {
        contextRef.current = context;
      },
      [contextRef],
    );

    return (
      <PrivateLoggerContext.Provider value={useMemo(() => ({ _getContext, _setContext }), [_getContext, _setContext])}>
        {children}
      </PrivateLoggerContext.Provider>
    );
  };

  const Provider = ({ children, initialContext }: { children: ReactNode; initialContext: Context }) => {
    if (initialContext !== undefined) {
      config.init?.(initialContext);
    }

    return (
      <PrivateProvider initialContext={initialContext}>
        <LoggerContext.Provider
          value={useMemo(
            () => ({
              logger: config,
            }),
            [],
          )}
        >
          {children}
        </LoggerContext.Provider>
      </PrivateProvider>
    );
  };

  const Event = ({ children, type, params }: { children: ReactNode; type: keyof DOMEvents; params: EventParams }) => {
    const child = Children.only(children);
    const { logger } = useLogger();
    const { _getContext } = usePrivateContext();
    return (
      isValidElement<{ [key in keyof DOMEvents]?: (...args: any[]) => void }>(child) &&
      cloneElement(child, {
        onClick: (...args: any[]) => {
          if (logger.events?.[type] !== undefined) {
            logger.events?.[type]?.(params, _getContext());
          }
          if (child.props && typeof child.props?.[type] === "function") {
            return child.props[type]?.(...args);
          }
        },
      })
    );
  };

  const Click = ({ children, params }: { children: ReactNode; params: EventParams }) => {
    return (
      <Event type="onClick" params={params}>
        {children}
      </Event>
    );
  };

  const Impression = ({
    children,
    params,
    // options,
  }: {
    children: ReactNode;
    params: ImpressionParams;
    // options: ImpressionOptions;
  }) => {
    const { logger } = useLogger();
    const { _getContext } = usePrivateContext();

    const { isIntersecting, ref: impressionRef } = useIntersectionObserver({
      threshold: 0.5,
    });

    const child = Children.only(children);
    const hasRef = isValidElement(child) && (child as any)?.ref != null;
    const ref = useMergeRefs<HTMLDivElement>(hasRef ? [(child as any).ref, impressionRef] : [impressionRef]);

    useEffect(() => {
      if (!isIntersecting || logger.impression === undefined) {
        return;
      }
      logger.impression.onImpression(params, _getContext());
    }, [isIntersecting, logger.impression, params, _getContext]);

    return hasRef ? (
      cloneElement(child as any, {
        ref,
      })
    ) : (
      <div aria-hidden ref={ref}>
        {child}
      </div>
    );
  };

  const PageView = (params: PageViewParams) => {
    const { logger } = useLogger();
    const { _getContext } = usePrivateContext();
    useEffect(() => {
      logger.pageView?.onView?.(params, _getContext());
    }, [logger.pageView, params, _getContext]);
    return null;
  };

  const SetContext = (context: Context) => {
    const { logger } = useLogger();
    const { _setContext } = usePrivateContext();

    useEffect(() => {
      if (logger.setContext !== undefined) _setContext(logger.setContext(context));
    }, [logger.setContext, logger, context, _setContext]);
    return null;
  };

  return [
    {
      Provider,
      Click,
      Impression,
      PageView,
      SetContext,
    },
    useLogger,
  ] as const;
}
