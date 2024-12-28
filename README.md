# react-analytics-logger
This package provides a flexible and extensible analytics logging system(e.g. GA, Amplitude) designed to handle various types of events and context management in your application. It is built with TypeScript, ensuring type safety and ease of integration.

## Main Features
1. Supports both declarative and imperative APIs, allowing developers to choose the style that best fits their needs.
2. Offers type-safe React components and hooks through the `createConfig` function by using JavaScript closure.
3. Clearly defines a layer for injecting dependencies related to analytics tools.

## Installing
Using npm:

```bash
$ npm install react-analytics-logger
```

Using yarn:
```bash
$ yarn add react-analytics-logger
```

Using pnpm:
```bash
$ pnpm add react-analytics-logger
```

## Example with react-ga4

#### logger.ts
```tsx
import ReactGA from "react-ga4";
import { createLogger } from "react-analytics-logger";

type EventParams = { category: string; label: string; value: number };
type GAContext = {
  userId: string;
  clientId: string;
};

export const [GALogger, useGA] = createLogger({
  init: () => {
    ReactGA.initialize("(your-ga-id)");
  },
  events: {
    onClick: (params: EventParams, context: GAContext) => {
      ReactGA.event({
        ...params,
        ...context,
        action: "click",
      });
    },
  },
  impression: {
    onImpression: (params: EventParams, context: GAContext) => {
      ReactGA.event({
        ...params,
        ...context,
        action: "impression",
      });
    },
  },
  pageView: {
    onView: ({ page }: { page: string }) => {
      ReactGA.send({
        hitType: "pageview",
        page,
      });
    },
  },
  setContext: (context: GAContext) => {
    return context;
  },
});
```


#### App.tsx
```tsx
import { useState } from "react";
import "./App.css";
import { GALogger } from "./gaLogger";

function App() {
  const [count, setCount] = useState(0);

  return (
    <GALogger.Provider
      initialContext={{ userId: "USERID", clientId: "CLIENTID" }}
    >
      <h1>React Analytics Logger</h1>
      <div className="card">
        <GALogger.Click
          params={{ category: "test", label: "count", value: count + 1 }}
        >
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </GALogger.Click>
      </div>
      <p className="read-the-docs">
        Click to learn more
      </p>
      <GALogger.PageView page="/home" />
    </GALogger.Provider>
  );
}

export default App;

```
