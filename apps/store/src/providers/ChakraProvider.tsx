'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        chocolate: {
            50: "#faf5f0",
            100: "#f0e5d8",
            200: "#e5d0b8",
            300: "#d4b795",
            400: "#c19872",
            500: "#a87547",
            600: "#8f5e39",
            700: "#774b2e",
            800: "#603c27",
            900: "#4d3022",
            950: "#2c1812",
        },
        primary: {
            50: '#faf5f0',
            100: '#f0e5d8',
            200: '#e5d0b8',
            300: '#d4b795',
            400: '#c19872',
            500: '#a87547',
            600: '#8f5e39',
            700: '#774b2e',
            800: '#603c27',
            900: '#4d3022',
        },
    },
    styles: {
        global: {
            body: {
                bg: 'chocolate.50',
                color: 'chocolate.900',
                fontFamily: 'sans-serif',
            },
        },
    },
    components: {
        Button: {
            variants: {
                solid: {
                    bg: 'chocolate.600',
                    color: 'white',
                    _hover: {
                        bg: 'chocolate.700',
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                    },
                    transition: 'all 0.3s',
                },
                outline: {
                    borderColor: 'chocolate.600',
                    color: 'chocolate.600',
                    _hover: {
                        bg: 'chocolate.50',
                        transform: 'translateY(-2px)',
                        boxShadow: 'md',
                    },
                    transition: 'all 0.3s',
                },
            },
        },
        Heading: {
            baseStyle: {
                color: 'chocolate.800',
                fontFamily: 'sans-serif',
            },
        },
        Card: {
            baseStyle: {
                container: {
                    bg: 'white',
                    borderRadius: 'lg',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                },
            },
        },
        Text: {
            baseStyle: {
                fontFamily: 'sans-serif',
            },
        },
    },
    fonts: {
        body: 'sans-serif',
        heading: 'sans-serif',
    },
    shadows: {
        outline: '0 0 0 3px rgba(168, 117, 71, 0.6)',
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    );
}
