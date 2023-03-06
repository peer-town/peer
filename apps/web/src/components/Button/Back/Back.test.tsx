import {render} from "@testing-library/react";
import {Back} from "./Back";

describe("<Back />", () => {
  it("should render the back comp with no issues", () => {
    const result = render(<Back link={"/"} />);
    expect(result.container).toBeInTheDocument();
  });
});
