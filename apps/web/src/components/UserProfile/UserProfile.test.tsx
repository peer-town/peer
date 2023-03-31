import { UserProfile } from './UserProfile';
import {renderWithTrpc} from "../../../test/trpcWrapper";

const mockUser = {
  isLoading: false,
  isError: false,
  data: {
    value: {
      userPlatforms: [
        {
          platformName: 'platform name',
          platformUsername: 'username',
          platformAvatar: 'https://some-url.com',
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
          id: 'community id',
          socialPlatforms: {
            edges: [
              {
                node: {
                  communityAvatar: 'https://some-url.com',
                  communityName: 'community name',
                },
              },
            ],
          },
        },
      },
    ],
  },
};
jest.mock('../../utils/trpc', () => ({
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

describe('UserProfile', () => {
  it("should render the component with no issues", () => {
    const result = renderWithTrpc(<UserProfile userStreamId={"sample-user-id"} />);
    expect(result.container).toBeInTheDocument();
  });

  it("renders the user profile", async () => {
    const { findByText } = renderWithTrpc(<UserProfile userStreamId="12345" />);
    expect(await findByText('username')).toBeInTheDocument();
    expect(await findByText('community name')).toBeInTheDocument();
  });
});
