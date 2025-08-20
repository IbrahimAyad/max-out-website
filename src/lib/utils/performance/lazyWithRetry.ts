import { lazy, ComponentType } from "react";
import { retry } from "./retry";

export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(() =>
    retry(componentImport, {
      maxAttempts: 3,
      initialDelay: 1000,
      onRetry: (error, attempt) => {

      },
    })
  );
}

// Usage example:
// const MyComponent = lazyWithRetry(() => import('./MyComponent'));