import { useAccount, useConnect } from "wagmi";
import React, { useState } from "react";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";
import { DIDSession } from "did-session";

import type { RuntimeCompositeDefinition } from "@composedb/types";
import NonSSRWrapper from "../components/NonSSRWrapper";
export const definition: RuntimeCompositeDefinition = {
  models: {
    Thread: {
      id: "kjzl6hvfrbw6c9aofa8penmje3t7ulzvrgdsm7mqiep6h2p7xps46717pl5vk73",
      accountRelation: { type: "list" },
    },
    Comment: {
      id: "kjzl6hvfrbw6c9fi3m3qzse6jxkloa84tp4xqk2qp4031qqbhpeg890admje9bu",
      accountRelation: { type: "list" },
    },
  },
  objects: {
    Thread: {
      title: { type: "string", required: true },
      community: { type: "string", required: true },
      createdAt: { type: "datetime", required: true },
      author: { type: "view", viewType: "documentAccount" },
    },
    Comment: {
      text: { type: "string", required: true },
      threadID: { type: "streamid", required: true },
      createdAt: { type: "datetime", required: true },
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
  const { connectors, connectAsync } = useConnect();
  const { address, isConnected } = useAccount();

  const [did, setDid] = useLocalStorage("did", "Bob");

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
      }&didSession=${session.serialize()}`
    );

    setDid(session.did.id);
  };

  return (
    <div className="flex flex-col p-6">
      <h1>Ceramic proof of concept</h1>
      <NonSSRWrapper>
        <button
          onClick={() => {
            connectWallet();
          }}
          className="m-2  rounded bg-blue-500 p-2 text-white"
        >
          {isConnected ? "Connected" : "Connect"}
        </button>
      </NonSSRWrapper>
      <button
        onClick={() => {
          handleDIDSession();
        }}
        className="m-2  rounded bg-blue-500 p-2 text-white"
      >
        Create DID Session
      </button>
      <br />

      <NonSSRWrapper> Your did: {did}</NonSSRWrapper>
      <span></span>
      <br />
    </div>
  );
};

export default AuthPage;

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
