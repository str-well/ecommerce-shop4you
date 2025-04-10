import React from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider, extendTheme, theme } from '@chakra-ui/react';
import '../styles/globals.css';


function App({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
