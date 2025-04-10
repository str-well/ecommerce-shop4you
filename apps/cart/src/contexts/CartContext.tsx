import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockProducts } from '../mocks/products';

export interface CartItem {
    id: string | number;
    name?: string;
    title?: string;
    price: number;
    quantity: number;
    image: string;
}

export interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export interface CartProviderProps {
    children: ReactNode;
    initialItems?: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const getInitialCartItems = (): CartItem[] => {
    if (typeof window === 'undefined') return [];

    try {
        const cart = localStorage.getItem('cart');

        if (cart) {
            const parsedCart = JSON.parse(cart);
            return parsedCart.map((item: any) => ({
                id: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));
        }
    } catch (error) {
        console.error('Erro ao carregar itens do carrinho:', error);
    }

    return [];
};

export const CartProvider: React.FC<CartProviderProps> = ({ children, initialItems }) => {
    const [items, setItems] = useState<CartItem[]>(() => initialItems || getInitialCartItems());

    useEffect(() => {
        if (items.length > 0) {
            localStorage.setItem('cart', JSON.stringify(items));
        }
    }, [items]);

    useEffect(() => {
        const savedItems = getInitialCartItems();
        if (savedItems.length > 0 && items.length === 0) {
            setItems(savedItems);
        }
    }, []);

    const addItem = (item: CartItem) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prevItems, item];
        });
    };

    const removeItem = (id: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
