import {dispatchMock} from "../../../test/setup";
import {act, fireEvent, render} from "@testing-library/react";
import {Thread} from "./Thread";
import {Provider} from "react-redux";
import {store} from "../../store";

const sampleThread = {
  user: {
    userPlatforms: {
      platformUsername: "sample",
      platformAvatar: "",
    },
    walletAddress: "0x90",
  },
  title: "sample title",
  createdAt: new Date().toISOString(),
}

describe("<Thread />", () => {
  const renderComponent = (ui) => {
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it("should render thread component with no issues", () => {
    const result = renderComponent(<Thread thread={undefined} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should render thread details", () => {
    const result = renderComponent(<Thread thread={sampleThread as any} />);
    expect(result.container).toBeInTheDocument();
  });

  it("should dispatch profile id on profile icon click", async () => {
    dispatchMock.mockReset();
    renderComponent(<Thread thread={sampleThread as any} />);
    await act(async () => {
      fireEvent.click(document.getElementById("profile"));
    });
    expect(dispatchMock).toBeCalledTimes(1);
  });
});
