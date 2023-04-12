import {fireEvent, render, screen} from "@testing-library/react";
import {LoadMore} from "./LoadMore";
import {omit} from "lodash";

describe("<LoadMore />", () => {
  const next = jest.fn();
  const props = {
    title: "test",
    isFetching: true,
    hasNextPage: true,
    next: next,
  }

  beforeEach(() => jest.resetAllMocks());

  it("should render the button with no issues", () => {
    const result = render(<LoadMore {...props} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should not render the button if hasNextPage is false", () => {
    render(<LoadMore {...omit(props, ["hasNextPage"])} hasNextPage={false}/>);
    expect(document.getElementById("loader-button")).toBeFalsy();
  });

  it("should render loading if isFetching is true", () => {
    render(<LoadMore {...props} />);
    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("should render title if isFetching is false", () => {
    render(<LoadMore {...props} isFetching={false}/>);
    expect(screen.getByText(props.title)).toBeTruthy();
  });

  it("should call next function on click", () => {
    render(<LoadMore {...props}/>);
    fireEvent.click(document.getElementById("loader-button"));
    expect(next).toBeCalled();
  });
});
