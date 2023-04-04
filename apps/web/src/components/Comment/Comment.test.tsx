import {dispatchMock} from "../../../test/setup";
import {act, fireEvent, render} from "@testing-library/react";
import {Comment} from "./Comment";
import {Provider} from "react-redux";
import {store} from "../../store";

describe("<Comment />", () => {
  const renderComponent = (ui) => {
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it("should render comment component with no issues", () => {
    const result = renderComponent(<Comment comment={undefined} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should dispatch profile id on profile icon click", async () => {
    dispatchMock.mockReset();
    renderComponent(<Comment comment={undefined} />);
    await act(async () => {
      fireEvent.click(document.getElementById("profile"));
    });
    expect(dispatchMock).toBeCalledTimes(1);
  });
});
