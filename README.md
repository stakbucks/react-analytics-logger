<p align='center'>
<img src='https://github.com/user-attachments/assets/80989807-139e-41aa-8c3f-5d32e53dcac0' width=600 height=314 />
</p>


# react-analytics-logger
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/slash/blob/main/LICENSE) 
[![NPM badge](https://img.shields.io/npm/v/react-analytics-logger?logo=npm)](https://www.npmjs.com/package/react-analytics-logger) 

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

type SendParams = {
  hitType:string;
  [key:string]:string;
}
type EventParams = { category: string; label: string; value?: number };
type GAContext = {
  userId: string;
  clientId: string;
};

export const [GALogger, useGA] = createLogger({
  init: () => {
    ReactGA.initialize("(your-ga-id)");
  },
  send: (params: SendParams , context: GAContext) => {
    const { hitType, ...rest } = params;
      ReactGA.send({
        hitType,
        ...rest,
      });
  },
  events: {
    onClick: (params: EventParams, context: GAContext) => {
      ReactGA.event({
        ...params,
        ...context,
        action: "click",
      });
    },
    onFocus: (params: EventParams, context: GAContext) => {
      ReactGA.event({
        ...params,
        ...context,
        action: "focus",
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
    options:{
      threshold: 0.5,
    }
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
import { GALogger } from "./logger";

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
      <GALogger.Event type="onFocus" params={{ category: "test", label: "my-input" }>
          <input />
      </GALogger.Event>
      <GALogger.PageView page="/home" />
    </GALogger.Provider>
  );
}

export default App;

```
