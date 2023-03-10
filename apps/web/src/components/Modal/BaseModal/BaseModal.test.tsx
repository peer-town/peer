import {render} from "@testing-library/react";
import {BaseModal} from "./BaseModal";
import {mockWindow} from "../../../../test/utils";

describe("<BaseModal />", () => {
  let result;
  const onClose = jest.fn();
  const child = <button>sample child</button>;

  const renderModal = (open: boolean) => {
    result = render(
      <BaseModal open={open} title={"sample"} onClose={onClose}>
        {child}
      </BaseModal>
    )
  }

  beforeAll(() => mockWindow());

  beforeEach(() => renderModal(true))

  it("should render modal with no issues", () => {
    expect(result.container).toBeInTheDocument();
  });

  it("should not render dialog if open is false", () => {
    renderModal(false);
    expect(document.getElementById("interface-modal")).toBeFalsy();
  });
});
