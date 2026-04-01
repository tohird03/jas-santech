type TrueObject = Record<string, any>;

interface Window {
  bpspat: {
    api: TrueObject;
  };
}

declare global {
  interface WindowEventMap {
    'local-storage': CustomEvent;
  }
}

declare module 'react-gallery-carousel'
