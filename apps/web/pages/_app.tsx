import "../styles/globals.css";
import type { AppProps, AppType } from "next/app";

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from "wagmi";

import { publicProvider } from "wagmi/providers/public";

import { InjectedConnector } from "wagmi/connectors/injected";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import React from "react";

// Configure chains & p

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

// Set up client
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

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
};

export default MyApp;
