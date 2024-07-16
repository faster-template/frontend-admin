import { App, Plugin } from 'vue';
import { Router } from 'vue-router';

interface ErrorHandlerOptions {
  router?: Router;
}

function sendErrorInfo(errorType: string, error: string) {
  // eslint-disable-next-line no-console
  console.log(`${errorType}: ${error}`);
}

const ErrorHandler: Plugin = {
  install(app: App, { router }: ErrorHandlerOptions = {}) {
    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      sendErrorInfo('promise-error', event.reason);
      event.stopImmediatePropagation();
      event.preventDefault();
    };

    const handleErrorEvent = (event: ErrorEvent) => {
      sendErrorInfo('event-error', event.message);
      event.stopImmediatePropagation();
      event.preventDefault();
    };

    const handleWindowError = (
      event: Event | string,
      source?: string,
      lineno?: number,
      colno?: number,
      error?: Error
    ) => {
      sendErrorInfo(
        'win.onerror',
        `message: ${event}, source: ${source}, lineno: ${lineno}, colno: ${colno}, error: ${error}`
      );
    };

    window.addEventListener('unhandledrejection', handlePromiseRejection);
    window.addEventListener('error', handleErrorEvent);
    window.onerror = handleWindowError;

    app.config.errorHandler = (_err, _instance, info) => {
      sendErrorInfo('vue', info);
    };

    if (router) {
      router.onError((error) => {
        sendErrorInfo('router', error.message);
        const pattern = /Loading chunk (\d)+ failed/g;
        const isChunkLoadFailed = error.message.match(pattern);
        if (isChunkLoadFailed) {
          window.location.reload();
        }
      });
    }

    // Optionally add to global properties for use in components
    app.config.globalProperties.$sendErrorInfo = sendErrorInfo;
  },
};

export default ErrorHandler;
