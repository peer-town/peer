import {render} from "@testing-library/react";
import {Modal} from "./Modal";

describe("<Modal />", () => {
  it("should render modal with no issues", () => {
    const result = render(<Modal handleClick={() => {}} />);
    expect(result.container).toBeInTheDocument();
  });
});
