import '../styles/globals.css'
import '../vars.css'
import type {AppProps} from 'next/app'
import {ChakraProvider} from "@chakra-ui/react";
import theme from '../styles/Theme';
import Navbar from "../components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";


function MyApp({Component, pageProps}: AppProps) {

// this manifest is used temporarily for development purposes
const manifestUrl =
"https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

const queryClient = new QueryClient({
defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

  return (
      <ChakraProvider theme={theme}>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
        <QueryClientProvider client={queryClient}>
          <div className={"customBackground"}>
            <Navbar/>
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
        </TonConnectUIProvider>
      </ChakraProvider>
  )
}

export default MyApp