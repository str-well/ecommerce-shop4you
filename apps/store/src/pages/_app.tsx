import React from 'react';
import type { AppProps } from 'next/app';
import { Providers } from '../providers/ChakraProvider';
import '../styles/globals.css';
import { CartProvider } from '../contexts/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </Providers>
    </QueryClientProvider>
  );
}

export default CustomApp;
