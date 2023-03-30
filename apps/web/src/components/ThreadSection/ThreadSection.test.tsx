import {ThreadSection} from "./ThreadSection";
import {Provider} from "react-redux";
import {store} from "../../store";
import {renderWithTrpc} from "../../../test/trpcWrapper";

describe("<ThreadSection />", () => {
  const renderComponent = (ui) => {
    return renderWithTrpc(<Provider store={store}>{ui}</Provider>);
  }

  it("should render the component with no issues", () => {
    const result = renderComponent(<ThreadSection threadId={"sample-thread-id"} />);
    expect(result.container).toBeInTheDocument();
  });
});
