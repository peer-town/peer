import {useWeb3Modal} from '@web3modal/react';
import {useState} from 'react';
import {useAccount, useDisconnect} from 'wagmi';
import * as utils from "../../../utils";
import {EthereumWebAuth, getAccountId} from "@didtools/pkh-ethereum";
import {DIDSession} from "did-session";
import {config} from "../../../config";
import {toast} from "react-toastify";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {ConnectWalletProps} from "./types";

export const ConnectWalletButton = (props: ConnectWalletProps) => {
  const {open} = useWeb3Modal()
  const {disconnect} = useDisconnect()
  const [loading, setLoading] = useState(false)
  const [, setDid, removeDid] = useLocalStorage("did", "");
  const [, setDidSession, removeDidSession] = useLocalStorage("didSession", "");

  const generateDidSession = async (address: string) => {
    const accountId = await getAccountId(window.ethereum, address);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      window.ethereum,
      accountId
    );
    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*`],
      expiresInSecs: config.didSession.expiresInSecs,
    });
    setDidSession(session.serialize());
    setDid(session.did.id);
  };

  const {address, isConnected} = useAccount({
    onConnect(context) {
      if (!context.isReconnected) {
        generateDidSession(context.address)
          .then(() => {
            props.onSessionCreated(context.address);
          })
          .catch(() => {
            toast.error("Error initiating did session!")
          });
      }
    },
    onDisconnect() {
      removeDid();
      removeDidSession();
    }
  });

  const onOpen = async () => {
    setLoading(true)
    await open()
    setLoading(false)
  }

  const onClick = async () => {
    isConnected ? disconnect() : await onOpen()
  }

  const getAddress = () => {
    return address ? utils.formatWalletAddress(address) : "";
  }

  return (
    <button
      className={utils.classNames(
        "flex h-[48px] items-center justify-center",
        "rounded-[10px] border-[1px] border-[#DAD8E2] bg-white px-8 py-3 hover:border-[#08010D] focus:outline-none",
        "font-medium text-[#97929B] hover:text-[#08010D]",
      )}
      onClick={onClick}
      disabled={loading}>
      {isConnected ? getAddress() : "Connect Wallet"}
    </button>
  )
}
