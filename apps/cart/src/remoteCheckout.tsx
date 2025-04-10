import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { CartProvider, CartProviderProps } from './contexts/CartContext';
import Checkout from './components/Checkout';
import './styles/globals.css';

type CartProviderWithProductsProps = Omit<CartProviderProps, 'initialItems'>;

const CartProviderWithProducts: React.FC<CartProviderWithProductsProps> = ({ children }) => {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
};

let root: Root | null = null;

export function unmount() {
    if (root) {
        root.unmount();
        root = null;
    }
}

export function mount(el: Element | null) {
    if (!el) {
        console.error('Elemento de montagem não encontrado');
        return;
    }

    try {
        // Se já existe uma root, desmonta primeiro
        if (root) {
            unmount();
        }

        root = createRoot(el);

        root.render(
            <React.StrictMode>
                <ChakraProvider resetCSS>
                    <CartProviderWithProducts>
                        <Checkout />
                    </CartProviderWithProducts>
                </ChakraProvider>
            </React.StrictMode>
        );
    } catch (error) {
        console.error('Erro ao montar o componente:', error);
    }
}

// Expor as funções mount e unmount para uso global
(window as any).mountCheckout = mount;
(window as any).unmountCheckout = unmount;
