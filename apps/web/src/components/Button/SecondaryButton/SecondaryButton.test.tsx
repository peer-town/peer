import {fireEvent, render, screen} from "@testing-library/react";
import {SecondaryButton} from "./SecondaryButton";

describe("<SecondaryButton />", () => {
  it("should render the button with no issues", () => {
    const result = render(<SecondaryButton title={"button"} onClick={jest.fn} />);
    expect(result.container).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("should be disabled if the props has disabled=true", () => {
    render(<SecondaryButton title={"button"} disabled={true} onClick={jest.fn} />);
    const button = screen.getByRole("button");
    expect(button).toBeTruthy();
    expect(button).toBeDisabled();
  });

  it("should handle click event", () => {
    const onClick = jest.fn();
    render(<SecondaryButton title={"button"} onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toBeCalled();
  });

  it("should handle custom class names", () => {
    const custom = "my-custom-class";
    render(<SecondaryButton title={"button"} onClick={jest.fn} classes={custom} />);
    expect(screen.getByRole("button")).toHaveClass(custom);
  });

  it("should display spinner on loading=true", () => {
    render(<SecondaryButton loading={true} title={"button"} onClick={jest.fn} />);
    expect(document.getElementById("spinner")).toBeInTheDocument();
  });
});
