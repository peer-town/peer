import { useSession, getCsrfToken, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useConnect, useAccount, useNetwork, useSignMessage } from "wagmi";

const AuthPage = () => {
  const { data: session } = useSession();

  const { connectors, connectAsync } = useConnect();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage({});

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
    <div>
      <h1>Auth Page</h1>

      {session?.user ? (
        <p>
          {session.user.name}
          <br />
          <button
            onClick={() => {
              signOut();
            }}
          >
            Sign out
          </button>
        </p>
      ) : (
        <p
          onClick={() => {
            handleLogin();
          }}
        >
          Sign in
        </p>
      )}
    </div>
  );
};

export default AuthPage;
