import {render} from "@testing-library/react";
import {CommunityCard} from "./CommunityCard";

describe("<CommunityCard />", () => {
  const props = {
    communityName: "sample",
    about: "sample",
    communityAvatar: "https://sample.com",
    members: 2000,
    questions: 2000,
    tags: ["tag"],
  }

  it("should render the component with no issues", () => {
    const result = render(<CommunityCard {...props} />);
    expect(result.container).toBeInTheDocument();
  });
});
