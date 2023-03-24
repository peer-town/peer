import {render} from "@testing-library/react";
import {Comment} from "./Comment";

describe("<Comment />", () => {
  it("should render comment component with no issues", () => {
    const result = render(<Comment comment={undefined} />);
    expect(result.container).toBeInTheDocument();
  });
});
