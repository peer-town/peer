import { render } from "@testing-library/react";
import { Loader } from "./Loader";

describe("<Loader />", () => {
  it("should render the loader with no issues", () => {
    const result = render(<Loader />);
    expect(result.container).toBeInTheDocument();
  });
});
