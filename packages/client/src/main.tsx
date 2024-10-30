import { createRoot } from "react-dom/client";
import "./reset.css";
import App from "./App.tsx";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { GRAPHQL_BASE } from "@/lib/api";

const client = new ApolloClient({
  uri: GRAPHQL_BASE,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <Theme>
      <App />
    </Theme>
  </ApolloProvider>
);
