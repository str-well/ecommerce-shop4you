import React from 'react';
import { Text, VStack } from '@chakra-ui/react';

interface PriceDisplayProps {
    price: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ price }) => (
    <VStack align="flex-end" spacing={1}>
        <Text fontWeight="bold" fontSize="lg">
            R$ {price.toFixed(2)}
        </Text>
        <Text color="gray.500" fontSize="sm">
            à vista no cartão ou Pix
        </Text>
        <Text color="gray.500" fontSize="xs">
            ou R$ {(price * 1.15).toFixed(2)} em até 10x
        </Text>
    </VStack>
);
