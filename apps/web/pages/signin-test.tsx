import { useSession, getCsrfToken, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useConnect, useAccount, useNetwork, useSignMessage } from "wagmi";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { getResolver as getKeyResolver } from "key-did-resolver";
import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import { TileDocument, TileMetadataArgs } from "@ceramicnetwork/stream-tile";
import React, { useEffect, useState } from "react";
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
  const [streamController, setStreamController] = useState("");

  useEffect(() => {
    if (session)
      fetch(`/api/user/data?address=${session.user.name}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setCeramicLoginState(true);
          setStreamId(data.stream);
        });
  }, [session]);

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

    fetch(`/api/user/ceramic-did?address=${address}&did=${did.id}`);

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

    setStreamController(doc.controllers[0]);
    setStreamId(doc.id.toString());
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

    fetch(
      `/api/user/ceramic-stream?address=${address}&did=${ceramic.did.id}&stream=${streamId}`
    );

    setStreamController(DEVNODE_DID_CONTROLLER);
    setStreamId(doc.id.toString());
  }

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
      {!ceramicLoginState && (
        <button
          onClick={() => {
            handleCeramicLogin(window.ethereum);
          }}
          className="bg-blue-500  text-white p-2 m-2 rounded"
        >
          Sign in Ceramic
        </button>
      )}
      {ceramicLoginState && (
        <button
          onClick={() => {
            ceramic.did = null;
            setCeramicLoginState(false);
          }}
          className="bg-blue-500  text-white p-2 m-2 rounded"
        >
          Sign out Ceramic
        </button>
      )}
      {ceramicLoginState && session && (
        <div>
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
        </div>
      )}
      <br />
      <span>NextJS Login state : {session ? "True" : "False"}</span> <br />
      <span>
        Ceramic Login state :{" "}
        {ceramic && ceramic.did ? ceramic.did.id : "False"}
      </span>
      <br />
      <span>Stream : {streamId}</span> <br />
      <span>Stream Controller : {streamController}</span> <br />
    </div>
  );
};

export default AuthPage;
