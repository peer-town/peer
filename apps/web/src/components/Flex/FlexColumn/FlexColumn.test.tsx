import {render} from "@testing-library/react";
import {FlexColumn} from "./FlexColumn";

describe("<FlexColumn />", () => {
  it("should render flex component with no issues", () => {
    const result = render(
      <FlexColumn>
        <div>sample div</div>
      </FlexColumn>
    );
    expect(result.container).toBeInTheDocument();
  });

  it("should have proper classes", () => {
    render(
      <FlexColumn>
        <div>sample div</div>
      </FlexColumn>
    );
    expect(document.getElementById("flex-column")).toHaveClass("flex flex-col");
  });

  it("should have custom classes when added", () => {
    const custom = "my-custom-class";
    render(
      <FlexColumn classes={custom}>
        <div>sample div</div>
      </FlexColumn>
    );
    expect(document.getElementById("flex-column")).toHaveClass(custom);
  })
});
