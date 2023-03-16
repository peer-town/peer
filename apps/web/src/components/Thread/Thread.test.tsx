import {render} from "@testing-library/react";
import {Thread} from "./Thread";

const sampleThread = {
  user: {
    userPlatforms: {
      platformUsername: "sample",
      platformAvatar: "",
    },
    walletAddress: "0x90",
  },
  title: "sample title",
  createdAt: new Date().toISOString(),
}

describe("<Thread />", () => {
  it("should render thread component with no issues", () => {
    const result = render(<Thread thread={undefined} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should render thread details", () => {
    const result = render(<Thread thread={sampleThread as any} />);
    expect(result.container).toBeInTheDocument();
  });
});
