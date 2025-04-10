import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { CartProvider } from '../contexts/CartContext';
import Checkout from '../components/Checkout';

const HomePage: React.FC = () => {
    return (
        <ChakraProvider>
            <CartProvider>
                <Checkout />
            </CartProvider>
        </ChakraProvider>
    );
};

export default HomePage;
