import {render} from "@testing-library/react";
import {FlexRow} from "./FlexRow";

describe("<FlexRow />", () => {
  it("should render flex component with no issues", () => {
    const result = render(
      <FlexRow>
        <div>sample div</div>
      </FlexRow>
    );
    expect(result.container).toBeInTheDocument();
  });

  it("should have proper classes", () => {
    render(
      <FlexRow>
        <div>sample div</div>
      </FlexRow>
    );
    expect(document.getElementById("flex-row")).toHaveClass("flex flex-row");
  });

  it("should have custom classes when added", () => {
    const custom = "my-custom-class";
    render(
      <FlexRow classes={custom}>
        <div>sample div</div>
      </FlexRow>
    );
    expect(document.getElementById("flex-row")).toHaveClass(custom);
  })
});
