import {ThreadSection} from "./ThreadSection";
import {Provider} from "react-redux";
import {store} from "../../store";
import {renderWithTrpc} from "../../../test/trpcWrapper";
import {act, fireEvent, screen} from "@testing-library/react";
import {right} from "../../utils/fp";

const mockCreateComment = right({ data: { message: 'Comment posted successfully' } });
const mockThreadDetails = {
  isLoading: false,
  isError: false,
  data: {
    node: {
      id: 'thread id',
      title: 'Thread title',
      content: 'Thread content',
      createdAt: '2022-01-01T00:00:00.000Z',
      createdBy: {
        id: 'user id',
        username: 'Username',
        avatar: 'https://some-url.com/avatar.jpg',
      },
    },
  },
};
const mockFetchCommentsByThreadId = {
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
  data: {
    pages: [{
      edges: [
        {
          node: {
            id: 'comment id',
            content: 'Comment content',
            createdAt: '2022-01-02T00:00:00.000Z',
            createdBy: {
              id: 'user id',
              username: 'Username',
              avatar: 'https://some-url.com/avatar.jpg',
            },
          },
        },
      ],
    }]
  },
};

const mutationMock = jest.fn().mockResolvedValue(mockCreateComment);
const dispatchMock = jest.fn();
const showUserProfileMock = jest.fn();

jest.mock('../../utils/trpc', () => ({
  trpc: {
    public: {
      fetchThreadDetails: {
        useQuery: () => mockThreadDetails
      },
    },
    comment: {
      createComment: {
        useMutation: () => ({mutateAsync: mutationMock}),
      },
      fetchCommentsByThreadId: {
        useInfiniteQuery: () => mockFetchCommentsByThreadId,
      },
    },
  },
}));

jest.mock('../../store', () => ({
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

describe("<ThreadSection />", () => {
  const renderComponent = (ui) => {
    return renderWithTrpc(<Provider store={store}>{ui}</Provider>);
  }

  it("should render the component with no issues", () => {
    const result = renderComponent(<ThreadSection threadId={"sample-thread-id"} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should be able to post comment", async () => {
    renderComponent(<ThreadSection threadId={"sample-thread-id"} />);
    await act(async () => {
      fireEvent.change(document.getElementById("chat"), {target: {value: "sample comment"}});
      fireEvent.click(screen.getByRole("button"));
    });
    expect(mutationMock).toBeCalledTimes(1);
  });

  it("should not be able to post comment is comment is empty", async () => {
    mutationMock.mockReset();
    renderComponent(<ThreadSection threadId={"sample-thread-id"} />);
    await act(async () => {
      fireEvent.change(document.getElementById("chat"), {target: {value: ""}});
      fireEvent.click(screen.getByRole("button"));
    });
    expect(mutationMock).toBeCalledTimes(0);
  });
});
