import { render, screen } from "@testing-library/react";
import { NoData } from "./NoData";

describe("<NoData/>", () => {
  it("should render the component with no issues", () => {
    const result = render(<NoData title="title" description="description"/>);
    expect(result.container).toBeInTheDocument();
    expect(screen.getByText("title")).toBeTruthy();
    expect(screen.getByText("description")).toBeTruthy();
  });
});
