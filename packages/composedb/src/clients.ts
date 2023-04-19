import {GraphQLClient} from "graphql-request";

export const graphqlClient = new GraphQLClient(String(process.env.CERAMIC_GRAPH), {});
