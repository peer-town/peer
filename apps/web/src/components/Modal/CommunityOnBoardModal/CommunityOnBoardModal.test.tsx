import {act, fireEvent, render, screen} from "@testing-library/react";
import {CommunityOnBoardModal} from "./CommunityOnBoardModal";
import {mockWindow} from "../../../../test/utils";

describe("<CommunityOnBoardModel />", () => {
  let rendered;
  const onSubmit = jest.fn().mockResolvedValue({});

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
    const description = screen.getByPlaceholderText("community description");
    const save = screen.getByRole("button");
    expect(name).toBeInTheDocument();
    expect(url).toBeInTheDocument();
    expect(tags).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(save).toBeInTheDocument();
  });

  it("should call submit button on save", async () => {
    const name = screen.getByPlaceholderText("community name");
    const url = screen.getByPlaceholderText("image url");
    const tags = screen.getByPlaceholderText("tags");
    const description = screen.getByPlaceholderText("community description");
    const save = screen.getByRole("button");
    await act(async () => {
      fireEvent.change(name, {target: {value: "abc"}});
      fireEvent.change(url, {target: {value: "https://xyz"}});
      fireEvent.change(tags, {target: {value: "web3"}});
      fireEvent.change(description, {target: {value: "blockchain is the future"}});
      fireEvent.click(save);
    });
    expect(onSubmit).toBeCalled();
    expect(onSubmit).toBeCalledWith({name: "abc", imageUrl: "https://xyz", tags: "web3", description:"blockchain is the future" })
  });
});
