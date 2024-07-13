type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  immediate = false
): ThrottledFunction<T> {
  let timeout: number | null;
  let lastRan: number | null = null;
  return function throttled(this: any, ...args: Parameters<T>) {
    if (immediate && !lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
      return;
    }

    if (lastRan === null || Date.now() - lastRan >= limit) {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (!immediate) {
        func.apply(this, args);
      }
      lastRan = Date.now();
    } else if (!timeout) {
      timeout = window.setTimeout(() => {
        timeout = null;
        if (!immediate) {
          func.apply(this, args);
        }
        lastRan = Date.now();
      }, limit - (Date.now() - lastRan));
    }
  };
}

export default null;
