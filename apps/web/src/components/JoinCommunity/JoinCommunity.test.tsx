import "../../../test/setup";
import { render } from "@testing-library/react";
import JoinCommunity from "./JoinCommunity";
import { right } from "../../utils/fp";

const mockResponse = right({ data: "data" });
export const mutationMock = jest.fn().mockResolvedValue(mockResponse);

jest.mock("../../utils/trpc", () => ({
  trpc: {
    user: {
      checkCommunityUser: {
        useQuery: () => ({ data: false }),
      },
    },
    community: {
      createUserCommunityRealtion: {
        useMutation: () => ({ mutateAsync: mutationMock }),
      },
    },
  },
}));

describe.only("<JoinCommunity />", () => {
  it("should render the component with no issues", () => {
    const result = render(<JoinCommunity />);
    expect(result.container).toBeInTheDocument();
  });
});
