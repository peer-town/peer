export const dispatchMock = jest.fn();
export const showUserProfileMock = jest.fn();

jest.mock('../src/store', () => ({
  useAppSelector: () => {
    return { id: "sample-id", didSession: "sample-session" };
  },
  useAppDispatch: () => {
    return dispatchMock;
  },
  showUserProfile: () => {
    return showUserProfileMock;
  },
  store: {
    getState: jest.fn(),
    subscribe: jest.fn(),
  }
}));

jest.mock('next/router', () => ({
  useRouter() {
    return ({
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn()
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null)
    });
  },
}));

jest.mock("react-markdown", () => (props) => {
  return props.children;
});

jest.mock("remark-gfm", () => () => {});
