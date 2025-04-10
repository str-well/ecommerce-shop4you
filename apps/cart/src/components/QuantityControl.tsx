import React from 'react';
import { HStack, IconButton, Text } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

interface QuantityControlProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
    quantity,
    onIncrease,
    onDecrease
}) => (
    <HStack>
        <IconButton
            aria-label="Diminuir quantidade"
            icon={<MinusIcon />}
            size="sm"
            variant="outline"
            onClick={onDecrease}
        />
        <Text px={2}>{quantity}</Text>
        <IconButton
            aria-label="Aumentar quantidade"
            icon={<AddIcon />}
            size="sm"
            variant="outline"
            onClick={onIncrease}
        />
    </HStack>
);
