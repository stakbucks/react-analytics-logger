import { render } from "@testing-library/react";
import { vi } from "vitest";

import { createLogger } from "..";

const initFn = vi.fn();
const sendFn = vi.fn();
const setContextFn = vi.fn();
const clickFn = vi.fn();
const focusFn = vi.fn();
const impressionFn = vi.fn();
const pageViewFn = vi.fn();

const [Logger, useLogger] = createLogger({
  init: initFn,
  send: sendFn,
  events: {
    onClick: clickFn,
    onFocus: focusFn,
  },
  impression: {
    onImpression: impressionFn,
  },
  setContext: setContextFn,
  pageView: {
    onPageView: pageViewFn,
  },
});

describe("init", () => {
  it("init function should be called when the Logger.Provider is mounted", () => {
    render(
      <Logger.Provider initialContext={{}}>
        <div>test</div>
      </Logger.Provider>,
    );

    expect(initFn).toHaveBeenCalledOnce();
  });
});

describe("events", () => {
  it("events.onClick should be called when the element inside Logger.Click is clicked", () => {
    const context = { userId: "id" };
    const clickParams = { a: 1 };
    const page = render(
      <Logger.Provider initialContext={context}>
        <div>test</div>
        <Logger.Click params={clickParams}>
          <button type="button">click</button>
        </Logger.Click>
      </Logger.Provider>,
    );

    page.getByText("click").click();
    expect(clickFn).toHaveBeenCalledWith(clickParams, context);
  });

  it("events.onClick can be called manually by using useLogger hook", () => {
    const context = { userId: "id" };
    const clickParams = { a: 1 };

    const ButtonWithLogger = () => {
      const { logger } = useLogger();

      return (
        <button type="button" onClick={() => logger.onClick?.(clickParams, context)}>
          click
        </button>
      );
    };

    const page = render(
      <Logger.Provider initialContext={context}>
        <div>test</div>
        <ButtonWithLogger />
      </Logger.Provider>,
    );

    page.getByText("click").click();
    expect(clickFn).toHaveBeenCalledWith(clickParams, context);
  });

  it("any DOM event such as onFoucs can be called declaratively using Logger.Event", () => {
    const context = { userId: "id" };
    const focusEventParams = { a: 1 };
    const page = render(
      <Logger.Provider initialContext={context}>
        <div>test</div>
        <Logger.Event type="onFocus" params={focusEventParams}>
          <input />
        </Logger.Event>
      </Logger.Provider>,
    );

    page.getByRole("textbox").click();
    expect(focusFn).toHaveBeenCalledWith(focusEventParams, context);
  });
});

describe("page view", () => {
  it("page view should be called when the page is loaded", () => {
    const context = { userId: "id" };
    const pageViewParams = { a: 1 };
    render(
      <Logger.Provider initialContext={context}>
        <div>test</div>
        <Logger.PageView {...pageViewParams} />
      </Logger.Provider>,
    );

    expect(pageViewFn).toHaveBeenCalledWith(pageViewParams, context);
  });
});

describe("set context", () => {
  it("set context should be called when the Logger.SetContext is mounted", () => {
    const context = { userId: "id" };
    const newContext = { userId: "newId" };
    render(
      <Logger.Provider initialContext={context}>
        <div>test</div>
        <Logger.SetContext {...newContext} />
      </Logger.Provider>,
    );

    expect(setContextFn).toHaveBeenCalledWith(newContext);
  });
});
