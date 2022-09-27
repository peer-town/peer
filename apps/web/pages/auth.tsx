import { useSession, getCsrfToken, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useConnect, useAccount, useNetwork, useSignMessage } from "wagmi";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import { TileDocument, TileMetadataArgs } from "@ceramicnetwork/stream-tile";
import React, { useState } from "react";
import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { DID } from "dids";

let ceramic;
let threeID;
if (typeof window !== "undefined") {
  ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
  threeID = new ThreeIdConnect();
}
const CERAMIC_STREAM_CONTENT = { counter: 0 };

const AuthPage = () => {
  const { data: session } = useSession();

  const { connectors, connectAsync } = useConnect();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage({});

  const [ceramicLoginState, setCeramicLoginState] = useState(false);
  const [streamId, setStreamId] = useState("");
  const [streamData, setStreamData] = useState("");
  const [streamMetadata, setStreamMetadata] = useState("");

  const handleCeramicLogin = async (ethereumProvider) => {
    const accounts = await ethereumProvider.request({
      method: "eth_requestAccounts",
    });
    // Create an EthereumAuthProvider using the Ethereum provider and requested account
    const authProvider = new EthereumAuthProvider(
      ethereumProvider,
      accounts[0]
    );
    await threeID.connect(authProvider);

    const did = new DID({
      provider: threeID.getDidProvider(),
      resolver: {
        ...get3IDResolver(ceramic),
        ...getKeyResolver(),
      },
    });

    await did.authenticate();

    ceramic.did = did;

    setCeramicLoginState(true);
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

  async function createStream() {
    const doc = await TileDocument.create(ceramic, CERAMIC_STREAM_CONTENT);

    setStreamId(doc.id.toString());
    setStreamData(JSON.stringify(doc.content));
    setStreamMetadata(JSON.stringify(doc.metadata));
  }

  async function giveStreamRights() {
    const DEVNODE_DID_CONTROLLER = await fetch("/api/ceramic/get-devnode-did")
      .then((response) => response.json())
      .then((data: any) => {
        return data.did; //remove "did:key:"
      });

    const doc = await TileDocument.load(ceramic, streamId);

    let metadata: TileMetadataArgs = {
      controllers: [DEVNODE_DID_CONTROLLER],
    };

    await doc.update(doc.content, metadata);

    setStreamId(doc.id.toString());
    setStreamData(JSON.stringify(doc.content));
    setStreamMetadata(JSON.stringify(doc.metadata));
  }

  async function incrementCounter() {
    await fetch(`/api/ceramic/increment-counter?streamId=${streamId}`);

    await new Promise((r) => setTimeout(r, 1000)); //wait to propagate

    const doc = await TileDocument.load(ceramic, streamId);
    setStreamId(doc.id.toString());
    setStreamData(JSON.stringify(doc.content));
    setStreamMetadata(JSON.stringify(doc.metadata));
  }

  return (
    <div className="p-6">
      <h1>Ceramic proof of concept</h1>

      {session?.user ? (
        <p>
          <div className="flex-shrink mx-4 text-gray-600">
            NextJS User : {session.user.name}
          </div>
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
            <div>
              <button
                onClick={() => {
                  handleCeramicLogin(window.ethereum);
                }}
                className="bg-blue-500  text-white p-2 m-2 rounded"
              >
                Sign in Ceramic
              </button>

              <div className="flex-shrink mx-4 text-gray-600">
                This will use 3ID-Connect to sign the user in Ceramic using
                Ethereum provider
              </div>
            </div>
          ) : (
            <div>
              <div className="flex-shrink mx-4 text-gray-600">
                Ceramic User : {ceramic.did ? ceramic.did.id : "none"}
              </div>

              <button
                onClick={() => {
                  ceramic.did = null;
                  setCeramicLoginState(false);
                }}
                className="bg-blue-500  text-white p-2 m-2 rounded"
              >
                Sign out Ceramic
              </button>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              <div className="flex">
                <button
                  className="bg-blue-500  text-white p-2 m-2 rounded"
                  onClick={() => {
                    createStream();
                  }}
                >
                  Create Ceramic Stream
                </button>

                <button
                  className="bg-blue-500  text-white p-2 m-2 rounded"
                  onClick={() => {
                    giveStreamRights();
                  }}
                >
                  Give us write rights
                </button>

                <button
                  className="bg-blue-500  text-white p-2 m-2 rounded"
                  onClick={() => {
                    incrementCounter();
                  }}
                >
                  Increment counter in backend
                </button>
              </div>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink mx-4 text-gray-400">
                  Stream ID
                </span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
              <div className="flex-shrink mx-4 text-gray-600">{streamId}</div>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink mx-4 text-gray-400">
                  Stream Data
                </span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
              <div className="flex-shrink mx-4 text-gray-600">{streamData}</div>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="flex-shrink mx-4 text-gray-400">
                  Stream Metadata
                </span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>
              <div className="flex-shrink mx-4 text-gray-600">
                {streamMetadata}
              </div>
            </div>
          )}
          <br />
        </p>
      ) : (
        <div>
          <button
            onClick={() => {
              handleNextJsLogin();
            }}
            className="bg-blue-500  text-white p-2 m-2 rounded"
          >
            Sign in NextJS
          </button>
          <div className="flex-shrink mx-4 text-gray-600">
            This will use Sign In With Ethereum and Next-Auth to sign the user
            in and store a session cookie
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
