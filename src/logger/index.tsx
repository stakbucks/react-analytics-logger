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
import type { LoggerConfig, LoggerContextProps, PrivateLoggerContextProps } from "./types";

export function createLogger<Context, EventParams, ImpressionParams, PageViewParams>(
  config: LoggerConfig<Context, EventParams, ImpressionParams, PageViewParams>,
) {
  const PrivateLoggerContext = createContext<null | PrivateLoggerContextProps<Context>>(null);
  const LoggerContext = createContext<null | LoggerContextProps<
    Context,
    EventParams,
    ImpressionParams,
    PageViewParams
  >>(null);

  const useLogger = () => {
    const context = useContext(LoggerContext);
    if (context === null) {
      throw new Error("useLogger must be used within a LoggerProvider");
    }
    return context;
  };

  const PrivateProvider = ({ children, initialContext }: { children: ReactNode; initialContext?: Context }) => {
    const contextRef = useRef<Context | undefined>(initialContext);

    const _getContext = useCallback(() => {
      return contextRef.current;
    }, [contextRef]);

    const _setContext = useCallback(
      (context?: Context) => {
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

  const Provider = ({ children, initialContext }: { children: ReactNode; initialContext?: Context }) => {
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

  const Click = ({ children, params }: { children: ReactNode; params: EventParams }) => {
    const child = Children.only(children);
    const { logger } = useLogger();

    return (
      isValidElement<{ onClick?: (...args: any[]) => void }>(child) &&
      cloneElement(child, {
        onClick: (...args: any[]) => {
          if (logger.events.onClick !== undefined) {
            logger.events.onClick(params);
          }
          if (child.props && typeof child.props["onClick"] === "function") {
            return child.props["onClick"](...args);
          }
        },
      })
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
      logger.impression.onImpression(params);
    }, [isIntersecting, logger.impression, params]);

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
    useEffect(() => {
      logger.pageView?.onView?.(params);
    }, [logger.pageView, params]);
    return null;
  };

  const SetContext = (context: Context) => {
    const { logger } = useLogger();
    const privateContext = useContext(PrivateLoggerContext);

    useEffect(() => {
      if (logger.setContext !== undefined) privateContext?._setContext(logger.setContext(context));
    }, [logger.setContext, logger, privateContext, context]);
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
