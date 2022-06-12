import { Popover } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { MenuIcon, XIcon, MoonIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [{ name: "Ask a question", href: "#", current: true }];

const NavBar = () => {
  return (
    <>
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? "fixed inset-0 z-40 overflow-y-auto" : "",
            "border-[#08010D12] border-b-[1px] lg:static lg:overflow-y-visible"
          )
        }
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl h-[100px] px-5 lg:px-0 bg-white">
              <div className="h-full flex items-center gap-[34px] lg:gap-[50px]">
                <div className="min-w-0 flex grow justify-center items-center gap-[30px] lg:max-w-[75%]">
                  <img
                    className="h-[44px] w-[44px] rounded-full"
                    src="./pp.png"
                    alt=""
                  />

                  <div className="flex grow items-center lg:max-w-none lg:mx-0 xl:px-0">
                    <div className="w-full">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                          <SearchIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="search"
                          name="search"
                          className="h-[50px] block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-black focus:border-black sm:text-sm hover:border-black"
                          placeholder="Search"
                          type="search"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
                <div className="hidden gap-[16px] lg:w-[25%] lg:flex lg:items-center lg:justify-end">
                  <a
                    href="#"
                    className="w-[250px] h-[50px] bg-[#08010D] rounded-[10px] flex justify-center items-center text-white text-[16px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Ask a question
                  </a>
                  <a
                    href="#"
                    className="w-[50px] h-[50px] bg-white rounded-[10px] border-[#DAD8E2] border-[1px] flex justify-center items-center text-[#97929B] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black hover:border-[#08010D]"
                  >
                    <MoonIcon className="w-[23px] h-[23px]" />
                  </a>
                </div>
              </div>
            </div>

            <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
              <div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "hover:bg-gray-50",
                      "block rounded-md py-2 px-3 text-base font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  );
};

export default NavBar;
