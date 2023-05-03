import {SearchProps} from "./types";

export const Search = (props: SearchProps) => {
  return (
    <div className="flex items-center lg:mx-0 lg:max-w-none xl:px-0 relative z-[0]">
      <div className="w-full">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
            <svg
              id="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              height={`${props.iconSize || 24}px`}
              width={`${props.iconSize || 24}px`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <label htmlFor="search" className="sr-only">
            {props.label || "Search"}
          </label>
          <input
            id="search"
            name="search"
            className={`block h-[${props.barHeight || 50}px] w-full rounded-xl border bg-white py-2 pl-12 pr-3 text-sm placeholder-gray-500 hover:border-gray-800 focus:border-gray-800 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black sm:text-sm`}
            placeholder={props.label || "Search"}
            type="search"
            onChange={(e) => {
              props.onQuery(e.target.value)
            }}
          />
        </div>
      </div>
    </div>
  );
}
