import {fireEvent, render} from "@testing-library/react";
import {Chip} from "./Chip";

describe("<Chip />", () => {
  const onClose = jest.fn();

  it("should render chip with no issues", () => {
    const result = render(<Chip text={"sample"} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should handle click on close icon", () => {
    render(<Chip text={"sample"} onClose={onClose}/>);
    fireEvent.click(document.getElementById("close-icon"));
    expect(onClose).toBeCalled();
  });
});
