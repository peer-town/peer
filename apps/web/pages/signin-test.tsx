import { useSession, getCsrfToken, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useConnect, useAccount, useNetwork, useSignMessage } from "wagmi";
import React from "react";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession } from "did-session";

import type { RuntimeCompositeDefinition } from "@composedb/types";
export const definition: RuntimeCompositeDefinition = {
  models: {
    Thread: {
      id: "kjzl6hvfrbw6c8zwpdnjdtn16p1kkxij8w3xj5obwi21vdgfuk1lkkkm9lm1rnm",
      accountRelation: { type: "list" },
    },
    Comment: {
      id: "kjzl6hvfrbw6c7gmbi9f3xfhjeom6940ote3qdwn28new5nyayh07kinemmuv05",
      accountRelation: { type: "list" },
    },
  },
  objects: {
    Thread: {
      title: { type: "string", required: true },
      author: { type: "view", viewType: "documentAccount" },
    },
    Comment: {
      text: { type: "string", required: true },
      threadID: { type: "streamid", required: true },
      author: { type: "view", viewType: "documentAccount" },
    },
  },
  enums: {},
  accountData: {
    threadList: { type: "connection", name: "Thread" },
    commentList: { type: "connection", name: "Comment" },
  },
};

const AuthPage = () => {
  const { data: session } = useSession();

  const { connectors, connectAsync } = useConnect();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage({});

  const handleDIDSession = async (ethereumProvider) => {
    const ethProvider = ethereumProvider; // import/get your web3 eth provider
    const addresses = await ethProvider.enable();
    const accountId = await getAccountId(ethProvider, addresses[0]);
    const authMethod = await EthereumWebAuth.getAuthMethod(
      ethereumProvider,
      accountId
    );

    const oneWeek = 60 * 60 * 24 * 7;
    const session = await DIDSession.authorize(authMethod, {
      resources: [`ceramic://*`],
      expiresInSecs: oneWeek,
    });

    fetch(
      `/api/user/didSession?address=${address}&did=${
        session.did.id
      }&didSession=${session.serialize()}`
    );
  };

  const handleNextJsLogin = async () => {
    try {
      if (!isConnected)
        Promise.all(
          connectors.map(async (connector) => {
            await connectAsync({ connector });
          })
        );

      if (isConnected) {
        const message = new SiweMessage({
          domain: window.location.host,
          address: address,
          statement: "Sign in with Ethereum to the app.",
          uri: window.location.origin,
          version: "1",
          chainId: chain?.id,
          nonce: await getCsrfToken(),
        });
        const signature = await signMessageAsync({
          message: message.prepareMessage(),
        });

        signIn("credentials", {
          message: JSON.stringify(message),
          signature,
          redirect: false,
          callbackUrl: message.uri,
        });
      }
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <div className="p-6">
      <h1>Ceramic proof of concept</h1>
      {!session && (
        <button
          onClick={() => {
            handleNextJsLogin();
          }}
          className="bg-blue-500  text-white p-2 m-2 rounded"
        >
          Sign in NextJS
        </button>
      )}
      {session && (
        <button
          onClick={() => {
            signOut();
          }}
          className="bg-blue-500  text-white p-2 m-2 rounded"
        >
          Sign out NextJS
        </button>
      )}
      <button
        onClick={() => {
          handleDIDSession(window.ethereum);
        }}
        className="bg-blue-500  text-white p-2 m-2 rounded"
      >
        Create DID Session
      </button>
      <br />
      <span>NextJS Login state : {session ? "True" : "False"}</span> <br />
      <span></span>
      <br />
    </div>
  );
};

export default AuthPage;
