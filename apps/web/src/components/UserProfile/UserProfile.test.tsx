import { UserProfile } from "./UserProfile";
import { renderWithTrpc } from "../../../test/trpcWrapper";
import { Provider } from "react-redux";
import { store } from "../../store";

const mockUser = {
  isLoading: false,
  isError: false,
  data: {
    value: {
      userPlatforms: [
        {
          platformName: "platform name",
          platformUsername: "username",
          platformAvatar: "https://some-url.com",
        },
      ],
    },
  },
};
const mockCommunities = {
  isLoading: false,
  isError: false,
  data: {
    edges: [
      {
        node: {
          community: {
            id: "community id",
            socialPlatforms: {
              edges: [
                {
                  node: {
                    communityAvatar: "https://some-url.com",
                    communityName: "community name",
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
};
jest.mock("../../utils/trpc", () => ({
  trpc: {
    user: {
      getUserByStreamId: {
        useQuery: () => mockUser,
      },
      getUserCommunities: {
        useQuery: () => mockCommunities,
      },
    },
  },
}));

describe("UserProfile", () => {
  const renderComponent = (ui) => {
    return renderWithTrpc(<Provider store={store}>{ui}</Provider>);
  };

  it("should render the component with no issues", () => {
    const result = renderComponent(
      <UserProfile userStreamId={"sample-user-id"} />
    );
    expect(result.container).toBeInTheDocument();
  });

  it("renders the user profile", async () => {
    const { findByText } = renderComponent(
      <UserProfile userStreamId="12345" />
    );
    expect(await findByText("username")).toBeInTheDocument();
    expect(await findByText("community name")).toBeInTheDocument();
  });
});
