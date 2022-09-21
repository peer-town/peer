import { useSession, getCsrfToken, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useConnect, useAccount, useNetwork, useSignMessage } from "wagmi";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { EthereumAuthProvider } from "@ceramicnetwork/blockchain-utils-linking";
import { DIDDataStore } from "@glazed/did-datastore";
import { DIDSession } from "@glazed/did-session";
import React, { useEffect, useState } from "react";

const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

const aliases = {
  schemas: {
    basicProfile:
      "ceramic://k3y52l7qbv1frxt706gqfzmq6cbqdkptzk8uudaryhlkf6ly9vx21hqu4r6k1jqio",
  },
  definitions: {
    BasicProfile:
      "kjzl6cwe1jw145cjbeko9kil8g9bxszjhyde21ob8epxuxkaon1izyqsu8wgcic",
  },
  tiles: {},
};

const datastore = new DIDDataStore({ ceramic, model: aliases });

const AuthPage = () => {
  const { data: session } = useSession();

  const { connectors, connectAsync } = useConnect();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage({});

  const [ceramicLoginState, setCeramicLoginState] = useState(false);
  const [ceramicName, setCeramicName] = useState();

  const [nameInput, setNameInput] = useState("Bilbo Baggins");

  const setCeramicData = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        name: nameInput,
      };

      await datastore.merge("BasicProfile", updatedProfile);
    } catch (error) {
      console.error(error);
    }
  };

  const readCeramicData = async () => {
    try {
      const profile = await datastore.get("BasicProfile");

      console.log(profile);

      let { name } = profile;
      setCeramicName(name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCeramicLogin = async (ethereumProvider) => {
    const accounts = await ethereumProvider.request({
      method: "eth_requestAccounts",
    });

    const authProvider = new EthereumAuthProvider(
      ethereumProvider,
      accounts[0]
    );

    const session = new DIDSession({ authProvider });

    const did = await session.authorize();

    ceramic.did = did;
    setCeramicLoginState(true);
  };

  const handleLogin = async () => {
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
      <h1>Auth Page</h1>

      {session?.user ? (
        <p>
          {session.user.name}
          <br />
          <button
            onClick={() => {
              signOut();
            }}
            className="bg-blue-500  text-white p-2 m-2 rounded"
          >
            Sign out NextJS
          </button>
          <br />
          {!ceramicLoginState ? (
            <button
              onClick={() => {
                handleCeramicLogin(window.ethereum);
              }}
              className="bg-blue-500  text-white p-2 m-2 rounded"
            >
              Sign in Ceramic
            </button>
          ) : (
            <div>Ceramic logged in</div>
          )}
          <br />
          {ceramicLoginState && (
            <div>
              <form onSubmit={setCeramicData}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={nameInput}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) => {
                      setNameInput(e.target.value);
                    }}
                  />
                </label>
                <input
                  type="submit"
                  value="Set Ceramic Data"
                  className="bg-blue-500  text-white p-2 m-2 rounded"
                />
              </form>
              <br />
              <button
                onClick={() => {
                  readCeramicData();
                }}
                className="bg-blue-500  text-white p-2 m-2 rounded"
              >
                Read Ceramic Data
              </button>
              <br />
              Ceramic Name: {ceramicName}
              <br />
              <br />
              Check it on Cerscan here :
              <br />
              https://cerscan.com/testnet-clay/profile/did:pkh:eip155:1:
              {session.user.name?.toLowerCase()}
            </div>
          )}
        </p>
      ) : (
        <button
          onClick={() => {
            handleLogin();
          }}
          className="bg-blue-500  text-white p-2 m-2 rounded"
        >
          Sign in
        </button>
      )}
    </div>
  );
};

export default AuthPage;
