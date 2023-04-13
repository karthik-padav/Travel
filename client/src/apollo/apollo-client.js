import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:2009/api/graphql",
    cache: new InMemoryCache(),
});

export default client;