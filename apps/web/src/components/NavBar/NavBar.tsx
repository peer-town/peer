import {Popover} from "@headlessui/react";
import {useAccount} from "wagmi";
import Image from "next/image";
import {useEffect, useState} from "react";
import {trpc, trpcProxy} from "../../utils/trpc";
import Link from "next/link";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import {ConnectWalletButton, PrimaryButton} from "../Button";
import * as utils from "../../utils";
import {isRight} from "../../utils/fp";
import {InterfacesModal, WebOnBoardModal} from "../Modal";
import {constants} from "../../config";
import useLocalStorage from "../../hooks/useLocalStorage";
import {has, get, isEmpty} from "lodash";

const navigation = [{ name: "Ask a question", href: "#", current: true }];

const NavBar = (props) => {
  const router = useRouter();
  const code = router.query.code as string;
  const {address} = useAccount();
  const [webOnboarding, setWebOnBoarding] = useState(false);
  const [socialInterfaces, setSocialInterfaces] = useState(false);
  const [didSession, setDidSession, removeDidSession] = useLocalStorage("didSession", "");

  const createUser = trpc.user.createUser.useMutation();
  const updateUser = trpc.user.updateUser.useMutation();
  const currentUser = trpc.user.getUser.useQuery({address});

  useEffect(() => {
    if (code) {
      handleDiscordAuthCallback(code).catch(console.log)
    }
  }, [code]);

  const handleDiscordAuthCallback = async (code: string) => {
    const response = await fetch(`/api/user/discord-auth/profile?code=${code}`);
    if (!response.ok) {
      return;
    }
    const profile = await response.json();
    await updateUserProfileWithDiscord(profile);
    props.handleDiscordUser(true);
  }

  const handleOnUserConnected = async () => {
    const existingUser = await trpcProxy.user.getUser.query({address});
    if (isRight(existingUser) && !existingUser.value.id) {
      setWebOnBoarding(true);
    } else {
      if(has(existingUser, "value.userPlatforms")) {
        const platforms = get(existingUser, "value.userPlatforms");
        const hasDiscord = platforms.filter((platform) => platform.platformName === constants.PLATFORM_DISCORD_NAME);
        if (isEmpty(hasDiscord)) {
          setSocialInterfaces(true);
        }
      }
    }
    props.handleDidSession(true);
  }

  const handleWebOnboardSubmit = async (details) => {
    const user = await createUser.mutateAsync({
      session: didSession,
      userPlatformDetails: {
        platformId: constants.PLATFORM_DEVNODE_ID,
        platformName: constants.PLATFORM_DEVNODE_NAME,
        platformUsername: details.name,
        platformAvatar: details.imageUrl,
      },
      walletAddress: address,
    });
    if (isRight(user)) {
      await currentUser.refetch();
      setWebOnBoarding(false);
      setSocialInterfaces(true);
    }
  }

  const updateUserProfileWithDiscord = async (profile) => {
    const user = await updateUser.mutateAsync({
      session: didSession,
      userPlatformDetails: {
        platformId: profile.id,
        platformName: constants.PLATFORM_DISCORD_NAME,
        platformUsername: utils.getDiscordUsername(profile.username, profile.discriminator),
        platformAvatar: utils.getDiscordAvatarUrl(profile.id, profile.avatar),
      },
      walletAddress: address,
    });
    if (isRight(user)) {
      toast.success("Updated profile with discord info!");
      await currentUser.refetch();
    }
  }

  const getUserAvatar = (user) => {
    if(!user) {return}
    if (has(user, "data.value.userPlatforms[0].platformAvatar")) {
      return get(user, "data.value.userPlatforms[0].platformAvatar");
    }
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
                  <Link href={{
                    pathname: address ? `/[id]/profile` : `/`,
                    query: { id: address },
                  }}>
                    <Image
                      width="44"
                      height="44"
                      className="rounded-full"
                      src={getUserAvatar(currentUser) || "/logo.svg"}
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
                  <ConnectWalletButton onSessionCreated={handleOnUserConnected} setDidSession={setDidSession} removeDidSession={removeDidSession}/>
                </div>
              </div>
            </div>

            <WebOnBoardModal
              onSubmit={handleWebOnboardSubmit}
              open={webOnboarding}
              onClose={() => setWebOnBoarding(false)}
            />
            <InterfacesModal open={socialInterfaces} onClose={() => setSocialInterfaces(false)} />

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
