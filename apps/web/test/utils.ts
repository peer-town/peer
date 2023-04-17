export const mockWindow = () => {
  Object.defineProperty(window, 'location', {
    value: {
      assign: jest.fn(),
      replace: jest.fn(),
    },
    writable: true,
  });
  // noinspection JSUnusedGlobalSymbols
  window.IntersectionObserver = jest.fn().mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
}
