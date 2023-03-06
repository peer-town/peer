import {fireEvent, render, screen} from "@testing-library/react";
import {CommunityOnBoardModal} from "./CommunityOnBoardModal";
import {mockWindow} from "../../../../test/utils";

describe("<CommunityOnBoardModel />", () => {
  let rendered;
  const onSubmit = jest.fn().mockImplementation((data) => data);

  beforeAll(() => mockWindow());

  beforeEach(() => {
    rendered = render(
      <CommunityOnBoardModal open={true} onClose={jest.fn} onSubmit={onSubmit}/>
    );
  });

  it("should render modal with no issues", () => {
    expect(rendered.container).toBeInTheDocument();
  });

  it("should have form with inputs and save button", () => {
    const name = screen.getByPlaceholderText("community name");
    const url = screen.getByPlaceholderText("image url");
    const tags = screen.getByPlaceholderText("tags");
    const save = screen.getByRole("button");
    expect(name).toBeInTheDocument();
    expect(url).toBeInTheDocument();
    expect(tags).toBeInTheDocument();
    expect(save).toBeInTheDocument();
  });

  it("should call submit button on save", () => {
    const name = screen.getByPlaceholderText("community name");
    const url = screen.getByPlaceholderText("image url");
    const tags = screen.getByPlaceholderText("tags");
    const save = screen.getByRole("button");
    fireEvent.change(name, {target: {value: "abc"}});
    fireEvent.change(url, {target: {value: "https://xyz"}});
    fireEvent.change(tags, {target: {value: "web3"}});
    fireEvent.click(save);
    expect(onSubmit).toBeCalled();
    expect(onSubmit).toReturnWith({name: "abc", imageUrl: "https://xyz", tags: "web3"})
  });
});
