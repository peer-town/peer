import {type AppType} from "next/app";
import {trpc} from "../utils/trpc";
import "../styles/globals.css";
import {configureChains, createClient, WagmiConfig} from "wagmi";
import {arbitrum, avalanche, bsc, fantom, gnosis, mainnet, optimism, polygon} from "wagmi/chains";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {EthereumClient, modalConnectors, walletConnectProvider} from "@web3modal/ethereum";
import {Web3Modal} from '@web3modal/react'
import {config} from '../config';
import {Provider} from "react-redux";
import {store} from "../store";

const projectId = config.walletConnect.projectId;
const chains = [mainnet, polygon, avalanche, arbitrum, bsc, optimism, gnosis, fantom]
const {provider} = configureChains(chains, [walletConnectProvider({projectId})])
const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({version: '1', appName: 'web3Modal', chains, projectId}),
  provider
})
const ethereumClient = new EthereumClient(client, chains)

const MyApp: AppType = ({Component, pageProps}) => {
  return (
    <>
      <WagmiConfig client={client}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </WagmiConfig>
      <Web3Modal
        themeMode="light"
        themeColor="blackWhite"
        themeBackground="themeColor"
        projectId={projectId}
        ethereumClient={ethereumClient}/>
    </>
  );
};

export default trpc.withTRPC(MyApp);
