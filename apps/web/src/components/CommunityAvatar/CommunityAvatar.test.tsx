import {fireEvent, render} from "@testing-library/react";
import {CommunityAvatar} from "./CommunityAvatar";

describe("<CommunityAvatar />", () => {
  const image = "https://placekitten.com/200/200";
  const name = "sample"
  const onClick = jest.fn();

  it("should render the card with no issues", () => {
    const result = render(<CommunityAvatar image={image} name={name} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should handle extra classes", () => {
    const custom = "my-custom-class";
    render(<CommunityAvatar image={image} name={name} selected={true} classes={custom} />);
    expect(document.getElementById("community-avatar")).toHaveClass(custom);
  });

  it("should handle click action", () => {
    render(<CommunityAvatar image={image} name={name} onClick={onClick} />);
    fireEvent.click(document.getElementById("community-avatar"));
    expect(onClick).toBeCalled();
  });
});
