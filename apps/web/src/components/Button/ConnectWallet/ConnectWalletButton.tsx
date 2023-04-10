import { useWeb3Modal } from "@web3modal/react";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import * as utils from "../../../utils";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession } from "did-session";
import { config } from "../../../config";
import { toast } from "react-toastify";
import { ConnectWalletProps } from "./types";
import { useAppDispatch, updateDidSession, updateDid } from "../../../store";


export const ConnectWalletButton = (props: ConnectWalletProps) => {
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const dispatch = useAppDispatch();

  const generateDidSession = async (address: string, connector: any) => {
    const provider = await connector.getProvider();
    const accountId = await getAccountId(provider, address);
    const authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId);
    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*`],
      expiresInSecs: config.didSession.expiresInSecs,
    });

    dispatch(updateDidSession(session.serialize()));
    dispatch(updateDid(session.did.id));
  };

  const { address, isConnected } = useAccount({
    onConnect(context) {
      if (!context.isReconnected) {
        generateDidSession(context.address, context.connector)
          .then(() => {
            props.onSessionCreated(context.address);
          })
          .catch(() => {
            toast.error("Error initiating did session!");
          });
      }
    },
    onDisconnect() {
      dispatch(updateDid(null));
      dispatch(updateDidSession(null));
    },
  });

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  const onOpen = async () => {
    setLoading(true);
    await open();
    setLoading(false);
  };

  const onClick = async () => {
    isConnected ? disconnect() : await onOpen();
  };

  const getAddress = () => {
    return address ? utils.formatWalletAddress(address) : "";
  };
  
  return (
    <button
      className={utils.classNames(
        "flex h-[74px] items-center justify-center w-full",
        "bg-[#5865F2] focus:outline-none",
        "font-medium text-white "
      )}
      onClick={onClick}
      disabled={loading}
    >
      {connected ? getAddress() : "Connect"}
    </button>
  );
};
