type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void;

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = true
): DebouncedFunction<T> {
  let timeout: number | null;

  return function debounced(this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = window.setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

export default debounce;
