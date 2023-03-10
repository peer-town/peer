import {Search} from "./Search";
import {fireEvent, render} from "@testing-library/react";

describe("<Search />", () => {
  const onQuery = jest.fn();

  it("should render search bar with no issues", () => {
    const result = render(<Search onQuery={onQuery} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should change the height of input on bar height updates", () => {
    render(<Search onQuery={onQuery} barHeight={30} iconSize={15}/>);
    expect(document.getElementById("search")).toHaveClass("h-[30px]");
    expect(document.getElementById("search-icon")).toHaveAttribute("height", "15px");
  });

  it("should update query when text is enter in search input", () => {
    render(<Search onQuery={onQuery} />);
    const search = document.getElementById("search");
    fireEvent.change(search, {target: { value : "text" }});
    expect(onQuery).toBeCalledWith("text");

    fireEvent.change(search, {target: { value : "searching" }});
    expect(onQuery).toBeCalledWith("searching");
  });
});
