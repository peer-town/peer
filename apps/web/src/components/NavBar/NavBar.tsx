import { Popover, Transition } from "@headlessui/react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import { Fragment, useState } from "react";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession } from "did-session";
import useLocalStorage from "../../hooks/useLocalStorage";
import { Resolver } from "did-resolver";
import { getResolver } from "pkh-did-resolver";
import { trpc } from "../../utils/trpc";
import { Modal } from "../Modal";

const pkhResolver = getResolver();
const resolver = new Resolver(pkhResolver);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [{ name: "Ask a question", href: "#", current: true }];

const NavBar = (props) => {
  const { disconnectAsync } = useDisconnect();
  const { connectors, connectAsync } = useConnect();
  const { address, isConnected } = useAccount();

  const [did, setDid] = useLocalStorage("did", "");
  const [didSession, setDidSession] = useLocalStorage("didSession", "");

  const [isOpen, setOpen] = useState(false);

  const authorDiscord = trpc.public.getDiscordUser.useQuery({
    didSession: didSession,
  });
  const discordUserName = authorDiscord.data?.discordUsername;

  discordUserName && props.handleDiscordUser(true);
  const connectWallet = async () => {
    await Promise.all(
      connectors.map(async (connector) => {
        if (!isConnected) await connectAsync({ connector });
      })
    );
  };

  const handleDIDSession = async () => {
    if (!isConnected) return;

    const accountId = await getAccountId(window.ethereum, address);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      window.ethereum,
      accountId
    );

    const oneHundredWeeks = 60 * 60 * 24 * 7 * 100;
    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*`],
      expiresInSecs: oneHundredWeeks,
    });

    fetch(
      `/api/user/didSession?&did=${
        session.did.id
      }&didSession=${session.serialize()}&didpkh=did:pkh:eip155:1:${address}`
    );

    setDidSession(session.serialize());
    props.handleDidSession(true);
    setDid(session.did.id);
  };

  const handleClick = () => {
    setOpen((state) => !state);
  };

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
                  <Image
                    width="44"
                    height="44"
                    className="rounded-full"
                    src="/logo.svg"
                    alt=""
                  />

                  <div className="flex grow items-center lg:mx-0 lg:max-w-none xl:px-0">
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
                <div className="flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  {/* <Popover.Button className="-mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button> */}
                </div>
                <div className="hidden gap-[16px] lg:flex lg:w-[40%] lg:items-center lg:justify-start">
                  {isConnected ? (
                    <button
                      onClick={() => {
                        disconnectAsync();
                      }}
                      className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                      {address.slice(0, 8) + "..."}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        connectWallet();
                      }}
                      className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                      Connect wallet
                    </button>
                  )}

                  {isConnected && did.length > 0 ? (
                    <Popover className="relative">
                      <Popover.Button
                        onClick={async () => {
                          await navigator.clipboard.writeText(did);
                        }}
                        className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      >
                        {did.slice(8, 12) +
                          "..." +
                          did.slice(did.length - 4, did.length)}
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-max -translate-x-1/2 transform">
                          <div className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                            <p>DID copied to clipboard!</p>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ) : (
                    <button
                      onClick={() => {
                        handleDIDSession();
                      }}
                      className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                      Create DID
                    </button>
                  )}

                  {discordUserName ? (
                    <Popover className="relative">
                      <Popover.Button
                        onClick={async () => {
                          await navigator.clipboard.writeText(did);
                        }}
                        className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                      >
                        {discordUserName}
                      </Popover.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-max -translate-x-1/2 transform">
                          <div className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                            <p>Discord user name copied to clipboard!</p>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </Popover>
                  ) : (
                    <button
                      onClick={handleClick}
                      className="flex h-[50px] items-center justify-center rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-2 text-[#97929B] hover:border-[#08010D] hover:text-[#08010D] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    >
                      Connect with Discord bot
                    </button>
                  )}
                  {isOpen && <Modal handleClick={handleClick} />}
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
