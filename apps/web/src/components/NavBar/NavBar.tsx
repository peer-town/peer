import { Popover } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { MenuIcon, XIcon, MoonIcon } from "@heroicons/react/outline";

function classNames(...classes: string[]) {
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
            "border-b-[1px] border-[#08010D12] lg:static lg:overflow-y-visible"
          )
        }
      >
        {({ open }) => (
          <>
            <div className="mx-auto h-[100px] max-w-7xl bg-white px-5 lg:px-0">
              <div className="flex h-full items-center gap-[34px] lg:gap-[50px]">
                <div className="flex min-w-0 grow items-center justify-center gap-[30px] lg:max-w-[75%]">
                  <img
                    className="h-[44px] w-[44px] rounded-full"
                    src="./pp.png"
                    alt=""
                  />

                  <div className="flex grow items-center lg:mx-0 lg:max-w-none xl:px-0">
                    <div className="w-full">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <SearchIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <input
                          id="search"
                          name="search"
                          className="block h-[50px] w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 hover:border-black focus:border-black focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                          placeholder="Search"
                          type="search"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="-mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
                <div className="hidden gap-[16px] lg:flex lg:w-[25%] lg:items-center lg:justify-end">
                  <a
                    href="#"
                    className="flex h-[50px] w-[250px] items-center justify-center rounded-[10px] bg-[#08010D] text-[16px] text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Ask a question
                  </a>
                  <a
                    href="#"
                    className="flex h-[50px] w-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    <MoonIcon className="h-[23px] w-[23px]" />
                  </a>
                </div>
              </div>
            </div>

            <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
              <div className="mx-auto max-w-3xl space-y-1 px-2 pt-2 pb-3 sm:px-4">
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
