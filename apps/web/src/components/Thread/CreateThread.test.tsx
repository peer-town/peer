import "../../../test/setup";
import {Provider} from "react-redux";
import {store} from "../../store";
import CreateThread from "./CreateThread";
import {renderWithTrpc} from "../../../test/trpcWrapper";
import {act, fireEvent, screen} from "@testing-library/react";
import {mockWindow} from "../../../test/utils";
import {right} from "../../utils/fp";

const mockResponse = right({data: "data"});
export const mutationMock = jest.fn().mockResolvedValue(mockResponse);
jest.mock('../../utils/trpc', () => ({
  trpc: {
    thread: {
      createThread: {
        useMutation: () => ({mutateAsync: mutationMock}),
      },
    },
  },
}));

describe("<CreateThread />", () => {
  const onClose = jest.fn();
  const community = {
    communityId: "sample",
    communityName: "community",
  }

  const renderComponent = (ui) => {
    return renderWithTrpc(<Provider store={store}>{ui}</Provider>);
  }

  beforeAll(() => mockWindow());
  beforeEach(() => mutationMock.mockReset());

  it("should render with no issues", () => {
    const result = renderComponent(<CreateThread title={"test"} open={true} onClose={onClose} community={community}/>);
    expect(result.container).toBeInTheDocument();
  });

  it("should not submit if title is not entered", async () => {
    renderComponent(<CreateThread title={"test"} open={true} onClose={onClose} community={community}/>);
    await act(() => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(mutationMock).toBeCalledTimes(0);
  });

  it("should not submit if description is not entered", async () => {
    renderComponent(<CreateThread title={"test"} open={true} onClose={onClose} community={community}/>);
    await act(() => {
      fireEvent.change(document.getElementById("question-title"), {target: {value: "sample title"}});
      fireEvent.click(screen.getByRole("button"));
    });
    expect(mutationMock).toBeCalledTimes(0);
  });

  it("should not submit if community id not provided", async () => {
    renderComponent(<CreateThread title={"test"} open={true} onClose={onClose} community={{...community, communityId: ""}}/>);
    await act(() => {
      fireEvent.change(document.getElementById("question-title"), {target: {value: "sample title"}});
      fireEvent.change(document.getElementById("question-desc"), {target: {value: "sample desc"}});
      fireEvent.click(screen.getByRole("button"));
    });
    expect(mutationMock).toBeCalledTimes(0);
  });
});
