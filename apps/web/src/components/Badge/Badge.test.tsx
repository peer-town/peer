import {fireEvent, render} from "@testing-library/react";
import {Badge} from "./Badge";

describe("<Badge />", () => {
  it("should render the badge with no issues", () => {
    const result = render(<Badge text={"badge"} onClick={jest.fn} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should handle click event", () => {
    const onClick = jest.fn();
    render(<Badge text={"badge"} onClick={onClick} />);
    fireEvent.click(document.getElementById("badge"));
    expect(onClick).toBeCalled();
  });

  it("should handle custom class names", () => {
    const custom = "my-custom-class";
    render(<Badge text={"badge"} onClick={jest.fn} classes={custom} />);
    expect(document.getElementById("badge")).toHaveClass(custom);
  });

  it("should have same name for the badger", () => {
    const custom = "my-custom-badge";
    render(<Badge text={custom} onClick={jest.fn} />);
    expect(document.getElementById("badge")).toHaveTextContent(custom);
  });
});
