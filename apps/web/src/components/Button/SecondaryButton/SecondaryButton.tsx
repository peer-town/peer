import {ButtonProps} from "../types";

const Spinner = () => {
  return (
    <svg id="spinner" className="animate-spin mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

export const SecondaryButton = (props: ButtonProps) => {
  return (
    <button
      type="button"
      id="primary-button"
      className={`cursor-pointer flex rounded-[10px] h-[48px] border border-black px-8 py-3 text-sm font-medium text-black hover:bg-gray-100 ${props.classes || ''}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <>{props.loading && <Spinner/>}</>
      {props.title}
    </button>
  );
};
