import { render } from "@testing-library/react";

import { createLogger } from "..";

const initFn = vi.fn();
const sendFn = vi.fn();
const setContextFn = vi.fn();
const clickFn = vi.fn();
const focusFn = vi.fn();

const [Logger] = createLogger({
  init: initFn,
  send: sendFn,
  events: {
    onClick: clickFn,
    onFocus: focusFn,
  },
  setContext: setContextFn,
});

// const renderUseLogger = (initialContext: any, children: ReactNode) =>
//   renderHook(() => useLogger(), {
//     wrapper: ({ children }) => Logger.Provider({ initialContext, children }),
//   });

describe("init function should be called when the Logger.Provider is mounted", () => {
  it("should init the logger", () => {
    render(
      <Logger.Provider initialContext={{}}>
        <div>test</div>
      </Logger.Provider>,
    );

    expect(initFn).toHaveBeenCalledOnce();
  });
});

describe("Events", () => {
  it("events.onClick should be called when the button inside Logger.Click is clicked", () => {
    const context = { userId: "id" };
    const clickParams = { a: 1 };
    const page = render(
      <Logger.Provider initialContext={context}>
        <div>test</div>
        <Logger.Click params={clickParams}>
          <button>click</button>
        </Logger.Click>
      </Logger.Provider>,
    );

    page.getByText("click").click();
    expect(clickFn).toHaveBeenCalledWith(clickParams, context);
  });

  it("any DOM events such as onFoucs can be called declaratively using Logger.Event", () => {
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
