import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  VStack
} from '@chakra-ui/react';

interface CreditCardFormProps {
  onSave: () => void;
  totalAmount: number;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSave, totalAmount }) => {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCardData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const installmentOptions = Array.from({ length: 10 }, (_, i) => {
    const installment = i + 1;
    const installmentAmount = totalAmount / installment;
    return {
      value: String(installment),
      label: `${installment}x de R$ ${installmentAmount.toFixed(2)}${installment === 1 ? ' à vista' : ' sem juros'}`
    };
  });

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={6}
      bg="white"
      borderRadius="lg"
      mt={4}
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
    >
      <VStack spacing={6}>
        <FormControl isRequired>
          <FormLabel fontSize="md" color="gray.700">Número do Cartão</FormLabel>
          <Input
            placeholder="0000 0000 0000 0000"
            value={cardData.number}
            onChange={handleChange('number')}
            size="lg"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ borderColor: "#c19872" }}
            _focus={{ borderColor: "#774b2e", boxShadow: "0 0 0 1px #774b2e" }}
            maxLength={19}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="md" color="gray.700">Nome no Cartão</FormLabel>
          <Input
            placeholder="Como aparece no cartão"
            value={cardData.name}
            onChange={handleChange('name')}
            size="lg"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ borderColor: "#c19872" }}
            _focus={{ borderColor: "#774b2e", boxShadow: "0 0 0 1px #774b2e" }}
          />
        </FormControl>

        <Grid templateColumns="2fr 1fr" gap={8}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel fontSize="md" color="gray.700">Validade</FormLabel>
              <Input
                placeholder="MM/AA"
                value={cardData.expiry}
                onChange={handleChange('expiry')}
                size="lg"
                width="30%"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: "#c19872" }}
                _focus={{ borderColor: "#774b2e", boxShadow: "0 0 0 1px #774b2e" }}
                maxLength={5}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel fontSize="md" color="gray.700">CVV</FormLabel>
              <Input
                type="password"
                maxLength={4}
                placeholder="123"
                value={cardData.cvv}
                width="30%"
                onChange={handleChange('cvv')}
                size="lg"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: "#c19872" }}
                _focus={{ borderColor: "#774b2e", boxShadow: "0 0 0 1px #774b2e" }}
              />
            </FormControl>
          </GridItem>
        </Grid>

        <FormControl>
          <FormLabel fontSize="md" color="gray.700">Parcelas</FormLabel>
          <Select
            value={cardData.installments}
            onChange={handleChange('installments')}
            size="lg"
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _hover={{ borderColor: "#c19872" }}
            _focus={{ borderColor: "#774b2e", boxShadow: "0 0 0 1px #774b2e" }}
          >
            {installmentOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          bg="#774b2e"
          color="white"
          size="lg"
          w="full"
          _hover={{ bg: "#c19872" }}
          _active={{ bg: "#5c3a24" }}
          fontSize="md"
          fontWeight="semibold"
          h="56px"
          transition="all 0.2s"
        >
          Salvar Cartão
        </Button>
      </VStack>
    </Box>
  );
};
