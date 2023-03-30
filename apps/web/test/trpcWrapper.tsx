import {createTRPCReact, getFetch} from "@trpc/react-query";
import {AppRouter} from "../src/server/trpc/router/_app";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {httpBatchLink, loggerLink} from "@trpc/client";
import superjson from "superjson";
import {render} from "@testing-library/react";
import {ReactElement} from "react";
import {fetch} from "node-fetch";

const globalAny = global as any;
globalAny.fetch = fetch;

export const testApi = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

const queryClient = new QueryClient();
const trpcClient = () =>
  testApi.createClient({
    links: [
      loggerLink({
        enabled: (opts) => false,
      }),
      httpBatchLink({
        url: "http://localhost:3000/api/trpc",
        fetch: async (input, init?) => {
          const fetch = getFetch();
          return fetch(input, {
            ...init,
          });
        },
      }),
    ],
    transformer: superjson,
  });

const AllTheProviders = ({children}: {children: React.ReactNode}) => {
  return (
    <testApi.Provider
      client={trpcClient()}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </testApi.Provider>
  );
}

export const renderWithTrpc = (
  ui: ReactElement,
) => render(<AllTheProviders>{ui}</AllTheProviders>);
