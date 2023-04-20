import {fireEvent, render} from "@testing-library/react";
import {ContentCard} from "./ContentCard";

describe("<ContentCard />", () => {
  const onClick = jest.fn();
  const props = {
    title: "sample",
    body: "sample",
    onClick: onClick,
  };

  it("should render the component with no issues", () => {
    const result = render(<ContentCard {...props} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should call onclick on click event", () => {
    render(<ContentCard {...props} />);
    fireEvent.click(document.getElementById("content-card"));
    expect(onClick).toBeCalled();
  });
});
