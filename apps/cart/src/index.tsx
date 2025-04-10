import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { CartProvider } from './contexts/CartContext';
import Checkout from './components/Checkout';
import './styles/globals.css';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento root não encontrado');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <CartProvider>
        <Checkout />
      </CartProvider>
    </ChakraProvider>
  </React.StrictMode>
);
