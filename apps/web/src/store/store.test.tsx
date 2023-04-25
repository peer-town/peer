import communityReducer, {
  selectCommunity,
} from "./features/community";
import { loadFromLocalStorage, saveToLocalStorage } from "./storage";
import { store } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect } from "react";
import { fireEvent, screen, render } from "@testing-library/react";
import { Provider } from "react-redux";

const SampleComponent = (props: { onChange(value): void; value: string }) => {
  const communityId = useAppSelector(
    (state) => state.community.selectedCommunity
  );
  const dispatch = useAppDispatch();
  useEffect(() => props.onChange(communityId), [props, communityId]);
  const handleClick = () =>
    dispatch(
      selectCommunity({
        selectedCommunity: props.value,
        communityAvatar: "",
        communityName: "",
        description: "",
        newlyCreatedCommunity: "",
      })
    );
  return <button onClick={handleClick}>Click me</button>;
};

describe("redux.community", () => {
  const onChange = jest.fn();
  const value = "sample";
  const renderComponent = (component) => {
    render(<Provider store={store}>{component}</Provider>);
  };

  it("should return initial state", () => {
    const state = {
      selectedCommunity: "new",
      communityAvatar: "",
      communityName: "",
      description: "",
      newlyCreatedCommunity: "",
    };
    const result = communityReducer(undefined, selectCommunity(state));
    expect(result).toEqual(state);
  });

  it("should render with base state", () => {
    renderComponent(<SampleComponent onChange={onChange} value={value} />);
    expect(onChange).toBeCalledWith("");
  });

  it("should dispatch the updated value and also update local state", () => {
    renderComponent(<SampleComponent onChange={onChange} value={value} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onChange).toBeCalledWith(value);
  });
});

describe("redux.storage", () => {
  beforeEach(() => window.localStorage.clear());

  it("should store new value to local storage", () => {
    saveToLocalStorage({test:"test"});
    expect(loadFromLocalStorage({})).toEqual({test:"test"});
  });

  it("should return undefined if no item in local storage", () => {
    expect(loadFromLocalStorage({})).toEqual(undefined);
  });

  it("should not store on fail case", () => {
    // @ts-ignore
    saveToLocalStorage(2n as any);
    expect(loadFromLocalStorage({})).toEqual(undefined);
    window.localStorage.setItem("state", "string");
    expect(loadFromLocalStorage({})).toEqual(undefined);
  });

  it("should handle when window is not available", () => {
    Object.defineProperty(global, "window", {});
    saveToLocalStorage("test");
    expect(loadFromLocalStorage({})).toEqual(undefined);
  });
});
