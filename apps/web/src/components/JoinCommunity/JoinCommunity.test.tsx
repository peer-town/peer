import { render, screen, fireEvent, act } from "@testing-library/react";
import JoinCommunity from "./JoinCommunity";
import { left } from "../../utils/fp";
import { trpc } from "../../utils/trpc";

jest.mock("../../utils/trpc", () => {
  return {
    trpc: {
      user: {
        checkCommunityUser: {
          useQuery: jest.fn(),
        },
      },
      community: {
        createUserCommunityRealtion: {
          useMutation: jest.fn(),
        },
      },
    },
  };
});

jest.mock('react-toastify', () => ({
  toast:{
    success: jest.fn(),
    error: jest.fn()
  }
}));

jest.mock('../../store', () => ({
  useAppSelector: () => {
    return {
      session:'sample-session-id',
      userId: 'sample-user-id',
      userAuthor: 'sample-community-id',
    };
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

describe.only("<JoinCommunity />", () => {

  beforeEach(()=>{
    jest.resetAllMocks()
  })
  it("should render the component with no issues", () => {
    (trpc.user.checkCommunityUser.useQuery as jest.Mock).mockReturnValue({
      data: false,
    });
    const result = render(<JoinCommunity />);
    expect(result.container).toBeInTheDocument();
  });

  it("should not render component SecondaryButton if user is in the community", () => {
    (trpc.user.checkCommunityUser.useQuery as jest.Mock).mockReturnValue({
      data: true,
    });
     render(<JoinCommunity />);
    const button = document.getElementById("primary-button");
    expect(button).not.toBeInTheDocument();
  });

  it("should not render component SecondaryButton if the data is undefined", () => {
    (trpc.user.checkCommunityUser.useQuery as jest.Mock).mockReturnValue({
      data: true,
    });
    render(<JoinCommunity />);
    const button = document.getElementById("primary-button");
    expect(button).not.toBeInTheDocument();
  });

  it("should call mutation to create userCommunity relation", () => {
    (trpc.user.checkCommunityUser.useQuery as jest.Mock).mockReturnValue({
      data: false,
      refetch: jest.fn(),
    });

    const mockResponse = left({ data: "data" });
    const mutationMock = jest.fn().mockResolvedValue(mockResponse);

    (
      trpc.community.createUserCommunityRealtion.useMutation as jest.Mock
    ).mockReturnValue({ mutateAsync: mutationMock });

    render(<JoinCommunity />);

    const button = screen.getByRole("button");
    act(() => {
      fireEvent.click(button);
    });
    expect(mutationMock).toBeCalledTimes(1);
  });
});
