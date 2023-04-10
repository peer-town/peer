import { screen, fireEvent, render } from "@testing-library/react";
import { ThreadCard } from "./ThreadCard";

describe("<ThreadCard />", () => {
  const onClick = jest.fn();
  const sampleThread = {
    id: "sample-id",
    title: "title",
    body: "body",
    createdAt: new Date().toISOString(),
    user: {
      userPlatforms: [
        {
          platformAvatar: "https://some.com",
          platformUsername: "sample-username",
        },
      ],
    },
  };

  it("should render the component with no issues", () => {
    const result = render(<ThreadCard thread={sampleThread} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should call onclick prop on card click", () => {
    const result = render(<ThreadCard thread={sampleThread} onClick={onClick} />);
    fireEvent.click(screen.getAllByText("title")[0]);
    expect(onClick).toBeCalledTimes(1);
  });
});
