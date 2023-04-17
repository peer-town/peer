import {dispatchMock} from "../../../test/setup";
import {act, fireEvent, render} from "@testing-library/react";
import {Comment} from "./Comment";
import {Provider} from "react-redux";
import {store} from "../../store";

describe("<Comment />", () => {
  const upVote = jest.fn();
  const downVote = jest.fn();
  const props = {
    onUpVote: upVote,
    onDownVote: downVote,
    comment: {id: "abc"},
  }

  beforeEach(() => jest.resetAllMocks());

  const renderComponent = (ui) => {
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it("should render comment component with no issues", () => {
    const result = renderComponent(<Comment {...props}  />);
    expect(result.container).toBeInTheDocument();
  });

  it("should dispatch profile id on profile icon click", async () => {
    renderComponent(<Comment {...props} />);
    await act(async () => {
      fireEvent.click(document.getElementById("profile"));
    });
    expect(dispatchMock).toBeCalledTimes(1);
  });

  it("should call upvote fn on upvote click", async () => {
    renderComponent(<Comment {...props} />);
    upVote.mockResolvedValue({});
    expect(document.getElementById("up-vote")).toBeTruthy();
    await act(async () => {
      fireEvent.click(document.getElementById("up-vote"));
    });
    expect(upVote).toBeCalled();
    expect(upVote).toBeCalledWith("abc");
  });

  it("should call downvote fn on downvote click", async () => {
    renderComponent(<Comment {...props} />);
    downVote.mockResolvedValue({});
    expect(document.getElementById("down-vote")).toBeTruthy();
    await act(async () => {
      fireEvent.click(document.getElementById("down-vote"));
    });
    expect(downVote).toBeCalled();
    expect(downVote).toBeCalledWith("abc");
  });
});
