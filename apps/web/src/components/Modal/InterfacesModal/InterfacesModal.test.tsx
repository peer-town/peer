import {render} from "@testing-library/react";
import {InterfacesModal} from "./InterfacesModal";
import {mockWindow} from "../../../../test/utils";

describe("<InterfacesModal />", () => {
  const onClose = jest.fn();
  beforeAll(() => mockWindow());

  it("should render modal with no issues", () => {
    const result = render(<InterfacesModal open={true} onClose={onClose} type ={"user"}/>);
    expect(result.container).toBeInTheDocument();
    expect(document.getElementById("interface-modal")).toBeTruthy();
  });

  it("should not render dialog if open is false", () => {
    render(<InterfacesModal open={false} onClose={onClose} type ={"user"}/>);
    expect(document.getElementById("interface-modal")).toBeFalsy();
  });

  it('should handle click on discord button', async () => {
    render(<InterfacesModal open={true} onClose={onClose} type ={"user"}/>);
    const button = document.getElementById("discord-button");
    await button.click();
    expect(button).toBeTruthy();
    expect(onClose).toBeCalled();
  });
});
