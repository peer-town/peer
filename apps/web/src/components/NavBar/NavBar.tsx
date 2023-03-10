import { Popover } from "@headlessui/react";
import { useAccount } from "wagmi";
import Image from "next/image";
import {useEffect} from "react";
import { trpc } from "../../utils/trpc";
import Link from "next/link";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import {ConnectWalletButton, PrimaryButton} from "../Button";
import * as utils from "../../utils";

const navigation = [{ name: "Ask a question", href: "#", current: true }];

const NavBar = (props) => {
  const router = useRouter();
  const code = router.query.code as string;
  const { address } = useAccount();

  const authorPlatformDetails = trpc.public.getAuthorDiscord.useQuery({
    address: address,
  });
  const discordUserName = authorPlatformDetails.data?.platformUsername ;
  discordUserName && props.handleDiscordUser(true);

  useEffect(() => {
    const profile = localStorage.getItem("discord");
    if (code && !profile) {
      handleDiscordAuthCallback(code).catch((e) => { console.error(e) })
    }
  }, [code]);

  const handleDiscordAuthCallback = async (code: string) => {
    const response = await fetch(`/api/user/discord-auth/profile?code=${code}`);
    const profile = await response.json();
    localStorage.setItem("discord", JSON.stringify(profile));
    toast.success("Successfully logged in with discord");
    props.handleDiscordUser(true);
  }

  return (
    <>
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className={({ open }) =>
          utils.classNames(
            open ? "fixed inset-0 z-40 overflow-y-auto" : "",
            "border-b-[1px] border-[#08010D12] lg:static lg:overflow-y-visible"
          )
        }
      >
        {({ open }) => (
          <>
            <div className="mx-auto h-[100px] max-w-7xl bg-white px-5 lg:px-0">
              <div className="flex h-full items-center justify-between gap-[34px] lg:gap-[50px]">
                <div className="flex min-w-0 grow items-center gap-[30px] lg:max-w-[75%]">
                  <Link href="/">
                    <Image
                      width="44"
                      height="44"
                      className="rounded-full"
                      src="/logo.svg"
                      alt=""
                    />
                  </Link>

                  <div className="flex items-center lg:w-[80%] lg:mx-0 lg:max-w-none xl:px-0">
                    <div className="w-full">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                          </svg>
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
                <div className="hidden gap-[16px] lg:flex lg:w-max lg:items-end lg:justify-end">
                  <PrimaryButton title={"Ask a question"} onClick={() => {}} />
                  <ConnectWalletButton />
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
                    className={utils.classNames(
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
