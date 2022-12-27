import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

import { publicProvider } from "wagmi/providers/public";

import { InjectedConnector } from "wagmi/connectors/injected";

import { Session } from "next-auth";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
};

export default trpc.withTRPC(MyApp);
