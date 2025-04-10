import React from 'react';
import { Box, Button, HStack, Image, Text } from '@chakra-ui/react';
import { QuantityControl } from './QuantityControl';
import { PriceDisplay } from './PriceDisplay';

interface CartItemProps {
    item: {
        id: string | number;
        title: string;
        price: number;
        quantity: number;
        image: string;
    };
    onQuantityChange: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onQuantityChange, onRemove }) => (
    <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200" bg="white">
        <HStack spacing={4} align="start">
            <Image
                src={item.image}
                alt={item.title}
                width="120px"
                height="120px"
                objectFit="cover"
                borderRadius="md"
            />
            <Box flex={1}>
                <Text fontSize="md" fontWeight="medium" mb={2}>{item.title}</Text>
                <Text color="gray.500" fontSize="sm" mb={2}>Vendido e entregue por Shop4You</Text>
                <HStack spacing={4}>
                    <QuantityControl
                        quantity={item.quantity}
                        onIncrease={() => onQuantityChange(item.id.toString(), item.quantity + 1)}
                        onDecrease={() => onQuantityChange(item.id.toString(), item.quantity - 1)}
                    />
                    <Button
                        variant="link"
                        colorScheme="blue"
                        color="#774b2e"
                        onClick={() => onRemove(item.id.toString())}
                    >
                        Excluir
                    </Button>
                </HStack>
            </Box>
            <PriceDisplay price={item.price} />
        </HStack>
    </Box>
);
