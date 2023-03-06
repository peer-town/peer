import {render, screen, fireEvent} from "@testing-library/react";
import {WebOnBoardModal} from "./WebOnBoardModal";
import {mockWindow} from "../../../../test/utils";

describe("<WebOnBoardModal />", () => {
  let rendered;
  const onSubmit = jest.fn();

  beforeAll(() => mockWindow());

  beforeEach(() => {
    rendered = render(
      <WebOnBoardModal open={true} onClose={jest.fn} onSubmit={onSubmit} />
    );
  });

  it("should render modal with no issues", () => {
    expect(rendered.container).toBeInTheDocument();
  });

  it("should have form with inputs and save button", () => {
    const name = screen.getByPlaceholderText("name");
    const url = screen.getByPlaceholderText("image url");
    const save = screen.getByRole("button");
    expect(name).toBeInTheDocument();
    expect(url).toBeInTheDocument();
    expect(save).toBeInTheDocument();
  });

  it("should call submit button on save", () => {
    const name = screen.getByPlaceholderText("name");
    const url = screen.getByPlaceholderText("image url");
    const save = screen.getByRole("button");
    fireEvent.change(name, { target: { value: "abc" }});
    fireEvent.change(url, { target: { value: "https://xyz" }});
    fireEvent.click(save);
    expect(onSubmit).toBeCalled();
    expect(onSubmit).toBeCalledWith({name: "abc", imageUrl: "https://xyz"})
  });
});
