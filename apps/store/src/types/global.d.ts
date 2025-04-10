declare global {
  interface Window {
    remoteCheckout?: {
      mount: (el: HTMLElement) => void;
    };
  }
}
