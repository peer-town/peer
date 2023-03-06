import {fireEvent, render, screen} from "@testing-library/react";
import {AvatarCard} from "./AvatarCard";

describe("<AvatarCard />", () => {
  const image = undefined;
  const imageSize = 12;
  const onAddressClick = jest.fn();

  it("should render the badge with no issues", () => {
    const result = render(<AvatarCard image={image} imageSize={imageSize} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should render optional name and address element", () => {
    render(<AvatarCard image={image} imageSize={imageSize} name={"abc"} />);
    expect(screen.getByText("abc")).toBeTruthy();

    render(<AvatarCard image={image} imageSize={imageSize} address={"xyz"} />);
    expect(document.getElementById("badge")).toBeTruthy();
  });

  it("should handle extra classes", () => {
    const custom = "my-custom-class";
    render(<AvatarCard image={image} imageSize={imageSize} classes={custom} />);
    expect(document.getElementById("avatar-card")).toHaveClass(custom);
  });

  it("should set avatar image size accordingly", () => {
    render(<AvatarCard image={image} imageSize={40} />);
    expect(screen.getByRole("img")).toHaveAttribute("height", "40");
    expect(screen.getByRole("img")).toHaveAttribute("width", "40");
  });

  it("should handle address click action", () => {
    render(<AvatarCard image={image} imageSize={40} address={"0x900"} onAddressClick={onAddressClick} />);
    fireEvent.click(document.getElementById("badge"));
    expect(onAddressClick).toBeCalledWith("0x900");
  });
});
