import React from 'react';
import { Box, HStack, Icon, Radio, Text, Grid, Button } from '@chakra-ui/react';
import { CiCreditCard1 } from "react-icons/ci";
import { DeleteIcon } from '@chakra-ui/icons';

interface SavedCardProps {
  isSelected: boolean;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  onClick: () => void;
  onDelete?: () => void;
}

export const SavedCard: React.FC<SavedCardProps> = ({
  isSelected,
  cardNumber,
  cardHolder,
  expiry,
  onClick,
  onDelete
}) => (
  <Box
    p={4}
    borderWidth="1px"
    borderRadius="md"
    borderColor={isSelected ? "#774b2e" : "gray.200"}
    bg={isSelected ? "#f5efe9" : "white"}
    cursor="pointer"
    onClick={onClick}
    position="relative"
    mb={4}
    transition="all 0.2s"
    _hover={{
      borderColor: "#774b2e",
      bg: "#f5efe9",
      transform: "translateY(-2px)",
      boxShadow: "sm"
    }}
  >
    <HStack spacing={4} justify="space-between">
      <HStack spacing={4}>
        <Radio
          isChecked={isSelected}
          colorScheme="brown"
          borderColor="#774b2e"
          _checked={{
            bg: "#774b2e57",
            borderColor: "#774b2e",
          }}
        />
        <Box>
          <HStack spacing={2} mb={1}>
            <Icon as={CiCreditCard1} boxSize={6} color="#774b2e" />
            <Text fontWeight="medium">(Crédito) Mastercard terminando em {cardNumber}</Text>
          </HStack>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <Text color="gray.600" fontSize="sm">Nome no cartão</Text>
            <Text color="gray.600" fontSize="sm">Vencimento</Text>
            <Text fontWeight="medium">{cardHolder}</Text>
            <Text fontWeight="medium">{expiry}</Text>
          </Grid>
        </Box>
      </HStack>
      {onDelete && (
        <Button
          variant="ghost"
          colorScheme="red"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          _hover={{ bg: "red.50" }}
        >
          <DeleteIcon />
        </Button>
      )}
    </HStack>
  </Box>
);
