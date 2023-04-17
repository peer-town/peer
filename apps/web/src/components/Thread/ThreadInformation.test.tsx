import {render} from "@testing-library/react";
import ThreadInformation from "./ThreadInformation";

const sampleComments = [
  {node: {user: {id: "123",}}},
  {node: {user: {id: "321",}}},
  {node: {user: {id: "123",}}},
  {node: {user: {id: "124",}}},
  {node: {user: {id: "321",}}},
];

describe("<ThreadInformation />", () => {
  it("should render the component with no issues", () => {
    const result = render(<ThreadInformation comments={[]}/>);
    expect(result.container).toBeInTheDocument();
  });

  it("should render the contributors based on props", () => {
    render(<ThreadInformation comments={sampleComments} />);
    expect(document.getElementsByTagName("img").length).toEqual(3);
  });
});
