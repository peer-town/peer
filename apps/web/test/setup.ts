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
