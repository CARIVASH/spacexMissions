// Next imports
import { AppProps } from 'next/app'

// Styles and fonts
import { ChakraProvider } from "@chakra-ui/react"

import { ApolloProvider } from "@apollo/client";
import { useApollo } from '../lib/apolloClient'

function MyApp({ Component, pageProps }: AppProps) {

  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp
